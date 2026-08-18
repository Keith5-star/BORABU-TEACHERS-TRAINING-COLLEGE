import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'News & Announcements',
  description: 'Stay updated with the latest events, announcements, and key academic calendars at Borabu TTC.',
};

export default function NewsPage() {
  const articles = [
    {
      title: 'September 2026 Student Intake Applications Open',
      date: 'August 10, 2026',
      excerpt: 'Borabu Teachers Training College is officially welcoming applications for DPTE, DECTE, and CECTE. Eligible candidates are advised to apply via our newly launched digital applicant portal.',
      category: 'Admissions',
    },
    {
      title: 'College Launches Digital Admissions Portal',
      date: 'August 08, 2026',
      excerpt: 'In line with national digitisation directives, we have launched our web-based admission system. Applicants can now receive instant eligibility pre-checks and retrieve formal QR-coded letters.',
      category: 'Technology',
    },
    {
      title: 'Capacity Building Workshop for Primary School Educators',
      date: 'July 15, 2026',
      excerpt: 'Borabu TTC hosted over 200 local primary school heads and teachers for a pedagogical workshop focused on CBC assessment strategies and instructional design tools.',
      category: 'Workshops',
    },
  ];

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '800px' }}>
      <header className="section-header">
        <span className="section-tag">Updates</span>
        <h1 className="section-title">College News & Events</h1>
        <p className="section-desc">
          Get the latest information about administrative notices, academic results, and workshops.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '45px' }}>
        {articles.map((art, idx) => (
          <article 
            key={idx} 
            style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-light)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '30px', 
              boxShadow: 'var(--shadow-sm)',
              position: 'relative' 
            }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', background: 'var(--primary-light)', color: 'var(--primary-blue)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                {art.category}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{art.date}</span>
            </div>
            
            <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--text-dark)' }}>{art.title}</h3>
            <p style={{ color: 'var(--text-main)', fontSize: '14px', marginBottom: '16px', lineHeight: '1.6' }}>{art.excerpt}</p>
            
            <Link href="#" style={{ color: 'var(--primary-blue)', fontSize: '14px', fontWeight: '600' }}>
              Read Full Notice &rarr;
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
