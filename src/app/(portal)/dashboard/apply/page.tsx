'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Programme {
  id: string;
  name: string;
  code: string;
  level: string;
  duration: string;
  intakePeriod?: string;
  minGradeRequirement?: {
    meanGrade: string;
    subjects?: Record<string, string>;
  };
}

export default function ApplyPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startingId, setStartingId] = useState<string | null>(null);
  const router = useRouter();

  const loadProgrammes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/programmes', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProgrammes(data.programmes || []);
      } else {
        setError('Unable to load courses from the registry. Please click Refresh.');
      }
    } catch (err: any) {
      console.error('Failed to load programmes:', err);
      setError('Network error while fetching programmes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgrammes();
  }, []);

  const handleStartApplication = async (programmeId: string) => {
    setError('');
    setStartingId(programmeId);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers,
        body: JSON.stringify({ programmeId }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.push('/login?redirect=/dashboard/apply');
        return;
      }

      if (res.ok || res.status === 409) {
        // Redirect to application wizard (if 409, we already have an active application file, redirect to it)
        const id = data.applicationId;
        if (id) {
          router.push(`/dashboard/apply/${id}`);
        } else {
          setError(data.error || 'You have an active application file.');
        }
      } else {
        setError(data.error || 'Failed to initialize application draft.');
      }
    } catch (err: any) {
      console.error('Failed to start application:', err);
      setError(err?.message || 'An error occurred. Please try again.');
    } finally {
      setStartingId(null);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: 'var(--text-dark)', fontWeight: 700 }}>Select a Programme of Study</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>
            Choose an accredited teacher education course to begin your application file.
          </p>
        </div>
        <button
          onClick={loadProgrammes}
          className="btn btn-secondary"
          style={{ fontSize: '13px', padding: '8px 16px' }}
        >
          🔄 Refresh Courses
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
          <div>⚠️ {error}</div>
        </div>
      )}

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          background: 'var(--bg-card)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <div style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: '16px' }}>Loading Available College Courses...</div>
          <p style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: '6px' }}>Retrieving ministry accredited programmes from the admissions registry.</p>
        </div>
      ) : programmes.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          background: 'var(--bg-card)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📚</div>
          <h3 style={{ fontSize: '18px', color: 'var(--text-dark)', marginBottom: '8px' }}>No Courses Currently Found</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', maxWidth: '450px', margin: '0 auto 20px' }}>
            Click below to initialize and synchronize available teacher training programmes.
          </p>
          <button onClick={loadProgrammes} className="btn btn-primary" style={{ padding: '10px 24px' }}>
            Synchronize Courses
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {programmes.map((prog) => {
            const minGrade = prog.minGradeRequirement?.meanGrade || 'C (Plain)';
            const intake = prog.intakePeriod || 'September 2026 Intake';
            const isStarting = startingId === prog.id;

            return (
              <div 
                key={prog.id}
                style={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 200px',
                  gap: '24px',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      background: 'var(--primary-light)', 
                      color: 'var(--primary-blue)', 
                      padding: '3px 10px', 
                      borderRadius: '12px', 
                      fontWeight: '700', 
                      textTransform: 'uppercase' 
                    }}>
                      {prog.level}
                    </span>
                    <span style={{ 
                      fontSize: '11px', 
                      background: '#f1f5f9', 
                      color: '#475569', 
                      padding: '3px 10px', 
                      borderRadius: '12px', 
                      fontWeight: '600' 
                    }}>
                      Code: {prog.code}
                    </span>
                    <span style={{ 
                      fontSize: '11px', 
                      background: '#ecfdf5', 
                      color: '#059669', 
                      padding: '3px 10px', 
                      borderRadius: '12px', 
                      fontWeight: '600' 
                    }}>
                      {intake}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '19px', color: 'var(--text-dark)', fontWeight: 700, margin: '4px 0 8px' }}>
                    {prog.name}
                  </h3>

                  <p style={{ fontSize: '13px', color: 'var(--text-light)', margin: '0 0 12px' }}>
                    Duration: <strong style={{ color: 'var(--text-dark)' }}>{prog.duration}</strong> | Ministry of Education Accredited
                  </p>

                  <div style={{ 
                    padding: '8px 12px', 
                    background: '#f8fafc', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid #e2e8f0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px', 
                    color: 'var(--text-main)' 
                  }}>
                    <span>🎓 Minimum Entry Requirement:</span>
                    <strong style={{ color: 'var(--primary-navy)' }}>Mean Grade {minGrade}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => handleStartApplication(prog.id)} 
                    disabled={isStarting}
                    className="btn btn-primary"
                    style={{ 
                      width: '100%', 
                      padding: '12px 18px', 
                      fontWeight: 600,
                      fontSize: '14px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {isStarting ? 'Starting...' : 'Start Application →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
