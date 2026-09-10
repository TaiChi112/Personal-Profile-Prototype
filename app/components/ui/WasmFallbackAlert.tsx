import React from 'react';

interface WasmFallbackAlertProps {
  message?: string;
  onRetry?: () => void;
}

export const WasmFallbackAlert: React.FC<WasmFallbackAlertProps> = ({ 
  message = "Failed to load WebAssembly module. The application is running in fallback mode with degraded performance.",
  onRetry 
}) => {
  return (
    <div 
      role="alert" 
      className="wasm-fallback-alert"
      style={{
        padding: '16px',
        margin: '16px 0',
        backgroundColor: '#fff3cd',
        color: '#856404',
        border: '1px solid #ffeeba',
        borderRadius: '4px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ marginRight: '8px' }}
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <h4 style={{ margin: 0, fontWeight: 600, fontSize: '16px' }}>
          WebAssembly Load Warning
        </h4>
      </div>
      <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
        {message}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          style={{
            backgroundColor: '#856404',
            color: '#fff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default WasmFallbackAlert;
