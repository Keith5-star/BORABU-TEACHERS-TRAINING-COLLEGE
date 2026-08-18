'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'admissions' | 'fees' | 'programmes' | 'campus' | 'certification';
}

const FAQS_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'admissions',
    question: 'What is the minimum entry requirement for the Diploma in Primary Teacher Education (DPTE)?',
    answer: 'The minimum requirement for direct admission into DPTE under the Ministry of Education and KNEC guidelines is a KCSE Mean Grade of C (Plain) or its recognized equivalent. Candidates should also have scored a minimum of C (Plain) in English, Kiswahili, Mathematics, and one Science/Humanities subject. Candidates with special needs (visual/hearing impairment) are eligible with a Mean Grade of C- (Minus).',
  },
  {
    id: 'faq-2',
    category: 'admissions',
    question: 'Can I apply for DPTE if I have a C- (Minus) in KCSE?',
    answer: 'Direct entry into DPTE requires a C (Plain). However, if you are an applicant with special needs or physical/sensory impairment, the entry benchmark is C- (Minus). Alternatively, applicants with C- or D+ can enroll in our foundational Certificate programmes and later progress to the Diploma level.',
  },
  {
    id: 'faq-3',
    category: 'programmes',
    question: 'What is the difference between DPTE and DECTE?',
    answer: 'DPTE (Diploma in Primary Teacher Education) prepares educators to teach Grade 1 through Grade 6 in primary schools under the Competency-Based Curriculum (CBC). DECTE (Diploma in Early Childhood Teacher Education) is specialized for Pre-Primary 1 (PP1), Pre-Primary 2 (PP2), and foundational early childhood developmental stages.',
  },
  {
    id: 'faq-4',
    category: 'programmes',
    question: 'How do Upgrade Diplomas (UDPTE & UDECTE) work for practicing P1/ECDE teachers?',
    answer: 'Upgrade Diplomas are designed specifically for practicing educators holding Primary Teacher (P1) certificates or ECDE Certificates. The training focuses on CBC pedagogy, micro-teaching, continuous assessment methods, and digital literacy. The programme is flexible and can be completed through modular school-holiday sessions (1-2 years).',
  },
  {
    id: 'faq-5',
    category: 'fees',
    question: 'How much are the tuition fees per term at Borabu TTC?',
    answer: 'Tuition fees at Borabu TTC are approximately KES 28,000 to KES 34,500 per term depending on boarding or day scholar residency choices. The official fee structure includes tuition, ICT/library access, examination facilitation, and activity fees. KUCCPS government-placed students receive Ministry capitation subsidies.',
  },
  {
    id: 'faq-6',
    category: 'fees',
    question: 'What are the official payment channels for the KES 1,000 application fee?',
    answer: 'You can pay the non-refundable KES 1,000 application fee directly through our online portal using M-Pesa STK Push, or via M-Pesa Paybill (Business No: 522123, Account: BTTC-[Your Name]) or through direct bank deposit to Co-operative Bank of Kenya (Account No: 01129482716400, Account Name: Borabu Teachers Training College).',
  },
  {
    id: 'faq-7',
    category: 'admissions',
    question: 'What documents do I need to prepare before applying online?',
    answer: 'You will need clear digital copies (PDF or image) of: 1) Your KCSE Result Slip or Certificate, 2) National ID Card or Birth Certificate, 3) Recent passport-size photograph, 4) Secondary School Leaving Certificate, and 5) Previous teaching certificates (if applying for an Upgrade Diploma).',
  },
  {
    id: 'faq-8',
    category: 'certification',
    question: 'Are Borabu TTC diplomas recognized by the Teachers Service Commission (TSC)?',
    answer: 'Yes. Borabu Teachers Training College is fully registered and accredited by the Ministry of Education and recognized by the Teachers Service Commission (TSC). Upon graduation, students receive accredited diplomas and are eligible for immediate TSC registration numbers and placement in public and private institutions.',
  },
  {
    id: 'faq-9',
    category: 'campus',
    question: 'Are boarding and hostel facilities available on campus?',
    answer: 'Yes. Borabu TTC provides modern, secure hostel accommodations for both male and female teacher trainees. Hostels feature 24/7 security, reliable water and power, catering facilities, recreational sports grounds, and quiet study halls.',
  },
  {
    id: 'faq-10',
    category: 'admissions',
    question: 'How do I download and verify my official Admission Letter?',
    answer: 'Once your application has been reviewed and approved by the admissions desk, an official PDF Admission Letter will be generated in your Portal Dashboard. The letter features a cryptographically secure QR code that can be verified in real-time by employers and education officers at /verify/check.',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All Questions' },
  { key: 'admissions', label: 'Admissions & Qualifications' },
  { key: 'fees', label: 'Fees & Payments' },
  { key: 'programmes', label: 'CBC Programmes & Upgrades' },
  { key: 'campus', label: 'Hostels & Campus Life' },
  { key: 'certification', label: 'TSC & Accreditation' },
];

