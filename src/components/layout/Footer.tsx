'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>BORABU BTTI</h2>
            <p className="footer-desc">
              To provide Competent Human Resource for Sustainable Development in Science and Technology through quality technical training and hands-on skill acquisition.
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
              Registered by the Ministry of Education & TVETA.
            </p>
          </div>

          <div className="footer-col">
            <h4>Programmes</h4>
            <ul className="footer-links">
              <li>
                <Link href="/programmes?level=Diploma" className="footer-link">
                  Diploma Programmes
                </Link>
              </li>
              <li>
                <Link href="/programmes?level=Certificate" className="footer-link">
                  Certificate Programmes
                </Link>
              </li>
              <li>
                <Link href="/programmes?level=Artisan" className="footer-link">
                  Artisan Programmes
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="footer-link">
                  Entry Requirements
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link href="/about" className="footer-link">
                  About the Institute
                </Link>
              </li>
              <li>
                <Link href="/fees" className="footer-link">
                  Fees Structure
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="footer-link">
                  Campus Gallery
                </Link>
              </li>
              <li>
                <Link href="/news" className="footer-link">
                  News & Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul className="footer-links" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px' }}>
              <li style={{ marginBottom: '10px' }}>
                <strong>Location:</strong> Nyamira County, off Kisii – Kericho highway, Alight at Nyangoge, Near Kebirigo Town
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Address:</strong> P.O. BOX 9 - 40506, Kebirigo
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Phone:</strong> 0746 211 764 | 0727 433 205
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Email:</strong> info@borabutti.ac.ke
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Borabu Technical Training Institute. All Rights Reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/verify/check" style={{ color: 'var(--accent-gold)', fontWeight: '600' }}>
              Verify Admission Letter
            </Link>
            <span>|</span>
            <span>Compliant with Kenya Data Protection Act 2019</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
