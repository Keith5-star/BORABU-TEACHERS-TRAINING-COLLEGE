'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ContrastToggle from '../ContrastToggle';

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
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to check auth state:', err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
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
    return pathname === path ? 'active' : '';
  };

  return (
    <header className="main-header">
      <div className="container nav-container">
        <Link href="/" className="logo-link">
          <div className="logo-icon">B</div>
          <div className="logo-text">
            <h1>BORABU TTC</h1>
            <div className="logo-tagline">Teachers Training College</div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav>
          <ul className="nav-menu">
            <li>
              <Link href="/" className={`nav-link ${isLinkActive('/')}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className={`nav-link ${isLinkActive('/about')}`}>
                About
              </Link>
            </li>
            <li>
              <Link href="/programmes" className={`nav-link ${isLinkActive('/programmes')}`}>
                Programmes
              </Link>
            </li>
            <li>
              <Link href="/admissions" className={`nav-link ${isLinkActive('/admissions')}`}>
                Admissions
              </Link>
            </li>
            <li>
              <Link href="/fees" className={`nav-link ${isLinkActive('/fees')}`}>
                Fees
              </Link>
            </li>
            <li>
              <Link href="/gallery" className={`nav-link ${isLinkActive('/gallery')}`}>
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/news" className={`nav-link ${isLinkActive('/news')}`}>
                News
              </Link>
            </li>
            <li>
              <Link href="/contact" className={`nav-link ${isLinkActive('/contact')}`}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="nav-cta" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ContrastToggle />
          {loading ? (
            <span style={{ fontSize: '14px', color: 'var(--text-light)' }}>Loading...</span>
          ) : user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link 
                href={user.role === 'applicant' ? '/dashboard' : '/admin'} 
                className="btn btn-secondary"
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                {user.role === 'applicant' ? 'Portal Dashboard' : 'Admin Area'}
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn btn-primary"
                style={{ fontSize: '13px', padding: '8px 16px', background: 'hsl(0, 72%, 51%)' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary">
                Apply Now
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
