'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface GalleryItem {
  id: string;
  title: string;
  desc: string;
  category: 'All' | 'Campus Grounds' | 'Student Life' | 'Academics & Training' | 'Celebrations';
  image: string;
  alt: string;
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'photo-1',
      title: 'Student Assembly & Academic Discipline',
      desc: 'Borabu TTC trainees gathered in formation during morning assembly and professional briefings.',
      category: 'Academics & Training',
      image: '/images/hero_students.jpg',
      alt: 'Borabu TTC students at morning assembly',
    },
    {
      id: 'photo-2',
      title: 'Serene Landscaped Campus Grounds',
      desc: 'Lush green lawns and manicured gardens offering a peaceful, distraction-free learning atmosphere.',
      category: 'Campus Grounds',
      image: '/images/campus_garden.jpg',
      alt: 'Borabu Teachers Training College green gardens and admin block',
    },
    {
      id: 'photo-3',
      title: 'Teacher Commissioning & Graduation Celebration',
      desc: 'Graduating teachers celebrating with peers, faculty, and families following their commissioning.',
      category: 'Celebrations',
      image: '/images/campus_celebration.jpg',
      alt: 'Borabu TTC graduation and teacher commissioning ceremony',
    },
    {
      id: 'photo-4',
      title: 'Teacher Trainees Practicum Line-Up',
      desc: 'Teacher candidates organized for pedagogical workshops and micro-teaching sessions.',
      category: 'Student Life',
      image: '/images/campus_students_line.jpg',
      alt: 'Borabu TTC student teachers in queue for academic activity',
    },
    {
      id: 'photo-5',
      title: 'College Location & Nyamira Campus Map',
      desc: 'Conveniently accessible campus location in Borabu, Nyamira County off the Kisii–Kericho highway.',
      category: 'Campus Grounds',
      image: '/images/map_location.png',
      alt: 'Borabu Teachers Training College location map in Nyamira',
    },
  ];

  const categories = ['All', 'Campus Grounds', 'Student Life', 'Academics & Training', 'Celebrations'];

  const filteredItems = galleryItems.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <div className="container" style={{ padding: '48px 20px', maxWidth: '1100px' }}>
      <header className="section-header" style={{ marginBottom: '32px' }}>
        <span className="section-tag">Visual Tour</span>
        <h1 className="section-title" style={{ fontSize: '32px' }}>Campus Life & Photo Gallery</h1>
        <p className="section-desc">
          Explore our environment, student community, graduation events, and campus facilities in Borabu, Nyamira County.
        </p>
      </header>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              background: activeCategory === cat ? 'var(--primary-navy)' : 'var(--bg-card)',
              color: activeCategory === cat ? 'white' : 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPhoto(item)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '240px', background: 'var(--primary-navy)' }}>
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
                  right: '12px',
                  background: 'rgba(12, 24, 33, 0.85)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '4px 10px',
                  borderRadius: '12px',
                }}
              >
                {item.category}
              </span>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
                }}
              />
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '17px', color: 'var(--text-dark)', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                {item.desc}
              </p>
              <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--primary-blue)', fontWeight: '700' }}>
                Click to view full photo &rarr;
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(12, 24, 33, 0.88)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '860px',
              width: '100%',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative', width: '100%', height: '420px', background: '#000' }}>
              <Image
                src={selectedPhoto.image}
                alt={selectedPhoto.alt}
                fill
                sizes="860px"
                style={{ objectFit: 'contain' }}
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--accent-gold)', background: 'var(--primary-navy)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', textTransform: 'uppercase' }}>
                  {selectedPhoto.category}
                </span>
                <h3 style={{ fontSize: '20px', color: 'var(--text-dark)', marginTop: '6px', marginBottom: '4px' }}>
                  {selectedPhoto.title}
                </h3>
                <p style={{ color: 'var(--text-main)', fontSize: '13.5px', margin: 0 }}>
                  {selectedPhoto.desc}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                  Apply Online
                </Link>
                <button onClick={() => setSelectedPhoto(null)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
