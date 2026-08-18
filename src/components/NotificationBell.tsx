'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';

interface Notification {
  id: string;
  subject: string;
  message: string;
  status: string;
  sentAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.status !== 'read').length;

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/notifications', { method: 'PATCH' });
      if (res.ok) {
        showToast('All notifications marked as read.', 'success');
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await fetch('/api/notifications', { method: 'DELETE' });
      if (res.ok) {
        showToast('Notification logs cleared.', 'success');
        setNotifications([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: 'var(--text-light)',
          transition: 'color 0.15s ease'
        }}
        title="View Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              background: 'var(--accent-gold)',
              color: 'var(--primary-deep)',
              fontSize: '10px',
              fontWeight: '800',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 2px var(--bg-card)'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Card */}
      {isOpen && (
        <>
          <div 
            onClick={() => setIsOpen(false)} 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} 
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '40px',
              background: 'white',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              width: '320px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '400px',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-main)' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-dark)' }}>Alert Notifications</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontSize: '11px', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                  >
                    Mark read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    onClick={handleClearAll}
                    style={{ background: 'none', border: 'none', color: 'hsl(0, 72%, 51%)', fontSize: '11px', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div style={{ overflowY: 'auto', flexGrow: 1 }}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-light)', fontSize: '13px' }}>
                  No messages in your inbox.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border-light)',
                      background: n.status !== 'read' ? 'rgba(37, 99, 235, 0.03)' : 'transparent',
                      borderLeft: n.status !== 'read' ? '3px solid var(--primary-blue)' : '3px solid transparent',
                      fontSize: '12px',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: 'var(--text-dark)', fontWeight: '600' }}>{n.subject || 'Notice Alert'}</strong>
                      <span style={{ color: 'var(--text-light)', fontSize: '10px' }}>
                        {new Date(n.sentAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-main)', lineHeight: '1.4' }}>{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
