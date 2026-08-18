'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

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
  feesStructure: any[];
}

function ProgrammesCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [filterLevel, setFilterLevel] = useState(searchParams.get('level') || 'All');
  const [loading, setLoading] = useState(true);

  // Sync state values if query params change externally
  useEffect(() => {
    setSearch(searchParams.get('q') || '');
    setFilterLevel(searchParams.get('level') || 'All');
  }, [searchParams]);

  useEffect(() => {
    async function loadProgrammes() {
      try {
        const res = await fetch('/api/programmes');
        if (res.ok) {
          const data = await res.json();
          setProgrammes(data.programmes);
        }
      } catch (err) {
        console.error('Failed to load programs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProgrammes();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateUrlParams(value, filterLevel);
  };

  const handleLevelChange = (value: string) => {
    setFilterLevel(value);
    updateUrlParams(search, value);
  };

  const updateUrlParams = (query: string, level: string) => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (level !== 'All') params.set('level', level);

    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const filtered = programmes.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = filterLevel === 'All' || p.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <header className="section-header">
        <span className="section-tag">Academic Programs</span>
        <h1 className="section-title">Explore Our Accredited Courses</h1>
        <p className="section-desc">
          We offer high-quality technical, vocational, and artisan programs accredited by the Ministry of Education, TVETA, and CDACC.
        </p>
      </header>

      {/* Filter and Search Panel */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '40px', 
          flexWrap: 'wrap', 
          background: 'var(--bg-card)', 
          padding: '20px', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-light)' 
        }}
      >
        <div style={{ flexGrow: 1, minWidth: '280px' }}>
          <label className="form-label">Search Courses</label>
          <input 
            type="text" 
            placeholder="Search by program name or code (e.g. ICT, Electrical, Business)..." 
            value={search} 
            onChange={(e) => handleSearchChange(e.target.value)} 
            className="form-input"
          />
        </div>
        <div style={{ width: '180px' }}>
          <label className="form-label">Filter by Level</label>
          <select 
            value={filterLevel} 
            onChange={(e) => handleLevelChange(e.target.value)} 
            className="form-input"
          >
            <option value="All">All Levels</option>
            <option value="Diploma">Diploma Courses</option>
            <option value="Certificate">Certificate Courses</option>
            <option value="Artisan">Artisan Courses</option>
            <option value="Short Course">Short Courses</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
          Loading courses catalog...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
          No courses match your criteria. Try adjusting filters or search query.
        </div>
      ) : (
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
          {filtered.map((prog) => (
            <div key={prog.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', background: 'var(--primary-light)', color: 'var(--primary-blue)', padding: '4px 10px', borderRadius: '20px', fontWeight: '700', textTransform: 'uppercase' }}>
                  {prog.level}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>
                  Code: <strong>{prog.code}</strong>
                </span>
              </div>
              
              <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--text-dark)' }}>{prog.name}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '13px', color: 'var(--text-light)' }}>
                <div>⏰ <strong>Duration:</strong> {prog.duration}</div>
                <div>📅 <strong>Intake:</strong> {prog.intakePeriod}</div>
                <div>👥 <strong>Capacity:</strong> {prog.intakeCapacity} Students</div>
              </div>

              {/* Requirement highlights */}
              <div 
                style={{ 
                  background: 'var(--bg-main)', 
                  padding: '16px', 
                  borderRadius: 'var(--radius-md)', 
                  fontSize: '13px', 
                  marginBottom: '20px',
                  border: '1px dashed var(--border-light)',
                  flexGrow: 1
                }}
              >
                <div style={{ fontWeight: '700', color: 'var(--text-dark)', marginBottom: '8px' }}>Minimum Requirements:</div>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>KCSE Mean Grade: <strong>{prog.minGradeRequirement.meanGrade}</strong></li>
                  {Object.entries(prog.minGradeRequirement.subjects).map(([sub, grade]) => (
                    <li key={sub} style={{ textTransform: 'capitalize' }}>
                      {sub}: <strong>{grade as string}</strong> or above
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                <Link href={`/fees`} className="btn btn-secondary" style={{ flexGrow: 1, padding: '10px 0' }}>
                  View Fees
                </Link>
                <Link href={`/register`} className="btn btn-primary" style={{ flexGrow: 1, padding: '10px 0' }}>
                  Apply Online
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProgrammesPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-light)' }}>
        Loading programmes catalog view...
      </div>
    }>
      <ProgrammesCatalog />
    </Suspense>
  );
}

