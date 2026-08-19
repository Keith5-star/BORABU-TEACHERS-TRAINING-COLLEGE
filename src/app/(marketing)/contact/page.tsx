'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitting(true);
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '1000px' }}>
      <header className="section-header">
        <span className="section-tag">Reach Out</span>
        <h1 className="section-title">Contact Our Admissions Office</h1>
        <p className="section-desc">
          Have queries about application status, entry grades, or fee programs? Get in touch today.
        </p>
      </header>

      {/* Admissions Office & Direct KUCCPS Placement Card */}
      <div style={{ background: 'var(--bg-card)', borderLeft: '4px solid var(--primary-blue)', padding: '18px 24px', borderRadius: 'var(--radius-md)', borderTop: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', marginTop: '28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-dark)', margin: 0 }}>
              Admissions Office & Direct KUCCPS Placement
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '4px 0 0 0' }}>
              Have questions about admission letters, deferments, or direct applications? Contact the registry desk.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', fontSize: '13px' }}>
            <span>
              📞 <strong>Helpline:</strong> <a href="tel:0101930121" style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>0101930121</a>
            </span>
            <span>
              💬 <strong>WhatsApp:</strong> <a href="https://wa.me/254101930121" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>0101930121</a>
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', marginTop: '32px' }}>
        {/* Contact Form */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px', color: 'var(--text-dark)' }}>Send Us a Message</h3>
          
          {success && (
            <div className="alert alert-success">
              <div>
                <strong>Message Sent!</strong> We have received your inquiry. An admissions representative will respond shortly.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                required 
                placeholder="Enter your name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input" 
              />
            </div>
            
            <div>
              <label className="form-label">Email Address *</label>
              <input 
                type="email" 
                required 
                placeholder="Enter your email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input" 
              />
            </div>

            <div>
              <label className="form-label">Subject</label>
              <input 
                type="text" 
                placeholder="What is this regarding?" 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="form-input" 
              />
            </div>

            <div>
              <label className="form-label">Message *</label>
              <textarea 
                required 
                rows={5} 
                placeholder="Write your message here..." 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-input" 
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              {submitting ? 'Sending...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>

        {/* Contact details & Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '30px', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: 'var(--text-dark)' }}>Campus Details</h3>
            
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none', fontSize: '14px' }}>
              <li>
                <strong>📍 Location:</strong><br />
                <span style={{ color: 'var(--text-light)' }}>Nyamira County, off Kisii – Kericho highway, Alight at Nyangoge, Near Kebirigo Town</span>
              </li>
              <li>
                <strong>✉️ Postal Address:</strong><br />
                <span style={{ color: 'var(--text-light)' }}>P.O. BOX 9 - 40506, Kebirigo</span>
              </li>
              <li>
                <strong>📞 Contact Hotline:</strong><br />
                <span style={{ color: 'var(--text-light)' }}>0746 211 764 | 0727 433 205 | 0725 533 426</span>
              </li>
              <li>
                <strong>📧 General Email:</strong><br />
                <span style={{ color: 'var(--text-light)' }}>info@borabuttc.ac.ke</span>
              </li>
              <li>
                <strong>🏫 Working Hours:</strong><br />
                <span style={{ color: 'var(--text-light)' }}>Monday - Friday (8:00 AM - 5:00 PM)</span>
              </li>
            </ul>
          </div>

          {/* Map Section */}
          <a 
            href="https://www.google.com/maps/place/-0.824378,35.0268" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'block', 
              position: 'relative', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden', 
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              height: '220px'
            }}
          >
            <img 
              src="/images/map_location.png" 
              alt="Borabu Teachers Training College Google Map Location" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              background: 'rgba(30, 41, 59, 0.85)', 
              color: 'white', 
              padding: '10px 15px', 
              fontSize: '12px',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ display: 'block' }}>📍 Borabu TTC Campus Location</strong>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Off Kisii – Kericho highway, near Kebirigo Town</span>
              </div>
              <span style={{ background: 'var(--primary-blue)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                Open Maps ↗
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
