'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must contain both letters and numbers.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please check your inputs.');
        setLoading(false);
        return;
      }

      // Save token for iframe resilience
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token);
      }

      // Success
      router.refresh();
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration submit error:', err);
      setError(err?.message || 'A network error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', padding: '20px' }}>
      <div className="form-card" style={{ margin: '0', maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <div className="logo-icon" style={{ width: '36px', height: '36px', fontSize: '16px' }}>B</div>
            <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-dark)' }}>BORABU TEACHERS TRAINING COLLEGE</span>
          </Link>
        </div>

        <h1 className="form-title" style={{ fontSize: '24px' }}>Create Applicant Account</h1>
        <p className="form-subtitle">Register to begin your online application process.</p>

        {error && (
          <div className="alert alert-danger" style={{ padding: '12px 16px', fontSize: '13px' }}>
            <div>⚠️ {error}</div>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Kevin Omwamba"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. kevin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="e.g. +254711223344"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-grid" style={{ marginBottom: '0' }}>
            <div className="form-group">
              <label className="form-label">Password * (min 8 chars)</label>
              <input
                type="password"
                required
                placeholder="Min 8 chars (letters & digits)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            {loading ? 'Creating account...' : 'Register & Start Application'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-light)' }}>
          Already have an account?{' '}
          <Link href="/login" className="form-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
