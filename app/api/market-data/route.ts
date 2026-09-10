import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
