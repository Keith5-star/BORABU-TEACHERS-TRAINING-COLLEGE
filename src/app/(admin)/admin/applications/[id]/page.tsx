'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import GradeRequirementBreakdown from '@/components/dashboard/GradeRequirementBreakdown';
import AdminDocumentScanStatus from '@/components/admin/AdminDocumentScanStatus';
import AiDocumentValidatorModal from '@/components/dashboard/AiDocumentValidatorModal';
import { useToast } from '@/components/Toast';
import { ShieldCheck, ShieldAlert, AlertTriangle, RefreshCw, FileText } from 'lucide-react';
import type { ApplicationScanSummary } from '@/app/api/applications/[id]/anti-forgery-scan/route';

interface Document {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  verified: boolean;
}

interface AdmissionLetter {
  id: string;
  serialNumber: string;
  pdfUrl: string;
  reportingDate: string;
}

interface Application {
  id: string;
  status: string;
  kcseIndexNo: string;
  kcseYear: number;
  kcseMeanGrade: string;
  personalDetails: any;
  subjectGrades: Record<string, string>;
  eligibilityResult: any;
  submittedAt: string | null;
  reviewNotes: string | null;
  reviewedAt: string | null;
  user: {
    fullName: string;
    email: string;
    phone: string;
  };
  programme: {
    id: string;
    name: string;
    code: string;
    level: string;
    minGradeRequirement: {
      meanGrade: string;
      subjects: Record<string, string>;
    };
  };
  documents: Document[];
  admissionLetter: AdmissionLetter | null;
}

