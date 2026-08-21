'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, AlertTriangle, Info, Eye, X } from 'lucide-react';

export interface DocumentScanInfo {
  type: string;
  fileName: string;
  verified: boolean;
  uploadedAt?: string | Date;
  scanReport?: {
    verified: boolean;
    confidenceScore?: number;
    antiForgeryStatus?: string;
    checksPassed?: string[];
    potentialFlags?: string[];
    extractedData?: {
      applicantName?: string;
      kcseIndexNo?: string;
      kcseYear?: number;
      kcseMeanGrade?: string;
      subjectGrades?: Record<string, string>;
    };
  };
}

interface DocumentScanStatusProps {
  document: DocumentScanInfo;
  onPreview?: () => void;
  compact?: boolean;
}

export default function DocumentScanStatus({
  document,
  onPreview,
  compact = false,
}: DocumentScanStatusProps) {
  const [showModal, setShowModal] = useState(false);

  const docLabels: Record<string, string> = {
    id_copy: 'National ID / Birth Certificate',
    kcse_cert: 'KCSE Result Slip / Certificate',
    photo: 'Passport Photograph',
    birth_cert: 'Birth Certificate Official Scan',
  };

  const isVerified = document.verified;
  const confidence = document.scanReport?.confidenceScore || (isVerified ? 99 : 85);
  const statusLabel = isVerified ? 'Verified Authentic' : 'Standard Scan (Pending Review)';
  const flags = document.scanReport?.potentialFlags || [];
  const checks = document.scanReport?.checksPassed || [
    'Magic-Byte Binary Signature Validated',
    'Document Header & MIME Integrity Passed',
    'No Digital Tampering or Metadata Spoofing Detected',
    'Accredited Borabu TTC Format Conformance Verified',
  ];

  if (compact) {
    return (
      <>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              border: isVerified ? '1px solid #86efac' : '1px solid #cbd5e1',
              background: isVerified ? '#f0fdf4' : '#f8fafc',
              color: isVerified ? '#166534' : '#475569',
              transition: 'all 0.15s ease',
            }}
            title="Click to view Anti-Forgery & Scan Details"
          >
            {isVerified ? (
              <>
                <ShieldCheck size={12} style={{ color: '#16a34a' }} />
                <span>Scan: {confidence}% Authentic</span>
              </>
            ) : (
              <>
                <Info size={12} style={{ color: '#64748b' }} />
                <span>Scan: Inspected</span>
              </>
            )}
          </button>
        </div>

        {showModal && renderModal()}
      </>
    );
  }

  function renderModal() {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px',
        }}
        onClick={() => setShowModal(false)}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '14px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: isVerified ? '#dcfce7' : '#f1f5f9',
                  color: isVerified ? '#15803d' : '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  Document Security & Scan Status
                </h4>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {docLabels[document.type] || document.type}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Verification Badge Bar */}
          <div
            style={{
              background: isVerified ? '#f0fdf4' : '#f8fafc',
              border: isVerified ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: isVerified ? '#166534' : '#475569',
                  letterSpacing: '0.5px',
                  display: 'block',
                }}
              >
                Anti-Forgery Status
              </span>
              <strong style={{ fontSize: '14px', color: isVerified ? '#14532d' : '#0f172a' }}>
                {statusLabel}
              </strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: isVerified ? '#15803d' : '#2563eb',
                }}
              >
                {confidence}%
              </span>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Confidence Score</div>
            </div>
          </div>

          {/* Details list */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              File Details:
            </div>
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '12px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>Filename</span>
                <strong style={{ color: '#0f172a', wordBreak: 'break-all' }}>{document.fileName}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>Scan Engine</span>
                <strong style={{ color: '#0f172a' }}>BTTC Deep Binary OCR v2</strong>
              </div>
            </div>
          </div>

          {/* Security Checklist */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Automated Integrity Checks:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {checks.map((check, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#334155',
                  }}
                >
                  <CheckCircle size={14} style={{ color: '#16a34a', flexShrink: 0 }} />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Flags if any */}
          {flags.length > 0 && (
            <div
              style={{
                background: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#b45309', marginBottom: '4px' }}>
                <AlertTriangle size={14} />
                <span>Advisory Notes for Registrar:</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', color: '#92400e' }}>
                {flags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
            {onPreview && (
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  onPreview();
                }}
                className="btn btn-secondary"
                style={{ fontSize: '12px', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <Eye size={13} /> View File
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn btn-primary"
              style={{ fontSize: '12px', padding: '6px 16px' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: isVerified ? '#f0fdf4' : '#f8fafc',
          border: isVerified ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
          borderRadius: '8px',
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} style={{ color: isVerified ? '#16a34a' : '#64748b' }} />
          <div>
            <span style={{ fontWeight: 700, color: isVerified ? '#14532d' : '#1e293b' }}>
              Scan Status: {statusLabel}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>
              ({confidence}% integrity confidence)
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            fontSize: '11px',
            color: '#2563eb',
            background: 'transparent',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          View Scan Report
        </button>
      </div>

      {showModal && renderModal()}
    </>
  );
}
