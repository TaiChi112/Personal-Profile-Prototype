import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'Missing url parameter' },
      { status: 400 }
    );
  }

  let authHeader = request.headers.get('authorization');

  if (!authHeader) {
    const fallbackToken =
      process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || process.env.GITHUB_TOKEN;
    if (fallbackToken) {
      authHeader = `Bearer ${fallbackToken}`;
    }
  }

  const headers = new Headers();
  if (authHeader) {
    headers.set('Authorization', authHeader);
  }

  try {
    const githubResponse = await fetch(`https://api.github.com${url}`, {
      method: 'GET',
      headers,
    });

    const responseHeaders = new Headers();
    
    const contentType = githubResponse.headers.get('content-type');
    if (contentType) {
      responseHeaders.set('Content-Type', contentType);
    }

    githubResponse.headers.forEach((value, key) => {
      if (key.toLowerCase().startsWith('x-ratelimit-')) {
        responseHeaders.set(key, value);
      }
    });

    return new Response(githubResponse.body, {
      status: githubResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to proxy request to GitHub' },
      { status: 500 }
    );
  }
}
