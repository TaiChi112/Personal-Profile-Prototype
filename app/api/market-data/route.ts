import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano&vs_currencies=usd&include_24hr_change=true', {
      next: { revalidate: 10 }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const rawData = await res.json();
    
    // Format it for the Dashboard
    const formattedData = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: rawData.bitcoin.usd, change24h: rawData.bitcoin.usd_24h_change },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: rawData.ethereum.usd, change24h: rawData.ethereum.usd_24h_change },
      { id: 'solana', name: 'Solana', symbol: 'SOL', price: rawData.solana.usd, change24h: rawData.solana.usd_24h_change },
      { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: rawData.cardano.usd, change24h: rawData.cardano.usd_24h_change },
    ];

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
