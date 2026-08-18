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
  const [activeTab, setActiveTab] = useState<'Diploma' | 'Certificate' | 'Artisan' | 'Short Course'>('Diploma');
  
  // Interactive Options
  const [includeBoarding, setIncludeBoarding] = useState(true);
  const [includeActivity, setIncludeActivity] = useState(true);
  const [includeUniform, setIncludeUniform] = useState(true);
  const [paymentPlan, setPaymentPlan] = useState<'1' | '2' | '3'>('1');
  
  // Payment Simulation state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [simulating, setSimulating] = useState(false);

  const rawFeesData: Record<'Diploma' | 'Certificate' | 'Artisan' | 'Short Course', FeeRow[]> = {
    Diploma: [
      { semester: 'Year 1 Term 1', tuition: 33595, boarding: 15000, activity: 4300, total: 52895 },
      { semester: 'Year 1 Term 2', tuition: 33594, boarding: 15000, activity: 0, total: 48594 },
      { semester: 'Year 2 Term 1', tuition: 33595, boarding: 15000, activity: 0, total: 48595 },
      { semester: 'Year 2 Term 2', tuition: 33594, boarding: 15000, activity: 0, total: 48594 },
      { semester: 'Year 3 Term 1', tuition: 33595, boarding: 15000, activity: 0, total: 48595 },
      { semester: 'Year 3 Term 2', tuition: 33594, boarding: 15000, activity: 0, total: 48594 },
    ],
    Certificate: [
      { semester: 'Year 1 Term 1', tuition: 33595, boarding: 15000, activity: 4300, total: 52895 },
      { semester: 'Year 1 Term 2', tuition: 33594, boarding: 15000, activity: 0, total: 48594 },
      { semester: 'Year 2 Term 1', tuition: 33595, boarding: 15000, activity: 0, total: 48595 },
      { semester: 'Year 2 Term 2', tuition: 33594, boarding: 15000, activity: 0, total: 48594 },
    ],
    Artisan: [
      { semester: 'Year 1 Term 1', tuition: 33595, boarding: 15000, activity: 4300, total: 52895 },
      { semester: 'Year 1 Term 2', tuition: 33594, boarding: 15000, activity: 0, total: 48594 },
    ],
    'Short Course': [
      { semester: 'Term 1 (3 Months)', tuition: 4600, boarding: 0, activity: 800, total: 5400 },
    ],
  };

  const getCourseName = (code: string) => {
    if (code === 'Diploma') return 'Standard Diploma Programmes';
    if (code === 'Certificate') return 'Standard Certificate Programmes';
    if (code === 'Artisan') return 'Standard Artisan Programmes';
    return 'Short Course / Computer Packages';
  };

  // Compute values dynamically based on selections
  const processFees = (rows: FeeRow[]) => {
    return rows.map((row, idx) => {
      const boardingVal = (includeBoarding && activeTab !== 'Short Course') ? 15000 : 0;
      const activityVal = (includeActivity || activeTab === 'Short Course') ? row.activity : 0;
      const uniformVal = (includeUniform && idx === 0 && activeTab !== 'Short Course') ? 5000 : 0;
      
      const newTotal = row.tuition + boardingVal + activityVal + uniformVal;
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
      return [{ installment: 'Full Semester Fee', amount: currentSemTotal, pct: 100, due: 'Upon Reporting' }];
    } else if (paymentPlan === '2') {
      return [
        { installment: '1st Installment (60%)', amount: currentSemTotal * 0.6, pct: 60, due: 'Upon Reporting' },
        { installment: '2nd Installment (40%)', amount: currentSemTotal * 0.4, pct: 40, due: 'Before Exams' },
      ];
    } else {
      return [
        { installment: '1st Installment (50%)', amount: currentSemTotal * 0.5, pct: 50, due: 'Upon Reporting' },
        { installment: '2nd Installment (30%)', amount: currentSemTotal * 0.3, pct: 30, due: 'Mid-Semester' },
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

    // Simulate standard M-pesa responses
    setTimeout(() => {
      showToast('STK Prompt sent! Please enter M-Pesa PIN on your phone to complete.', 'success');
      
      setTimeout(() => {
        const receiptCode = 'MPESA' + Math.random().toString(36).substring(2, 8).toUpperCase();
        showToast(`Payment Confirmed! Ref: ${receiptCode}. Your account statement is updated.`, 'success');
        setSimulating(false);
        setPhoneNumber('');
      }, 4000);
    }, 2500);
  };

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <header className="section-header">
        <span className="section-tag">Financial Plan</span>
        <h1 className="section-title">Tuition & Accommodation Fees</h1>
        <p className="section-desc">
          We maintain transparent cost schedules to help students and sponsors manage tuition expenses. Use our interactive estimator to calculate flexible budgets.
        </p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '35px' }}>
        {(['Diploma', 'Certificate', 'Artisan', 'Short Course'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '10px 24px' }}
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
            * Values are estimated in Kenya Shillings (KES) and dynamically adjusted below.
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--primary-navy)', color: 'white' }}>
                  <th style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm) 0 0 0' }}>Term / Semester</th>
                  <th style={{ padding: '12px 16px' }}>Tuition (KES)</th>
                  <th style={{ padding: '12px 16px' }}>Boarding & Admin</th>
                  <th style={{ padding: '12px 16px' }}>Activity & Ext.</th>
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
                  <td style={{ padding: '14px 16px', color: 'var(--primary-blue)' }} colSpan={4}>Accumulated Program Total:</td>
                  <td style={{ padding: '14px 16px', color: 'var(--primary-blue)', fontSize: '15px' }}>{grandTotal.toLocaleString()} KES</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--text-dark)', marginBottom: '8px' }}>Official Payment Channels</h4>
            <div style={{ fontSize: '13px', color: 'var(--text-main)', background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', lineHeight: '1.6' }}>
              <strong>💳 KCB Bank, Nyamira Branch:</strong> Account Name: <code>Borabu Technical Training Institute</code> | Account Number: <code>1259559858</code> <br />
              <strong>📱 M-Pesa Paybill:</strong> Business No: <code>889955</code> | Account: <code>[Student Name/Index]</code>
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
                <span>Include Boarding/Hostel (+15,000 KES/sem)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={includeActivity} 
                  onChange={(e) => setIncludeActivity(e.target.checked)} 
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span>Include Activities & Exams (+3,000 KES/sem)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={includeUniform} 
                  onChange={(e) => setIncludeUniform(e.target.checked)} 
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span>Include Uniform & Gear (+5,000 KES one-off)</span>
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
                <span>First Semester Total:</span>
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
                Simulate paying your first installment using safaricom mobile money directly to the college Paybill portal.
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
                {simulating ? 'Processing Transaction...' : `Pay First Term KES ${Math.round(getInstallments()[0].amount).toLocaleString()} via M-Pesa`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
