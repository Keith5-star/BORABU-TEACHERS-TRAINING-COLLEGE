import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About the College',
  description: 'Learn about the history, vision, values, and administrative leadership of Borabu Teachers Training College.',
};

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '48px 20px', maxWidth: '1040px' }}>
      <header className="section-header" style={{ marginBottom: '36px' }}>
        <span className="section-tag">Our Heritage & Mission</span>
        <h1 className="section-title" style={{ fontSize: '36px' }}>About Borabu Teachers Training College</h1>
        <p className="section-desc">Established to nurture competent educators equipped with pedagogical skills, ethical grounding, and leadership values.</p>
      </header>

      {/* History section with Campus Garden Image */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center', marginBottom: '50px' }}>
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px', color: 'var(--text-dark)' }}>
            College History & Mandate
          </h2>
          <p style={{ color: 'var(--text-main)', fontSize: '15px', lineHeight: '1.7', marginBottom: '14px' }}>
            Borabu Teachers Training College is a premier public teacher education institution situated in Borabu Constituency, Nyamira County, Kenya. Registered and licensed under the Ministry of Education and TVETA, the college was founded to provide rigorous teacher training, preparing graduates for direct registry by the Teachers Service Commission (TSC).
          </p>
          <p style={{ color: 'var(--text-main)', fontSize: '15px', lineHeight: '1.7' }}>
            Our programs (DPTE, DECTE, and CECTE) are designed in strict alignment with national educational standards and the Competency-Based Curriculum (CBC) framework, empowering our student teachers to lead modern learner-centered classrooms across Kenya.
          </p>
        </div>

        <div style={{ position: 'relative', height: '300px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <Image
            src="/images/campus_garden.jpg"
            alt="Borabu TTC landscaped campus grounds and administrative lawns"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
            referrerPolicy="no-referrer"
          />
          <span
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: 'rgba(12, 24, 33, 0.85)',
              color: 'white',
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '4px',
            }}
          >
            Serene Campus Grounds in Nyamira County
          </span>
        </div>
      </section>

      {/* Visual Photo Banner of Trainees and Celebrations */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '50px' }}>
        <div style={{ position: 'relative', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
          <Image
            src="/images/hero_students.jpg"
            alt="Borabu TTC students gathered in assembly"
            fill
            sizes="33vw"
            style={{ objectFit: 'cover' }}
            referrerPolicy="no-referrer"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
          <span style={{ position: 'absolute', bottom: '10px', left: '12px', color: 'white', fontSize: '12px', fontWeight: '600' }}>
            Daily Academic Assembly & Briefings
          </span>
        </div>

        <div style={{ position: 'relative', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
          <Image
            src="/images/campus_celebration.jpg"
            alt="Borabu TTC graduation and commissioning event"
            fill
            sizes="33vw"
            style={{ objectFit: 'cover' }}
            referrerPolicy="no-referrer"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
          <span style={{ position: 'absolute', bottom: '10px', left: '12px', color: 'white', fontSize: '12px', fontWeight: '600' }}>
            Annual Graduation & Commissioning
          </span>
        </div>

        <div style={{ position: 'relative', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
          <Image
            src="/images/campus_students_line.jpg"
            alt="Borabu TTC student teachers practicum orientation"
            fill
            sizes="33vw"
            style={{ objectFit: 'cover' }}
            referrerPolicy="no-referrer"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
          <span style={{ position: 'absolute', bottom: '10px', left: '12px', color: 'white', fontSize: '12px', fontWeight: '600' }}>
            Practicum Preparation & CBC Training
          </span>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '50px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '28px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>🎯</div>
          <h3 style={{ fontSize: '19px', marginBottom: '8px', color: 'var(--text-dark)' }}>Our Mission</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
            To train competent, professional, and value-driven educators who excel in pedagogical excellence, classroom leadership, and community development.
          </p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '28px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>👁️</div>
          <h3 style={{ fontSize: '19px', marginBottom: '8px', color: 'var(--text-dark)' }}>Our Vision</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
            To be a leading national center of excellence in teacher education, pedagogical innovation, and holistic professional mentorship.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px', color: 'var(--text-dark)' }}>
          Our Core Values
        </h2>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px', fontSize: '15px' }}>Integrity</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>High moral standards, transparency, and accountability in all professional conduct.</p>
          </div>
          <div style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px', fontSize: '15px' }}>Professionalism</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>Commitment to the highest standards of workmanship, ethical values, and performance.</p>
          </div>
          <div style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px', fontSize: '15px' }}>Accountability</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>Fostering transparency and responsible management of resources and training.</p>
          </div>
          <div style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px', fontSize: '15px' }}>Pedagogical Excellence</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>Promoting instructional innovation, modern teaching practices, and hands-on classroom mastery.</p>
          </div>
        </div>
      </section>

      {/* Leadership Profile */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px', color: 'var(--text-dark)' }}>
          College Administration & Governance
        </h2>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--primary-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 14px' }}>👨‍🏫</div>
            <h3 style={{ fontSize: '17px', marginBottom: '4px' }}>Prof. Charles O. Nyabuto</h3>
            <p style={{ fontStyle: 'italic', fontSize: '12.5px', color: 'var(--text-light)', marginBottom: '10px' }}>Principal / Secretary to Board of Management</p>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5', margin: 0 }}>Leading the academic strategy and overall administration at the college.</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--primary-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 14px' }}>👩‍💼</div>
            <h3 style={{ fontSize: '17px', marginBottom: '4px' }}>Nancy Kemunto</h3>
            <p style={{ fontStyle: 'italic', fontSize: '12.5px', color: 'var(--text-light)', marginBottom: '10px' }}>College Registrar (Admissions & Academic Affairs)</p>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5', margin: 0 }}>Manages admissions queue, records, student records, and eligibility checking.</p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--primary-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 14px' }}>👨‍💼</div>
            <h3 style={{ fontSize: '17px', marginBottom: '4px' }}>David Omwansa</h3>
            <p style={{ fontStyle: 'italic', fontSize: '12.5px', color: 'var(--text-light)', marginBottom: '10px' }}>Dean of Students</p>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5', margin: 0 }}>Overseeing student welfare, boarding administration, sports, and life guidance.</p>
          </div>
        </div>
      </section>

      {/* Call to Action banner */}
      <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '28px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '8px' }}>Join the Next Generation of Certified Educators</h3>
        <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '18px', maxWidth: '600px', margin: '0 auto 18px' }}>
          Explore our wide range of teacher training programs or submit your online application today.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/programmes" className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '13px' }}>
            View Programmes
          </Link>
          <Link href="/register" className="btn btn-primary" style={{ padding: '8px 22px', fontSize: '13px' }}>
            Apply Online Now
          </Link>
        </div>
      </section>
    </div>
  );
}