export default function FAQsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((faq) => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <main style={{ minHeight: '80vh', padding: '40px 0 80px 0', background: 'var(--bg-light, #f8fafc)' }}>
      <div className="container" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Breadcrumb & Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--accent-gold, #cda34f)',
              background: 'rgba(205, 163, 79, 0.1)',
              padding: '6px 14px',
              borderRadius: '20px',
              display: 'inline-block',
              marginBottom: '12px',
            }}
          >
            Admissions Knowledge Base
          </span>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '800',
              color: 'var(--primary-navy, #0b2545)',
              marginBottom: '12px',
              fontFamily: 'var(--font-heading, serif)',
            }}
          >
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
            Find immediate answers regarding entry requirements for DPTE/DECTE, fees structure, M-Pesa payments, and CBC teacher training upgrades.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '30px' }}>
          <div
            style={{
              position: 'relative',
              background: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ padding: '0 16px', fontSize: '18px', color: '#94a3b8' }}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. DPTE grade, fees, M-Pesa, hostel, upgrade)..."
              style={{
                width: '100%',
                padding: '16px 16px 16px 0',
                border: 'none',
                outline: 'none',
                fontSize: '15px',
                borderRadius: '12px',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '0 16px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '32px',
            justifyContent: 'center',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--primary-navy, #0b2545)' : 'rgba(0,0,0,0.1)',
                  background: isActive ? 'var(--primary-navy, #0b2545)' : '#ffffff',
                  color: isActive ? '#ffffff' : 'var(--primary-navy, #0b2545)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}>
          {filteredFaqs.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px dashed #cbd5e1',
              }}
            >
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                No questions matched your search: &ldquo;{searchQuery}&rdquo;
              </p>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                Try different keywords or ask our AI Advisor directly.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="btn btn-secondary"
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '10px',
                    border: isExpanded ? '1px solid var(--accent-gold, #cda34f)' : '1px solid rgba(0,0,0,0.08)',
                    boxShadow: isExpanded ? '0 4px 16px rgba(11, 37, 69, 0.08)' : '0 2px 6px rgba(0,0,0,0.02)',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: isExpanded ? 'var(--primary-navy, #0b2545)' : '#1e293b',
                      fontWeight: '700',
                      fontSize: '15px',
                      gap: '16px',
                    }}
                  >
                    <span>{faq.question}</span>
                    <span
                      style={{
                        fontSize: '18px',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        color: 'var(--accent-gold, #cda34f)',
                      }}
                    >
                      ▼
                    </span>
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        padding: '0 20px 20px 20px',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#475569',
                        borderTop: '1px solid rgba(0,0,0,0.04)',
                        paddingTop: '14px',
                      }}
                    >
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* CTA Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0b2545 0%, #134074 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '36px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            border: '2px solid rgba(205, 163, 79, 0.4)',
          }}
        >
          <div style={{ maxWidth: '540px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#ffffff' }}>
              Ready to begin your teaching journey?
            </h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.5' }}>
              Submit your direct application online today or contact our dedicated admissions desk for personalized guidance on qualifications and intake schedules.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href="/register"
              className="btn btn-primary"
              style={{
                background: 'var(--accent-gold, #cda34f)',
                color: '#0b2545',
                fontWeight: '700',
                padding: '12px 24px',
              }}
            >
              Apply for Admission
            </Link>
            <Link
              href="/contact"
              className="btn btn-secondary"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                borderColor: 'rgba(255,255,255,0.3)',
                padding: '12px 20px',
              }}
            >
              Contact Desk
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
