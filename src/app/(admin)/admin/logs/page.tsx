'use client';

import { useEffect, useState } from 'react';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  actor: {
    fullName: string;
    role: string;
  };
}

interface Notification {
  id: string;
  channel: string;
  subject: string | null;
  message: string;
  status: string;
  sentAt: string;
  user: {
    fullName: string;
    email: string;
  };
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'notifications'>('audit');

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch('/api/admin/logs');
        if (res.ok) {
          const data = await res.json();
          setLogs(data.auditLogs || []);
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error('Failed to load system logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const getActionColor = (action: string) => {
    if (action.includes('approve')) return 'var(--accent-teal)';
    if (action.includes('reject')) return 'hsl(0, 72%, 51%)';
    if (action.includes('create')) return 'var(--primary-blue)';
    return 'var(--text-light)';
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px' }}>Security Audit & Notifications Log</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Track administrator actions and monitor dispatched enrollment notifications.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveSubTab('audit')}
          className="btn"
          style={{
            fontSize: '13px',
            padding: '8px 16px',
            borderColor: activeSubTab === 'audit' ? 'var(--primary-blue)' : 'transparent',
            background: activeSubTab === 'audit' ? 'var(--primary-light)' : 'transparent',
            color: activeSubTab === 'audit' ? 'var(--primary-blue)' : 'var(--text-light)',
          }}
        >
          📜 Administrative Audit Logs
        </button>
        <button
          onClick={() => setActiveSubTab('notifications')}
          className="btn"
          style={{
            fontSize: '13px',
            padding: '8px 16px',
            borderColor: activeSubTab === 'notifications' ? 'var(--primary-blue)' : 'transparent',
            background: activeSubTab === 'notifications' ? 'var(--primary-light)' : 'transparent',
            color: activeSubTab === 'notifications' ? 'var(--primary-blue)' : 'var(--text-light)',
          }}
        >
          📧 Dispatched Notifications
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading system registries...
        </div>
      ) : activeSubTab === 'audit' ? (
        /* Audit Logs Table */
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--primary-navy)', color: 'white' }}>
                  <th style={{ padding: '12px 16px' }}>Timestamp</th>
                  <th style={{ padding: '12px 16px' }}>Officer / Actor</th>
                  <th style={{ padding: '12px 16px' }}>Action Taken</th>
                  <th style={{ padding: '12px 16px' }}>Affected Entity</th>
                  <th style={{ padding: '12px 16px' }}>Entity ID</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text-light)' }}>
                      {new Date(log.timestamp).toLocaleString('en-KE')}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-dark)' }}>
                      {log.actor.fullName}
                      <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '400' }}>{log.actor.role.replace('_', ' ').toUpperCase()}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: getActionColor(log.action) }}>
                      {log.action.replace('_', ' ').toUpperCase()}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{log.entity}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--text-light)' }}>
                      {log.entityId.slice(0, 12)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Notifications Table */
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--primary-navy)', color: 'white' }}>
                  <th style={{ padding: '12px 16px' }}>Timestamp</th>
                  <th style={{ padding: '12px 16px' }}>Recipient Applicant</th>
                  <th style={{ padding: '12px 16px' }}>Subject</th>
                  <th style={{ padding: '12px 16px' }}>Message Preview</th>
                  <th style={{ padding: '12px 16px' }}>Delivery</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notif) => (
                  <tr key={notif.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text-light)' }}>
                      {new Date(notif.sentAt).toLocaleString('en-KE')}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-dark)' }}>
                      {notif.user.fullName}
                      <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '400' }}>{notif.user.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{notif.subject || 'SMS Notification'}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-main)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {notif.message}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', background: notif.status === 'sent' ? 'hsl(142, 70%, 92%)' : 'hsl(0, 72%, 95%)', color: notif.status === 'sent' ? 'hsl(142, 76%, 15%)' : 'hsl(0, 72%, 25%)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        {notif.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
