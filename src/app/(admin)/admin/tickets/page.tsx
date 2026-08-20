'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/Toast';

interface TicketMessage {
  id: string;
  senderId: string;
  message: string;
  createdAt: string;
  sender: {
    fullName: string;
    role: string;
  };
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    fullName: string;
    email: string;
    phone?: string;
  };
  messages?: TicketMessage[];
}

export default function AdminTicketsPage() {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Filtering and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Reply message state
  const [replyText, setReplyText] = useState('');

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  };

  const loadTickets = async (selectId?: string) => {
    try {
      const res = await fetch('/api/tickets', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const loadedTickets = data.tickets || [];
        setTickets(loadedTickets);
        
        const targetId = selectId || activeTicket?.id;
        if (targetId) {
          const updated = loadedTickets.find((t: Ticket) => t.id === targetId);
          if (updated) {
            loadTicketThread(updated.id);
          }
        }
      } else {
        showToast('Could not load tickets from the database.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not load system support ticket logs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadTicketThread = async (ticketId: string) => {
    setLoadingThread(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveTicket(data.ticket);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load message thread details.', 'error');
    } finally {
      setLoadingThread(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/tickets/${activeTicket.id}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message: replyText.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setReplyText('');
        showToast('Reply sent to applicant.', 'success');
        await loadTickets(activeTicket.id);
      } else {
        showToast(data.error || 'Could not send response.', 'error');
      }
    } catch (err) {
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveTicket = async () => {
    if (!activeTicket) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/tickets/${activeTicket.id}/resolve`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        showToast('Ticket marked as resolved successfully.', 'success');
        await loadTickets(activeTicket.id);
      } else {
        showToast('Failed to resolve support ticket.', 'error');
      }
    } catch (err) {
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      payment: '💳 Payment Gateway',
      documents: '📁 Document Verification',
      technical: '💻 Technical Portal Issue',
      other: '❔ General Inquiry',
    };
    return labels[cat] || cat;
  };

  const filteredTickets = tickets.filter((t) => {
    const userName = t.user?.fullName || '';
    const userEmail = t.user?.email || '';
    const userPhone = t.user?.phone || '';
    const subject = t.subject || '';

    const matchesSearch = 
      subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userPhone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' ? true : t.category === filterCategory;
    const matchesStatus = filterStatus === 'all' ? true : t.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 160px)', minHeight: '560px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '26px', color: 'var(--text-dark)', fontWeight: 700 }}>Support & Inquiries Helpdesk</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>
            Review and respond to student inquiries, payment verifications, and document clarifications.
          </p>
        </div>
        <button
          onClick={() => loadTickets()}
          className="btn btn-secondary"
          style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          🔄 Refresh Inquiries
        </button>
      </div>

      {/* Filters bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
        <input
          type="text"
          placeholder="Search by applicant name, email, phone, or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ flexGrow: 1, minWidth: '220px', fontSize: '13px', padding: '8px 12px' }}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="form-input"
          style={{ width: '170px', fontSize: '13px', padding: '8px 12px' }}
        >
          <option value="all">All Categories</option>
          <option value="payment">💳 Payments</option>
          <option value="documents">📁 Documents</option>
          <option value="technical">💻 Technical Issues</option>
          <option value="other">General Inquiry</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="form-input"
          style={{ width: '140px', fontSize: '13px', padding: '8px 12px' }}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open Cases</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          Loading ticket files...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px', flexGrow: 1, height: '70%', overflow: 'hidden' }}>
          
          {/* Left list panel */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)', fontWeight: '700', color: 'var(--text-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Applicant Inquiries ({filteredTickets.length})</span>
            </div>
            
            {filteredTickets.length === 0 ? (
              <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-light)', fontSize: '13px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📬</div>
                No matching support tickets found.
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isActive = activeTicket?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => loadTicketThread(t.id)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      textAlign: 'left',
                      background: isActive ? 'var(--primary-light)' : 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--border-light)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', background: 'var(--bg-main)', color: 'var(--text-light)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                        {t.category.toUpperCase()}
                      </span>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        color: t.status === 'open' ? 'var(--accent-gold)' : '#10b981'
                      }}>
                        ● {t.status === 'open' ? 'OPEN' : 'RESOLVED'}
                      </span>
                    </div>
                    <strong style={{ fontSize: '13px', color: 'var(--text-dark)', display: 'block', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.subject}
                    </strong>
                    <div style={{ fontSize: '12px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>👤 {t.user?.fullName || 'Applicant'}</span>
                      {t.user?.phone && <span style={{ color: 'var(--text-light)', fontSize: '11px' }}>📞 {t.user.phone}</span>}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                      Updated: {new Date(t.updatedAt).toLocaleDateString()} {new Date(t.updatedAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Right chat panel */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {activeTicket ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                
                {/* Chat Header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', color: 'var(--text-dark)', fontWeight: 700 }}>{activeTicket.subject}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: '2px 0 0' }}>
                      Applicant: <strong>{activeTicket.user?.fullName}</strong> ({activeTicket.user?.email}) {activeTicket.user?.phone ? `| 📞 ${activeTicket.user.phone}` : ''} | Cat: <strong>{getCategoryLabel(activeTicket.category)}</strong>
                    </p>
                  </div>
                  {activeTicket.status === 'open' && (
                    <button className="btn btn-secondary" onClick={handleResolveTicket} disabled={submitting} style={{ padding: '6px 12px', fontSize: '12px' }}>
                      ✓ Mark Resolved
                    </button>
                  )}
                </div>

                {/* Messages logs */}
                <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#fafafa' }}>
                  {loadingThread ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-light)' }}>Loading thread messages...</div>
                  ) : (
                    activeTicket.messages?.map((msg) => {
                      const isOfficer = msg.sender.role !== 'applicant';
                      return (
                        <div 
                          key={msg.id} 
                          style={{
                            alignSelf: isOfficer ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isOfficer ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <span style={{ fontSize: '11px', color: 'var(--text-light)', marginBottom: '3px' }}>
                            {msg.sender.fullName} ({isOfficer ? 'Admissions Registry' : 'Applicant'})
                          </span>
                          <div style={{
                            padding: '12px 16px',
                            borderRadius: '12px',
                            borderTopRightRadius: isOfficer ? '2px' : '12px',
                            borderTopLeftRadius: isOfficer ? '12px' : '2px',
                            background: isOfficer ? 'var(--primary-navy)' : '#ffffff',
                            color: isOfficer ? '#ffffff' : 'var(--text-dark)',
                            border: isOfficer ? 'none' : '1px solid #e2e8f0',
                            fontSize: '13px',
                            lineHeight: '1.5',
                            whiteSpace: 'pre-wrap',
                            boxShadow: 'var(--shadow-sm)',
                          }}>
                            {msg.message}
                          </div>
                          <span style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '4px' }}>
                            {new Date(msg.createdAt).toLocaleString('en-KE')}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Send Reply area */}
                <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-card)' }}>
                  <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder={activeTicket.status === 'resolved' ? 'Ticket marked resolved. Reply to reopen...' : 'Write official reply to applicant...'}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="form-input"
                      style={{ flexGrow: 1, borderRadius: '24px' }}
                    />
                    <button type="submit" disabled={submitting || !replyText.trim()} className="btn btn-primary" style={{ borderRadius: '24px', padding: '10px 20px' }}>
                      Send Reply 🚀
                    </button>
                  </form>
                </div>

              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: '40px', color: 'var(--text-light)', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                <h3>No Inquiry Selected</h3>
                <p style={{ maxWidth: '360px', marginTop: '6px' }}>Select an open case file from the sidebar to review the applicant inquiry and post a response.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
