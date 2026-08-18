'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div 
        style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          zIndex: 9999, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px',
          maxWidth: '380px',
          width: 'calc(100% - 40px)'
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const animIn = setTimeout(() => setVisible(true), 10);
    const autoClose = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => {
      clearTimeout(animIn);
      clearTimeout(autoClose);
    };
  }, [onClose]);

  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'rgba(16, 185, 129, 0.95)',
          border: 'rgba(16, 185, 129, 0.2)',
          icon: '✓'
        };
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.95)',
          border: 'rgba(239, 68, 68, 0.2)',
          icon: '⚠️'
        };
      case 'info':
      default:
        return {
          bg: 'rgba(37, 99, 235, 0.95)',
          border: 'rgba(37, 99, 235, 0.2)',
          icon: 'ℹ'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        background: colors.bg,
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: `1px solid ${colors.border}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(100px)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{colors.icon}</span>
      <span style={{ flexGrow: 1, fontSize: '14px', fontWeight: 500 }}>{toast.message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px',
          opacity: 0.7,
          padding: 0,
          marginLeft: '8px'
        }}
      >
        ×
      </button>
    </div>
  );
}
