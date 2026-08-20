import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import QRCode from 'qrcode';
import Link from 'next/link';
import PrintTriggerButton from '@/components/dashboard/PrintTriggerButton';
import { ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Official Admission Letter (Print)',
  description: 'Printable official admission letter for Borabu Teachers Training College',
};

export default async function PrintAdmissionLetterPage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { serial } = await params;
  const decodedSerial = decodeURIComponent(serial);
  const serialSafe = decodedSerial.replace(/\//g, '_');

  const letter = await prisma.admissionLetter.findFirst({
    where: {
      OR: [
        { serialNumber: decodedSerial },
        { serialNumber: serialSafe },
        { serialNumber: serial },
      ],
    },
    include: {
      application: {
        include: {
          user: true,
          programme: true,
        },
      },
    },
  });

  if (!letter) {
    notFound();
  }

  // Authorization check: User must be applicant owner or staff/admin
  if (user.role === 'applicant' && letter.application.userId !== user.id) {
    redirect('/dashboard');
  }

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://borabuttc.ac.ke'}/verify/${serialSafe}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 140,
    color: {
      dark: '#0c1821',
      light: '#ffffff',
    },
  });

  let feesStructure: { semester: string; total?: number; tuition?: number; boarding?: number; activity?: number }[] = [];
  try {
    feesStructure = JSON.parse(letter.application.programme.feesStructure || '[]');
  } catch {
    feesStructure = [];
  }

  if (feesStructure.length === 0) {
    feesStructure = [
      { semester: 'Term 1 / Semester 1', total: 24500 },
      { semester: 'Term 2 / Semester 2', total: 18500 },
      { semester: 'Term 3 / Semester 3', total: 18500 },
    ];
  }

  const feesSummary = feesStructure.map((fee) => ({
    semester: fee.semester,
    total: fee.total || ((fee.tuition || 0) + (fee.boarding || 0) + (fee.activity || 0)) || 20000,
  }));

  const totalFirstYear = feesSummary.reduce((acc, curr) => acc + curr.total, 0);

  const currentDateStr = new Date().toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const reportingDateStr = new Date(letter.reportingDate).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const nameLower = letter.application.programme.name.toLowerCase();
  const codeUpper = letter.application.programme.code.toUpperCase();
  let durationStr = '3 Years (Full-Time)';
  if (nameLower.includes('3 months') || ['CAP', 'CSPV', 'CMR'].includes(codeUpper)) {
    durationStr = '3 Months';
  } else if (nameLower.includes('artisan') || ['AEIW', 'AWF', 'AFD', 'ACP', 'APL', 'AMA'].includes(codeUpper)) {
    durationStr = '1 Year';
  } else if (nameLower.includes('certificate') || ['CIT', 'CEEE-P', 'CEEE-T', 'CSCM', 'CHRM', 'CCOM', 'CBM', 'CSS', 'CTA', 'CACC', 'CFM', 'CHR-IT', 'DCH', 'CAE', 'CWF', 'CFD', 'CCP', 'CBT', 'CWT', 'CPL', 'CSW', 'CECTE'].includes(codeUpper)) {
    durationStr = '2 Years';
  }

  return (
    <div style={{ minHeight: '100vh', background: '#e2e8f0', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Top Floating Control Bar (Hidden on Print) */}
      <div
        className="no-print"
        style={{
          width: '100%',
          maxWidth: '780px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--primary-deep, #0c1821)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '6px',
          marginBottom: '20px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            href="/dashboard"
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'underline',
            }}
          >
            &larr; Back to Dashboard
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Serial: {letter.serialNumber}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PrintTriggerButton />
          <a
            href={`/api/letters/download/${letter.serialNumber}`}
            download
            className="btn btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              borderColor: 'rgba(255,255,255,0.3)',
              color: '#ffffff',
            }}
          >
            📥 Download PDF
          </a>
        </div>
      </div>

      {/* Main Printable Document Sheet */}
      <div
        id="printable-admission-letter"
        className="printable-admission-sheet"
        style={{
          background: '#ffffff',
          color: '#0f172a',
          width: '100%',
          maxWidth: '780px',
          minHeight: '1000px',
          padding: '44px 52px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: '1.45',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Top Accent Band */}
        <div style={{ height: '6px', background: 'linear-gradient(90deg, #14213d 0%, #1e3a8a 50%, #b7791f 100%)', marginBottom: '20px' }} />

        {/* Header & Crest */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #14213d', paddingBottom: '16px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <svg width="60" height="66" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2L3 8.5V18C3 28 10.5 35.5 18 38C25.5 35.5 33 28 33 18V8.5L18 2Z" fill="#14213d" stroke="#b7791f" strokeWidth="2.5" strokeLinejoin="round"/>
              <path d="M10 19.5H26M10 23.5H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18 9.5L13 13.5V15H23V13.5L18 9.5Z" fill="#b7791f"/>
              <circle cx="18" cy="14" r="1.5" fill="#14213d"/>
            </svg>
            <div>
              <h1 style={{ fontSize: '21px', fontWeight: '800', color: '#14213d', margin: 0, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                BORABU TEACHERS TRAINING COLLEGE
              </h1>
              <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Arial, sans-serif', marginTop: '2px' }}>
                P.O. BOX 9 - 40506, Kebirigo, Kenya | Tel: +254 746 211 764 / +254 727 433 205
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Arial, sans-serif' }}>
                Email: info@borabuttc.ac.ke | registrar@borabuttc.ac.ke | www.borabuttc.ac.ke
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="Verification QR Code" style={{ width: '68px', height: '68px', display: 'block' }} />
            <span style={{ fontSize: '8px', color: '#475569', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', display: 'block', marginTop: '2px' }}>
              SCAN TO VERIFY
            </span>
          </div>
        </div>

        {/* Serial & Date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', marginBottom: '16px', color: '#334155' }}>
          <div>
            <span>Ref / Serial No: </span>
            <span style={{ color: '#14213d', padding: '2px 6px', background: '#f1f5f9', borderRadius: '3px' }}>{letter.serialNumber}</span>
          </div>
          <div>
            <span>Date of Issue: </span>
            <span>{currentDateStr}</span>
          </div>
        </div>

        {/* Candidate Address Block */}
        <div style={{ marginBottom: '18px', padding: '12px 16px', background: '#f8fafc', borderLeft: '4px solid #14213d', borderRadius: '0 4px 4px 0', fontSize: '12.5px', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ fontWeight: 'bold', color: '#64748b', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}>TO APPLICANT:</div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase' }}>{letter.application.user.fullName}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px', marginTop: '6px', color: '#334155' }}>
            <div><strong>Email:</strong> {letter.application.user.email}</div>
            <div><strong>Phone:</strong> {letter.application.user.phone}</div>
            <div><strong>KCSE Index No:</strong> {letter.application.kcseIndexNo}</div>
            <div><strong>Mean Grade:</strong> {letter.application.kcseMeanGrade}</div>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', margin: '20px 0 16px', borderBottom: '1.5px solid #0f172a', paddingBottom: '6px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.5px', margin: 0 }}>
            RE: PROVISIONAL ADMISSION LETTER ({letter.application.programme.code})
          </h2>
        </div>

        {/* Body */}
        <div style={{ fontSize: '13.5px', color: '#1e293b', marginBottom: '16px', textAlign: 'justify' }}>
          <p style={{ marginBottom: '10px' }}>
            I am pleased to inform you that following the academic pre-evaluation and verification of your Kenya Certificate of Secondary Education (KCSE) credentials, you have been offered provisional admission to <strong>Borabu Teachers Training College</strong> to pursue a course of study leading to the award of:
          </p>
          
          <div style={{ margin: '12px 0', padding: '12px 18px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '6px', fontSize: '12.5px' }}>
              <span style={{ fontWeight: 'bold', color: '#475569' }}>Programme Title:</span>
              <strong style={{ color: '#14213d' }}>{letter.application.programme.name}</strong>
              
              <span style={{ fontWeight: 'bold', color: '#475569' }}>Programme Code:</span>
              <span>{letter.application.programme.code}</span>

              <span style={{ fontWeight: 'bold', color: '#475569' }}>Course Duration:</span>
              <span>{durationStr}</span>

              <span style={{ fontWeight: 'bold', color: '#475569' }}>Reporting Date:</span>
              <strong style={{ color: '#b7791f' }}>{reportingDateStr} at 8:00 AM EAT</strong>
            </div>
          </div>

          <p style={{ marginBottom: '10px' }}>
            This offer of admission is provisional and subject to satisfactory physical presentation and authentication of your original KCSE Certificate or Official Result Slip, National Identity Card / Birth Certificate, and two recent colored passport-size photographs on the date of reporting.
          </p>
        </div>

        {/* Fee Schedule Summary */}
        <div style={{ marginBottom: '20px', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#14213d', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>💰</span> First Year Schedule of Approved Tuition & Boarding Fees (KES)
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', border: '1px solid #cbd5e1' }}>
            <thead>
              <tr style={{ background: '#14213d', color: '#ffffff' }}>
                <th style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>Academic Period</th>
                <th style={{ padding: '6px 10px', border: '1px solid #cbd5e1', textAlign: 'right' }}>Amount Payable (KES)</th>
                <th style={{ padding: '6px 10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {feesSummary.map((fee, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', fontWeight: '500' }}>{fee.semester}</td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 'bold' }}>
                    KES {fee.total.toLocaleString()}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#15803d', fontWeight: 'bold', fontSize: '11px' }}>
                    Due on Admission
                  </td>
                </tr>
              ))}
              <tr style={{ background: '#f1f5f9', fontWeight: 'bold' }}>
                <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Total First Year Tuition & Boarding:</td>
                <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1', textAlign: 'right', color: '#14213d', fontSize: '13px' }}>
                  KES {totalFirstYear.toLocaleString()}
                </td>
                <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>-</td>
              </tr>
            </tbody>
          </table>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
            * Payments should be deposited directly to Borabu TTC Bank Accounts or via the Official M-Pesa Paybill number. Cash payments are strictly not accepted on campus.
          </div>
        </div>

        {/* Signature & Official Seal Block */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', fontFamily: 'Arial, sans-serif' }}>
          <div>
            <div style={{ height: '36px', display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ fontFamily: "'Brush Script MT', cursive, serif", fontSize: '24px', color: '#1e3a8a' }}>
                Dr. P. Ombati
              </span>
            </div>
            <div style={{ borderTop: '1.5px solid #0f172a', paddingTop: '4px', width: '180px' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>Registrar (Academic Affairs)</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Borabu Teachers Training College</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #1e3a8a',
                padding: '8px 14px',
                borderRadius: '50%',
                width: '105px',
                height: '105px',
                background: 'rgba(30, 58, 138, 0.04)',
                textAlign: 'center',
              }}
            >
              <ShieldCheck size={20} color="#1e3a8a" />
              <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#1e3a8a', letterSpacing: '0.5px' }}>BORABU TTC</span>
              <span style={{ fontSize: '7px', color: '#b7791f', fontWeight: 'bold' }}>OFFICIAL REGISTRY</span>
              <span style={{ fontSize: '7px', color: '#15803d', fontWeight: 'bold' }}>AUTHENTICATED</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '24px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', fontSize: '9px', color: '#94a3b8', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
          This admission document is digitally encrypted and officially registered in the Borabu TTC Central Academic Records Registry. Verification URL: {verifyUrl}
        </div>
      </div>
    </div>
  );
}
