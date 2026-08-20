'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

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
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  // Ticket Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('other');
  const [ticketMessage, setTicketMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [currentUser, setCurrentUser] = useState<{ fullName: string; email: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  // Check if applicant / user is logged in
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
        setGuestName(parsed.fullName || '');
        setGuestEmail(parsed.email || '');
      }
    } catch {
      // Ignore parsing errors
    }
  }, []);

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

  // Open modal with smart pre-population based on search query & selected category
  const handleOpenTicketModal = () => {
    setCreatedTicketId(null);

    // 1. Determine Subject
    let initialSubject = '';
    if (searchQuery.trim()) {
      initialSubject = `Inquiry regarding: ${searchQuery.trim()}`;
    } else if (selectedCategory !== 'all') {
      const catObj = CATEGORIES.find((c) => c.key === selectedCategory);
      initialSubject = `Inquiry on ${catObj ? catObj.label : 'Admissions'}`;
    } else {
      initialSubject = 'Admissions & Course Application Inquiry';
    }
    setTicketSubject(initialSubject);

    // 2. Determine Category Mapping
    let mappedCat = 'other';
    if (selectedCategory === 'fees') {
      mappedCat = 'payment';
    } else if (selectedCategory === 'admissions') {
      mappedCat = 'documents';
    } else {
      // Check keywords in search query
      const lowerQ = searchQuery.toLowerCase();
      if (lowerQ.includes('fee') || lowerQ.includes('pay') || lowerQ.includes('mpesa') || lowerQ.includes('m-pesa')) {
        mappedCat = 'payment';
      } else if (lowerQ.includes('doc') || lowerQ.includes('slip') || lowerQ.includes('cert') || lowerQ.includes('grade') || lowerQ.includes('kcse')) {
        mappedCat = 'documents';
      } else if (lowerQ.includes('error') || lowerQ.includes('bug') || lowerQ.includes('login') || lowerQ.includes('portal')) {
        mappedCat = 'technical';
      }
    }
    setTicketCategory(mappedCat);

    // 3. Determine Message Pre-fill
    let initialMessage = '';
    if (searchQuery.trim()) {
      initialMessage = `Hello Admissions Office,\n\nI was searching the FAQs for "${searchQuery.trim()}" and could not find a complete answer to my question.\n\nCould you please assist me with additional details regarding this inquiry?\n\nThank you.`;
    } else if (selectedCategory !== 'all') {
      const catObj = CATEGORIES.find((c) => c.key === selectedCategory);
      initialMessage = `Hello Admissions Office,\n\nI have a question regarding ${catObj ? catObj.label : 'Borabu TTC admissions'} that wasn't covered in the public FAQs.\n\nKindly provide further assistance.\n\nThank you.`;
    } else {
      initialMessage = `Hello Admissions Office,\n\nI have a question regarding my application to Borabu Teachers Training College.\n\n[Please describe your question or issue in detail here]\n\nThank you.`;
    }
    setTicketMessage(initialMessage);

    setIsModalOpen(true);
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      showToast('Please provide both a subject and inquiry message.', 'error');
      return;
    }

    if (!currentUser && (!guestName.trim() || !guestEmail.trim())) {
      showToast('Please provide your Full Name and Email Address.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const payload: any = {
        subject: ticketSubject.trim(),
        category: ticketCategory,
        message: ticketMessage.trim(),
      };

      if (!currentUser) {
        payload.fullName = guestName.trim();
        payload.email = guestEmail.trim();
        if (guestPhone.trim()) payload.phone = guestPhone.trim();
      }

      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setCreatedTicketId(data.ticketId);
        showToast('Support ticket created successfully! An admissions officer will review it.', 'success');
      } else {
        showToast(data.error || 'Failed to submit support ticket. Please try again.', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
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
        <div style={{ marginBottom: '32px' }}>
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

          {/* Link Below FAQ Search Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '12px',
              padding: '0 4px',
              fontSize: '13px',
              color: '#64748b',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>Can&apos;t find your answer?</span>
              <button
                type="button"
                onClick={handleOpenTicketModal}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'var(--primary-blue, #1d4ed8)',
                  fontWeight: '700',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Open a support ticket 💬
              </button>
            </div>

            {searchQuery.trim() && (
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                Filtered for &ldquo;<strong>{searchQuery}</strong>&rdquo;
              </span>
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
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔍</div>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                No questions matched your search: &ldquo;{searchQuery}&rdquo;
              </p>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', maxWidth: '480px', margin: '0 auto 20px' }}>
                Have a unique query? Our Admissions Office and registry officers are ready to help you directly.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handleOpenTicketModal}
                  className="btn btn-primary"
                  style={{ fontSize: '13px', padding: '9px 18px' }}
                >
                  💬 Open a Support Ticket for &ldquo;{searchQuery}&rdquo;
                </button>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '13px', padding: '9px 18px' }}
                >
                  Reset Filters
                </button>
              </div>
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
              Submit your direct application online today or open a support ticket with our dedicated admissions desk for personalized guidance on qualifications and intake schedules.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
            <button
              onClick={handleOpenTicketModal}
              className="btn btn-secondary"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                borderColor: 'rgba(255,255,255,0.3)',
                padding: '12px 20px',
                cursor: 'pointer',
              }}
            >
              💬 Open Support Ticket
            </button>
          </div>
        </div>

      </div>

      {/* Pre-Populated Support Ticket Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '560px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                background: 'var(--primary-navy, #0b2545)',
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                    Open a Support Ticket
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      background: 'rgba(205, 163, 79, 0.2)',
                      color: 'var(--accent-gold, #cda34f)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: 600,
                    }}
                  >
                    ✨ Pre-populated
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', margin: '4px 0 0' }}>
                  Admissions registry officers will review your inquiry.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
              {createdTicketId ? (
                <div style={{ textAlign: 'center', padding: '24px 8px' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: '#ecfdf5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      margin: '0 auto 16px',
                    }}
                  >
                    ✓
                  </div>
                  <h4 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
                    Support Ticket Submitted!
                  </h4>
                  <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '400px', margin: '0 auto 20px', lineHeight: '1.5' }}>
                    Your support case has been officially logged with the Borabu TTC Admissions & Registry desk.
                  </p>

                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      marginBottom: '24px',
                      display: 'inline-block',
                    }}
                  >
                    Ticket Reference ID: <strong>{createdTicketId}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <Link
                      href="/dashboard/tickets"
                      className="btn btn-primary"
                      style={{ padding: '10px 20px', fontSize: '13px' }}
                    >
                      View in Support Dashboard →
                    </Link>
                    <button
                      onClick={() => {
                        setCreatedTicketId(null);
                        setIsModalOpen(false);
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '10px 18px', fontSize: '13px' }}
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* User Badge / Guest Inputs */}
                  {currentUser ? (
                    <div
                      style={{
                        background: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '13px',
                      }}
                    >
                      <div>
                        <span style={{ color: '#0369a1', fontWeight: 600 }}>Logged in as:</span>{' '}
                        <strong>{currentUser.fullName}</strong> ({currentUser.email})
                      </div>
                      <span style={{ fontSize: '11px', background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>
                        Portal Account
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '12px' }}>Your Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="form-input"
                          style={{ fontSize: '13px', padding: '8px 12px' }}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '12px' }}>Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. john@example.com"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="form-input"
                          style={{ fontSize: '13px', padding: '8px 12px' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Inquiry Category */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Inquiry Category *</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '13px', padding: '8px 12px' }}
                    >
                      <option value="payment">💳 Fees & M-Pesa Payment Validation</option>
                      <option value="documents">📁 KCSE Slip & Document Verification</option>
                      <option value="technical">💻 Portal Technical Help</option>
                      <option value="other">❔ General Admissions Inquiry</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Subject Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="Summarize your question..."
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '13px', padding: '8px 12px' }}
                    />
                  </div>

                  {/* Message */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Detailed Explanation / Question *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Write your question or explain what you need assistance with..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '13px', padding: '10px 12px', resize: 'vertical', lineHeight: '1.5' }}
                    />
                  </div>

                  {/* Footer Actions */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      justifyContent: 'flex-end',
                      borderTop: '1px solid #e2e8f0',
                      paddingTop: '16px',
                      marginTop: '8px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                      style={{ padding: '8px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      {isSubmitting ? 'Submitting Case...' : 'Submit Support Ticket 🚀'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
