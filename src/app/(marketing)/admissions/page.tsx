import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admissions & Entry Requirements',
  description: 'Learn about the entry qualifications, documents checklist, and student intake calendar at Borabu Teachers Training College.',
};

export default function AdmissionsPage() {
  return (
    <div className="container" style={{ padding: '48px 20px', maxWidth: '960px' }}>
      <header className="section-header" style={{ marginBottom: '36px' }}>
        <span className="section-tag">Enrollment Guide</span>
        <h1 className="section-title" style={{ fontSize: '36px' }}>Admissions & Requirements</h1>
        <p className="section-desc">
          Everything you need to know about qualifying and applying to join Borabu Teachers Training College.
        </p>
      </header>

      {/* Visual Image Banner */}
      <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '40px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <Image
          src="/images/campus_students_line.jpg"
          alt="Borabu TTC prospective student teachers and orientation"
          fill
          sizes="960px"
          style={{ objectFit: 'cover' }}
          referrerPolicy="no-referrer"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12, 24, 33, 0.85) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: '20px', left: '24px', color: 'white' }}>
          <span style={{ fontSize: '12px', background: 'var(--accent-gold)', color: 'var(--primary-navy)', padding: '3px 10px', borderRadius: '4px', fontWeight: '700', textTransform: 'uppercase' }}>
            Ongoing Intake 2026/2027
          </span>
          <h3 style={{ fontSize: '20px', marginTop: '6px', color: 'white' }}>Diploma & Certificate Teacher Training Programs</h3>
        </div>
      </div>

      {/* General Entry Requirements */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '16px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px', color: 'var(--text-dark)' }}>
          General Entry Qualifications
        </h2>
        <p style={{ marginBottom: '20px', color: 'var(--text-main)', fontSize: '14.5px', lineHeight: '1.6' }}>
          Admission to Borabu Teachers Training College is open to all qualified applicants who meet the minimum teacher-training entry criteria stipulated by the Ministry of Education and the Teachers Service Commission (TSC).
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px', fontSize: '16px' }}>Diploma in Primary Teacher Education (DPTE)</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6', margin: 0 }}>
              Requires a KCSE Mean Grade of <strong>C (Plain)</strong> or above. Applicants must have secured a C (Plain) in English, Kiswahili, Mathematics, and either one Science or one Humanities subject.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px', fontSize: '16px' }}>Diploma in Early Childhood Teacher Education (DECTE)</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6', margin: 0 }}>
              Requires a KCSE Mean Grade of <strong>C (Plain)</strong> or above. This course equips student-teachers with advanced competencies for early-years education (Pre-Primary 1 & 2).
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px', fontSize: '16px' }}>Certificate in Early Childhood Teacher Education (CECTE)</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6', margin: 0 }}>
              Requires a KCSE Mean Grade of <strong>C- (Minus)</strong> or above. Designed for educators entering early childhood development instruction.
            </p>
          </div>
        </div>
      </section>

      {/* Checklist of required files */}
      <section style={{ marginBottom: '50px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '14px', color: 'var(--text-dark)' }}>
          Required Application Documents Checklist
        </h2>
        <p style={{ color: 'var(--text-light)', fontSize: '13.5px', marginBottom: '20px', lineHeight: '1.6' }}>
          Applicants must upload clear, legible copies of the following documents during the online application process. Allowed file formats are PDF, JPG, JPEG, and PNG (maximum size: 5MB per file):
        </p>

        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
            <span style={{ color: 'var(--accent-teal)' }}>✔️</span>
            <span><strong>National Identity Card / Passport</strong> (Copy of front and back) or Birth Certificate</span>
          </li>
          <li style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
            <span style={{ color: 'var(--accent-teal)' }}>✔️</span>
            <span><strong>KCSE Certificate or Result Slip</strong> (Signed and stamped by Principal)</span>
          </li>
          <li style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
            <span style={{ color: 'var(--accent-teal)' }}>✔️</span>
            <span><strong>Official Leaving Certificate</strong> from secondary school</span>
          </li>
          <li style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
            <span style={{ color: 'var(--accent-teal)' }}>✔️</span>
            <span><strong>Recent Passport-Size Photo</strong> (Light background, clear face view)</span>
          </li>
        </ul>
      </section>

      {/* Document verification policy */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '16px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px', color: 'var(--text-dark)' }}>
          Physical Credentials Verification
        </h2>
        <div className="alert alert-warning" style={{ margin: 0 }}>
          <div>
            <strong>⚠️ Mandatory Physical Verification Notice:</strong>
            <p style={{ fontSize: '13px', marginTop: '6px', lineHeight: '1.6' }}>
              Online admission letters are provisional. Upon reporting to the college for registration, all students MUST bring their original National ID/Birth certificate, original KCSE certificate, and passport photographs. Any discrepancy between details entered online and original physical documents will lead to automatic rejection and cancellation of the admission offer.
            </p>
          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center', display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Link href="/programmes" className="btn btn-secondary" style={{ padding: '12px 20px', fontSize: '14px' }}>
          Explore Programmes
        </Link>
        <Link href="/register" className="btn btn-primary" style={{ padding: '12px 26px', fontSize: '14px' }}>
          Proceed to Online Application
        </Link>
      </div>
    </div>
  );
}
