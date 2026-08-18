'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyCheckPage() {
  const [serial, setSerial] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim()) return;
    
    // Normalize slashes to underscores for URL safety
    const safeSerial = serial.trim().replace(/\//g, '_');
    router.push(`/verify/${safeSerial}`);
  };

  return (
    <div className="container" style={{ padding: '80px 20px', display: 'flex', justifyContent: 'center' }}>
      <div className="form-card" style={{ margin: '0', maxWidth: '550px' }}>
        <div style={{ textAlign: 'center', fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
        <h1 className="form-title" style={{ fontSize: '24px' }}>Verify Admission Letter</h1>
        <p className="form-subtitle">
          Enter the unique serial number printed on the admission letter to verify its authenticity.
        </p>

        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label className="form-label">Admission Letter Serial Number</label>
            <input
              type="text"
              required
              placeholder="e.g. BORABU/2026/DPTE/00001"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              className="form-input"
              style={{ textTransform: 'uppercase', textAlign: 'center', fontWeight: '600', letterSpacing: '0.5px' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            Verify Letter Authenticity
          </button>
        </form>

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '20px', fontSize: '12px', color: 'var(--text-light)', textAlign: 'center', lineHeight: '1.5' }}>
          🔒 <strong>Security Warning:</strong> Genuine Borabu TTC admission letters contain a cryptographically verifiable serial code and a QR code. Verification checks search our live college registration database.
        </div>
      </div>
    </div>
  );
}
