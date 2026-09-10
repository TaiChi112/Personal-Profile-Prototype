"use client";

import React, { useEffect, useState } from "react";

export default function LiveViewers() {
  const [viewers, setViewers] = useState<number>(1);

  useEffect(() => {
    const eventSource = new EventSource("/api/live-viewers");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.viewers !== undefined) {
          setViewers(data.viewers);
        } else if (data.count !== undefined) {
          setViewers(data.count);
        } else if (typeof data === "number") {
          setViewers(data);
        }
      } catch (err) {
        // Fallback if data is a raw string number
        const num = parseInt(event.data, 10);
        if (!isNaN(num)) {
          setViewers(num);
        }
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      // Optional: you can close and attempt to reconnect or just let the browser handle it.
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <span className="animate-pulse">🟢</span>
      <span>{viewers} people viewing this page right now</span>
    </div>
  );
}
