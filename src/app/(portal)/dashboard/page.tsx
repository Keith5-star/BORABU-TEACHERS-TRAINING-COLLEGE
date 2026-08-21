'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import GradeRequirementBreakdown from '@/components/dashboard/GradeRequirementBreakdown';
import AdmissionLetterVerifier from '@/components/dashboard/AdmissionLetterVerifier';
import AdmissionLetterPrintModal from '@/components/dashboard/AdmissionLetterPrintModal';
import DocumentScanStatus from '@/components/dashboard/DocumentScanStatus';
import AiDocumentValidatorModal from '@/components/dashboard/AiDocumentValidatorModal';
import TscNewsUpdates from '@/components/dashboard/TscNewsUpdates';
import { Printer, ShieldCheck, FileDown } from 'lucide-react';

interface Document {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
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
  paymentStatus: string;
  paymentReceiptUrl: string | null;
  summaryReceiptUrl: string | null;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  programme: {
    id: string;
    name: string;
    code: string;
    level: string;
    minGradeRequirement?: any;
    feesStructure?: any;
  };
  documents: Document[];
  admissionLetter: AdmissionLetter | null;
}

interface Notification {
  id: string;
  subject: string;
  message: string;
  sentAt: string;
  channel: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePrintApp, setActivePrintApp] = useState<Application | null>(null);
  
  // Log Search and Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState<'all' | 'email' | 'sms'>('all');
  const [resendingId, setResendingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const appRes = await fetch('/api/applications');
      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData.applications || []);
      }

      // Load database notifications dynamically
      const notifRes = await fetch('/api/notifications');
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData.notifications || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleResendNotification = async (notifId: string) => {
    setResendingId(notifId);
    try {
      const res = await fetch('/api/notifications/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: notifId }),
      });
      if (res.ok) {
        showToast('Notification successfully resent.', 'success');
        fetchDashboardData();
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Failed to resend notification.', 'error');
      }
    } catch (err) {
      showToast('Error connecting to gateway service.', 'error');
    } finally {
      setResendingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: 'hsl(210, 16%, 93%)', text: 'var(--text-light)', label: 'Draft Mode' },
      submitted: { bg: 'hsl(38, 92%, 96%)', text: 'var(--accent-gold)', label: 'Under Review' },
      eligibility_passed: { bg: 'hsl(142, 70%, 97%)', text: 'hsl(142, 76%, 20%)', label: 'Eligible (Pre-Check)' },
      eligibility_failed: { bg: 'hsl(0, 72%, 97%)', text: 'hsl(0, 72%, 30%)', label: 'Ineligible' },
      under_review: { bg: 'var(--primary-light)', text: 'var(--primary-blue)', label: 'Officer Review' },
      admitted: { bg: 'hsl(142, 70%, 97%)', text: 'hsl(142, 76%, 20%)', label: 'Admitted' },
      rejected: { bg: 'hsl(0, 72%, 97%)', text: 'hsl(0, 72%, 30%)', label: 'Rejected' },
      letter_issued: { bg: 'hsl(142, 70%, 92%)', text: 'hsl(142, 76%, 15%)', label: 'Letter Issued' },
    };

    const badge = badges[status] || { bg: 'var(--border-light)', text: 'var(--text-light)', label: status };
    return (
      <span style={{ fontSize: '12px', background: badge.bg, color: badge.text, padding: '4px 10px', borderRadius: '12px', fontWeight: '700', border: `1px solid ${badge.text}1a` }}>
        {badge.label}
      </span>
    );
  };

  const renderProgressTracker = (status: string) => {
    const steps = [
      { key: 'draft', label: 'Draft' },
      { key: 'submitted', label: 'Submitted' },
      { key: 'review', label: 'Registry Review' },
      { key: 'issued', label: 'Letter Issued' },
    ];

    let currentStepIdx = 0;
    if (status === 'draft') currentStepIdx = 0;
    else if (status === 'submitted' || status === 'eligibility_passed') currentStepIdx = 1;
    else if (status === 'under_review') currentStepIdx = 2;
    else if (status === 'letter_issued') currentStepIdx = 3;
    else if (status === 'rejected' || status === 'eligibility_failed') currentStepIdx = 2; // stops at review

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '20px 0', padding: '16px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIdx || status === 'letter_issued';
          const isActive = idx === currentStepIdx;
          const isFailed = (status === 'rejected' || status === 'eligibility_failed') && idx === 2;

          return (
            <div key={step.key} style={{ display: 'flex', alignItems: 'center', flexGrow: idx < steps.length - 1 ? 1 : 0 }}>
              <div 
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  background: isFailed ? 'hsl(0, 72%, 51%)' : isCompleted ? 'var(--accent-teal)' : isActive ? 'var(--primary-blue)' : 'var(--border-light)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '700',
                  zIndex: 2,
                }}
              >
                {isFailed ? '❌' : isCompleted ? '✓' : idx + 1}
              </div>
              <span style={{ fontSize: '12px', marginLeft: '8px', fontWeight: isActive || isCompleted ? '600' : '400', color: isFailed ? 'hsl(0, 72%, 51%)' : isActive ? 'var(--primary-blue)' : 'var(--text-light)', marginRight: '8px' }}>
                {step.label}
              </span>
              
              {idx < steps.length - 1 && (
                <div style={{ flexGrow: 1, height: '2px', background: isCompleted ? 'var(--accent-teal)' : 'var(--border-light)', margin: '0 8px' }} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const userIssuedLetters = applications
    .filter((app) => app.admissionLetter && app.admissionLetter.serialNumber)
    .map((app) => ({
      serialNumber: app.admissionLetter!.serialNumber,
      programmeName: app.programme.name,
    }));

  const filteredNotifications = notifications.filter((notif) => {
    const matchesChannel = filterChannel === 'all' ? true : notif.channel === filterChannel;
    const matchesSearch = 
      (notif.subject?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px' }}>Applicant Portal Dashboard</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Track your enrollment forms and retrieve admission letters.</p>
        </div>
        {applications.length > 0 && (
          <Link href="/dashboard/apply" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
            ➕ Start Another Application
          </Link>
        )}
      </div>

      {/* Support & KUCCPS Notice Banner */}
      <div style={{ background: 'var(--primary-light)', borderLeft: '4px solid var(--accent-gold)', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h4 style={{ fontSize: '15px', color: 'var(--text-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📞 Registry & Admissions Support Desk
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5', margin: '0 0 10px 0' }}>
          For inquiries or assistance regarding <strong>Admission/Deferment letters</strong>, <strong>DPTE/DSTE/SNE Applications</strong>, <strong>School-based/Upgrading courses</strong>, or <strong>Unsuccessful applications</strong>, contact the registrar directly. 
          Additionally, if you or someone you know missed placement under <strong>KUCCPS</strong>, direct applications are currently open!
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '13px', fontWeight: 'bold' }}>
          <a href="tel:0101930121" style={{ color: 'var(--primary-blue)', textDecoration: 'underline' }}>📞 Call/WhatsApp: 0101930121</a>
          <span style={{ color: 'var(--border-light)' }}>|</span>
          <a href="https://wa.me/254101930121" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-teal)', textDecoration: 'underline' }}>💬 Chat on WhatsApp</a>
        </div>
      </div>

      {/* Direct Admission Letter Status Verifier */}
      <div style={{ marginBottom: '28px' }}>
        <AdmissionLetterVerifier userIssuedLetters={userIssuedLetters} />
      </div>

      {/* Live Search-Grounded TSC News & Official Registration Updates */}
      <TscNewsUpdates />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          Loading your application file...
        </div>
      ) : applications.length === 0 ? (
        <div 
          style={{ 
            textAlign: 'center', 
            padding: '60px 40px', 
            background: 'var(--bg-card)', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📁</div>
          <h2 style={{ fontSize: '22px', marginBottom: '10px', color: 'var(--text-dark)' }}>No Active Applications</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', maxWidth: '440px', margin: '0 auto 24px' }}>
            You haven&apos;t submitted any teacher training applications yet. Click below to explore programmes and start a draft.
          </p>
          <Link href="/dashboard/apply" className="btn btn-primary" style={{ padding: '12px 24px' }}>
            Start Application File
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {applications.map((app) => (
            <div 
              key={app.id}
              style={{ 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-light)', 
                borderRadius: 'var(--radius-lg)', 
                padding: '30px', 
                boxShadow: 'var(--shadow-sm)' 
              }}
            >
              {/* App Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', color: 'var(--text-dark)' }}>
                    {app.programme.name}
                  </h3>
                  <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                    Ref ID: <code style={{ fontWeight: '700' }}>{app.id.slice(0, 8)}...</code> 
                    {app.submittedAt && ` | Submitted: ${new Date(app.submittedAt).toLocaleDateString()}`}
                  </span>
                </div>
                <div>{getStatusBadge(app.status)}</div>
              </div>

              {/* Progress Tracker */}
              {renderProgressTracker(app.status)}

              {/* Status Details Panels */}
              {app.status === 'draft' && (
                <div className="alert alert-info" style={{ margin: '20px 0 0' }}>
                  <div>
                    <strong>Draft application incomplete:</strong>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>
                      You have an active draft for this course. Please complete your KCSE index details, subject grades, and upload copies of required identification papers.
                    </p>
                    <Link href={`/dashboard/apply/${app.id}`} className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 16px', marginTop: '12px' }}>
                      Complete Application Wizard &rarr;
                    </Link>
                  </div>
                </div>
              )}

              {(app.status === 'submitted' || app.status === 'under_review') && (
                <div className="alert alert-warning" style={{ margin: '20px 0 0' }}>
                  <div>
                    <strong>Application Under Manual Registry Review:</strong>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>
                      Your grades passed the automatic pre-checks. The registrar panel is currently reviewing your uploaded document copies (National ID, KCSE Cert/Slip) to verify credentials. Check back soon.
                    </p>
                  </div>
                </div>
              )}

              {app.status === 'eligibility_failed' && (
                <div className="alert alert-danger" style={{ margin: '20px 0 0' }}>
                  <div>
                    <strong>Academic Entry Requirements Not Met:</strong>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>
                      The system&apos;s eligibility engine has flagged that your grades do not meet the minimum criteria for this program. You must select another course (e.g. CECTE) or re-verify details.
                    </p>
                    <p style={{ fontSize: '12px', marginTop: '8px', fontStyle: 'italic' }}>
                      Auto-Check audit: {app.eligibilityResult?.message || 'KCSE grades check failed.'}
                    </p>
                  </div>
                </div>
              )}

              {app.status === 'rejected' && (
                <div className="alert alert-danger" style={{ margin: '20px 0 0' }}>
                  <div>
                    <strong>Application Rejected:</strong>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>
                      Your application has been reviewed and rejected by the Admissions Panel.
                    </p>
                    <p style={{ fontSize: '13px', marginTop: '6px', fontWeight: '600' }}>
                      Panel notes: {app.reviewNotes || 'Does not meet minimum requirements.'}
                    </p>
                  </div>
                </div>
              )}

              {app.status === 'letter_issued' && app.admissionLetter && (
                <div className="alert alert-success" style={{ margin: '20px 0 0', display: 'block' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>🎉 Congratulations! You Have Been Admitted</h4>
                  <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '14px' }}>
                    Your application for <strong>{app.programme.name}</strong> has been approved. Your official admission letter has been generated with serial number <strong>{app.admissionLetter.serialNumber}</strong>. Please download the PDF letter below, print it, and follow the reporting guidelines.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setActivePrintApp(app)}
                      className="btn btn-accent"
                      style={{ fontSize: '13px', padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                      id={`print-letter-${app.id}`}
                    >
                      <Printer size={15} /> 🖨️ Print Admission Letter
                    </button>
                    <a 
                      href={`/api/letters/download/${app.admissionLetter.serialNumber}`} 
                      download 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary" 
                      style={{ fontSize: '13px', padding: '10px 20px', background: 'var(--accent-gold)', borderColor: 'var(--accent-gold)' }}
                    >
                      📄 Download PDF
                    </a>
                    <a
                      href="#admission-verifier-card"
                      className="btn btn-secondary"
                      style={{ fontSize: '13px', padding: '10px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      🛡️ Auto-Verify Letter Status
                    </a>
                    <span style={{ fontSize: '12px', color: 'var(--text-main)' }}>
                      Reporting Date: <strong>{new Date(app.admissionLetter.reportingDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Visual Academic Grade Requirement Breakdown Matrix */}
              <GradeRequirementBreakdown
                programmeName={app.programme.name}
                programmeCode={app.programme.code}
                minGradeRequirement={app.programme.minGradeRequirement}
                kcseMeanGrade={app.kcseMeanGrade}
                subjectGrades={app.subjectGrades}
                applicationStatus={app.status}
              />

              {/* Document Scan Status & Anti-Forgery Review Strip with AI Legibility Validator */}
              {app.documents && app.documents.length > 0 && (
                <div style={{ marginTop: '20px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={18} style={{ color: 'var(--primary-blue)' }} />
                      <div>
                        <strong style={{ fontSize: '14px', color: 'var(--text-dark)', display: 'block' }}>
                          Uploaded Credentials ({app.documents.length} File{app.documents.length > 1 ? 's' : ''})
                        </strong>
                        <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                          KNEC format compliance, anti-forgery headers, & AI legibility inspection
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: '12px' }}>
                        ✓ Binary Checks Passed
                      </span>

                      {/* AI Validate Documents Button */}
                      <AiDocumentValidatorModal
                        applicationId={app.id}
                        applicationTitle={app.programme.name}
                        documentsCount={app.documents.length}
                        onRescanClick={(docType) => {
                          if (app.status === 'draft') {
                            router.push(`/dashboard/apply/${app.id}`);
                          } else {
                            showToast(`To update or rescan ${docType || 'documents'} for a submitted application, please reach out via the Helpdesk or Registry.`, 'info');
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                    {app.documents.map((doc) => (
                      <DocumentScanStatus
                        key={doc.id}
                        document={{
                          type: doc.type,
                          fileName: doc.fileName,
                          verified: true,
                        }}
                        compact={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Receipt, Export PDF and Summary Downloads Area */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '20px', alignItems: 'center' }}>
                {/* Export Application PDF Button */}
                <a
                  href={`/api/applications/${app.id}/export-pdf`}
                  download
                  className="btn btn-primary"
                  style={{ fontSize: '12px', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                  id={`export-pdf-${app.id}`}
                >
                  <FileDown size={14} /> 📄 Export PDF (Application Dossier)
                </a>

                {app.paymentStatus === 'paid' && (
                  <a
                    href={`/api/payments/receipt/${app.id}`}
                    download
                    className="btn btn-secondary"
                    style={{ fontSize: '12px', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    💳 Download Fee Receipt (PDF)
                  </a>
                )}
                {app.status !== 'draft' && app.summaryReceiptUrl && (
                  <a
                    href={app.summaryReceiptUrl}
                    download
                    className="btn btn-secondary"
                    style={{ fontSize: '12px', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    📄 Download Summary Receipt (PDF)
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Inbox / Notification Logs */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '30px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-dark)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📨 Communications Log
            </h3>
            <p style={{ color: 'var(--text-light)', fontSize: '13px', marginBottom: '20px' }}>
              Logs of notices dispatched to your registered contact coordinates for transparency.
            </p>

            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search subject or logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ flexGrow: 1, minWidth: '200px', fontSize: '13px', padding: '8px 12px' }}
              />
              <select
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value as any)}
                className="form-input"
                style={{ width: '150px', fontSize: '13px', padding: '8px 12px' }}
              >
                <option value="all">All Channels</option>
                <option value="email">Email Notices</option>
                <option value="sms">SMS Alerts</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredNotifications.length === 0 ? (
                <div style={{ borderLeft: '4px solid var(--primary-blue)', padding: '12px 16px', background: 'var(--bg-main)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', fontSize: '13px' }}>
                  <p style={{ color: 'var(--text-light)', margin: 0 }}>
                    No matching communication logs found.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  let borderCol = 'var(--primary-blue)';
                  const subjectLower = notif.subject?.toLowerCase() || '';
                  if (subjectLower.includes('offer') || subjectLower.includes('approve') || subjectLower.includes('admit')) {
                    borderCol = 'var(--accent-teal)';
                  } else if (subjectLower.includes('regret') || subjectLower.includes('reject') || subjectLower.includes('failed')) {
                    borderCol = 'hsl(0, 72%, 51%)';
                  } else if (subjectLower.includes('confirm') || subjectLower.includes('submit')) {
                    borderCol = 'var(--accent-gold)';
                  }

                  return (
                    <div 
                      key={notif.id} 
                      style={{ 
                        borderLeft: `4px solid ${borderCol}`, 
                        padding: '16px', 
                        background: 'var(--bg-main)', 
                        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', 
                        fontSize: '13px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '20px',
                      }}
                    >
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
                          <span style={{ fontSize: '10px', background: 'var(--border-light)', color: 'var(--text-dark)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                            {notif.channel.toUpperCase()}
                          </span>
                          <strong style={{ color: 'var(--text-dark)' }}>{notif.subject || 'SMS Notification'}</strong>
                          <span style={{ color: 'var(--text-light)', fontSize: '11px' }}>
                            {new Date(notif.sentAt).toLocaleString('en-KE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                          {notif.message}
                        </p>
                      </div>
                      
                      {/* Resend Action */}
                      <button
                        type="button"
                        onClick={() => handleResendNotification(notif.id)}
                        disabled={resendingId === notif.id}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '6px 12px', flexShrink: 0, margin: 0 }}
                      >
                        {resendingId === notif.id ? 'Resending...' : '🔄 Resend'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

      {/* Printable Admission Letter Modal */}
      {activePrintApp && activePrintApp.admissionLetter && (
        <AdmissionLetterPrintModal
          isOpen={!!activePrintApp}
          onClose={() => setActivePrintApp(null)}
          serialNumber={activePrintApp.admissionLetter.serialNumber}
          applicantName={activePrintApp.user?.fullName || activePrintApp.personalDetails?.fullName || 'Applicant'}
          email={activePrintApp.user?.email || 'applicant@borabuttc.ac.ke'}
          phone={activePrintApp.user?.phone || activePrintApp.personalDetails?.phone || '+254 700 000 000'}
          kcseIndexNo={activePrintApp.kcseIndexNo || 'N/A'}
          kcseMeanGrade={activePrintApp.kcseMeanGrade || 'N/A'}
          programmeName={activePrintApp.programme.name}
          programmeCode={activePrintApp.programme.code}
          reportingDate={activePrintApp.admissionLetter.reportingDate}
          feesSummary={
            Array.isArray(activePrintApp.programme.feesStructure) && activePrintApp.programme.feesStructure.length > 0
              ? activePrintApp.programme.feesStructure.map((fee: any) => ({
                  semester: fee.semester || 'Semester',
                  total: fee.total || (fee.tuition || 0) + (fee.boarding || 0) + (fee.activity || 0) || 20000,
                }))
              : undefined
          }
        />
      )}
    </div>
  );
}