export default function AdminApplicationReviewPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;
  const { showToast } = useToast();

  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  
  // Document preview state
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  // Anti-Forgery Scan state
  const [scanSummary, setScanSummary] = useState<ApplicationScanSummary | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const loadScanReport = async () => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/anti-forgery-scan`);
      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          setScanSummary(data.summary);
        }
      }
    } catch (err) {
      console.warn('Anti-forgery scan summary fetch error:', err);
    }
  };

  const handleLiveReScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}/anti-forgery-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Live anti-forgery scan failed.');
      }

      const data = await res.json();
      if (data.summary) {
        setScanSummary(data.summary);
        showToast('✓ Real-time anti-forgery scan complete across all uploaded files.', 'success');
      }
    } catch (err: any) {
      console.error('Failed to trigger live scan:', err);
      showToast(err.message || 'Error occurred while scanning documents.', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const loadApplication = async () => {
    try {
      const res = await fetch(`/api/applications/${applicationId}`);
      if (!res.ok) {
        router.push('/admin');
        return;
      }
      const data = await res.json();
      setApp(data.application);
      
      // Auto-set first document for preview
      if (data.application?.documents?.length > 0) {
        setPreviewDoc(data.application.documents[0]);
      }
      if (data.application?.reviewNotes) {
        setNotes(data.application.reviewNotes);
      }

      // Trigger background anti-forgery scan inspection
      loadScanReport();
    } catch (err) {
      console.error('Failed to load application detail:', err);
      setError('Could not retrieve candidate details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId) {
      loadApplication();
    }
  }, [applicationId]);

  const handleDecision = async (decision: 'approve' | 'reject') => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/applications/${applicationId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, notes }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit decision.');
      }

      // Success, reload page or go back
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to save review decision.');
      setSubmitting(false);
    }
  };

  const getDocLabel = (type: string) => {
    const labels: Record<string, string> = {
      id_copy: 'National ID Card',
      kcse_cert: 'KCSE Certificate',
      photo: 'Passport Photograph',
      birth_cert: 'Birth Certificate',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        Loading student file folder...
      </div>
    );
  }

  if (!app) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        Application file not found.
      </div>
    );
  }

  // Double check requirements logic
  const minReq = app.programme.minGradeRequirement;
  const applicantGrades = app.subjectGrades;
  const gradeOptions = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];

  const meanPassed = gradeOptions.indexOf(app.kcseMeanGrade) <= gradeOptions.indexOf(minReq.meanGrade) && gradeOptions.indexOf(app.kcseMeanGrade) !== -1;

  return (
    <div>
      {/* Back Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: 'var(--primary-blue)', fontWeight: '600', fontSize: '14px' }}>
          &larr; Back to Admissions Queue
        </Link>
        <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
          Application ID: <code>{app.id}</code>
        </span>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '24px' }}>
          <div>⚠️ {error}</div>
        </div>
      )}

      {/* Split review page */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px', alignItems: 'start' }}>
        {/* Left Side: Candidate details & Action panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card: Personal and Academic Profile */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-dark)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
              👤 Candidate Profile
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', fontSize: '13px', lineHeight: '1.6' }}>
              <div>FullName: <strong>{app.user.fullName}</strong></div>
              <div>Email: <strong>{app.user.email}</strong></div>
              <div>Phone: <strong>{app.user.phone}</strong></div>
              <div>Date of Birth: <strong>{app.personalDetails?.dob || 'N/A'}</strong></div>
              <div>Gender: <strong>{app.personalDetails?.gender || 'N/A'}</strong></div>
              <div>County: <strong>{app.personalDetails?.county || 'N/A'}</strong></div>
              <div>Guardian Phone: <strong>{app.personalDetails?.guardianContact || 'N/A'}</strong></div>
            </div>
          </div>

          {/* Card: Grade evaluations */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-dark)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
              🎓 Academic Grade Checks & Requirements
            </h3>
            
            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>KCSE Index Number: <strong>{app.kcseIndexNo}</strong> ({app.kcseYear})</div>

              <GradeRequirementBreakdown
                programmeName={app.programme.name}
                programmeCode={app.programme.code}
                minGradeRequirement={app.programme.minGradeRequirement}
                kcseMeanGrade={app.kcseMeanGrade}
                subjectGrades={app.subjectGrades}
                showCardWrapper={false}
              />
            </div>
          </div>

          {/* Action Decision panel */}
          {app.status === 'submitted' ? (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--text-dark)', marginBottom: '14px' }}>🛡️ Evaluation Decision</h3>
              
              <div className="form-group">
                <label className="form-label">Review Panel Notes / Reasons *</label>
                <textarea
                  rows={4}
                  placeholder="Enter comments about document authenticity or rejection details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  onClick={() => handleDecision('reject')}
                  disabled={submitting}
                  className="btn btn-danger"
                  style={{ flexGrow: 1, padding: '10px 0', fontSize: '13px' }}
                >
                  Reject Candidate
                </button>
                <button
                  onClick={() => handleDecision('approve')}
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ flexGrow: 1, padding: '10px 0', fontSize: '13px', background: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }}
                >
                  Approve & Issue Letter
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '24px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>✓</div>
              <h4 style={{ color: 'var(--text-dark)' }}>File Review Completed</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '4px' }}>
                Current status: <strong>{app.status.toUpperCase()}</strong>. <br />
                Reviewed: {app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString() : 'N/A'}
              </p>
              {app.admissionLetter && (
                <a
                  href={app.admissionLetter.pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ fontSize: '12px', padding: '8px 16px', marginTop: '12px' }}
                >
                  Download Issued Letter (PDF)
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Document Previewer & Anti-Forgery Scan Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '90px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            
            {/* Header with Anti-Forgery Overview and AI Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: 'var(--text-dark)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📂 Uploaded Credentials ({app.documents?.length || 0}/4)
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                  Real-time KNEC binary verification & anti-forgery analysis
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Live Re-Scan Button */}
                <button
                  type="button"
                  onClick={handleLiveReScan}
                  disabled={isScanning || !app.documents?.length}
                  className="btn btn-secondary"
                  style={{
                    fontSize: '11px',
                    padding: '6px 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    height: '32px',
                  }}
                  title="Run active real-time anti-forgery check on all candidate documents"
                >
                  <RefreshCw size={12} className={isScanning ? 'spin-animation' : ''} />
                  {isScanning ? 'Scanning...' : 'Live Re-Scan All'}
                </button>

                {/* AI Document Validator Modal Button */}
                <AiDocumentValidatorModal
                  applicationId={applicationId}
                  applicationTitle={app.programme.name}
                  documentsCount={app.documents?.length || 0}
                  onRescanClick={(docType) => {
                    const doc = app.documents.find(d => d.type === docType);
                    if (doc) setPreviewDoc(doc);
                  }}
                />
              </div>
            </div>

            {/* Application-Level Anti-Forgery Health Bar */}
            {scanSummary && (
              <div
                style={{
                  background: scanSummary.overallStatus === 'AUTHENTIC' ? '#f0fdf4' : scanSummary.overallStatus === 'WARNING_FLAGGED' ? '#fffbeb' : '#fef2f2',
                  border: `1px solid ${scanSummary.overallStatus === 'AUTHENTIC' ? '#bbf7d0' : scanSummary.overallStatus === 'WARNING_FLAGGED' ? '#fde68a' : '#fecaca'}`,
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {scanSummary.overallStatus === 'AUTHENTIC' ? (
                    <ShieldCheck size={16} style={{ color: '#16a34a' }} />
                  ) : scanSummary.overallStatus === 'WARNING_FLAGGED' ? (
                    <AlertTriangle size={16} style={{ color: '#d97706' }} />
                  ) : (
                    <ShieldAlert size={16} style={{ color: '#dc2626' }} />
                  )}
                  <div>
                    <strong style={{ fontSize: '12px', color: scanSummary.overallStatus === 'AUTHENTIC' ? '#14532d' : scanSummary.overallStatus === 'WARNING_FLAGGED' ? '#92400e' : '#991b1b' }}>
                      Anti-Forgery Service: {scanSummary.allVerified ? 'All Documents Verified Authentic' : scanSummary.overallStatus === 'WARNING_FLAGGED' ? 'Advisory Flags on Candidate Files' : 'Potential Discrepancies Flagged'}
                    </strong>
                    <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>
                      ({scanSummary.overallAuthenticityScore}% Avg Authenticity • KNEC & Registry Linked)
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: '11px', fontWeight: 700, color: scanSummary.overallStatus === 'AUTHENTIC' ? '#166534' : '#b45309' }}>
                  ✓ Magic-Bytes & Format Passed
                </span>
              </div>
            )}
            
            {/* Document Selector Grid with Visual Document Scan Status Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginBottom: '16px' }}>
              {app.documents.map((doc) => {
                const docReport = scanSummary?.documents?.find((d) => d.documentId === doc.id || d.docType === doc.type);
                const isSelected = previewDoc?.id === doc.id;

                return (
                  <div
                    key={doc.id}
                    onClick={() => setPreviewDoc(doc)}
                    style={{
                      border: `1px solid ${isSelected ? 'var(--primary-blue)' : 'var(--border-light)'}`,
                      background: isSelected ? 'var(--primary-light)' : 'var(--bg-main)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '12px', color: isSelected ? 'var(--primary-blue)' : 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        📁 {getDocLabel(doc.type)}
                      </strong>

                      {/* Visual 'Document Scan Status' indicator */}
                      <AdminDocumentScanStatus
                        documentReport={docReport}
                        fileName={doc.fileName}
                        docType={doc.type}
                        isVerified={doc.verified}
                        isLoading={isScanning}
                        compactBadgeOnly={true}
                        onRefreshScan={handleLiveReScan}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-light)' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }} title={doc.fileName}>
                        {doc.fileName}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: doc.verified ? '#16a34a' : '#d97706' }}>
                        {doc.verified ? '✓ Verified' : '• Pending'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Document Anti-Forgery Detailed Scan Inspector Card */}
            {previewDoc && (
              <div style={{ marginBottom: '16px' }}>
                <AdminDocumentScanStatus
                  documentReport={scanSummary?.documents?.find((d) => d.documentId === previewDoc.id || d.docType === previewDoc.type)}
                  fileName={previewDoc.fileName}
                  docType={previewDoc.type}
                  isVerified={previewDoc.verified}
                  isLoading={isScanning}
                  showDetailCard={true}
                  onRefreshScan={handleLiveReScan}
                />
              </div>
            )}

            {/* Preview Frame */}
            {previewDoc ? (
              <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-main)' }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-light)', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} style={{ color: 'var(--primary-blue)' }} />
                    <span>Inspecting: <strong style={{ color: 'var(--text-dark)' }}>{previewDoc.fileName}</strong></span>
                  </div>
                  <a href={previewDoc.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    🔗 Open Tab
                  </a>
                </div>
                
                {/* Render depending on file type */}
                {previewDoc.fileUrl.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={`${previewDoc.fileUrl}#toolbar=0`}
                    style={{ width: '100%', height: '420px', border: 'none' }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '320px', padding: '10px', background: 'hsl(215, 15%, 15%)' }}>
                    <img 
                      src={previewDoc.fileUrl} 
                      alt="Credential Preview" 
                      style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ height: '300px', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: '13px' }}>
                No documents uploaded for this candidate application.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
