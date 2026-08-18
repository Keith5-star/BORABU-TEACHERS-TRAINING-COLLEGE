import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campus Life & Gallery',
  description: 'View photos of our campus, research center, laboratories, classrooms, and student life activities.',
};

export default function GalleryPage() {
  const items = [
    { title: 'Modern Library Center', desc: 'Housing thousands of physical volumes and academic journals.', category: 'Facility', icon: '📖' },
    { title: 'Computer Science Lab', desc: 'Fully equipped ICT laboratory for computer literacy studies.', category: 'Academics', icon: '💻' },
    { title: 'DPTE Science Laboratory', desc: 'Equipped for hands-on experiments in basic sciences.', category: 'Academics', icon: '🔬' },
    { title: 'Vibrant Sports Grounds', desc: 'Students participate in athletics, football, and netball.', category: 'Extracurricular', icon: '⚽' },
    { title: 'Annual Graduation Ceremony', desc: 'Celebrating our graduates as they join the workforce.', category: 'Event', icon: '🎓' },
    { title: 'Micro-Teaching Classrooms', desc: 'Safe space for student-teachers to practice instructional skills.', category: 'Facility', icon: '🏫' },
  ];

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <header className="section-header">
        <span className="section-tag">Campus Life</span>
        <h1 className="section-title">Our Gallery & Environment</h1>
        <p className="section-desc">
          Take a visual tour around Borabu Teachers Training College campus, facilities, and events.
        </p>
      </header>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '40px' }}>
        {items.map((item, idx) => (
          <div key={idx} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div 
              style={{ 
                height: '200px', 
                background: 'var(--primary-navy)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '64px',
                color: 'white',
                position: 'relative'
              }}
            >
              {item.icon}
              <span 
                style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  right: '12px', 
                  background: 'rgba(255,255,255,0.15)', 
                  backdropFilter: 'blur(10px)', 
                  color: 'white', 
                  fontSize: '11px', 
                  padding: '4px 10px', 
                  borderRadius: '20px',
                  fontWeight: '600'
                }}
              >
                {item.category}
              </span>
            </div>
            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-dark)' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '13px', lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
