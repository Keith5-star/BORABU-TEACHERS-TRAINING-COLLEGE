'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer" style={{ padding: '48px 0 24px', background: 'var(--primary-deep)', color: 'white', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px 24px', marginBottom: '36px' }}>
          
          {/* Institution Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '28px', height: '32px' }}>
                <svg width="28" height="32" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2L2 9V18C2 28.5 10.5 35.8 18 38C25.5 35.8 34 28.5 34 18V9L18 2Z" fill="var(--primary-blue)" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M12 18H24M12 22H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18 10L14 13.5V15H22V13.5L18 10Z" fill="var(--accent-gold)"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '17px', color: 'white', margin: 0, fontWeight: '700', letterSpacing: '-0.3px' }}>
                BORABU TTC
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', marginBottom: '12px' }}>
              Premier teacher training college offering accredited DPTE & DECTE diploma courses in Nyamira County.
            </p>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5', padding: '6px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)' }}>
              MoE Reg: MOE-TTC/PRIVATE/2021/089<br/>
              TSC Teacher Education Accredited
            </div>
          </div>

          {/* Programmes */}
          <div>
            <h4 style={{ fontSize: '14px', color: 'var(--accent-gold)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700' }}>
              Academic Courses
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <Link href="/programmes" className="footer-link" style={{ fontSize: '13px' }}>
                  Diploma Primary Teacher Ed. (DPTE)
                </Link>
              </li>
              <li>
                <Link href="/programmes" className="footer-link" style={{ fontSize: '13px' }}>
                  Diploma Early Childhood Ed. (DECTE)
                </Link>
              </li>
              <li>
                <Link href="/programmes" className="footer-link" style={{ fontSize: '13px' }}>
                  CBC Upgrade Programmes
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="footer-link" style={{ fontSize: '13px' }}>
                  Admission Criteria & Checklist
                </Link>
              </li>
              <li>
                <Link href="/fees" className="footer-link" style={{ fontSize: '13px' }}>
                  Fee Structure & Schedule
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals & Resources */}
          <div>
            <h4 style={{ fontSize: '14px', color: 'var(--accent-gold)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700' }}>
              Student & Portal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <Link href="/register" className="footer-link" style={{ fontSize: '13px' }}>
                  Online Application Form
                </Link>
              </li>
              <li>
                <Link href="/login" className="footer-link" style={{ fontSize: '13px' }}>
                  Applicant / Student Portal
                </Link>
              </li>
              <li>
                <Link href="/verify/check" className="footer-link" style={{ fontSize: '13px', color: 'var(--accent-gold)' }}>
                  Verify Admission Letter
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="footer-link" style={{ fontSize: '13px' }}>
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="footer-link" style={{ fontSize: '13px' }}>
                  Campus Gallery & Grounds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Admissions Desk */}
          <div>
            <h4 style={{ fontSize: '14px', color: 'var(--accent-gold)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700' }}>
              Admissions Helpdesk
            </h4>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <strong>Call:</strong> <a href="tel:0101930121" style={{ color: 'white' }}>0101930121</a>
              </div>
              <div>
                <strong>WhatsApp:</strong> <a href="https://wa.me/254101930121" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-teal)' }}>Chat 0101930121</a>
              </div>
              <div>
                <strong>Email:</strong> <a href="mailto:admissions@borabuttc.ac.ke" style={{ color: 'white' }}>admissions@borabuttc.ac.ke</a>
              </div>
              <div>
                <strong>Location:</strong> Nyamira County, Off Kisii–Kericho Hwy (Kebirigo)
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
          <div>
            &copy; {currentYear} Borabu Teachers Training College. All rights reserved.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <Link href="/terms" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
              Terms of Admission
            </Link>
            <span>&bull;</span>
            <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/verify/check" style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>
              Letter Verification
            </Link>
            <span>&bull;</span>
            <span>Kenya Data Protection Act 2019</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
