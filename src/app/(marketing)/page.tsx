import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const newsItems = [
    {
      title: 'September 2026 Admissions Open for DPTE & DECTE',
      date: 'August 18, 2026',
      category: 'Admissions',
      image: '/images/campus_students_line.jpg',
      alt: 'Borabu TTC student teachers at assembly',
      summary: 'Borabu Teachers Training College invites KCSE candidates to apply for Diploma in Primary Teacher Education (DPTE) and Early Childhood Teacher Education (DECTE). Early registration receives instant eligibility checks.',
      slug: '/news#admissions-2026',
    },
    {
      title: 'Annual Graduation & Teacher Commissioning Ceremony',
      date: 'August 05, 2026',
      category: 'Events',
      image: '/images/campus_celebration.jpg',
      alt: 'Borabu TTC graduation and student celebration',
      summary: 'Over 300 newly certified teacher graduates were commissioned for registry with the Teachers Service Commission (TSC). The college community celebrated remarkable pedagogical milestones.',
      slug: '/news#graduation-2026',
    },
    {
      title: 'Modern Learning Facilities & Campus Green Spaces Expanded',
      date: 'July 28, 2026',
      category: 'Campus',
      image: '/images/campus_garden.jpg',
      alt: 'Borabu TTC landscaped campus gardens and administrative grounds',
      summary: 'The college has completed modernization of micro-teaching laboratories, upgraded the digital ICT center, and enhanced the serene, eco-friendly grounds conducive for intensive academic study.',
      slug: '/news#campus-upgrade',
    },
  ];

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
      <section className="steps-section" style={{ padding: '40px 0 44px 0', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-main)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="section-header" style={{ marginBottom: '24px' }}>
            <span className="section-tag" style={{ marginBottom: '6px', fontSize: '11.5px' }}>How to Apply</span>
            <h2 className="section-title" style={{ fontSize: '26px', marginBottom: '6px' }}>Join Us in 3 Simple Steps</h2>
            <p className="section-desc" style={{ fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>Quick, paperless online application with direct eligibility checks.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginTop: '24px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '22px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
                1
              </div>
              <h4 style={{ fontSize: '16px', marginBottom: '6px', color: 'var(--text-dark)', fontWeight: '700' }}>Create an Account</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>Register with your name, phone number, and email to access the portal.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '22px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
                2
              </div>
              <h4 style={{ fontSize: '16px', marginBottom: '6px', color: 'var(--text-dark)', fontWeight: '700' }}>Fill & Upload</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>Enter KCSE grades and upload copies of your ID/birth certificate and result slip.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '22px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-teal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
                3
              </div>
              <h4 style={{ fontSize: '16px', marginBottom: '6px', color: 'var(--text-dark)', fontWeight: '700' }}>Download Letter</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>Receive your official QR-verified admission letter and joining instructions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News & Announcements Section */}
      <section style={{ padding: '56px 0', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="section-tag" style={{ marginBottom: '6px' }}>News</span>
              <h2 className="section-title" style={{ fontSize: '28px', margin: 0 }}>Latest College News & Announcements</h2>
              <p className="section-desc" style={{ marginTop: '6px', marginBottom: 0 }}>Stay informed on academic schedules, intake timelines, and campus developments.</p>
            </div>
            <Link href="/news" className="btn btn-secondary" style={{ fontSize: '13px', padding: '8px 18px' }}>
              View All News &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {newsItems.map((item, idx) => (
              <article
                key={idx}
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '190px', background: 'var(--primary-navy)' }}>
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    referrerPolicy="no-referrer"
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(12, 24, 33, 0.85)',
                      color: 'var(--accent-gold)',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '8px' }}>
                    📅 {item.date}
                  </div>
                  <h3 style={{ fontSize: '18px', color: 'var(--text-dark)', marginBottom: '10px', lineHeight: '1.4' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--text-main)', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '16px', flexGrow: 1 }}>
                    {item.summary}
                  </p>
                  <Link
                    href="/news"
                    style={{
                      color: 'var(--primary-blue)',
                      fontWeight: '700',
                      fontSize: '13.5px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    Read Full Story &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '48px 0', background: 'var(--primary-navy)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{ fontSize: '28px', color: 'white', marginBottom: '12px' }}>Ready to Start Your Teaching Career?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
            Apply online today for the ongoing intake. Check your KCSE minimum grade qualifications instantly through our digital portal.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '14px' }}>
              Create Applicant Account
            </Link>
            <Link href="/contact" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '14px', borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
              Contact Admissions Office
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
