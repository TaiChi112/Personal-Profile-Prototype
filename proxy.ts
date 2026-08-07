import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { NextFetchEvent } from 'next/server';
import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import { i18n } from './app/lib/i18n';

const fumadocsMiddleware = createI18nMiddleware(i18n);

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  // If the request is for docs, run Fumadocs middleware
  const isDocsRoute = request.nextUrl.pathname.startsWith('/docs') || request.nextUrl.pathname.match(/^\/(en|th)\/docs/);
  let response = isDocsRoute ? await fumadocsMiddleware(request, event) : null;
  
  if (!response) {
    response = NextResponse.next();
  }

  // ดึงค่าสดๆ จาก .env ของเครื่องที่รันอยู่ (ถ้าไม่มีให้ขึ้น Fallback)
  const serverNode = process.env.SERVER_NODE || 'Unknown-Node';

  // แปะป้ายชื่อ Header กลับไปหาเบราว์เซอร์
  response.headers.set('X-Served-By', serverNode);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};