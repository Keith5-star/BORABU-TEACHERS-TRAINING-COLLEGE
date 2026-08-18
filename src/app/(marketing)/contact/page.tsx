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

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', marginTop: '40px' }}>
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
                <span style={{ color: 'var(--text-light)' }}>info@borabutti.ac.ke</span>
              </li>
              <li>
                <strong>🏫 Working Hours:</strong><br />
                <span style={{ color: 'var(--text-light)' }}>Monday - Friday (8:00 AM - 5:00 PM)</span>
              </li>
            </ul>
          </div>

          {/* Map placeholder */}
          <div style={{ background: 'var(--primary-navy)', height: '200px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center', padding: '20px' }}>
            <span style={{ fontSize: '32px', marginBottom: '8px' }}>🗺️</span>
            <h4>Interactive Map</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '4px' }}>
              Located off Kisii – Kericho highway, near Kebirigo Town.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
