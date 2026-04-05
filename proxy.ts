import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(_request: NextRequest) {
  // Future authorization seam:
  // Route-level permission enforcement can be enabled here (e.g. /admin, /api/private)
  // once roles and policies are finalized. Keep as pass-through for public access phase.
  return NextResponse.next();
}

export const config = {
  matcher: [],
};