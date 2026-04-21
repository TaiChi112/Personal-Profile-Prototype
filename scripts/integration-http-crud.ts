import { prisma } from '../lib/prisma';

const baseUrl = process.env.APP_URL ?? 'http://localhost:3000';

function getSetCookieHeaders(response: Response): string[] {
  const headers = response.headers as unknown as { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie();
  }

  const single = response.headers.get('set-cookie');
  return single ? [single] : [];
}

function toCookieHeader(setCookies: string[]): string {
  return setCookies
    .map((cookie) => cookie.split(';')[0])
    .filter(Boolean)
    .join('; ');
}

async function loginByCredentials(email: string, password: string) {
  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
  assertStatus('GET /api/auth/csrf', csrfRes.status, 200);

  const csrfBody = (await csrfRes.json()) as { csrfToken?: string };
  if (!csrfBody.csrfToken) {
    throw new Error('csrf token not returned');
  }

  const csrfCookieHeader = toCookieHeader(getSetCookieHeaders(csrfRes));

  const form = new URLSearchParams({
    csrfToken: csrfBody.csrfToken,
    email,
    password,
    callbackUrl: `${baseUrl}/`,
    json: 'true',
  });

  const loginRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      cookie: csrfCookieHeader,
    },
    body: form.toString(),
    redirect: 'manual',
  });

  assertStatus('POST /api/auth/callback/credentials', loginRes.status, [200, 302]);

  const loginCookieHeader = toCookieHeader(getSetCookieHeaders(loginRes));
  const cookieHeader = [csrfCookieHeader, loginCookieHeader].filter(Boolean).join('; ');

  if (!cookieHeader.includes('next-auth')) {
    throw new Error('session cookie not set');
  }

  return cookieHeader;
}

async function requestJson(path: string, init?: RequestInit) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  let json: unknown = null;

  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }

  return { res, json };
}

async function requestJsonWithCookie(path: string, cookieHeader: string, init?: RequestInit) {
  return requestJson(path, {
    ...init,
    headers: {
      cookie: cookieHeader,
      ...(init?.headers ?? {}),
    },
  });
}

function assertStatus(name: string, actual: number, expected: number | number[]) {
  const expectedList = Array.isArray(expected) ? expected : [expected];
  if (!expectedList.includes(actual)) {
    throw new Error(`${name} expected status ${expectedList.join('|')} but got ${actual}`);
  }
}

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
    select: { id: true },
  });

  if (!admin) {
    throw new Error('seed admin user not found; run bun run prisma:seed first');
  }

  const sessionCheck = await requestJson('/api/auth/session');
  assertStatus('GET /api/auth/session', sessionCheck.res.status, 200);

  // users endpoints are protected; anonymous requests should be blocked
  const userList = await requestJson('/api/users');
  assertStatus('GET /api/users anonymous', userList.res.status, [401, 403]);

  const userCreate = await requestJson('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: `http-user-${Date.now()}@example.com` }),
  });
  assertStatus('POST /api/users anonymous', userCreate.res.status, [401, 403]);

  const userIdForProtectedRoute = admin.id;
  const userGet = await requestJson(`/api/users/${userIdForProtectedRoute}`);
  assertStatus('GET /api/users/:id anonymous', userGet.res.status, [401, 403]);

  const userUpdate = await requestJson(`/api/users/${userIdForProtectedRoute}`, {
    method: 'PUT',
    body: JSON.stringify({ name: 'Blocked Update' }),
  });
  assertStatus('PUT /api/users/:id anonymous', userUpdate.res.status, [401, 403]);

  const userDelete = await requestJson(`/api/users/${userIdForProtectedRoute}`, {
    method: 'DELETE',
  });
  assertStatus('DELETE /api/users/:id anonymous', userDelete.res.status, [401, 403]);

  // posts now require auth for read
  const postsListBefore = await requestJson('/api/posts');
  assertStatus('GET /api/posts anonymous', postsListBefore.res.status, 401);

  // create a viewer test user for read-only validation
  const viewerEmail = `viewer-http-${Date.now()}@example.com`;
  await prisma.user.upsert({
    where: { email: viewerEmail },
    update: {
      role: 'viewer',
      provider: 'credentials',
      providerAccountId: viewerEmail,
      name: 'HTTP Viewer',
    },
    create: {
      email: viewerEmail,
      name: 'HTTP Viewer',
      role: 'viewer',
      provider: 'credentials',
      providerAccountId: viewerEmail,
    },
  });

  const viewerCookie = await loginByCredentials(
    viewerEmail,
    process.env.VIEWER_TEST_PASSWORD ?? 'viewer123',
  );

  const postsListViewer = await requestJsonWithCookie('/api/posts', viewerCookie);
  assertStatus('GET /api/posts viewer', postsListViewer.res.status, 200);

  const viewerCreatePost = await requestJsonWithCookie('/api/posts', viewerCookie, {
    method: 'POST',
    body: JSON.stringify({
      title: 'Viewer Blocked Post',
      content: 'viewer should not create',
      published: false,
      authorId: admin.id,
    }),
  });
  assertStatus('POST /api/posts viewer', viewerCreatePost.res.status, 403);

  const adminCookie = await loginByCredentials(
    process.env.ADMIN_TEST_EMAIL ?? 'admin@example.com',
    process.env.ADMIN_TEST_PASSWORD ?? 'admin123',
  );

  const createPost = await requestJsonWithCookie('/api/posts', adminCookie, {
    method: 'POST',
    body: JSON.stringify({
      title: 'HTTP Integration Post',
      content: 'created via integration-http-crud.ts',
      published: false,
      authorId: admin.id,
    }),
  });
  assertStatus('POST /api/posts', createPost.res.status, 201);

  const createdPostId = (createPost.json as { post?: { id?: string } })?.post?.id;
  if (!createdPostId) {
    throw new Error('POST /api/posts did not return post.id');
  }

  const getPost = await requestJsonWithCookie(`/api/posts/${createdPostId}`, adminCookie);
  assertStatus('GET /api/posts/:id', getPost.res.status, 200);

  const viewerUpdatePost = await requestJsonWithCookie(`/api/posts/${createdPostId}`, viewerCookie, {
    method: 'PUT',
    body: JSON.stringify({ title: 'viewer cannot update' }),
  });
  assertStatus('PUT /api/posts/:id viewer', viewerUpdatePost.res.status, 403);

  const viewerDeletePost = await requestJsonWithCookie(`/api/posts/${createdPostId}`, viewerCookie, {
    method: 'DELETE',
  });
  assertStatus('DELETE /api/posts/:id viewer', viewerDeletePost.res.status, 403);

  const updatePost = await requestJsonWithCookie(`/api/posts/${createdPostId}`, adminCookie, {
    method: 'PUT',
    body: JSON.stringify({
      title: 'HTTP Integration Post (Updated)',
      published: true,
    }),
  });
  assertStatus('PUT /api/posts/:id', updatePost.res.status, 200);

  const deletePost = await requestJsonWithCookie(`/api/posts/${createdPostId}`, adminCookie, {
    method: 'DELETE',
  });
  assertStatus('DELETE /api/posts/:id', deletePost.res.status, 200);

  const getDeletedPost = await requestJsonWithCookie(`/api/posts/${createdPostId}`, adminCookie);
  assertStatus('GET /api/posts/:id (deleted)', getDeletedPost.res.status, 404);

  await prisma.user.delete({ where: { email: viewerEmail } });

  console.log('[integration-http] users protected + posts role policy via HTTP passed');
}

main()
  .catch((error) => {
    console.error('[integration-http] failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
