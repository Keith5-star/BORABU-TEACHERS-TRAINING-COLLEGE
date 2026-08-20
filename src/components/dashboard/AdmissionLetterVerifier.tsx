'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface VerifiedLetterData {
  verified: boolean;
  serialNumber: string;
  applicantName: string;
  programmeName: string;
  programmeCode: string;
  issuedAt: string;
  reportingDate: string;
}

interface AdmissionLetterVerifierProps {
  userIssuedLetters?: Array<{
    serialNumber: string;
    programmeName: string;
  }>;
}

export default function AdmissionLetterVerifier({
  userIssuedLetters = [],
}: AdmissionLetterVerifierProps) {
  const [serialInput, setSerialInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifiedResult, setVerifiedResult] = useState<VerifiedLetterData | null>(null);

  const handleVerify = async (serialToVerify?: string) => {
    const rawSerial = serialToVerify || serialInput;
    const clean = rawSerial.trim();
    if (!clean) {
      setError('Please enter an admission letter serial number to verify.');
      return;
    }

    setLoading(true);
    setError(null);
    setVerifiedResult(null);

    try {
      // Safe normalization for API endpoint
      const safeSerialParam = encodeURIComponent(clean.replace(/\//g, '_'));
      const res = await fetch(`/api/verify/${safeSerialParam}`);
      const data = await res.json();

      if (res.ok && data.verified) {
        setVerifiedResult(data);
        setSerialInput(data.serialNumber || clean);
      } else {
        setError(data.error || 'No matching admission letter was found in our college registry.');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError('Failed to connect to the verification service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAutoFill = (serial: string) => {
    setSerialInput(serial);
    handleVerify(serial);
  };

  const handleReset = () => {
    setSerialInput('');
    setVerifiedResult(null);
    setError(null);
  };

  return (
    <div
      id="admission-verifier-card"
      style={{
        background: 'var(--bg-card, #ffffff)',
        border: '1px solid var(--border-light, #e2e8f0)',
        borderRadius: 'var(--radius-lg, 16px)',
        padding: '28px',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-dark, #0b2545)',
                margin: 0,
              }}
            >
              Direct Admission Letter Verifier
            </h3>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--accent-gold, #cda34f)',
                background: 'rgba(205, 163, 79, 0.12)',
                padding: '3px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(205, 163, 79, 0.25)',
              }}
            >
              Instant In-Portal Check
            </span>
          </div>
          <p
            style={{
              color: 'var(--text-light, #64748b)',
              fontSize: '13px',
              marginTop: '4px',
              marginBottom: 0,
              maxWidth: '650px',
              lineHeight: '1.5',
            }}
          >
            Instantly validate the cryptographic authenticity and official registry status of any Borabu TTC admission letter by entering its serial number below.
          </p>
        </div>

        {/* Public portal link indicator */}
        <Link
          href="/verify/check"
          target="_blank"
          style={{
            fontSize: '12px',
            color: 'var(--primary-blue, #1d4ed8)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 600,
          }}
        >
          Public Verify Page ↗
        </Link>
      </div>

      {/* Quick Auto-Fill suggestions if student has letters */}
      {userIssuedLetters.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '18px',
            padding: '10px 14px',
            background: 'var(--bg-main, #f8fafc)',
            borderRadius: '8px',
            border: '1px dashed #cbd5e1',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dark, #1e293b)' }}>
            ⚡ Your Issued Letters:
          </span>
          {userIssuedLetters.map((letter) => (
            <button
              key={letter.serialNumber}
              type="button"
              onClick={() => handleQuickAutoFill(letter.serialNumber)}
              style={{
                background: '#ffffff',
                border: '1px solid #94a3b8',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--primary-navy, #0b2545)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
              title={`Auto-verify ${letter.programmeName}`}
            >
              <span>{letter.serialNumber}</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>({letter.programmeName})</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Verification Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: verifiedResult || error ? '20px' : '0',
        }}
      >
        <div style={{ flexGrow: 1, minWidth: '260px', position: 'relative' }}>
          <input
            id="admission-serial-input"
            type="text"
            placeholder="Enter Serial (e.g. BORABU/2026/DPTE/00001 or BTTC/...)"
            value={serialInput}
            onChange={(e) => {
              setSerialInput(e.target.value);
              if (error) setError(null);
            }}
            className="form-input"
            style={{
              width: '100%',
              fontSize: '14px',
              fontWeight: 600,
              padding: '10px 14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily: 'monospace',
              border: error ? '1px solid #ef4444' : '1px solid var(--border-light, #cbd5e1)',
            }}
          />
        </div>

        <button
          id="verify-serial-submit-btn"
          type="submit"
          disabled={loading || !serialInput.trim()}
          className="btn btn-primary"
          style={{
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            minWidth: '130px',
            justifyContent: 'center',
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              Verifying...
            </>
          ) : (
            <>🔍 Verify Status</>
          )}
        </button>

        {(verifiedResult || error || serialInput) && (
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            style={{
              padding: '10px 14px',
              fontSize: '13px',
            }}
          >
            Reset
          </button>
        )}
      </form>

      {/* Error state */}
      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '14px 16px',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '20px' }}>❌</span>
          <div>
            <strong style={{ color: '#991b1b', fontSize: '13px', display: 'block' }}>
              Verification Unsuccessful
            </strong>
            <p style={{ color: '#b91c1c', fontSize: '12px', margin: '4px 0 0', lineHeight: '1.4' }}>
              {error}
            </p>
            <span style={{ fontSize: '11px', color: '#7f1d1d', marginTop: '6px', display: 'block' }}>
              Tip: Ensure the serial matches the exact format on your document (e.g. including slashes or underscores).
            </span>
          </div>
        </div>
      )}

      {/* Verified Authentic Certificate Card */}
      {verifiedResult && (
        <div
          id="verified-letter-result"
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
            border: '2px solid #22c55e',
            borderRadius: '12px',
            padding: '20px 24px',
            marginTop: '18px',
            boxShadow: '0 4px 16px rgba(34, 197, 94, 0.12)',
            position: 'relative',
          }}
        >
          {/* Badge & Seal */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              borderBottom: '1px solid #bbf7d0',
              paddingBottom: '14px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#16a34a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                ✓
              </div>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#15803d',
                  }}
                >
                  Official Registry Record
                </span>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#14532d' }}>
                  Authentic & Valid Admission Letter
                </h4>
              </div>
            </div>

            <div
              style={{
                background: '#dcfce7',
                border: '1px solid #86efac',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🔒 KNEC & MoE Accredited</span>
            </div>
          </div>

          {/* Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              fontSize: '13px',
              marginBottom: '18px',
            }}
          >
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                Applicant Name
              </span>
              <strong style={{ color: '#0f172a', fontSize: '14px' }}>
                {verifiedResult.applicantName}
              </strong>
            </div>

            <div>
              <span style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                Admitted Programme
              </span>
              <strong style={{ color: '#0f172a', fontSize: '14px' }}>
                {verifiedResult.programmeName}
              </strong>{' '}
              <span style={{ fontSize: '11px', color: '#64748b' }}>({verifiedResult.programmeCode})</span>
            </div>

            <div>
              <span style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                Official Serial Number
              </span>
              <code
                style={{
                  background: '#f1f5f9',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  color: '#0b2545',
                  fontSize: '12px',
                }}
              >
                {verifiedResult.serialNumber}
              </code>
            </div>

            <div>
              <span style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                Issue Date
              </span>
              <span style={{ color: '#334155', fontWeight: 600 }}>
                {new Date(verifiedResult.issuedAt).toLocaleDateString('en-KE', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div>
              <span style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                Reporting Date
              </span>
              <span style={{ color: '#166534', fontWeight: 700 }}>
                {new Date(verifiedResult.reportingDate).toLocaleDateString('en-KE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              alignItems: 'center',
              borderTop: '1px dashed #bbf7d0',
              paddingTop: '14px',
            }}
          >
            <a
              href={`/api/letters/download/${encodeURIComponent(verifiedResult.serialNumber)}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                fontSize: '12px',
                padding: '8px 16px',
                background: 'var(--accent-gold, #cda34f)',
                borderColor: 'var(--accent-gold, #cda34f)',
                color: '#0b2545',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              📄 Download PDF Letter
            </a>

            <Link
              href={`/verify/${encodeURIComponent(verifiedResult.serialNumber.replace(/\//g, '_'))}`}
              target="_blank"
              className="btn btn-secondary"
              style={{
                fontSize: '12px',
                padding: '8px 16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🔗 Open Public Verification View ↗
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
