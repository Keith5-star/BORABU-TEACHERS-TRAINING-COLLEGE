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

  const loadTickets = async (selectId?: string) => {
    try {
      const res = await fetch('/api/tickets');
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
        
        if (selectId) {
          const updated = data.tickets.find((t: Ticket) => t.id === selectId);
          if (updated) {
            loadTicketThread(updated.id);
          }
        }
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
      const res = await fetch(`/api/tickets/${ticketId}`);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setReplyText('');
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
      payment: '💳 Payment',
      documents: '📁 Documents',
      technical: '💻 Portal Glitch',
      other: 'General Inquiry',
    };
    return labels[cat] || cat;
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = 
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' ? true : t.category === filterCategory;
    const matchesStatus = filterStatus === 'all' ? true : t.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 180px)', minHeight: '550px' }}>
      <div>
        <h1 style={{ fontSize: '28px', color: 'var(--text-dark)' }}>Support Tickets Desk</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Respond to applicant questions, clarify fee payment references, or resolve technical portal issues.</p>
      </div>

      {/* Filters bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
        <input
          type="text"
          placeholder="Search by student name, email, or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ flexGrow: 1, minWidth: '220px', fontSize: '13px', padding: '8px 12px' }}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="form-input"
          style={{ width: '150px', fontSize: '13px', padding: '8px 12px' }}
        >
          <option value="all">All Categories</option>
          <option value="payment">💳 Payments</option>
          <option value="documents">📁 Documents</option>
          <option value="technical">💻 Technical Errors</option>
          <option value="other">General Inquiry</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="form-input"
          style={{ width: '130px', fontSize: '13px', padding: '8px 12px' }}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          Loading ticket files...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '20px', flexGrow: 1, height: '70%', overflow: 'hidden' }}>
          
          {/* Left list panel */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)', fontWeight: '700', color: 'var(--text-dark)' }}>
              Active Tickets ({filteredTickets.length})
            </div>
            
            {filteredTickets.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)', fontSize: '13px' }}>
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
                      transition: 'var(--transition-fast)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', background: 'var(--bg-main)', color: 'var(--text-light)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                        {t.category.toUpperCase()}
                      </span>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        color: t.status === 'open' ? 'var(--accent-gold)' : 'var(--accent-teal)'
                      }}>
                        ● {t.status === 'open' ? 'OPEN' : 'RESOLVED'}
                      </span>
                    </div>
                    <strong style={{ fontSize: '13px', color: 'var(--text-dark)', display: 'block', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.subject}
                    </strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: '500' }}>
                      👤 {t.user.fullName}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                      Updated: {new Date(t.updatedAt).toLocaleDateString()}
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
                    <h3 style={{ fontSize: '16px', color: 'var(--text-dark)' }}>{activeTicket.subject}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>
                      Applicant: <strong>{activeTicket.user.fullName}</strong> ({activeTicket.user.email}) | Cat: {getCategoryLabel(activeTicket.category)}
                    </p>
                  </div>
                  {activeTicket.status === 'open' && (
                    <button className="btn btn-secondary" onClick={handleResolveTicket} disabled={submitting} style={{ padding: '6px 12px', fontSize: '12px' }}>
                      ✓ Mark as Resolved
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
                            {msg.sender.fullName} ({isOfficer ? 'Support' : 'Applicant'})
                          </span>
                          <div style={{
                            padding: '12px 16px',
                            borderRadius: '12px',
                            borderTopRightRadius: isOfficer ? '2px' : '12px',
                            borderTopLeftRadius: isOfficer ? '12px' : '2px',
                            background: isOfficer ? 'var(--primary-navy)' : '#e2e8f0',
                            color: isOfficer ? '#ffffff' : 'var(--text-dark)',
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
                      placeholder={activeTicket.status === 'resolved' ? 'Ticket resolved. Reply to reopen...' : 'Write your response to the student here...'}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="form-input"
                      style={{ flexGrow: 1, borderRadius: '24px' }}
                    />
                    <button type="submit" disabled={submitting || !replyText.trim()} className="btn btn-primary" style={{ borderRadius: '24px', padding: '10px 20px', background: 'var(--primary-blue)' }}>
                      Post Reply 🚀
                    </button>
                  </form>
                </div>

              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: '40px', color: 'var(--text-light)', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                <h3>No Ticket Selected</h3>
                <p style={{ maxWidth: '360px', marginTop: '6px' }}>Select an open case file from the sidebar to review the applicant inquiry logs.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
