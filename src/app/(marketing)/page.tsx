import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section - Full Initial Viewport */}
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
          </div>

          {/* Full-width Stats Bar anchored cleanly at the base of the Hero */}
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

      {/* Simplified 3 Steps - Compact, Clean Spacing */}
      <section className="steps-section" style={{ padding: '32px 0 36px 0', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-main)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="section-header" style={{ marginBottom: '22px' }}>
            <span className="section-tag" style={{ marginBottom: '6px', fontSize: '11.5px' }}>How to Apply</span>
            <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '6px' }}>Join Us in 3 Steps</h2>
            <p className="section-desc" style={{ fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>Quick, paperless online application with direct eligibility checks.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '20px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>
                1
              </div>
              <h4 style={{ fontSize: '15px', marginBottom: '6px', color: 'var(--text-dark)', fontWeight: '700' }}>Create an Account</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>Register with your name, phone number, and email to access the portal.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>
                2
              </div>
              <h4 style={{ fontSize: '15px', marginBottom: '6px', color: 'var(--text-dark)', fontWeight: '700' }}>Fill & Upload</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>Enter KCSE grades and upload copies of your ID/birth certificate and result slip.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent-teal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>
                3
              </div>
              <h4 style={{ fontSize: '15px', marginBottom: '6px', color: 'var(--text-dark)', fontWeight: '700' }}>Download Letter</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>Receive your official QR-verified admission letter and joining instructions.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link href="/register" className="btn btn-primary" style={{ padding: '11px 24px', fontSize: '14px' }}>
              Start Online Application
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
