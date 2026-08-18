import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About the College',
  description: 'Learn about the history, vision, values, and administrative leadership of Borabu Technical Training Institute (BTTI).',
};

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '1000px' }}>
      <header className="section-header" style={{ marginBottom: '40px' }}>
        <span className="section-tag">Our History & Mandate</span>
        <h1 className="section-title" style={{ fontSize: '40px' }}>About Borabu Technical Training Institute</h1>
        <p className="section-desc">Established to nurture competent human resource equipped with technical skills and strong values.</p>
      </header>

      {/* History section */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px' }}>Institute History</h2>
        <p style={{ color: 'var(--text-main)', fontSize: '15px', marginBottom: '14px' }}>
          Borabu Technical Training Institute (BTTI) is a premier public Technical, Vocational Education and Training (TVET) institution situated in Borabu Constituency, Nyamira County, Kenya. Registered under the Ministry of Education and TVETA, the institute was established to provide competent human resource for sustainable development in science, technology, and industry.
        </p>
        <p style={{ color: 'var(--text-main)', fontSize: '15px' }}>
          Over the years, the institution has built a reputation for excellence in technical training, innovation, and holistic development, producing graduates who excel in both employment and entrepreneurial ventures across the region.
        </p>
      </section>

      {/* Mission & Vision */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '50px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '30px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Our Mission</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
            To provide Competent Human Resource for Sustainable Development in Science and Technology.
          </p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '30px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>👁️</div>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Our Vision</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
            To be a center of excellence for Technical, Vocational Education and Training.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '24px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px' }}>Our Core Values</h2>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px' }}>Integrity</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>High moral standards, transparency, and accountability in all professional conducts.</p>
          </div>
          <div style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px' }}>Professionalism</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Commitment to the highest standards of workmanship, ethical values, and performance.</p>
          </div>
          <div style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px' }}>Accountability</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Fostering transparency and responsible management of resources and training.</p>
          </div>
          <div style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px' }}>Creativity</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Promoting innovativeness, technical breakthroughs, and hands-on skill development.</p>
          </div>
        </div>
      </section>

      {/* Leadership Profile */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '24px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px' }}>Institute Administration</h2>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px' }}>👨‍🏫</div>
            <h3>Prof. Charles O. Nyabuto</h3>
            <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-light)', marginBottom: '10px' }}>Principal / Secretary to Board of Management</p>
            <p style={{ fontSize: '13px' }}>Leading the academic strategy and overall administration at the institute.</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px' }}>👩‍💼</div>
            <h3>Nancy Kemunto</h3>
            <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-light)', marginBottom: '10px' }}>College Registrar (Admissions & Academic Affairs)</p>
            <p style={{ fontSize: '13px' }}>Manages admissions queue, records, student records, and eligibility checking.</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px' }}>👨‍💼</div>
            <h3>David Omwansa</h3>
            <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-light)', marginBottom: '10px' }}>Dean of Students</p>
            <p style={{ fontSize: '13px' }}>Overseeing student welfare, boarding administration, sports, and life guidance.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
