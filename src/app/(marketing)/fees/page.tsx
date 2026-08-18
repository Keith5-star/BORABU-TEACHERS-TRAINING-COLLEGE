'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toast';

interface FeeRow {
  semester: string;
  tuition: number;
  boarding: number;
  activity: number;
  total: number;
}

export default function FeesPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'DPTE/DECTE' | 'Upgrade Diploma' | 'Certificate ECDE' | 'Short Course'>('DPTE/DECTE');
  
  // Interactive Options
  const [includeBoarding, setIncludeBoarding] = useState(true);
  const [includeActivity, setIncludeActivity] = useState(true);
  const [includeTeachingPracticum, setIncludeTeachingPracticum] = useState(true);
  const [paymentPlan, setPaymentPlan] = useState<'1' | '2' | '3'>('1');
  
  // Payment Simulation state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [simulating, setSimulating] = useState(false);

  const rawFeesData: Record<'DPTE/DECTE' | 'Upgrade Diploma' | 'Certificate ECDE' | 'Short Course', FeeRow[]> = {
    'DPTE/DECTE': [
      { semester: 'Year 1 Term 1', tuition: 18500, boarding: 12000, activity: 2500, total: 33000 },
      { semester: 'Year 1 Term 2', tuition: 16500, boarding: 12000, activity: 1000, total: 29500 },
      { semester: 'Year 1 Term 3', tuition: 16500, boarding: 12000, activity: 1000, total: 29500 },
      { semester: 'Year 2 Term 1 (TP Practicum 1)', tuition: 18500, boarding: 12000, activity: 3500, total: 34000 },
      { semester: 'Year 2 Term 2', tuition: 16500, boarding: 12000, activity: 1000, total: 29500 },
      { semester: 'Year 2 Term 3 (TP Practicum 2)', tuition: 18500, boarding: 12000, activity: 3500, total: 34000 },
      { semester: 'Year 3 Term 1', tuition: 18500, boarding: 12000, activity: 2000, total: 32500 },
      { semester: 'Year 3 Term 2 (Final Practicum)', tuition: 18500, boarding: 12000, activity: 3500, total: 34000 },
      { semester: 'Year 3 Term 3 (KNEC Assessments)', tuition: 16500, boarding: 12000, activity: 2500, total: 31000 },
    ],
    'Upgrade Diploma': [
      { semester: 'Term 1 (Holiday Module)', tuition: 16000, boarding: 6000, activity: 1500, total: 23500 },
      { semester: 'Term 2 (Holiday Module)', tuition: 16000, boarding: 6000, activity: 1000, total: 23000 },
      { semester: 'Term 3 (Teaching Practicum)', tuition: 18000, boarding: 6000, activity: 2500, total: 26500 },
      { semester: 'Term 4 (KNEC Evaluation)', tuition: 16000, boarding: 6000, activity: 1500, total: 23500 },
    ],
    'Certificate ECDE': [
      { semester: 'Year 1 Term 1', tuition: 14000, boarding: 11000, activity: 2000, total: 27000 },
      { semester: 'Year 1 Term 2', tuition: 12500, boarding: 11000, activity: 1000, total: 24500 },
      { semester: 'Year 1 Term 3', tuition: 12500, boarding: 11000, activity: 1000, total: 24500 },
      { semester: 'Year 2 Term 1 (Teaching Practicum)', tuition: 15000, boarding: 11000, activity: 2500, total: 28500 },
      { semester: 'Year 2 Term 2', tuition: 12500, boarding: 11000, activity: 1000, total: 24500 },
      { semester: 'Year 2 Term 3 (KNEC Exam)', tuition: 12500, boarding: 11000, activity: 2000, total: 25500 },
    ],
    'Short Course': [
      { semester: 'Module 1: CBC & Formative Assessment', tuition: 8000, boarding: 0, activity: 1000, total: 9000 },
      { semester: 'Module 2: Digital Tools & Media', tuition: 8000, boarding: 0, activity: 1000, total: 9000 },
    ],
  };

  const getCourseName = (code: string) => {
    if (code === 'DPTE/DECTE') return 'Diploma in Primary / Early Childhood Teacher Education';
    if (code === 'Upgrade Diploma') return 'Upgrade Diploma in Teacher Education (UDPTE / UDECTE)';
    if (code === 'Certificate ECDE') return 'Certificate in Early Childhood Development Education';
    return 'CBC Continuous Professional Development & Short Courses';
  };

  // Compute values dynamically based on selections
  const processFees = (rows: FeeRow[]) => {
    return rows.map((row) => {
      const boardingVal = (includeBoarding && activeTab !== 'Short Course') ? row.boarding : 0;
      const activityVal = (includeActivity || activeTab === 'Short Course') ? row.activity : 0;
      const tpVal = (includeTeachingPracticum && row.semester.includes('Practicum')) ? 2000 : 0;
      
      const newTotal = row.tuition + boardingVal + activityVal + tpVal;
      return {
        ...row,
        boarding: boardingVal,
        activity: activityVal,
        total: newTotal,
      };
    });
  };

  const currentFees = processFees(rawFeesData[activeTab]);
  const currentSemTotal = currentFees[0]?.total || 0;
  const grandTotal = currentFees.reduce((acc, row) => acc + row.total, 0);

  const getInstallments = () => {
    if (paymentPlan === '1') {
      return [{ installment: 'Full Term Fee', amount: currentSemTotal, pct: 100, due: 'Upon Reporting' }];
    } else if (paymentPlan === '2') {
      return [
        { installment: '1st Installment (60%)', amount: currentSemTotal * 0.6, pct: 60, due: 'Upon Reporting' },
        { installment: '2nd Installment (40%)', amount: currentSemTotal * 0.4, pct: 40, due: 'Mid-Term' },
      ];
    } else {
      return [
        { installment: '1st Installment (50%)', amount: currentSemTotal * 0.5, pct: 50, due: 'Upon Reporting' },
        { installment: '2nd Installment (30%)', amount: currentSemTotal * 0.3, pct: 30, due: 'Mid-Term' },
        { installment: '3rd Installment (20%)', amount: currentSemTotal * 0.2, pct: 20, due: 'Before Exams' },
      ];
    }
  };

  const handleMpesaSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }

    if (!/^(?:254|\+254|0)?(7|1)\d{8}$/.test(phoneNumber)) {
      showToast('Please enter a valid Kenyan Safaricom phone number (e.g. 0712345678).', 'error');
      return;
    }

    setSimulating(true);
    showToast(`Initiating secure M-Pesa STK Push of KES ${getInstallments()[0].amount.toLocaleString()} to ${phoneNumber}...`, 'info');

    setTimeout(() => {
      showToast('STK Prompt sent! Please enter M-Pesa PIN on your phone to complete.', 'success');
      
      setTimeout(() => {
        const receiptCode = 'MPESA' + Math.random().toString(36).substring(2, 8).toUpperCase();
        showToast(`Payment Confirmed! Ref: ${receiptCode}. Your trainee fee statement has been updated.`, 'success');
        setSimulating(false);
        setPhoneNumber('');
      }, 4000);
    }, 2500);
  };

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <header className="section-header">
        <span className="section-tag">Financial Information</span>
        <h1 className="section-title">Teacher Trainee Fee Structures</h1>
        <p className="section-desc">
          Borabu Teachers Training College maintains approved Ministry of Education fee structures with flexible installment schedules. Use the interactive planner to estimate tuition, boarding, and teaching practicum costs.
        </p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '35px', flexWrap: 'wrap' }}>
        {(['DPTE/DECTE', 'Upgrade Diploma', 'Certificate ECDE', 'Short Course'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '10px 20px' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Column: Fees Table */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '4px', color: 'var(--text-dark)' }}>
            {getCourseName(activeTab)}
          </h3>
          <p style={{ color: 'var(--text-light)', fontSize: '13px', marginBottom: '20px' }}>
            * Values are in Kenya Shillings (KES) and dynamically adjusted by options selected on the right.
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--primary-navy)', color: 'white' }}>
                  <th style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm) 0 0 0' }}>Term / Module</th>
                  <th style={{ padding: '12px 16px' }}>Tuition (KES)</th>
                  <th style={{ padding: '12px 16px' }}>Boarding & Meals</th>
                  <th style={{ padding: '12px 16px' }}>Activity & TP</th>
                  <th style={{ padding: '12px 16px', borderRadius: '0 var(--radius-sm) 0 0' }}>Total (KES)</th>
                </tr>
              </thead>
              <tbody>
                {currentFees.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)', background: idx % 2 === 0 ? 'transparent' : 'rgba(148, 163, 184, 0.05)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{row.semester}</td>
                    <td style={{ padding: '12px 16px' }}>{row.tuition.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px' }}>{row.boarding.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px' }}>{row.activity.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-dark)' }}>{row.total.toLocaleString()}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: '2px solid var(--primary-blue)', background: 'var(--primary-light)', fontWeight: '800' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--primary-blue)' }} colSpan={4}>Accumulated Programme Total:</td>
                  <td style={{ padding: '14px 16px', color: 'var(--primary-blue)', fontSize: '15px' }}>{grandTotal.toLocaleString()} KES</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--text-dark)', marginBottom: '8px' }}>Official College Bank Accounts</h4>
            <div style={{ fontSize: '13px', color: 'var(--text-main)', background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', lineHeight: '1.6' }}>
              <strong>💳 KCB Bank, Nyamira Branch:</strong> Account Name: <code>Borabu Teachers Training College</code> | Account Number: <code>1259559858</code> <br />
              <strong>📱 M-Pesa Paybill:</strong> Business No: <code>889955</code> | Account: <code>[Trainee Name or Admission No]</code>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Planner Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--text-dark)' }}>Interactive Budget Planner</h3>
            
            {/* Options Checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={includeBoarding} 
                  onChange={(e) => setIncludeBoarding(e.target.checked)} 
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span>Include College Hostel & Catering (Boarding)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={includeActivity} 
                  onChange={(e) => setIncludeActivity(e.target.checked)} 
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span>Include Activity & KTTCA Sports Fees</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={includeTeachingPracticum} 
                  onChange={(e) => setIncludeTeachingPracticum(e.target.checked)} 
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span>Include Teaching Practice Moderation Assessment</span>
              </label>
            </div>

            {/* Installment Plan Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontSize: '13px' }}>Select Installment Payment Option</label>
              <select
                value={paymentPlan}
                onChange={(e) => setPaymentPlan(e.target.value as '1' | '2' | '3')}
                className="form-input"
                style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)' }}
              >
                <option value="1">Full Term Payment (100% on reporting)</option>
                <option value="2">2 Installments (60% / 40%)</option>
                <option value="3">3 Installments (50% / 30% / 20%)</option>
              </select>
            </div>

            {/* Summary details */}
            <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span>First Term Total:</span>
                <strong style={{ color: 'var(--text-dark)' }}>{currentSemTotal.toLocaleString()} KES</strong>
              </div>
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-light)', display: 'block', marginBottom: '6px' }}>
                  Installment Schedule Breakdown:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {getInstallments().map((inst, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-light)' }}>{inst.installment}:</span>
                      <strong style={{ color: 'var(--primary-blue)' }}>{Math.round(inst.amount).toLocaleString()} KES ({inst.due})</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mpesa Simulator */}
            <form onSubmit={handleMpesaSimulation} style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '10px', color: 'var(--text-dark)' }}>Simulate M-Pesa STK Payment</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-light)', marginBottom: '12px' }}>
                Simulate paying your first term fees directly to the Borabu TTC Safaricom Paybill.
              </p>
              
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <input 
                  type="text"
                  placeholder="e.g. 0712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="form-input"
                  disabled={simulating}
                  style={{ textAlign: 'center', letterSpacing: '0.5px' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={simulating}
                style={{ width: '100%', padding: '10px', fontSize: '13px' }}
              >
                {simulating ? 'Processing Transaction...' : `Pay Term 1 KES ${Math.round(getInstallments()[0].amount).toLocaleString()} via M-Pesa`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
