"use client";

import React, { useEffect } from "react";
import { Playground } from "./Playground";

type CollaborativePlaygroundProps = React.ComponentProps<typeof Playground>;

export function CollaborativePlayground(props: CollaborativePlaygroundProps) {
  useEffect(() => {
    // ------------------------------------------------------------------------
    // TODO: Initialize yjs and y-websocket provider here
    // ------------------------------------------------------------------------
    // Example:
    // import * as Y from "yjs";
    // import { WebsocketProvider } from "y-websocket";
    // 
    // const doc = new Y.Doc();
    // const provider = new WebsocketProvider(
    //   "wss://your-websocket-endpoint", // Replace with your WebSocket server URL
    //   "room-id",                       // Replace with your dynamic room ID
    //   doc
    // );
    //
    // // Bind Yjs doc to Sandpack files state here...
    // 
    // return () => {
    //   provider.destroy();
    //   doc.destroy();
    // };
    // ------------------------------------------------------------------------
  }, []);

  return (
    <div className="relative group">
      {/* UI Badge for Live Collaboration */}
      <div className="absolute top-8 right-2 z-10 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md pointer-events-none">
        Live Collaboration Enabled
      </div>
      
      <Playground {...props} />
    </div>
  );
}
