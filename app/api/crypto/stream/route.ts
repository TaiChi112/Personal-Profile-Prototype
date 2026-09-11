export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const fetchAndEmit = async () => {
        try {
          const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano&vs_currencies=usd&include_24hr_change=true');
          const data = await res.json();
          
          if (!data || !data.bitcoin) return;

          const formattedData = [
            { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: data.bitcoin.usd, change24h: data.bitcoin.usd_24h_change },
            { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: data.ethereum.usd, change24h: data.ethereum.usd_24h_change },
            { id: 'solana', name: 'Solana', symbol: 'SOL', price: data.solana.usd, change24h: data.solana.usd_24h_change },
            { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: data.cardano.usd, change24h: data.cardano.usd_24h_change },
          ];
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(formattedData)}\n\n`));
        } catch (error) {
          console.error('Error fetching crypto data:', error);
        }
      };

      await fetchAndEmit();
      const interval = setInterval(fetchAndEmit, 5000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
