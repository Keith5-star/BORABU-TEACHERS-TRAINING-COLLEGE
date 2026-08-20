import { prisma } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import QRCode from 'qrcode';
import PrintVerificationButton from '@/components/PrintVerificationButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Admission Authenticity | Borabu Teachers Training College',
  description: 'Public verification portal to confirm the authenticity and status of Borabu Teachers Training College admission letters.',
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
              email: true,
              phone: true,
            },
          },
          programme: {
            select: {
              name: true,
              code: true,
              level: true,
              duration: true,
            },
          },
        },
      },
    },
  });

  // Generate QR Code data URL for instant verification re-check
  let qrCodeDataUrl: string | null = null;
  if (letter) {
    try {
      const serialSafe = letter.serialNumber.replace(/\//g, '_');
      const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://borabuttc.ac.ke'}/verify/${serialSafe}`;
      qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
        margin: 1,
        width: 130,
        color: {
          dark: '#0c1821',
          light: '#ffffff',
        },
      });
    } catch (err) {
      console.error('Failed to generate QR code for verification page:', err);
    }
  }

  const currentDateFormatted = new Date().toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="container verification-print-page" style={{ padding: '48px 20px', display: 'flex', justifyContent: 'center' }}>
      {!letter ? (
        /* Invalid Verification */
        <div
          className="form-card verification-cert-card"
          style={{
            margin: '0',
            maxWidth: '580px',
            borderColor: 'hsl(0, 72%, 85%)',
            background: '#ffffff',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Header on Failure */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'hsl(0, 72%, 95%)',
                color: 'hsl(0, 72%, 45%)',
                fontSize: '32px',
                marginBottom: '12px',
              }}
            >
              ✕
            </div>
            <h1 className="form-title" style={{ fontSize: '24px', color: 'hsl(0, 72%, 30%)', margin: '0 0 6px 0' }}>
              Verification Record Not Found
            </h1>
            <span
              style={{
                display: 'inline-block',
                background: 'hsl(0, 72%, 92%)',
                color: 'hsl(0, 72%, 35%)',
                fontWeight: '700',
                fontSize: '12px',
                padding: '3px 10px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Invalid Serial Number
            </span>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-main)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
            The serial number <strong style={{ color: 'hsl(0, 72%, 35%)', fontFamily: 'monospace', fontSize: '15px' }}>{normalizedSerial}</strong> does not match any official admission letter registered in the Borabu Teachers Training College central database.
          </p>

          <div
            style={{
              background: 'hsl(0, 72%, 98%)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid hsl(0, 72%, 88%)',
              fontSize: '13px',
              color: 'hsl(0, 72%, 30%)',
              marginBottom: '24px',
              lineHeight: '1.6',
            }}
          >
            <strong>⚠️ Advisory Notice:</strong> An unverified serial number may indicate an altered, fabricated, or unapproved document. If you received this document from an applicant or third party, please contact the Office of the Registrar immediately for clarification.
          </div>

          <div className="no-print" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/verify/check" className="btn btn-secondary" style={{ flex: '1 1 180px', textAlign: 'center' }}>
              Verify Another Serial
            </Link>
            <Link href="/contact" className="btn btn-primary" style={{ flex: '1 1 180px', textAlign: 'center' }}>
              Contact Registrar
            </Link>
          </div>
        </div>
      ) : (
        /* Valid Verification Record Card */
        <div
          className="verification-cert-card"
          style={{
            margin: '0',
            maxWidth: '740px',
            width: '100%',
            background: '#ffffff',
            border: '1.5px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
          }}
        >
          {/* Official Letterhead (Prominent on Screen and Print) */}
          <div
            style={{
              borderBottom: '2px solid var(--primary-navy)',
              paddingBottom: '20px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '52px', flexShrink: 0 }}>
                <svg width="48" height="52" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2L3 8.5V18C3 28 10.5 35.5 18 38C25.5 35.5 33 28 33 18V8.5L18 2Z" fill="#14213d" stroke="#b7791f" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M10 19.5H26M10 23.5H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18 9.5L13 13.5V15H23V13.5L18 9.5Z" fill="#b7791f"/>
                  <circle cx="18" cy="14" r="1.5" fill="#14213d"/>
                </svg>
              </div>
              <div>
                <span style={{ fontSize: '10.5px', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--accent-gold)', display: 'block' }}>
                  Republic of Kenya &bull; Ministry of Education
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-navy)', margin: '2px 0', letterSpacing: '-0.3px', lineHeight: '1.2' }}>
                  BORABU TEACHERS TRAINING COLLEGE
                </h2>
                <div style={{ fontSize: '11.5px', color: 'var(--text-light)', lineHeight: '1.4' }}>
                  Office of the College Registrar &bull; Central Admissions & Records Division
                </div>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div style={{ textAlign: 'right' }}>
              <div
                className="verification-badge-verified"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'hsl(142, 70%, 96%)',
                  border: '1.5px solid hsl(142, 70%, 80%)',
                  color: 'hsl(142, 76%, 22%)',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontWeight: '700',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                }}
              >
                <span>✓</span>
                <span>Officially Verified</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>
                Registry Date: {currentDateFormatted}
              </div>
            </div>
          </div>

          {/* Certificate Headline */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: 'var(--accent-gold)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Public Validation Dossier
            </span>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: '800',
                color: 'var(--text-dark)',
                margin: '0 0 6px 0',
                fontFamily: 'var(--font-lora), Georgia, serif',
              }}
            >
              Certificate of Admission Letter Authenticity
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', margin: 0 }}>
              This record validates that an authentic admission letter with the specified serial number was duly issued by Borabu Teachers Training College.
            </p>
          </div>

          {/* Verification Details Table */}
          <div
            className="verification-details-table"
            style={{
              background: 'var(--bg-main)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '24px',
            }}
          >
            {/* Serial Number Row */}
            <div
              className="verification-details-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border-light)',
                background: '#ffffff',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: '600' }}>
                Unique Letter Serial Number:
              </span>
              <strong style={{ fontSize: '14px', color: 'var(--primary-navy)', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                {letter.serialNumber}
              </strong>
            </div>

            {/* Candidate Name Row */}
            <div
              className="verification-details-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: '600' }}>
                Admitted Candidate Full Name:
              </span>
              <strong style={{ fontSize: '14px', color: 'var(--text-dark)', textTransform: 'uppercase' }}>
                {letter.application.user.fullName}
              </strong>
            </div>

            {/* KCSE & Academic Index Row */}
            <div
              className="verification-details-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border-light)',
                background: '#ffffff',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: '600' }}>
                KCSE Index / Academic Reference:
              </span>
              <strong style={{ fontSize: '13.5px', color: 'var(--text-dark)' }}>
                {letter.application.kcseIndexNo} ({letter.application.kcseMeanGrade || 'Validated'})
              </strong>
            </div>

            {/* Accredited Programme Row */}
            <div
              className="verification-details-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: '600' }}>
                Accredited Programme:
              </span>
              <strong style={{ fontSize: '14px', color: 'var(--primary-blue)', textAlign: 'right' }}>
                {letter.application.programme.name} ({letter.application.programme.code})
              </strong>
            </div>

            {/* Programme Level & Duration */}
            <div
              className="verification-details-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border-light)',
                background: '#ffffff',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: '600' }}>
                Study Level & Duration:
              </span>
              <span style={{ fontSize: '13.5px', color: 'var(--text-dark)', fontWeight: '600' }}>
                {letter.application.programme.level} Level &bull; {letter.application.programme.duration}
              </span>
            </div>

            {/* Date Issued */}
            <div
              className="verification-details-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: '600' }}>
                Official Issue Date:
              </span>
              <span style={{ fontSize: '13.5px', color: 'var(--text-dark)', fontWeight: '600' }}>
                {new Date(letter.issuedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            {/* Reporting Date */}
            <div
              className="verification-details-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border-light)',
                background: '#ffffff',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: '600' }}>
                Scheduled Reporting Date:
              </span>
              <strong style={{ fontSize: '14px', color: 'var(--text-dark)' }}>
                {new Date(letter.reportingDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
              </strong>
            </div>

            {/* Database Validation Status */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 18px',
                background: 'hsl(142, 70%, 98%)',
              }}
            >
              <span style={{ fontSize: '13px', color: 'hsl(142, 76%, 22%)', fontWeight: '700' }}>
                Central Database Status:
              </span>
              <strong style={{ fontSize: '13px', color: 'hsl(142, 76%, 20%)', textTransform: 'uppercase' }}>
                ● Active Official Record
              </strong>
            </div>
          </div>

          {/* QR Code & Security Seals Section */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: qrCodeDataUrl ? '130px 1fr' : '1fr',
              gap: '20px',
              alignItems: 'center',
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              marginBottom: '24px',
            }}
          >
            {qrCodeDataUrl && (
              <div
                className="verification-qr-wrap"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ffffff',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  textAlign: 'center',
                }}
              >
                <Image
                  src={qrCodeDataUrl}
                  alt={`QR Code for ${letter.serialNumber}`}
                  width={100}
                  height={100}
                  style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
                  unoptimized
                />
                <span style={{ fontSize: '9px', color: 'var(--text-light)', marginTop: '4px', fontWeight: '600', textTransform: 'uppercase' }}>
                  Scan to Verify
                </span>
              </div>
            )}

            <div>
              <h4 style={{ fontSize: '14px', color: 'var(--primary-navy)', marginBottom: '4px', fontWeight: '700' }}>
                Official Security & Physical Clearance Protocol
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-main)', lineHeight: '1.55', margin: '0 0 8px 0' }}>
                This verification certifies that the named applicant was admitted into Borabu Teachers Training College. On reporting day, the candidate must present their original National Identification Card/Birth Certificate, KCSE Result Slip/Certificate, and two passport photographs for physical verification by the Registrar.
              </p>
              <div style={{ fontSize: '11.5px', color: 'var(--text-light)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <span><strong>College Registrar:</strong> Borabu TTC</span>
                <span>&bull;</span>
                <span><strong>Accredited by:</strong> Ministry of Education / TSC</span>
              </div>
            </div>
          </div>

          {/* Official Registry Stamp Box (Crisp on Print) */}
          <div
            className="verification-security-seal"
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: '#f8fafc',
              border: '1px dashed #94a3b8',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '28px',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.5' }}>
              <strong>BORABU TEACHERS TRAINING COLLEGE REGISTRY VERIFICATION</strong><br />
              <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                P.O. Box 9 - 40506 Kebirigo, Kenya &bull; Tel: 0101930121 &bull; admissions@borabuttc.ac.ke
              </span>
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-light)' }}>
              <div>Digital Stamp: <strong>BORABU-REG-SEC-2026</strong></div>
              <div>Timestamp: {new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC</div>
            </div>
          </div>

          {/* Action Buttons (Hidden on Print) */}
          <div className="no-print" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <PrintVerificationButton label="🖨️ Print Verification Certificate" className="btn-primary" />
            <Link href="/verify/check" className="btn btn-secondary" style={{ padding: '10px 18px' }}>
              Verify Another Serial
            </Link>
            <Link href="/" className="btn btn-secondary" style={{ padding: '10px 18px' }}>
              College Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
