import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admissions & Entry Requirements - Borabu Teachers Training College',
  description: 'Learn about teacher education entry qualifications, documents checklist, and student intake calendar at Borabu Teachers Training College (BTTC).',
};

export default function AdmissionsPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '950px' }}>
      <header className="section-header">
        <span className="section-tag">Enrollment Guide</span>
        <h1 className="section-title">Teacher Admissions & Requirements</h1>
        <p className="section-desc">
          Everything you need to know about qualifying and applying to join Borabu Teachers Training College (BTTC) under Ministry of Education and TSC guidelines.
        </p>
      </header>

      {/* General Entry Requirements */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '16px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px', color: 'var(--primary-navy)' }}>
          Ministry of Education & TSC Entry Criteria
        </h2>
        <p style={{ marginBottom: '20px', color: 'var(--text-main)', fontSize: '15px' }}>
          Admission to Borabu Teachers Training College is open to all qualified applicants who meet the criteria established by the Ministry of Education, the Teachers Service Commission (TSC), and KNEC for teacher training:
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px', fontSize: '17px' }}>Diploma in Primary Teacher Education (DPTE)</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6' }}>
              Requires a KCSE Mean Grade of <strong>C (Plain)</strong> or its equivalent as approved by the Ministry of Education. Prepares teacher trainees for primary school Competency-Based Curriculum (CBC) delivery across grades 1 to 6.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px', fontSize: '17px' }}>Diploma in Early Childhood Teacher Education (DECTE)</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6' }}>
              Requires a KCSE Mean Grade of <strong>C (Plain)</strong> or equivalent. Specializes in foundational early childhood pedagogy for pre-primary (PP1, PP2) and lower primary learning.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px', fontSize: '17px' }}>Upgrade Diploma in Teacher Education (UDPTE & UDECTE)</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6' }}>
              Designed for in-service teachers possessing a recognized <strong>P1 / PTE Certificate</strong> or <strong>ECDE Certificate</strong> seeking to upgrade their qualification to Diploma level in CBC pedagogy.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px', fontSize: '17px' }}>Diploma in Secondary Teacher Education (DSTE - Junior School)</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6' }}>
              Requires a KCSE Mean Grade of <strong>C+ (Plus)</strong> with a minimum of <strong>C+ (Plus)</strong> in the two selected teaching subjects. Prepares educators for Junior Secondary (Grades 7, 8, and 9).
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px', fontSize: '17px' }}>Certificate in ECDE & Special Needs Education (SNE)</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6' }}>
              ECDE Certificate requires KCSE <strong>D+ (Plus)</strong>. SNE Diploma requires prior DPTE/P1 or relevant educational qualification for special needs inclusion (hearing, visual, intellectual support).
            </p>
          </div>
        </div>
      </section>

      {/* Checklist of required files */}
      <section style={{ marginBottom: '50px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '30px' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '16px', color: 'var(--primary-navy)' }}>
          Required Application Documents Checklist
        </h2>
        <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '20px' }}>
          Applicants must upload clear, legible copies of the following documents during the online application process. Allowed file formats are PDF, JPG, JPEG, and PNG (maximum size: 5MB per file):
        </p>

        <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none' }}>
          <li style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
            <span style={{ color: 'var(--accent-teal)', fontSize: '18px' }}>✔️</span>
            <span><strong>National Identity Card / Birth Certificate:</strong> Clear scanned copy of front and back.</span>
          </li>
          <li style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
            <span style={{ color: 'var(--accent-teal)', fontSize: '18px' }}>✔️</span>
            <span><strong>KCSE Certificate or Official KNEC Result Slip:</strong> Legible copy showing all subject grades.</span>
          </li>
          <li style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
            <span style={{ color: 'var(--accent-teal)', fontSize: '18px' }}>✔️</span>
            <span><strong>Prior Teaching Certificate (For Upgrade Applicants):</strong> P1 or ECDE certificate copy.</span>
          </li>
          <li style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
            <span style={{ color: 'var(--accent-teal)', fontSize: '18px' }}>✔️</span>
            <span><strong>Recent Passport-Size Photograph:</strong> Plain light background showing full facial features.</span>
          </li>
        </ul>
      </section>

      {/* Document verification policy */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '16px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px', color: 'var(--primary-navy)' }}>
          Physical Credentials Verification Policy
        </h2>
        <div className="alert alert-warning" style={{ margin: 0 }}>
          <div>
            <strong>⚠️ Mandatory Physical Verification Notice:</strong>
            <p style={{ fontSize: '13px', marginTop: '6px', lineHeight: '1.6' }}>
              Online admission letters issued by Borabu Teachers Training College are provisional. Upon reporting to the college campus for physical admission and registration, all admitted trainees MUST present their original National ID, original KCSE certificate / result slip, and school leaving certificate to the Registrar of Admissions. Any discrepancy between entered records and original physical certificates will result in immediate disqualification.
            </p>
          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center' }}>
        <Link href="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '15px' }}>
          Proceed to Online Application Portal
        </Link>
      </div>
    </div>
  );
}
