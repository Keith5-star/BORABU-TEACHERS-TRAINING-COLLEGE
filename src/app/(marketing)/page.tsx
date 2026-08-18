import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="section-tag">Technical Excellence</span>
            <h1 className="hero-title">
              Shaping the Future of <span>Technical Education & Leadership</span>
            </h1>
            <p className="hero-subtitle">
              Welcome to Borabu Technical Training Institute (BTTI), Nyamira County. We provide world-class technical, vocational, and entrepreneurship training designed to inspire innovation and career excellence.
            </p>
            <div className="hero-buttons">
              <Link href="/register" className="btn btn-primary">
                Apply Online Now
              </Link>
              <Link href="/programmes" className="btn btn-secondary">
                Explore Programmes
              </Link>
            </div>
            
            {/* Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <h3>3,500+</h3>
                <p>Accredited Graduates</p>
              </div>
              <div className="stat-item">
                <h3>95%</h3>
                <p>Employment & Self-Employment</p>
              </div>
              <div className="stat-item">
                <h3>57</h3>
                <p>Accredited Courses</p>
              </div>
            </div>
          </div>
          
          <div className="hero-image-container">
            <div className="hero-image-placeholder">
              <div style={{ fontSize: '72px', marginBottom: '20px' }}>🎓</div>
              <h3 style={{ color: 'white', marginBottom: '10px' }}>BTTI Campus Life</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                A vibrant learning community centered on research, values, and technical excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Steps */}
      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-header">
            <span className="section-tag">Admissions Process</span>
            <h2 className="section-title">Join Us in 3 Simple Steps</h2>
            <p className="section-desc">Our online portal speeds up registration and provides instant eligibility feedback.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', margin: '40px 0' }}>
            <div style={{ display: 'flex', gap: '25px', background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', flexShrink: 0 }}>
                1
              </div>
              <div>
                <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>Create an Account</h4>
                <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Sign up using your name, email, and phone number to activate your secure applicant portal dashboard.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '25px', background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', flexShrink: 0 }}>
                2
              </div>
              <div>
                <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>Fill application & Upload papers</h4>
                <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Fill out personal details, enter your KCSE grades, and upload copies of your ID card and KCSE result slip.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '25px', background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', flexShrink: 0 }}>
                3
              </div>
              <div>
                <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>Get letter of admission</h4>
                <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>The system checks your eligibility immediately. Once verified by the registry panel, download your formal QR-coded admission letter.</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/register" className="btn btn-primary" style={{ padding: '14px 30px', fontSize: '16px' }}>
              Start Your Online Application Now
            </Link>
          </div>
        </div>
      </section>

      {/* Verification CTA */}
      <section className="section section-bg" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Verify an Admission Letter</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>
            Are you a sponsor, employer, or government official looking to confirm the validity of a Borabu BTTI admission letter? Use our digital verification tool.
          </p>
          <Link href="/verify/check" className="btn btn-secondary">
            Verify Letter Authenticity
          </Link>
        </div>
      </section>
    </div>
  );
}
