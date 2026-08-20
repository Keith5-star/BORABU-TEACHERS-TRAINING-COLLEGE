'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setUser(data.user);
        } else {
          if (isMounted) setUser(null);
        }
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  const isLinkActive = (path: string) => {
    if (path === '/') return pathname === '/' ? 'active' : '';
    return pathname.startsWith(path) ? 'active' : '';
  };

  const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/programmes', label: 'Programmes' },
    { href: '/admissions', label: 'Admissions' },
    { href: '/fees', label: 'Fees' },
    { href: '/news', label: 'News' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="main-header">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link href="/" className="logo-link" style={{ textDecoration: 'none' }}>
          <div className="logo-icon-wrap" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2L3 8.5V18C3 28 10.5 35.5 18 38C25.5 35.5 33 28 33 18V8.5L18 2Z" fill="var(--primary-navy)" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinejoin="round"/>
              <path d="M10 19.5H26M10 23.5H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18 9.5L13 13.5V15H23V13.5L18 9.5Z" fill="var(--accent-gold)"/>
              <circle cx="18" cy="14" r="1.5" fill="var(--primary-navy)"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-title">
              BORABU
            </span>
            <span className="logo-subtitle">
              TEACHERS TRAINING COLLEGE
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="desktop-nav">
          <ul className="nav-menu" style={{ display: 'flex', gap: '18px', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`nav-link ${isLinkActive(link.href)}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTAs */}
        <div className="nav-cta desktop-cta" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {loading ? (
            <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>...</span>
          ) : user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link 
                href={user.role === 'applicant' ? '/dashboard' : '/admin'} 
                className="btn btn-secondary"
                style={{ fontSize: '12px', padding: '7px 14px', borderRadius: 'var(--radius-sm)' }}
              >
                {user.role === 'applicant' ? 'Portal Dashboard' : 'Admin Area'}
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn"
                style={{ fontSize: '12px', padding: '7px 12px', background: 'hsl(0, 72%, 51%)', color: 'white', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link 
                href="/login" 
                className="btn btn-secondary" 
                style={{ fontSize: '12px', padding: '7px 14px', borderRadius: 'var(--radius-sm)' }}
              >
                Portal Login
              </Link>
              <Link 
                href="/register" 
                className="btn btn-primary" 
                style={{ fontSize: '12px', padding: '7px 16px', borderRadius: 'var(--radius-sm)' }}
              >
                Apply Online
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Actions Wrap (Hamburger) */}
        <div style={{ display: 'none', alignItems: 'center', gap: '8px' }} className="mobile-actions-wrap">
          <button
            className="mobile-hamburger-btn"
            style={{ display: 'inline-flex' }}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <ul className="mobile-nav-list" style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`mobile-nav-link ${isLinkActive(link.href)}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/faqs"
                className={`mobile-nav-link ${isLinkActive('/faqs')}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQs & Admissions Help
              </Link>
            </li>
            <li>
              <Link
                href="/verify/check"
                className={`mobile-nav-link ${isLinkActive('/verify/check')}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: 'var(--accent-gold)' }}
              >
                Verify Admission Letter
              </Link>
            </li>
          </ul>

          <div className="mobile-nav-actions" style={{ paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <Link 
                  href={user.role === 'applicant' ? '/dashboard' : '/admin'} 
                  className="btn btn-secondary"
                  style={{ textAlign: 'center', width: '100%', padding: '10px' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user.role === 'applicant' ? 'Portal Dashboard' : 'Admin Area'}
                </Link>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="btn"
                  style={{ width: '100%', padding: '10px', background: 'hsl(0, 72%, 51%)', color: 'white', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <Link
                  href="/login"
                  className="btn btn-secondary"
                  style={{ textAlign: 'center', width: '100%', padding: '10px' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Portal Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary"
                  style={{ textAlign: 'center', width: '100%', padding: '10px' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Apply Online Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
