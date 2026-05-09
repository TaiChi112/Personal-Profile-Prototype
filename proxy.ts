import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(_request: NextRequest) {
  // Future authorization seam:
  // Route-level permission enforcement can be enabled here (e.g. /admin, /api/private)
  // once roles and policies are finalized. Keep as pass-through for public access phase.
  const response = NextResponse.next();

  // ดึงค่าสดๆ จาก .env ของเครื่องที่รันอยู่ (ถ้าไม่มีให้ขึ้น Fallback)
  const serverNode = process.env.SERVER_NODE || 'Unknown-Node';

  // แปะป้ายชื่อ Header กลับไปหาเบราว์เซอร์
  response.headers.set('X-Served-By', serverNode);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};