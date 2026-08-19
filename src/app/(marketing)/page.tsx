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
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px', justifyContent: 'center' }}>
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

      {/* Admissions Support & KUCCPS Placement Info */}
      <section style={{ background: 'var(--bg-main)', padding: '24px 0', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ background: 'var(--bg-card)', borderLeft: '3px solid var(--primary-blue)', padding: '20px 24px', borderRadius: 'var(--radius-md)', borderTop: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-dark)' }}>
              Admissions Support & Direct Applications
            </h3>
            
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)', margin: '0 0 12px 0' }}>
              For questions or assistance regarding admission letters, deferments, DPTE/DSTE/SNE applications, upgrading programs, or general application status, please reach out to the admissions office. If you missed placement under KUCCPS, you are welcome to submit a direct application to the college.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-light)' }}>
                📞 <strong>Call Admissions:</strong> <a href="tel:0101930121" style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>0101930121</a>
              </span>
              <span style={{ color: 'var(--text-light)' }}>
                💬 <strong>WhatsApp Registrar:</strong> <a href="https://wa.me/254101930121" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>Chat on WhatsApp</a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Steps */}
      <section className="section" style={{ borderBottom: '1px solid var(--border-light)' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div className="section-header">
            <span className="section-tag">Admissions Process</span>
            <h2 className="section-title">Join Us in 3 Simple Steps</h2>
            <p className="section-desc">Our online portal speeds up registration and provides instant eligibility feedback.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px 24px', marginTop: '56px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-card)', padding: '30px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', borderTop: '4px solid var(--primary-blue)', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-24px', left: '24px', width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', boxShadow: 'var(--shadow-md)' }}>
                1
              </div>
              <div style={{ marginTop: '12px' }}>
                <h4 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-dark)' }}>Create an Account</h4>
                <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.6' }}>Sign up using your name, email, and phone number to activate your secure applicant portal dashboard.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-card)', padding: '30px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', borderTop: '4px solid var(--accent-gold)', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-24px', left: '24px', width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', boxShadow: 'var(--shadow-md)' }}>
                2
              </div>
              <div style={{ marginTop: '12px' }}>
                <h4 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-dark)' }}>Fill Application & Uploads</h4>
                <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.6' }}>Fill out personal details, enter your KCSE grades, and upload copies of your ID card, birth certificate, and KCSE result slip.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-card)', padding: '30px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', borderTop: '4px solid var(--accent-teal)', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-24px', left: '24px', width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-teal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', boxShadow: 'var(--shadow-md)' }}>
                3
              </div>
              <div style={{ marginTop: '12px' }}>
                <h4 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-dark)' }}>Get Letter of Admission</h4>
                <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.6' }}>The system checks your eligibility immediately. Once verified by the registry panel, download your formal QR-coded admission letter.</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link href="/register" className="btn btn-primary" style={{ padding: '14px 30px', fontSize: '16px' }}>
              Start Your Online Application Now
            </Link>
          </div>
        </div>
      </section>

      {/* Programmes Section */}
      <section className="section" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Academic Offerings</span>
            <h2 className="section-title">Accredited Teacher Training Programmes</h2>
            <p className="section-desc">We offer fully certified Diploma and Certificate courses aligned with the TSC and the Ministry of Education.</p>
          </div>

          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '40px' }}>
            <div className="card" style={{ padding: '30px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderTop: '4px solid var(--primary-blue)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
              <div>
                <span style={{ fontSize: '11px', background: 'var(--primary-blue)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>DPTE</span>
                <h3 style={{ fontSize: '20px', marginTop: '15px', marginBottom: '10px', color: 'var(--text-dark)' }}>Diploma in Primary Teacher Education</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '20px' }}>
                  A 3-year programme equipping educators with CBC pedagogy, teaching practice, and modern instruction standards.
                </p>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '15px' }}><strong>Req:</strong> KCSE Mean Grade C (Plain)</div>
                <Link href="/programmes" style={{ color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '14px' }}>Learn More →</Link>
              </div>
            </div>

            <div className="card" style={{ padding: '30px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderTop: '4px solid var(--primary-blue)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
              <div>
                <span style={{ fontSize: '11px', background: 'var(--primary-blue)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>DECTE</span>
                <h3 style={{ fontSize: '20px', marginTop: '15px', marginBottom: '10px', color: 'var(--text-dark)' }}>Diploma in Early Childhood Teacher Education</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '20px' }}>
                  Specialized training focusing on early years development (PP1 & PP2), pre-primary curriculum, and child psychology.
                </p>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '15px' }}><strong>Req:</strong> KCSE Mean Grade C (Plain)</div>
                <Link href="/programmes" style={{ color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '14px' }}>Learn More →</Link>
              </div>
            </div>

            <div className="card" style={{ padding: '30px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderTop: '4px solid var(--accent-gold)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
              <div>
                <span style={{ fontSize: '11px', background: 'var(--accent-gold)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>Upgrades</span>
                <h3 style={{ fontSize: '20px', marginTop: '15px', marginBottom: '10px', color: 'var(--text-dark)' }}>Upgrade Diploma (Primary / ECDE)</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '20px' }}>
                  Modular holiday programmes for practicing P1/ECDE certificate teachers seeking alignment with the CBC system.
                </p>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '15px' }}><strong>Req:</strong> P1 or ECDE Certificate</div>
                <Link href="/programmes" style={{ color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '14px' }}>Learn More →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Facilities & Gallery Section */}
      <section className="section" style={{ background: 'var(--bg-main)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Campus</span>
            <h2 className="section-title">Campus Life & Facilities</h2>
            <p className="section-desc">Take a look at our training facilities, gardens, and vibrant student community in Nyamira County.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '40px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ height: '220px', overflow: 'hidden', background: '#eee' }}>
                <img 
                  src="/images/campus_garden.jpg" 
                  alt="Borabu TTC Campus Gardens" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '16px', color: 'var(--text-dark)', marginBottom: '8px' }}>Campus Facilities & Grounds</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.5' }}>Our serene and quiet learning environment located in Nyamira County provides the ideal atmosphere for academic focus and professional growth.</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ height: '220px', overflow: 'hidden', background: '#eee' }}>
                <img 
                  src="/images/campus_students_line.jpg" 
                  alt="Student Teacher Training" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '16px', color: 'var(--text-dark)', marginBottom: '8px' }}>Practical Teacher Training</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.5' }}>Student-teachers actively participate in micro-teaching sessions, peer reviews, and local school practicums to master CBC instructional skills.</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ height: '220px', overflow: 'hidden', background: '#eee' }}>
                <img 
                  src="/images/campus_celebration.jpg" 
                  alt="Borabu TTC Graduation & Celebration" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '16px', color: 'var(--text-dark)', marginBottom: '8px' }}>KNEC Examination Success</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.5' }}>Celebrating the achievements of our certified teacher graduates as they enter the workforce and obtain their official TSC registration.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Student & Community Stories</span>
            <h2 className="section-title">What Our Community Says</h2>
            <p className="section-desc">Hear from our graduates, lecturers, and parents about their actual experiences at the college.</p>
          </div>

          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '40px' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', background: 'var(--bg-main)', position: 'relative', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ position: 'absolute', top: '10px', right: '20px', fontSize: '72px', color: 'rgba(0,0,0,0.04)', fontFamily: 'Georgia, serif', lineHeight: '1', userSelect: 'none', pointerEvents: 'none' }}>
                “
              </div>
              <p style={{ fontStyle: 'italic', color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', zIndex: 1 }}>
                "I joined Borabu in 2022 for the primary teaching diploma. The lecturers are very supportive—they really walk with you during school practice. I completed my KNEC exams last year and I'm already teaching at a local primary school here in Nyamira."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', margin: 0 }}>Mercy Chepngetich</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>DPTE Graduate (Class of 2024)</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', background: 'var(--bg-main)', position: 'relative', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ position: 'absolute', top: '10px', right: '20px', fontSize: '72px', color: 'rgba(0,0,0,0.04)', fontFamily: 'Georgia, serif', lineHeight: '1', userSelect: 'none', pointerEvents: 'none' }}>
                “
              </div>
              <p style={{ fontStyle: 'italic', color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', zIndex: 1 }}>
                "We focus heavily on hands-on practice. Before our student-teachers go for their external teaching practice, we take them through micro-teaching sessions where they practice lesson delivery with their peers. It builds their confidence early."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'hsl(38, 92%, 96%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', margin: 0 }}>Mr. John Ndwiga</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>Education Department Lecturer</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', background: 'var(--bg-main)', position: 'relative', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ position: 'absolute', top: '10px', right: '20px', fontSize: '72px', color: 'rgba(0,0,0,0.04)', fontFamily: 'Georgia, serif', lineHeight: '1', userSelect: 'none', pointerEvents: 'none' }}>
                “
              </div>
              <p style={{ fontStyle: 'italic', color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', zIndex: 1 }}>
                "My daughter finished her DPTE course here. What pleased me most was that the fees were exactly as advertised—no hidden charges midway through the term. She has already received her TSC registration number."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'hsl(172, 45%, 95%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
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
