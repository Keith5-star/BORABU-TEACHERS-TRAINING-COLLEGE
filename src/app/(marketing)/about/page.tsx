import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About the College - Borabu Teachers Training College',
  description: 'Learn about the history, vision, mission, pedagogical mandate, and administrative leadership of Borabu Teachers Training College (BTTC).',
};

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '1100px' }}>
      <header className="section-header" style={{ marginBottom: '40px' }}>
        <span className="section-tag">Our History & Mandate</span>
        <h1 className="section-title" style={{ fontSize: '40px' }}>About Borabu Teachers Training College</h1>
        <p className="section-desc">
          Established to prepare competent, ethical, and transformative educators equipped with pedagogical mastery, Competency-Based Curriculum (CBC) expertise, and strong moral values.
        </p>
      </header>

      {/* History section */}
      <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '36px', borderRadius: 'var(--radius-lg)', marginBottom: '40px', lineHeight: '1.7' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px', color: 'var(--primary-navy)' }}>College History & Strategic Mandate</h2>
        <p style={{ color: 'var(--text-main)', fontSize: '15px', marginBottom: '14px' }}>
          <strong>Borabu Teachers Training College (BTTC)</strong> is a premier public teacher education institution situated in Borabu Constituency, Nyamira County, Kenya. Registered under the Ministry of Education and working in close alignment with the Teachers Service Commission (TSC) and the Kenya Institute of Curriculum Development (KICD), the college was founded to address the national demand for highly qualified, modern educators.
        </p>
        <p style={{ color: 'var(--text-main)', fontSize: '15px', marginBottom: '14px' }}>
          BTTC is at the forefront of implementing Kenya's Competency-Based Education and Training (CBET) for teacher trainees, offering the modern <strong>Diploma in Primary Teacher Education (DPTE)</strong>, <strong>Diploma in Early Childhood Teacher Education (DECTE)</strong>, Upgrade Diploma programmes for in-service educators, and Special Needs Education options.
        </p>
        <p style={{ color: 'var(--text-main)', fontSize: '15px' }}>
          Situated in a serene and conducive learning environment in Nyamira County off the Kisii–Kericho highway, the college offers state-of-the-art micro-teaching laboratories, modern science and ICT hubs, well-equipped creative arts studios, and extensive school practicum linkages across Western, Nyanza, and Rift Valley regions.
        </p>
      </section>

      {/* Vision, Mission, Motto */}
      <section className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '30px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
          <h3 style={{ fontSize: '20px', marginBottom: '10px', color: 'var(--primary-navy)' }}>Our Mission</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.6' }}>
            To produce competent, innovative, and value-driven teachers through transformative pedagogical training, practical school mentorship, educational research, and community engagement.
          </p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '30px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>👁️</div>
          <h3 style={{ fontSize: '20px', marginBottom: '10px', color: 'var(--primary-navy)' }}>Our Vision</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.6' }}>
            To be a national and regional center of excellence in Teacher Education, Pedagogical Innovation, and Educational Leadership for the 21st century classroom.
          </p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '30px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💡</div>
          <h3 style={{ fontSize: '20px', marginBottom: '10px', color: 'var(--primary-navy)' }}>College Motto</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.6', fontStyle: 'italic', fontWeight: '600' }}>
            &ldquo;Pedagogy, Integrity, and Excellence in Educational Leadership.&rdquo;
          </p>
          <p style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: '8px' }}>
            Nurturing head, heart, and hands to transform generations of learners.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px', color: 'var(--primary-navy)' }}>Our Core Values</h2>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px' }}>1. Integrity & Ethics</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.5' }}>Exemplary moral character, honesty, transparency, and role-modeling in both personal and professional spheres.</p>
          </div>
          <div style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px' }}>2. Pedagogical Mastery</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.5' }}>Commitment to deep subject knowledge, child-centered instructional methods, and innovative assessment design.</p>
          </div>
          <div style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px' }}>3. Inclusivity & Equity</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.5' }}>Celebrating diversity, supporting differentiated learning styles, and promoting special needs inclusion.</p>
          </div>
          <div style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px' }}>4. Innovation & ICT</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.5' }}>Integrating digital teaching tools, creative instructional media, and adaptive learning strategies.</p>
          </div>
        </div>
      </section>

      {/* College Administration Structure */}
      <section style={{ marginBottom: '50px' }}>
        <div style={{ marginBottom: '24px' }}>
          <span className="section-tag">Governance & Leadership</span>
          <h2 style={{ fontSize: '28px', color: 'var(--primary-navy)', marginTop: '6px' }}>College Administration Structure</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '15px' }}>
            Borabu Teachers Training College operates under a structured governance framework ensuring academic rigor, ethical stewardship, and effective trainee mentorship.
          </p>
        </div>

        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Chief Principal */}
          <div className="card" style={{ borderTop: '4px solid var(--primary-navy)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>👨‍🏫</div>
              <div>
                <h3 style={{ fontSize: '18px', margin: 0, color: 'var(--text-dark)' }}>Dr. George Ondieki</h3>
                <span style={{ fontSize: '12px', color: 'var(--primary-blue)', fontWeight: '700', textTransform: 'uppercase' }}>Chief Principal</span>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-light)', marginBottom: '10px' }}>Secretary to Board of Governors & Accounting Officer</p>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>
              Provides executive strategic leadership, institutional policy governance, and serves as primary liaison with the Ministry of Education, TSC, and international educational partners.
            </p>
          </div>

          {/* Deputy Principal Academics */}
          <div className="card" style={{ borderTop: '4px solid var(--primary-blue)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>👩‍🏫</div>
              <div>
                <h3 style={{ fontSize: '18px', margin: 0, color: 'var(--text-dark)' }}>Agnes Nyaboke</h3>
                <span style={{ fontSize: '12px', color: 'var(--primary-blue)', fontWeight: '700', textTransform: 'uppercase' }}>Deputy Principal (Academics)</span>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-light)', marginBottom: '10px' }}>Curriculum Implementation & Academic Affairs</p>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>
              Supervises instructional timetabling, academic departments, micro-teaching laboratories, continuous assessment moderation, and KNEC examination standards.
            </p>
          </div>

          {/* Deputy Principal Administration */}
          <div className="card" style={{ borderTop: '4px solid var(--accent-gold)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#b45309', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>👨‍💼</div>
              <div>
                <h3 style={{ fontSize: '18px', margin: 0, color: 'var(--text-dark)' }}>Francis Mogaka</h3>
                <span style={{ fontSize: '12px', color: '#b45309', fontWeight: '700', textTransform: 'uppercase' }}>Deputy Principal (Administration)</span>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-light)', marginBottom: '10px' }}>Operations, HR & Institutional Development</p>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>
              Coordinates non-teaching personnel, campus security, infrastructural expansions, boarding facilities, procurement, and physical asset management.
            </p>
          </div>

          {/* College Registrar */}
          <div className="card" style={{ borderTop: '4px solid #0d9488' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>📋</div>
              <div>
                <h3 style={{ fontSize: '18px', margin: 0, color: 'var(--text-dark)' }}>Nancy Kemunto</h3>
                <span style={{ fontSize: '12px', color: '#0d9488', fontWeight: '700', textTransform: 'uppercase' }}>College Registrar</span>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-light)', marginBottom: '10px' }}>Admissions & Academic Records Office</p>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>
              Leads student intake, verification of KCSE credentials, issuance of official digital admission letters, registration registers, and transcript archiving.
            </p>
          </div>

          {/* Dean of Curriculum & Teaching Practicum */}
          <div className="card" style={{ borderTop: '4px solid #7c3aed' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#7c3aed', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>🏫</div>
              <div>
                <h3 style={{ fontSize: '18px', margin: 0, color: 'var(--text-dark)' }}>Peter Nyakundi</h3>
                <span style={{ fontSize: '12px', color: '#7c3aed', fontWeight: '700', textTransform: 'uppercase' }}>Dean of Teaching Practicum</span>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-light)', marginBottom: '10px' }}>School Attachment & Practicum Placement</p>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>
              Coordinates trainee school attachments across partner primary and junior schools, manages field supervisor assessment panels, and oversees micro-teaching clinics.
            </p>
          </div>

          {/* Dean of Students */}
          <div className="card" style={{ borderTop: '4px solid #e11d48' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e11d48', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>🤝</div>
              <div>
                <h3 style={{ fontSize: '18px', margin: 0, color: 'var(--text-dark)' }}>David Omwansa</h3>
                <span style={{ fontSize: '12px', color: '#e11d48', fontWeight: '700', textTransform: 'uppercase' }}>Dean of Trainee Welfare</span>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-light)', marginBottom: '10px' }}>Student Life, Boarding & Spiritual Guidance</p>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>
              Oversees trainee affairs, hostel accommodation, student council governance, sports & clubs, guidance & counseling, and chaplaincy services.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section style={{ background: 'var(--primary-navy)', color: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '12px', color: 'white' }}>Join Borabu Teachers Training College</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto 24px', fontSize: '15px' }}>
          Explore our accredited teacher education programmes and take the first step towards a prestigious, impactful career in modern classroom pedagogy.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/programmes" className="btn btn-primary" style={{ background: 'var(--accent-gold)', color: 'var(--primary-navy)', fontWeight: '700' }}>
            View Teacher Programmes
          </Link>
          <Link href="/register" className="btn btn-secondary" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
            Apply for Admission
          </Link>
        </div>
      </section>
    </div>
  );
}
