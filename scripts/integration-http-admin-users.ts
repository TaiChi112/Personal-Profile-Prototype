const baseUrl = process.env.APP_URL ?? 'http://localhost:3000';

function assertStatus(name: string, actual: number, expected: number | number[]) {
  const expectedList = Array.isArray(expected) ? expected : [expected];
  if (!expectedList.includes(actual)) {
    throw new Error(`${name} expected status ${expectedList.join('|')} but got ${actual}`);
  }
}

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

async function loginAsAdmin() {
  const email = process.env.ADMIN_TEST_EMAIL ?? 'admin@example.com';
  const password = process.env.ADMIN_TEST_PASSWORD ?? 'admin123';

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

  const loginCookies = toCookieHeader(getSetCookieHeaders(loginRes));
  const cookieHeader = [csrfCookieHeader, loginCookies].filter(Boolean).join('; ');

  if (!cookieHeader.includes('next-auth')) {
    throw new Error('session cookie not set after admin login');
  }

  const sessionRes = await fetch(`${baseUrl}/api/auth/session`, {
    headers: { cookie: cookieHeader },
  });
  assertStatus('GET /api/auth/session (admin)', sessionRes.status, 200);

  const session = (await sessionRes.json()) as { user?: { role?: string } };
  if (session.user?.role !== 'admin') {
    throw new Error('authenticated session is not admin');
  }

  return cookieHeader;
}

async function requestJson(path: string, cookieHeader: string, init?: RequestInit) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      cookie: cookieHeader,
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

async function main() {
  const cookieHeader = await loginAsAdmin();

  const userList = await requestJson('/api/users', cookieHeader);
  assertStatus('GET /api/users (admin)', userList.res.status, 200);

  const email = `admin-http-user-${Date.now()}@example.com`;
  const createUser = await requestJson('/api/users', cookieHeader, {
    method: 'POST',
    body: JSON.stringify({
      email,
      name: 'Admin HTTP User',
      role: 'viewer',
      provider: 'manual',
      providerAccountId: `manual-${Date.now()}`,
    }),
  });
  assertStatus('POST /api/users (admin)', createUser.res.status, 201);

  const createdUserId = (createUser.json as { user?: { id?: string } })?.user?.id;
  if (!createdUserId) {
    throw new Error('POST /api/users did not return user.id');
  }

  const getCreatedUser = await requestJson(`/api/users/${createdUserId}`, cookieHeader);
  assertStatus('GET /api/users/:id (admin)', getCreatedUser.res.status, 200);

  const updateUser = await requestJson(`/api/users/${createdUserId}`, cookieHeader, {
    method: 'PUT',
    body: JSON.stringify({
      name: 'Admin HTTP User Updated',
      role: 'viewer',
    }),
  });
  assertStatus('PUT /api/users/:id (admin)', updateUser.res.status, 200);

  const deleteUser = await requestJson(`/api/users/${createdUserId}`, cookieHeader, {
    method: 'DELETE',
  });
  assertStatus('DELETE /api/users/:id (admin)', deleteUser.res.status, 200);

  const getDeletedUser = await requestJson(`/api/users/${createdUserId}`, cookieHeader);
  assertStatus('GET /api/users/:id (deleted)', getDeletedUser.res.status, 404);

  console.log('[integration-http-admin-users] authenticated admin users CRUD passed');
}

main().catch((error) => {
  console.error('[integration-http-admin-users] failed', error);
  process.exit(1);
});
