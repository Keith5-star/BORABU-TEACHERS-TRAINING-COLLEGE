'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>BORABU TTC</h2>
            <p className="footer-desc">
              To train competent, value-driven educators through quality teacher education, research, and professional mentorship.
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
              Registered & Licensed by the Ministry of Education (Reg: MOE-TTC/PRIVATE/2021/089) & Accredited for TSC Teacher Training.
            </p>
          </div>

          <div className="footer-col">
            <h4>Programmes</h4>
            <ul className="footer-links">
              <li>
                <Link href="/programmes" className="footer-link">
                  Primary Teacher Ed. (DPTE)
                </Link>
              </li>
              <li>
                <Link href="/programmes" className="footer-link">
                  Early Childhood Ed. (DECTE)
                </Link>
              </li>
              <li>
                <Link href="/programmes" className="footer-link">
                  ECDE Certificate (CECTE)
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
                  About the College
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
                <strong>Email:</strong> info@borabuttc.ac.ke
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Borabu Teachers Training College. All Rights Reserved.</p>
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
