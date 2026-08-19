import Link from 'next/link';

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '80vh', padding: '48px 0 64px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ marginBottom: '32px' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--primary-blue)', fontWeight: '600' }}>
            ← Back to Home
          </Link>
          <h1 style={{ fontSize: '32px', color: 'var(--text-dark)', marginTop: '12px', marginBottom: '8px' }}>
            Terms of Admission & Portal Use
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
            Borabu Teachers Training College &bull; Last updated: January 2025
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '36px 32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '12px' }}>1. Institutional Status & Scope</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7' }}>
              Borabu Teachers Training College (Borabu TTC) is a registered teacher training institution recognized by the Ministry of Education (MoE Reg: MOE-TTC/PRIVATE/2021/089) and offering teacher education programmes aligned with the Teachers Service Commission (TSC) and Kenya National Examinations Council (KNEC) curricula.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '12px' }}>2. Admission Eligibility & Verification</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7', marginBottom: '12px' }}>
              All applicants seeking admission into Diploma in Primary Teacher Education (DPTE), Diploma in Early Childhood Teacher Education (DECTE), or Upgrade courses must meet the minimum criteria stipulated by the Ministry of Education:
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7' }}>
              <li>Minimum KCSE Mean Grade of C (Plain) for standard diploma pathways, or documented P1/ECDE qualifications for upgrade modules.</li>
              <li>Applicants must provide authentic, unaltered copies of their national ID card, birth certificate, and official KCSE result slip/certificate.</li>
              <li>Any admission granted based on forged or falsified credentials will be revoked immediately, with criminal reporting to law enforcement authorities.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '12px' }}>3. Fee Payments & Financial Regulations</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7' }}>
              Tuition and accommodation fees are payable only through designated official institutional bank accounts or authorized college Paybill numbers as indicated on the official fee structure. The college will never ask applicants to send personal mobile money transfers to individual staff members. Receipts must be uploaded or presented during physical admission registration.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '12px' }}>4. Portal Account Security & Responsibility</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7' }}>
              Applicants are solely responsible for maintaining the confidentiality of their portal credentials (email and password). All actions performed under an applicant account, including document uploads and profile edits, are deemed authorized by the registered student.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '12px' }}>5. Deferment & Admission Validity</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7' }}>
              Official admission letters are valid only for the designated intake session. Candidates unable to report on the scheduled date must formally request a deferment via the portal or registry office at least seven (7) days prior to the intake reporting deadline.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '12px' }}>6. Contact & Grievance</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7' }}>
              For queries concerning admission policies, contact the Academic Registrar at <a href="mailto:admissions@borabuttc.ac.ke" style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>admissions@borabuttc.ac.ke</a> or call <a href="tel:0101930121" style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>0101930121</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
