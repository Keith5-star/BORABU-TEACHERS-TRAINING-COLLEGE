'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Search, QrCode, FileCheck, AlertTriangle, HelpCircle, CheckCircle2 } from 'lucide-react';

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

  const sampleSerials = [
    'BORABU/2026/DPTE/00001',
    'BORABU/2026/DSTE/00042',
    'BORABU/2026/CECTE/00108',
  ];

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '960px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        
        {/* Main Verification Input Card */}
        <div className="form-card" style={{ margin: '0 auto', maxWidth: '640px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'var(--primary-light)',
                color: 'var(--primary-blue)',
                marginBottom: '12px',
              }}
            >
              <ShieldCheck size={32} />
            </div>
            <h1 className="form-title" style={{ fontSize: '26px', color: 'var(--text-dark)' }}>
              Official Admission Letter Verification
            </h1>
            <p className="form-subtitle" style={{ maxWidth: '480px', margin: '0 auto' }}>
              Public verification service to authenticate admission credentials issued by Borabu Teachers Training College.
            </p>
          </div>

          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>
                Admission Letter Serial Number *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. BORABU/2026/DPTE/00001"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  className="form-input"
                  style={{
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    fontWeight: '700',
                    letterSpacing: '0.8px',
                    fontSize: '16px',
                    padding: '14px 16px',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>Quick try:</span>
                {sampleSerials.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSerial(s)}
                    style={{
                      background: 'var(--bg-main)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      color: 'var(--primary-blue)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Search size={18} />
              Verify Letter Authenticity
            </button>
          </form>

          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '16px', fontSize: '12px', color: 'var(--text-light)', textAlign: 'center', lineHeight: '1.5' }}>
            🔒 <strong>Registry Guarantee:</strong> All verification queries run directly against the live College Registrar database to ensure instantaneous authenticity confirmation.
          </div>
        </div>

        {/* Comprehensive Step-by-Step Verification Instructions */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
            <FileCheck size={24} style={{ color: 'var(--primary-blue)' }} />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                Official Verification Instructions & Guidelines
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                Follow these instructions to validate admission credentials for students, employers, and bursary committees.
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            {/* Step 1 */}
            <div style={{ background: 'var(--bg-main)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--primary-blue)', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                  1
                </span>
                <strong style={{ fontSize: '14px', color: 'var(--text-dark)' }}>Locate Serial Number</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-main)', lineHeight: '1.5', margin: 0 }}>
                Examine the upper-right corner or letterhead banner of the official Admission Letter. The serial number follows the standard format: <code style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>BORABU/YYYY/PROG/XXXXX</code>.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ background: 'var(--bg-main)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--primary-blue)', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                  2
                </span>
                <strong style={{ fontSize: '14px', color: 'var(--text-dark)' }}>Scan Embedded QR Code</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-main)', lineHeight: '1.5', margin: 0 }}>
                Every genuine letter features a cryptographic QR seal at the bottom. Open any smartphone camera or QR scanner app to instantly open the encrypted verification record page.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ background: 'var(--bg-main)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--primary-blue)', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                  3
                </span>
                <strong style={{ fontSize: '14px', color: 'var(--text-dark)' }}>Cross-Check Identity</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-main)', lineHeight: '1.5', margin: 0 }}>
                Compare the verified candidate full name, KCSE index number, enrolled programme, and reporting date displayed on the official verification certificate against the physical letter.
              </p>
            </div>
          </div>

          {/* Security Features & Anti-Fraud Notice */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: '#16a34a' }} /> Genuine Security Features to Inspect:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '12px', color: '#334155' }}>
              <div>✔ <strong>High-Resolution College Crest</strong> with official motto: <em>"Quality Education for Sustainable Development"</em></div>
              <div>✔ <strong>Central Registry Digital Stamp</strong> with matching cryptographic reference ID</div>
              <div>✔ <strong>Authorized Registrar Signature</strong> with college seal overlay</div>
              <div>✔ <strong>Direct Ministry & TSC Accreditation</strong> programme credentials</div>
            </div>

            <div
              style={{
                marginTop: '10px',
                paddingTop: '12px',
                borderTop: '1px dashed #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#991b1b' }}>
                <AlertTriangle size={16} />
                <span>
                  <strong>Suspect Document?</strong> If a certificate returns <em>"Record Not Found"</em> or details do not match, notify admissions immediately.
                </span>
              </div>
              <Link href="/contact" className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 14px' }}>
                Contact Registrar Desk
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

