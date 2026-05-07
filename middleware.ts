import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // สร้าง Response อัตโนมัติให้วิ่งผ่านไปปกติ
  const response = NextResponse.next();

  // ดึงค่าสดๆ จาก .env ของเครื่องที่รันอยู่ (ถ้าไม่มีให้ขึ้น Fallback)
  const serverNode = process.env.SERVER_NODE || 'Unknown-Node';

  // แปะป้ายชื่อ Header กลับไปหาเบราว์เซอร์
  response.headers.set('X-Served-By', serverNode);

  return response;
}