'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SocialFeed from '@/components/social/SocialFeed';

interface Article {
  id: string;
  title: string;
  date: string;
  category: 'Admissions' | 'Events' | 'Campus' | 'Workshops' | 'Academics';
  image: string;
  imageAlt: string;
  excerpt: string;
  content: string[];
  readTime: string;
  author: string;
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      id: 'admissions-2026',
      title: 'September 2026 Student Intake Applications Now Officially Open',
      date: 'August 18, 2026',
      category: 'Admissions',
      image: '/images/campus_students_line.jpg',
      imageAlt: 'Borabu TTC student teachers at assembly and registration',
      readTime: '3 min read',
      author: 'Office of the College Registrar',
      excerpt: 'Borabu Teachers Training College is officially receiving applications for the 2026/2027 academic year across DPTE, DECTE, CECTE, and CBC Upgrade courses.',
      content: [
        'The Admissions Office of Borabu Teachers Training College is pleased to announce that applications for the September 2026 intake are now open for all prospective teacher trainees.',
        'Applicants who scored KCSE Mean Grade C (Plain) or higher can apply for the Diploma in Primary Teacher Education (DPTE) or Diploma in Early Childhood Teacher Education (DECTE). Certificate in Early Childhood Teacher Education (CECTE) is also accepting trainees with KCSE Mean Grade D+.',
        'Our online admissions portal provides real-time prerequisite grade validation, ensuring applicants receive instantaneous eligibility checks before submitting their documents.',
        'Prospective students can complete the application paperlessly, upload their academic certificates and KCSE result slips, and download their official QR-verifiable admission letters upon approval by the admissions board.',
      ],
    },
    {
      id: 'graduation-2026',
      title: 'Annual Graduation & Teacher Commissioning Ceremony Celebrates Over 300 Graduates',
      date: 'August 05, 2026',
      category: 'Events',
      image: '/images/campus_celebration.jpg',
      imageAlt: 'Borabu TTC graduation celebration and student teachers',
      readTime: '4 min read',
      author: 'Dean of Students & Public Relations',
      excerpt: 'Borabu TTC celebrated its annual graduation and commissioning ceremony, conferring diplomas and certificates to over 300 newly certified educational practitioners.',
      content: [
        'In a vibrant celebration marked with joy and distinction, Borabu Teachers Training College successfully held its annual Teacher Commissioning and Graduation ceremony on campus.',
        'The chief guest, representing the Ministry of Education and the Teachers Service Commission (TSC), commended Borabu TTC for maintaining stellar national standards in teacher pedagogy, professional ethics, and CBC instructional readiness.',
        'Graduates expressed their pride in the hands-on micro-teaching practicum, ICT integration in modern classrooms, and value-based holistic mentorship they received during their studies.',
        'All graduating trainees have been registered for TSC certification, preparing them for deployment across primary, junior secondary, and early childhood education centers nationwide.',
      ],
    },
    {
      id: 'campus-upgrade',
      title: 'Modern Learning Facilities & Campus Green Spaces Expanded',
      date: 'July 28, 2026',
      category: 'Campus',
      image: '/images/campus_garden.jpg',
      imageAlt: 'Borabu TTC landscaped administrative lawns and serene green campus',
      readTime: '3 min read',
      author: 'College Facilities & Administration',
      excerpt: 'The college has completed modernization of micro-teaching laboratories, upgraded the digital ICT center, and enhanced serene, eco-friendly study grounds.',
      content: [
        'Borabu Teachers Training College has completed extensive improvements to its academic and environmental infrastructure. The enhancements are tailored to foster a tranquil and resource-rich study atmosphere.',
        'The upgrades feature expanded computer science laboratories with high-speed optical fiber connectivity, renovated micro-teaching suites with multimedia recording tools for classroom practice, and extended botanical learning zones.',
        'The college administration emphasizes that a lush, green, and serene campus directly reinforces academic focus and student well-being during rigorous teacher preparation courses.',
      ],
    },
    {
      id: 'cbc-workshop',
      title: 'CBC Pedagogical Mastery & Assessment Strategy Workshop Hosted for Regional Educators',
      date: 'July 15, 2026',
      category: 'Workshops',
      image: '/images/hero_students.jpg',
      imageAlt: 'Borabu TTC teacher trainees and staff during instructional seminar',
      readTime: '4 min read',
      author: 'Directorate of Curriculum & Quality Assurance',
      excerpt: 'Over 200 educators from Nyamira, Kisii, and surrounding counties gathered at Borabu TTC for an intensive capacity-building session on Competency-Based Curriculum tools.',
      content: [
        'Borabu TTC hosted a two-day regional educator symposium on Competency-Based Assessment (CBA) strategies, instructional material development, and inclusive classroom techniques.',
        'Facilitators guided participants through modern formative assessment matrices, rubrics formulation, and experiential learning projects aligned with the Kenya Institute of Curriculum Development (KICD) frameworks.',
        'Borabu TTC continues to serve as an intellectual hub and benchmark center for quality teacher education and continuous professional development (CPD) in Western Kenya.',
      ],
    },
  ];

  const categories = ['All', 'Admissions', 'Events', 'Campus', 'Workshops'];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '48px 20px', maxWidth: '1080px' }}>
      <header className="section-header" style={{ marginBottom: '32px' }}>
        <span className="section-tag">Campus News & Press Releases</span>
        <h1 className="section-title" style={{ fontSize: '32px' }}>Borabu College News & Events</h1>
        <p className="section-desc">
          Official bulletins, academic calendar updates, admissions notices, and campus life stories from Borabu Teachers Training College.
        </p>
      </header>

      {/* Filter and Search Controls */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 22px',
          marginBottom: '36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '7px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                background: selectedCategory === cat ? 'var(--primary-navy)' : 'var(--bg-main)',
                color: selectedCategory === cat ? 'white' : 'var(--text-main)',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ minWidth: '240px', flexGrow: 1, maxWidth: '340px' }}>
          <input
            type="text"
            placeholder="Search news & events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ fontSize: '13px', padding: '8px 14px' }}
          />
        </div>
      </div>

      {/* News Grid */}
      {filteredArticles.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-light)',
          }}
        >
          No news articles found matching your filters.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '210px',
                  background: 'var(--primary-navy)',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveArticle(art)}
              >
                <Image
                  src={art.image}
                  alt={art.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(12, 24, 33, 0.88)',
                    color: 'var(--accent-gold)',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  {art.category}
                </span>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {art.readTime}
                </span>
              </div>

              <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ fontSize: '12.5px', color: 'var(--text-light)', marginBottom: '8px' }}>
                  📅 {art.date} &bull; ✍️ {art.author}
                </div>

                <h3
                  onClick={() => setActiveArticle(art)}
                  style={{
                    fontSize: '19px',
                    color: 'var(--text-dark)',
                    marginBottom: '10px',
                    lineHeight: '1.4',
                    cursor: 'pointer',
                  }}
                >
                  {art.title}
                </h3>

                <p
                  style={{
                    color: 'var(--text-main)',
                    fontSize: '13.5px',
                    lineHeight: '1.6',
                    marginBottom: '18px',
                    flexGrow: 1,
                  }}
                >
                  {art.excerpt}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                  <button
                    onClick={() => setActiveArticle(art)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--primary-blue)',
                      fontWeight: '700',
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      padding: '0',
                    }}
                  >
                    Read Full Notice &rarr;
                  </button>

                  {art.category === 'Admissions' && (
                    <Link
                      href="/register"
                      className="btn btn-primary"
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                    >
                      Apply Now
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Official Social Media Feed: Latest Posts from X & Facebook */}
      <section style={{ marginTop: '56px' }}>
        <SocialFeed />
      </section>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(12, 24, 33, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setActiveArticle(null)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Banner */}
            <div style={{ position: 'relative', width: '100%', height: '260px', background: 'var(--primary-navy)' }}>
              <Image
                src={activeArticle.image}
                alt={activeArticle.imageAlt}
                fill
                sizes="720px"
                style={{ objectFit: 'cover' }}
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setActiveArticle(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
                aria-label="Close modal"
              >
                ✕
              </button>
              <span
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '20px',
                  background: 'rgba(12, 24, 33, 0.9)',
                  color: 'var(--accent-gold)',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}
              >
                {activeArticle.category}
              </span>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '10px' }}>
                📅 Published on {activeArticle.date} &bull; ✍️ {activeArticle.author}
              </div>

              <h2 style={{ fontSize: '24px', color: 'var(--text-dark)', marginBottom: '18px', lineHeight: '1.3' }}>
                {activeArticle.title}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-main)', fontSize: '14.5px', lineHeight: '1.7' }}>
                {activeArticle.content.map((paragraph, pIdx) => (
                  <p key={pIdx} style={{ margin: 0 }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div
                style={{
                  marginTop: '28px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <button
                  onClick={() => setActiveArticle(null)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 18px', fontSize: '13px' }}
                >
                  Close Story
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link href="/programmes" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                    View Programmes
                  </Link>
                  <Link href="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
                    Apply Online
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
