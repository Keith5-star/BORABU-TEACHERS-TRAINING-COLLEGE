import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '80vh', padding: '48px 0 64px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ marginBottom: '32px' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--primary-blue)', fontWeight: '600' }}>
            ← Back to Home
          </Link>
          <h1 style={{ fontSize: '32px', color: 'var(--text-dark)', marginTop: '12px', marginBottom: '8px' }}>
            Privacy Policy & Data Protection
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
            Borabu Teachers Training College &bull; Compliant with Kenya Data Protection Act, 2019
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '36px 32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '12px' }}>1. Information We Collect</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7', marginBottom: '12px' }}>
              When you apply for admission or create an applicant account at Borabu Teachers Training College, we collect personal data necessary to evaluate your eligibility, generate formal admission records, and maintain statutory compliance:
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7' }}>
              <li><strong>Personal Identifiers:</strong> Full legal name, National ID / Birth Certificate number, gender, date of birth, and nationality.</li>
              <li><strong>Contact Information:</strong> Active phone number, WhatsApp contact, personal email address, and home/postal address.</li>
              <li><strong>Academic Records:</strong> KCSE index number, examination year, subject grades, mean grade, and scanned copies of academic transcripts/certificates.</li>
              <li><strong>Emergency & Guardian Details:</strong> Next of kin names, relationship, and telephone contact.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '12px' }}>2. Purpose of Data Processing</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7', marginBottom: '12px' }}>
              We process your personal information strictly for legitimate academic and administrative objectives:
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7' }}>
              <li>Evaluating admission applications in accordance with Ministry of Education entry requirements.</li>
              <li>Issuing secure, digitally verifiable QR-coded admission letters and student joining documents.</li>
              <li>Facilitating communication regarding intake dates, orientation, fee payments, and coursework.</li>
              <li>Registering candidates for KNEC national examinations and subsequent TSC registration pipelines.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '12px' }}>3. Data Sharing & Disclosures</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7' }}>
              Borabu TTC will never sell, rent, or lease your personal information to commercial third parties. Your information is shared only with authorized statutory regulatory bodies, specifically the <strong>Ministry of Education (MoE)</strong>, the <strong>Kenya National Examinations Council (KNEC)</strong>, the <strong>Teachers Service Commission (TSC)</strong>, and the <strong>Kenya Universities and Colleges Central Placement Service (KUCCPS)</strong> for accreditation and placement verification.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '12px' }}>4. Data Security & Storage</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7' }}>
              We implement industry-standard encryption, role-based access control, and secure database protocols to protect applicant information against unauthorized access, loss, or alteration. Physical copies submitted during intake are safely cataloged in the college registrar's confidential archive.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '12px' }}>5. Your Rights as a Data Subject</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7' }}>
              Under the Kenya Data Protection Act 2019, you have the right to request access to the personal data we hold about you, request rectification of inaccurate records, or seek clarification on how your data is handled.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '12px' }}>6. Data Protection Officer Contact</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7' }}>
              For data privacy inquiries or requests, email our Registry Office at <a href="mailto:privacy@borabuttc.ac.ke" style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>privacy@borabuttc.ac.ke</a> or write to:
              <br />
              <strong>Data Protection Desk, Borabu Teachers Training College</strong>
              <br />
              P.O. Box 9 - 40506, Kebirigo, Nyamira County, Kenya.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
