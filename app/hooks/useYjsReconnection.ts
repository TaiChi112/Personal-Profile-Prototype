import { useState, useEffect, useCallback, useRef } from 'react';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export interface UseYjsReconnectionOptions {
  url?: string;
  roomName?: string;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxRetries?: number;
}

export function useYjsReconnection(options: UseYjsReconnectionOptions = {}) {
  const {
    url = 'ws://localhost:1234',
    roomName = 'test-room',
    autoConnect = true,
    reconnectInterval = 2000,
    maxRetries = 5,
  } = options;

  const [status, setStatus] = useState<ConnectionStatus>(
    autoConnect ? 'connecting' : 'disconnected'
  );
  const [retryCount, setRetryCount] = useState(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    setStatus('connecting');
    // Mock successful connection after a short delay
    setTimeout(() => {
      setStatus('connected');
      setRetryCount(0);
    }, 500);
  }, []);

  const disconnect = useCallback(() => {
    setStatus('disconnected');
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  const simulateDisconnect = useCallback(() => {
    setStatus('disconnected');
  }, []);

  useEffect(() => {
    if (status === 'disconnected' && autoConnect && retryCount < maxRetries) {
      reconnectTimeoutRef.current = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        connect();
      }, reconnectInterval);
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [status, autoConnect, retryCount, maxRetries, reconnectInterval, connect]);

  // Initial connect if autoConnect is true and we're disconnected without any retries
  useEffect(() => {
    if (autoConnect && status === 'disconnected' && retryCount === 0) {
      connect();
    }
  }, [autoConnect, status, retryCount, connect]);

  return {
    status,
    connect,
    disconnect,
    simulateDisconnect,
    retryCount,
    url,
    roomName
  };
}
