import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Become a TSC-Registered Teacher at <span>Borabu TTC</span>
            </h1>
            <p className="hero-subtitle">
              Accredited teacher education college in Nyamira County offering Diploma in Primary Teacher Education (DPTE), Early Childhood Teacher Education (DECTE/CECTE), and CBC Upgrade programmes with full KNEC certification.
            </p>
            
            <div className="hero-buttons">
              <Link href="/register" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>
                Apply Online Now
              </Link>
              <Link href="/programmes" className="btn btn-secondary" style={{ padding: '12px 20px', fontSize: '15px' }}>
                Explore Programmes
              </Link>
            </div>

            <div className="hero-support-line">
              <span>Direct Admissions Hotline: <a href="tel:0101930121">0101930121</a></span>
              <span>&bull;</span>
              <span>WhatsApp: <a href="https://wa.me/254101930121" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-teal)' }}>Chat 0101930121</a></span>
              <span>&bull;</span>
              <span>Campus: Kebirigo, Nyamira County</span>
            </div>
          </div>

          {/* Full-width Stats Bar */}
          <div className="hero-stats-bar">
            <div className="stat-item">
              <h3>100%</h3>
              <p>TSC & CBC Curriculum Alignment</p>
            </div>
            <div className="stat-item">
              <h3>KNEC</h3>
              <p>Certified National Exam Center</p>
            </div>
            <div className="stat-item">
              <h3>Direct</h3>
              <p>KUCCPS & Direct College Placement</p>
            </div>
            <div className="stat-item">
              <h3>Instant</h3>
              <p>QR Verifiable Admission Letters</p>
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
    </div>
  );
}
