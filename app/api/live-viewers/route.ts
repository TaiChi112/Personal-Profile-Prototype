import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  let interval: NodeJS.Timeout;

  const stream = new ReadableStream({
    start(controller) {
      // Send an initial value immediately, then every 3 seconds
      const sendViewers = () => {
        const viewers = Math.floor(Math.random() * 100) + 1;
        controller.enqueue(new TextEncoder().encode(`data: ${viewers}\n\n`));
      };
      
      sendViewers();
      interval = setInterval(sendViewers, 3000);
    },
    cancel() {
      clearInterval(interval);
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
