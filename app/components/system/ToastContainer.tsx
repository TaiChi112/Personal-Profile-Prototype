'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

type ToastLevel = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

type ToastEvent = {
  message: string;
  type: ToastLevel;
  id: number;
};

type ToastContainerStyle = {
  getToastClass: (type: ToastLevel) => string;
};

type ToastContainerProps = {
  style: ToastContainerStyle;
  subscribe: (observer: (event: ToastEvent) => void) => () => void;
};

export function ToastContainer({ style, subscribe }: ToastContainerProps) {
  const [toasts, setToasts] = useState<ToastEvent[]>([]);

  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      setToasts((previous) => [...previous, event]);
      setTimeout(() => {
        setToasts((previous) => previous.filter((toast) => toast.id !== event.id));
      }, 3000);
    });

    return unsubscribe;
  }, [subscribe]);

  if (toasts.length === 0) return null;

  return (
    <>
      {toasts.map((toast) => (
        <div key={toast.id} className={style.getToastClass(toast.type)}>
          {toast.type === 'SUCCESS' ? <CheckCircle size={18} /> : toast.type === 'WARNING' ? <AlertTriangle size={18} /> : <Info size={18} />}
          <span>{toast.message}</span>
        </div>
      ))}
    </>
  );
}
