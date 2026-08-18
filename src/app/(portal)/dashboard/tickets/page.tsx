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
  messages?: TicketMessage[];
}

export default function TicketsPage() {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // New ticket form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('payment');
  const [initMessage, setInitMessage] = useState('');

  // Reply message state
  const [replyText, setReplyText] = useState('');

  const loadTickets = async (selectId?: string) => {
    try {
      const res = await fetch('/api/tickets');
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
        
        // If a ticket ID is passed, refresh active ticket thread
        if (selectId) {
          const updated = data.tickets.find((t: Ticket) => t.id === selectId);
          if (updated) {
            loadTicketThread(updated.id);
          }
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Could not load tickets.', 'error');
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
      showToast('Failed to fetch ticket message logs.', 'error');
    } finally {
      setLoadingThread(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !initMessage.trim()) {
      showToast('Please fill in all ticket details.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          category,
          message: initMessage.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Support ticket filed successfully.', 'success');
        setSubject('');
        setInitMessage('');
        setShowCreateModal(false);
        await loadTickets();
        if (data.ticketId) {
          await loadTicketThread(data.ticketId);
        }
      } else {
        showToast(data.error || 'Failed to submit ticket.', 'error');
      }
    } catch (err) {
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

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
        // Refresh active ticket and ticket list
        await loadTickets(activeTicket.id);
      } else {
        showToast(data.error || 'Could not post message.', 'error');
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
        showToast('Ticket marked as resolved.', 'success');
        await loadTickets(activeTicket.id);
      } else {
        showToast('Failed to resolve ticket.', 'error');
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
      technical: '💻 Portal Glitch/IT',
      other: '❔ General Inquiry',
    };
    return labels[cat] || cat;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', height: 'calc(100vh - 150px)', minHeight: '500px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px' }}>Support Ticket Helpdesk</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Submit tickets and chat with registry officers about your application file.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          💬 Open New Ticket
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          Loading ticket files...
        </div>
      ) : (
        /* Workspace layout: Left panel ticket list, Right panel chat */
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', flexGrow: 1, height: '80%', overflow: 'hidden' }}>
          
          {/* Left panel: List */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)', fontWeight: '700', color: 'var(--text-dark)' }}>
              Your Cases ({tickets.length})
            </div>
            
            {tickets.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)', fontSize: '13px' }}>
                No support logs submitted yet. Click above to open a ticket.
              </div>
            ) : (
              tickets.map((t) => {
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
                    <strong style={{ fontSize: '13px', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', width: '100%' }}>
                      {t.subject}
                    </strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                      Updated: {new Date(t.updatedAt).toLocaleDateString()}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Right panel: Message Thread */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {activeTicket ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                
                {/* Header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', color: 'var(--text-dark)' }}>{activeTicket.subject}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>
                      Category: {getCategoryLabel(activeTicket.category)} | Status: <strong style={{ color: activeTicket.status === 'open' ? 'var(--accent-gold)' : 'var(--accent-teal)' }}>{activeTicket.status.toUpperCase()}</strong>
                    </p>
                  </div>
                  {activeTicket.status === 'open' && (
                    <button className="btn btn-secondary" onClick={handleResolveTicket} disabled={submitting} style={{ padding: '6px 12px', fontSize: '12px' }}>
                      ✓ Mark Resolved
                    </button>
                  )}
                </div>

                {/* Messages Body */}
                <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#fafafa' }}>
                  {loadingThread ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-light)' }}>Loading thread messages...</div>
                  ) : (
                    activeTicket.messages?.map((msg) => {
                      const isCandidate = msg.sender.role === 'applicant';
                      return (
                        <div 
                          key={msg.id} 
                          style={{
                            alignSelf: isCandidate ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isCandidate ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <span style={{ fontSize: '11px', color: 'var(--text-light)', marginBottom: '3px' }}>
                            {msg.sender.fullName} ({msg.sender.role === 'applicant' ? 'You' : 'Officer'})
                          </span>
                          <div style={{
                            padding: '12px 16px',
                            borderRadius: '12px',
                            borderTopRightRadius: isCandidate ? '2px' : '12px',
                            borderTopLeftRadius: isCandidate ? '12px' : '2px',
                            background: isCandidate ? 'var(--primary-blue)' : '#e2e8f0',
                            color: isCandidate ? '#ffffff' : 'var(--text-dark)',
                            fontSize: '13px',
                            lineHeight: '1.5',
                            whiteSpace: 'pre-wrap',
                            boxShadow: 'var(--shadow-sm)',
                          }}>
                            {msg.message}
                          </div>
                          <span style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '4px' }}>
                            {new Date(msg.createdAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer Send Input */}
                <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-card)' }}>
                  <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder={activeTicket.status === 'resolved' ? 'Type a reply to re-open this ticket...' : 'Write message reply...'}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="form-input"
                      style={{ flexGrow: 1, borderRadius: '24px' }}
                    />
                    <button type="submit" disabled={submitting || !replyText.trim()} className="btn btn-primary" style={{ borderRadius: '24px', padding: '10px 20px' }}>
                      Send 🚀
                    </button>
                  </form>
                </div>

              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: '40px', color: 'var(--text-light)', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                <h3>No Ticket Selected</h3>
                <p style={{ maxWidth: '360px', marginTop: '6px' }}>Select an active ticket from the left panel to review responses, or open a new inquiry.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Modal: New Ticket */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--text-dark)' }}>File New Support Request</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-light)' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Subject Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Summarize your issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Inquiry Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="payment">💳 Payment & Processing Fee (KES 1,000)</option>
                  <option value="documents">📁 Document Validation Slips</option>
                  <option value="technical">💻 Portal Technical Error</option>
                  <option value="other">❔ General Inquiry</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Explanation *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide context, transaction references, or grade descriptions..."
                  value={initMessage}
                  onChange={(e) => setInitMessage(e.target.value)}
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Support Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
