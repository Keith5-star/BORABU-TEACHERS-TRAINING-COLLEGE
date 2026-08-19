import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="section-tag">Train to Become a Certified TSC Teacher</span>
            <h1 className="hero-title">
              Become a TSC-Registered Teacher at <span>Borabu Teachers Training College</span>
            </h1>
            <p className="hero-subtitle">
              Located in Nyamira County, we offer accredited Diploma in Primary Teacher Education (DPTE) and Early Childhood Teacher Education (DECTE/CECTE) programmes.
            </p>
            
            <div className="hero-buttons">
              <Link href="/register" className="btn btn-primary">
                Apply Online Now
              </Link>
              <Link href="/programmes" className="btn btn-secondary">
                Explore Programmes
              </Link>
            </div>

            {/* Key Badges */}
            <div className="hero-stats">
              <div className="stat-item">
                <h3>100%</h3>
                <p>TSC Alignment Rate</p>
              </div>
              <div className="stat-item">
                <h3>KNEC</h3>
                <p>National Exam Center</p>
              </div>
              <div className="stat-item">
                <h3>Approved</h3>
                <p>MoE & TSC Registered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admissions Support & KUCCPS Placement Info */}
      <section style={{ background: 'var(--bg-main)', padding: '20px 0', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ background: 'var(--bg-card)', borderLeft: '3px solid var(--primary-blue)', padding: '16px 20px', borderRadius: 'var(--radius-md)', borderTop: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)', margin: 0 }}>
                  Admissions Office & Direct KUCCPS Placement
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '4px 0 0 0' }}>
                  Have questions about admission letters, deferments, or direct applications? Contact the registry desk.
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', fontSize: '13px' }}>
                <span>
                  📞 <strong>Helpline:</strong> <a href="tel:0101930121" style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>0101930121</a>
                </span>
                <span>
                  💬 <strong>WhatsApp:</strong> <a href="https://wa.me/254101930121" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>0101930121</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified 3 Steps */}
      <section className="section" style={{ borderBottom: '1px solid var(--border-light)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div className="section-header">
            <span className="section-tag">How to Apply</span>
            <h2 className="section-title">Join Us in 3 Steps</h2>
            <p className="section-desc">Quick, paperless online application with direct eligibility checks.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '32px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
                1
              </div>
              <h4 style={{ fontSize: '16px', marginBottom: '6px', color: 'var(--text-dark)' }}>Create an Account</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '13px', lineHeight: '1.5' }}>Register with your name, phone number, and email to access the portal.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
                2
              </div>
              <h4 style={{ fontSize: '16px', marginBottom: '6px', color: 'var(--text-dark)' }}>Fill & Upload</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '13px', lineHeight: '1.5' }}>Enter KCSE grades and upload copies of your ID/birth certificate and result slip.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-teal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
                3
              </div>
              <h4 style={{ fontSize: '16px', marginBottom: '6px', color: 'var(--text-dark)' }}>Download Letter</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '13px', lineHeight: '1.5' }}>Receive your official QR-verified admission letter and joining instructions.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <Link href="/register" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>
              Start Online Application
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Verification CTA */}
      <section className="section" style={{ background: 'var(--bg-card)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <span className="section-tag" style={{ margin: '0 auto 8px' }}>Verification</span>
          <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>Verify an Admission Letter</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '20px', fontSize: '13px', lineHeight: '1.6' }}>
            Need to confirm the validity of a Borabu Teachers Training College admission letter? Use our official verification portal.
          </p>
          <Link href="/verify/check" className="btn btn-secondary">
            Verify Letter Authenticity
          </Link>
        </div>
      </section>
    </div>
  );
}
