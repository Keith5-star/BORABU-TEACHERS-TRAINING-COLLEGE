import { prisma } from '@/lib/db';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Admission Authenticity',
  description: 'Public verification portal to confirm the authenticity of Borabu Teachers Training College admission letters.',
};

export default async function VerifySerialPage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { serial } = await params;
  const normalizedSerial = serial.replace(/_/g, '/');

  const letter = await prisma.admissionLetter.findFirst({
    where: {
      OR: [
        { serialNumber: normalizedSerial },
        { serialNumber: serial },
      ]
    },
    include: {
      application: {
        include: {
          user: {
            select: {
              fullName: true,
            },
          },
          programme: {
            select: {
              name: true,
              code: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="container" style={{ padding: '80px 20px', display: 'flex', justifyContent: 'center' }}>
      {!letter ? (
        /* Invalid Verification */
        <div className="form-card" style={{ margin: '0', maxWidth: '550px', borderColor: 'hsl(0, 72%, 90%)', background: 'hsl(0, 72%, 99%)' }}>
          <div style={{ textAlign: 'center', fontSize: '56px', marginBottom: '16px' }}>❌</div>
          <h1 className="form-title" style={{ fontSize: '24px', color: 'hsl(0, 72%, 25%)' }}>Verification Failed</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '14px', marginBottom: '24px' }}>
            The serial number <strong>{normalizedSerial}</strong> does not match any official admission letter issued by Borabu Teachers Training College.
          </p>
          
          <div style={{ background: 'white', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid hsl(0, 72%, 85%)', fontSize: '13px', color: 'hsl(0, 72%, 35%)', marginBottom: '24px' }}>
            ⚠️ <strong>Verification Alert:</strong> This could indicate an unauthorized, modified, or forged document. Please verify the code or contact the college registrar admissions desk immediately.
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/verify/check" className="btn btn-secondary" style={{ flexGrow: 1 }}>
              Try Another Serial
            </Link>
            <Link href="/contact" className="btn btn-primary" style={{ flexGrow: 1 }}>
              Contact Registrar
            </Link>
          </div>
        </div>
      ) : (
        /* Valid Verification */
        <div className="form-card" style={{ margin: '0', maxWidth: '600px', borderColor: 'hsl(142, 70%, 80%)', background: 'hsl(142, 70%, 99%)', position: 'relative', overflow: 'hidden' }}>
          {/* Watermark/Hologram */}
          <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', fontSize: '180px', opacity: 0.05, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>
            ✅
          </div>

          <div style={{ textAlign: 'center', fontSize: '56px', marginBottom: '16px' }}>🛡️</div>
          <h1 className="form-title" style={{ fontSize: '24px', color: 'hsl(142, 76%, 15%)' }}>Admission Verified</h1>
          <p style={{ textAlign: 'center', color: 'hsl(142, 76%, 20%)', fontSize: '14px', marginBottom: '24px', fontWeight: '500' }}>
            This is a verified official admission record for Borabu Teachers Training College.
          </p>

          <div 
            style={{ 
              background: 'white', 
              border: '1px solid hsl(142, 70%, 85%)', 
              borderRadius: 'var(--radius-md)', 
              padding: '24px', 
              fontSize: '14px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              marginBottom: '24px'
            }}
          >
            <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-light)' }}>Serial Number:</span>
              <strong style={{ color: 'var(--text-dark)' }}>{letter.serialNumber}</strong>
            </div>

            <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-light)' }}>Student Name:</span>
              <strong style={{ color: 'var(--text-dark)' }}>{letter.application.user.fullName.toUpperCase()}</strong>
            </div>

            <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-light)' }}>Accredited Course:</span>
              <strong style={{ color: 'var(--text-dark)', textAlign: 'right' }}>{letter.application.programme.name}</strong>
            </div>

            <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-light)' }}>Date Issued:</span>
              <strong style={{ color: 'var(--text-dark)' }}>{new Date(letter.issuedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-light)' }}>Reporting Date:</span>
              <strong style={{ color: 'var(--text-dark)' }}>{new Date(letter.reportingDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </div>
          </div>

          <div style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.15)', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--text-main)', textAlign: 'center', marginBottom: '24px' }}>
            ℹ️ <strong>Physical Verification:</strong> The candidate must present their original academic certificate and National Identification Card for physical comparison upon reporting.
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/verify/check" className="btn btn-secondary" style={{ flexGrow: 1 }}>
              Back to Verify
            </Link>
            <Link href="/" className="btn btn-primary" style={{ flexGrow: 1 }}>
              Main Website
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
