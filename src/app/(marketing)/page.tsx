import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="section-tag">Train to Become a Certified TSC Teacher</span>
            <h1 className="hero-title">
              Become a TSC-Registered Teacher at <span>Borabu Teachers Training College</span>
            </h1>
            <p className="hero-subtitle">
              Located in Nyamira County, we offer fully accredited Diploma in Primary Teacher Education (DPTE) and Early Childhood Teacher Education (DECTE/CECTE) courses. Apply today to secure your intake slot!
            </p>
            
            <div className="hero-buttons">
              <Link href="/register" className="btn btn-primary">
                Apply Online Now
              </Link>
              <Link href="/programmes" className="btn btn-secondary">
                Explore Programmes
              </Link>
            </div>

            {/* Accreditation inline trust seals */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.08)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.15)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>
                🛡️ TSC Accredited Training
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.08)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.15)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>
                📜 Ministry Licensed (MOE)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.08)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.15)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>
                🏫 KNEC Examination Center
              </div>
            </div>
            
            {/* Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <h3>100%</h3>
                <p>TSC Alignment Rate</p>
              </div>
              <div className="stat-item">
                <h3>KNEC</h3>
                <p>National Exam Prep</p>
              </div>
              <div className="stat-item">
                <h3>Approved</h3>
                <p>MoE & TSC Registered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admissions Support & KUCCPS Notice */}
      <section style={{ background: 'var(--primary-light)', padding: '30px 0', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ background: 'var(--bg-card)', borderLeft: '4px solid var(--accent-gold)', padding: '24px 28px', borderRadius: '0 var(--radius-md) var(--radius-md) 0', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--accent-gold)', color: 'white', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Urgent Notice
              </span>
              <h3 style={{ fontSize: '18px', margin: 0, color: 'var(--text-dark)' }}>
                Admissions, Upgrading & Application Support Desk
              </h3>
            </div>
            
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)', margin: 0 }}>
              If you have queries or are experiencing issues with <strong>Admission letters</strong>, <strong>Deferment letters</strong>, <strong>DPTE/DSTE Applications</strong>, <strong>School-based applications</strong>, <strong>SNE (Special Needs Education)</strong>, <strong>Upgrading courses</strong>, or <strong>Unsuccessful applications</strong>:
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px 30px', background: 'var(--bg-main)', padding: '12px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                📞 <strong>Direct Line:</strong> <a href="tel:0101930121" style={{ color: 'var(--primary-blue)', fontWeight: 'bold' }}>0101930121</a>
              </span>
              <span style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                💬 <strong>WhatsApp Chat:</strong> <a href="https://wa.me/254101930121" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-teal)', fontWeight: 'bold' }}>Chat on WhatsApp</a>
              </span>
            </div>

            <div className="alert alert-warning" style={{ margin: 0, padding: '12px 16px', background: 'hsl(38, 100%, 97%)', border: '1px dashed var(--accent-gold)', color: 'hsl(38, 80%, 25%)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📢</span>
              <span><strong>KUCCPS Placement Notice:</strong> If you missed placement under KUCCPS, this is the right time to make a direct application to Borabu TTC. Call or WhatsApp the registrar at <strong>0101930121</strong> to secure your slot today!</span>
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
                <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Fill out personal details, enter your KCSE grades, and upload copies of your ID card, birth certificate, and KCSE result slip.</p>
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

      {/* Testimonials Section */}
      <section className="section" style={{ background: 'var(--bg-main)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Student & Community Stories</span>
            <h2 className="section-title">What Our Community Says</h2>
            <p className="section-desc">Hear from our graduates, lecturers, and parents about our commitment to excellence in teacher education.</p>
          </div>

          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '40px' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', background: 'var(--bg-card)' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                "Borabu TTC prepared me for my career. The micro-teaching sessions gave me real classroom confidence, and I got my TSC registration number within a month of graduating! I am now happily teaching at Nyansiongo Primary School."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>MC</div>
                <div>
                  <h4 style={{ fontSize: '14px', margin: 0 }}>Mercy Chepngetich</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>DPTE Graduate (Class of 2024)</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', background: 'var(--bg-card)' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                "We don't just teach the curriculum; we mentor future leaders. Our science and micro-teaching labs are fully equipped to ensure student-teachers master instructional skills long before their field placement."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>JN</div>
                <div>
                  <h4 style={{ fontSize: '14px', margin: 0 }}>Mr. John Ndwiga</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>Education Department Lecturer</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', background: 'var(--bg-card)' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                "Kenyan parents are naturally skeptical of small colleges, but Borabu's transparent fee structures, physical campus, and TSC accreditation gave me peace of mind. My son is now a registered primary school teacher."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-teal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>SM</div>
                <div>
                  <h4 style={{ fontSize: '14px', margin: 0 }}>Mr. Silas Mwangi</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>Parent of DPTE Graduate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification CTA */}
      <section className="section section-bg" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '650px' }}>
          <span className="section-tag" style={{ margin: '0 auto 12px' }}>Trust & Compliance</span>
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Verify an Admission Letter</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '24px', fontSize: '14px', lineHeight: '1.6' }}>
            Are you a sponsor, guardian, or government official looking to confirm the validity of a Borabu Teachers Training College admission letter? Use our digital verification tool.
          </p>
          <Link href="/verify/check" className="btn btn-secondary">
            Verify Letter Authenticity
          </Link>
        </div>
      </section>
    </div>
  );
}
