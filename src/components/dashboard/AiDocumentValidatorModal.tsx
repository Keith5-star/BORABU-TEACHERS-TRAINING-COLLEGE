'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  ShieldCheck,
} from 'lucide-react';
import type { ApplicationValidationReport } from '@/lib/aiDocumentValidator';

interface AiDocumentValidatorModalProps {
  applicationId: string;
  applicationTitle?: string;
  documentsCount: number;
  onRescanClick?: (documentType?: string) => void;
  onPreviewClick?: (fileUrl: string, fileName: string) => void;
}

export default function AiDocumentValidatorModal({
  applicationId,
  applicationTitle: _applicationTitle,
  documentsCount,
  onRescanClick,
  onPreviewClick: _onPreviewClick,
}: AiDocumentValidatorModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [report, setReport] = useState<ApplicationValidationReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = (extra: Record<string, string> = {}) => {
    const headers: Record<string, string> = { ...extra };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  };

  const handleRunValidation = async () => {
    setIsValidating(true);
    setError(null);
    try {
      const res = await fetch(`/api/applications/${applicationId}/validate-documents`, {
        method: 'POST',
        headers: getAuthHeaders({
          'Content-Type': 'application/json',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to validate documents with AI.');
      }

      setReport(data.report);
    } catch (err: any) {
      setError(err?.message || 'Error occurred while validating documents.');
    } finally {
      setIsValidating(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    if (!report) {
      handleRunValidation();
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const getMetricBadge = (metricName: string, value: string) => {
    const isGood =
      value === 'crisp' ||
      value === 'optimal' ||
      value === 'all_corners_visible' ||
      value === 'fully_readable';
    const isMid =
      value === 'acceptable' ||
      value === 'partially_cropped' ||
      value === 'partially_obscured' ||
      value === 'glare_detected';

    let label = value.replace(/_/g, ' ');
    label = label.charAt(0).toUpperCase() + label.slice(1);

    const bg = isGood ? '#f0fdf4' : isMid ? '#fffbeb' : '#fef2f2';
    const color = isGood ? '#166534' : isMid ? '#92400e' : '#991b1b';
    const border = isGood ? '#bbf7d0' : isMid ? '#fde68a' : '#fecaca';

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 8px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 600,
          background: bg,
          color: color,
          border: `1px solid ${border}`,
        }}
      >
        {isGood ? '✓' : isMid ? '⚠️' : '✕'} {metricName}: {label}
      </span>
    );
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={openModal}
        disabled={documentsCount === 0}
        className="btn"
        id={`btn-validate-documents-${applicationId}`}
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          cursor: documentsCount === 0 ? 'not-allowed' : 'pointer',
          opacity: documentsCount === 0 ? 0.6 : 1,
          boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)',
          transition: 'all 0.2s ease',
        }}
        title={
          documentsCount === 0
            ? 'Upload documents first to run AI clarity validation'
            : 'Check document legibility, contrast, and rescan status via AI'
        }
      >
        <Sparkles size={14} style={{ color: '#93c5fd' }} />
        <span>Validate Documents (AI Clarity)</span>
      </button>

      {/* Verification Dialog / Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '840px',
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 24px',
                borderBottom: '1px solid #e2e8f0',
                background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    AI Document Quality & Legibility Inspector
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                    Borabu Teachers Training College • Ministry of Education & TSC Conformance Check
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleRunValidation}
                  disabled={isValidating}
                  className="btn btn-secondary"
                  style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '8px',
                  }}
                >
                  <RefreshCw
                    size={13}
                    style={{
                      animation: isValidating ? 'spin 1s linear infinite' : 'none',
                    }}
                  />
                  <span>{isValidating ? 'Inspecting...' : 'Re-Validate'}</span>
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {isValidating && !report && (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      border: '4px solid #e2e8f0',
                      borderTop: '4px solid #2563eb',
                      borderRadius: '50%',
                      margin: '0 auto 20px',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    AI Vision Analysis in Progress...
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>
                    Evaluating optical clarity, lighting contrast, margin boundaries, and KNEC/Government watermark readability across all uploaded credentials.
                  </p>
                </div>
              )}

              {error && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '10px',
                    padding: '16px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <AlertTriangle size={18} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '13px', color: '#991b1b' }}>Validation Encountered an Issue</strong>
                    <p style={{ fontSize: '12px', color: '#b91c1c', margin: '4px 0 0' }}>{error}</p>
                  </div>
                </div>
              )}

              {report && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Global Status Banner */}
                  <div
                    style={{
                      background:
                        report.overallStatus === 'all_passed'
                          ? '#f0fdf4'
                          : report.overallStatus === 'rescan_needed'
                          ? '#fff1f2'
                          : '#fffbeb',
                      border:
                        report.overallStatus === 'all_passed'
                          ? '1px solid #86efac'
                          : report.overallStatus === 'rescan_needed'
                          ? '1px solid #fecdd3'
                          : '1px solid #fde68a',
                      borderRadius: '12px',
                      padding: '18px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background:
                            report.overallStatus === 'all_passed'
                              ? '#dcfce7'
                              : report.overallStatus === 'rescan_needed'
                              ? '#ffe4e6'
                              : '#fef3c7',
                          color:
                            report.overallStatus === 'all_passed'
                              ? '#15803d'
                              : report.overallStatus === 'rescan_needed'
                              ? '#e11d48'
                              : '#b45309',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {report.overallStatus === 'all_passed' ? (
                          <CheckCircle2 size={24} />
                        ) : report.overallStatus === 'rescan_needed' ? (
                          <AlertTriangle size={24} />
                        ) : (
                          <ShieldCheck size={24} />
                        )}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4
                            style={{
                              margin: 0,
                              fontSize: '16px',
                              fontWeight: 800,
                              color:
                                report.overallStatus === 'all_passed'
                                  ? '#14532d'
                                  : report.overallStatus === 'rescan_needed'
                                  ? '#9f1239'
                                  : '#78350f',
                            }}
                          >
                            {report.overallStatus === 'all_passed'
                              ? 'All Documents Clear & Fully Legible'
                              : report.overallStatus === 'rescan_needed'
                              ? 'Rescan Recommended for 1+ Documents'
                              : 'Documents Legible with Minor Notes'}
                          </h4>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '12px',
                              background: '#ffffff',
                              border: '1px solid currentColor',
                              color:
                                report.overallStatus === 'all_passed'
                                  ? '#16a34a'
                                  : report.overallStatus === 'rescan_needed'
                                  ? '#e11d48'
                                  : '#d97706',
                            }}
                          >
                            {report.overallScore}% Overall Clarity
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#475569' }}>
                          {report.summaryMessage}
                        </p>
                      </div>
                    </div>

                    {/* Stats pills */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div
                        style={{
                          background: '#ffffff',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                          {report.totalDocuments}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>
                          Checked
                        </div>
                      </div>

                      <div
                        style={{
                          background: '#ffffff',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          border: '1px solid #bbf7d0',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#16a34a' }}>
                          {report.passedCount}
                        </div>
                        <div style={{ fontSize: '10px', color: '#166534', textTransform: 'uppercase' }}>
                          Passed
                        </div>
                      </div>

                      {report.rescanCount > 0 && (
                        <div
                          style={{
                            background: '#ffffff',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid #fecdd3',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ fontSize: '16px', fontWeight: 800, color: '#e11d48' }}>
                            {report.rescanCount}
                          </div>
                          <div style={{ fontSize: '10px', color: '#9f1239', textTransform: 'uppercase' }}>
                            Rescan
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documents List Breakdown */}
                  <div>
                    <h5
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: '#64748b',
                        marginBottom: '12px',
                      }}
                    >
                      Individual Document Clarity & Rescan Status:
                    </h5>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {report.documents.map((doc) => {
                        const isRescan = doc.rescanRequired;
                        const isPass = doc.verdict === 'pass';

                        return (
                          <div
                            key={doc.documentId}
                            style={{
                              background: '#ffffff',
                              border: isRescan
                                ? '1.5px solid #fda4af'
                                : isPass
                                ? '1px solid #e2e8f0'
                                : '1px solid #fde68a',
                              borderRadius: '12px',
                              padding: '18px',
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {/* Doc Top Bar */}
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                gap: '12px',
                                marginBottom: '12px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: isPass ? '#f0fdf4' : isRescan ? '#fff1f2' : '#fffbeb',
                                    color: isPass ? '#16a34a' : isRescan ? '#e11d48' : '#d97706',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                  }}
                                >
                                  {isPass ? '✓' : isRescan ? '⚠️' : 'ℹ️'}
                                </div>
                                <div>
                                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                                    {doc.documentLabel}
                                  </h4>
                                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                                    File: <code style={{ fontWeight: 600 }}>{doc.fileName}</code>
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ textAlign: 'right' }}>
                                  <div
                                    style={{
                                      fontSize: '16px',
                                      fontWeight: 800,
                                      color: isPass ? '#16a34a' : isRescan ? '#e11d48' : '#d97706',
                                    }}
                                  >
                                    {doc.overallLegibilityScore}%
                                  </div>
                                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                                    Legibility Index
                                  </div>
                                </div>

                                <span
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    background: isPass ? '#dcfce7' : isRescan ? '#ffe4e6' : '#fef3c7',
                                    color: isPass ? '#15803d' : isRescan ? '#9f1239' : '#92400e',
                                    border: isPass
                                      ? '1px solid #bbf7d0'
                                      : isRescan
                                      ? '1px solid #fecdd3'
                                      : '1px solid #fde68a',
                                  }}
                                >
                                  {isPass
                                    ? 'Clear & Legible'
                                    : isRescan
                                    ? 'Rescan Required'
                                    : 'Acceptable (Warning)'}
                                </span>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div
                              style={{
                                width: '100%',
                                height: '6px',
                                background: '#f1f5f9',
                                borderRadius: '3px',
                                overflow: 'hidden',
                                marginBottom: '14px',
                              }}
                            >
                              <div
                                style={{
                                  width: `${doc.overallLegibilityScore}%`,
                                  height: '100%',
                                  background: isPass ? '#16a34a' : isRescan ? '#e11d48' : '#f59e0b',
                                  borderRadius: '3px',
                                }}
                              />
                            </div>

                            {/* Metric Badges Strip */}
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                                marginBottom: '14px',
                              }}
                            >
                              {getMetricBadge('Sharpness', doc.qualityMetrics.sharpness)}
                              {getMetricBadge('Lighting', doc.qualityMetrics.lightingContrast)}
                              {getMetricBadge('Framing', doc.qualityMetrics.framingAndMargins)}
                              {getMetricBadge('Text Readability', doc.qualityMetrics.textReadability)}
                            </div>

                            {/* Actionable Feedback Box */}
                            <div
                              style={{
                                background: '#f8fafc',
                                borderRadius: '8px',
                                padding: '12px 14px',
                                border: '1px solid #e2e8f0',
                                marginBottom: '12px',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: '#475569',
                                  textTransform: 'uppercase',
                                  marginBottom: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Sparkles size={12} style={{ color: '#2563eb' }} />
                                AI Optical Diagnosis:
                              </div>
                              <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', lineHeight: '1.5' }}>
                                {doc.actionableFeedback}
                              </p>
                            </div>

                            {/* Detected Institutional Elements */}
                            {doc.detectedFeatures && doc.detectedFeatures.length > 0 && (
                              <div style={{ marginBottom: '12px' }}>
                                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                                  Identified Elements:
                                </span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                                  {doc.detectedFeatures.map((feat, fIdx) => (
                                    <span
                                      key={fIdx}
                                      style={{
                                        fontSize: '11px',
                                        background: '#f1f5f9',
                                        color: '#334155',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                      }}
                                    >
                                      ✓ {feat}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Rescan Instructions if needed */}
                            {isRescan && doc.rescanTips && doc.rescanTips.length > 0 && (
                              <div
                                style={{
                                  background: '#fff1f2',
                                  border: '1px solid #fecdd3',
                                  borderRadius: '8px',
                                  padding: '12px 14px',
                                  marginBottom: '12px',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: '#9f1239',
                                    marginBottom: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <RefreshCw size={13} />
                                  Tips for Clear Rescan:
                                </div>
                                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#881337' }}>
                                  {doc.rescanTips.map((tip, tIdx) => (
                                    <li key={tIdx} style={{ marginTop: '2px' }}>
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Action Row */}
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '10px',
                                borderTop: '1px solid #f1f5f9',
                                paddingTop: '10px',
                              }}
                            >
                              {onRescanClick && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    closeModal();
                                    onRescanClick(doc.documentType);
                                  }}
                                  className="btn btn-secondary"
                                  style={{
                                    fontSize: '12px',
                                    padding: '6px 12px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: isRescan ? '#e11d48' : '#334155',
                                    borderColor: isRescan ? '#fecdd3' : '#cbd5e1',
                                  }}
                                >
                                  <RefreshCw size={13} />
                                  <span>{isRescan ? 'Rescan / Replace File' : 'Upload Newer Scan'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                borderTop: '1px solid #e2e8f0',
                background: '#f8fafc',
              }}
            >
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Automated Quality Pre-Check • Powered by Gemini Vision & BTTC Registry Engine
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="btn btn-primary"
                style={{ fontSize: '13px', padding: '8px 20px' }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
