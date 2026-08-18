'use client';

import { useEffect, useState } from 'react';

interface Requirement {
  meanGrade: string;
  subjects: Record<string, string>;
}

interface Programme {
  id: string;
  name: string;
  code: string;
  level: string;
  duration: string;
  minGradeRequirement: Requirement;
  intakeCapacity: number;
  intakePeriod: string;
  isActive: boolean;
}

export default function AdminRulesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [selectedProg, setSelectedProg] = useState<Programme | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Editable states
  const [name, setName] = useState('');
  const [intakeCapacity, setIntakeCapacity] = useState(100);
  const [intakePeriod, setIntakePeriod] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [meanGrade, setMeanGrade] = useState('C');
  const [subjectGrades, setSubjectGrades] = useState<Record<string, string>>({});

  const GRADE_OPTIONS = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];

  const loadProgrammes = async () => {
    try {
      const res = await fetch('/api/programmes');
      if (res.ok) {
        const data = await res.json();
        setProgrammes(data.programmes || []);
        if (data.programmes?.length > 0) {
          selectProgramme(data.programmes[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load rules programmes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgrammes();
  }, []);

  const selectProgramme = (prog: Programme) => {
    setSelectedProg(prog);
    setName(prog.name);
    setIntakeCapacity(prog.intakeCapacity);
    setIntakePeriod(prog.intakePeriod);
    setIsActive(prog.isActive);
    setMeanGrade(prog.minGradeRequirement.meanGrade);
    setSubjectGrades(prog.minGradeRequirement.subjects || {});
    setSuccess('');
    setError('');
  };

  const handleSubjectRequirementChange = (subject: string, grade: string) => {
    setSubjectGrades({ ...subjectGrades, [subject]: grade });
  };

  const handleSaveRules = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProg) return;

    setSaving(true);
    setSuccess('');
    setError('');

    const minGradeRequirement = {
      meanGrade,
      subjects: subjectGrades,
    };

    try {
      const res = await fetch(`/api/programmes/${selectedProg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          intakeCapacity,
          intakePeriod,
          isActive,
          minGradeRequirement,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update rules.');
      }

      setSuccess('Entry criteria and capacity rules updated successfully!');
      
      // Refresh list to keep sync
      const updatedList = programmes.map((p) => {
        if (p.id === selectedProg.id) {
          return {
            ...p,
            name,
            intakeCapacity,
            intakePeriod,
            isActive,
            minGradeRequirement,
          };
        }
        return p;
      });
      setProgrammes(updatedList);
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving rules.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        Loading program configurations...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px' }}>Admissions Entry Criteria Editor</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Update minimum KCSE qualifications and intake capacities for active programs.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '30px', alignItems: 'start' }}>
        {/* Left Side: Select course tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)', padding: '6px' }}>Select Course</div>
          {programmes.map((p) => (
            <button
              key={p.id}
              onClick={() => selectProgramme(p)}
              className="btn"
              style={{
                justifyContent: 'flex-start',
                padding: '12px 14px',
                fontSize: '13px',
                borderColor: selectedProg?.id === p.id ? 'var(--primary-blue)' : 'var(--border-light)',
                background: selectedProg?.id === p.id ? 'var(--primary-light)' : 'transparent',
                color: selectedProg?.id === p.id ? 'var(--primary-blue)' : 'var(--text-dark)',
              }}
            >
              📖 {p.code} Criteria
            </button>
          ))}
        </div>

        {/* Right Side: Configuration form */}
        {selectedProg && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--text-dark)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Settings for: {selectedProg.code}
              <span style={{ fontSize: '11px', background: isActive ? 'hsl(142, 70%, 92%)' : 'hsl(0, 72%, 95%)', color: isActive ? 'hsl(142, 76%, 15%)' : 'hsl(0, 72%, 25%)', padding: '3px 8px', borderRadius: '4px' }}>
                {isActive ? 'Active' : 'Closed'}
              </span>
            </h3>

            {success && (
              <div className="alert alert-success" style={{ padding: '12px 16px', fontSize: '13px' }}>
                <div>✓ {success}</div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger" style={{ padding: '12px 16px', fontSize: '13px' }}>
                <div>⚠️ {error}</div>
              </div>
            )}

            <form onSubmit={handleSaveRules} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="form-label">Full Programme Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-grid">
                <div>
                  <label className="form-label">Intake Capacity (Students)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={intakeCapacity}
                    onChange={(e) => setIntakeCapacity(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Intake Period</label>
                  <input
                    type="text"
                    required
                    value={intakePeriod}
                    onChange={(e) => setIntakePeriod(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="isActive" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                  Accept Online Applications for this Course
                </label>
              </div>

              {/* Requirements */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '15px', color: 'var(--text-dark)', marginBottom: '14px' }}>🛡️ Minimum Grade Requirements</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontSize: '13px' }}>KCSE Minimum Mean Grade</span>
                    <select
                      value={meanGrade}
                      onChange={(e) => setMeanGrade(e.target.value)}
                      className="form-input"
                      style={{ fontWeight: '700' }}
                    >
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {Object.entries(subjectGrades).map(([subject, val]) => (
                    <div key={subject} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', alignItems: 'center', gap: '20px', borderTop: '1px solid var(--bg-main)', paddingTop: '10px' }}>
                      <span style={{ fontSize: '13px', textTransform: 'capitalize' }}>Minimum Grade in {subject}</span>
                      <select
                        value={val}
                        onChange={(e) => handleSubjectRequirementChange(subject, e.target.value)}
                        className="form-input"
                      >
                        {GRADE_OPTIONS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                {saving ? 'Saving changes...' : 'Save Configuration Rules'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
