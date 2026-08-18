'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Application {
  id: string;
  status: string;
  kcseIndexNo: string;
  kcseMeanGrade: string;
  submittedAt: string | null;
  user: {
    fullName: string;
    email: string;
    phone: string;
  };
  programme: {
    id: string;
    name: string;
    code: string;
  };
  eligibilityResult: any;
}

interface Programme {
  id: string;
  name: string;
  code: string;
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('submitted'); // default to pending submitted queue
  const [progFilter, setProgFilter] = useState('All');

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

  const loadData = async (targetPage = 1) => {
    setLoading(true);
    try {
      // Load programmes on first mount
      if (programmes.length === 0) {
        const progRes = await fetch('/api/programmes');
        if (progRes.ok) {
          const progData = await progRes.json();
          setProgrammes(progData.programmes || []);
        }
      }

      // Construct request url with params
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (progFilter !== 'All') params.append('programmeId', progFilter);
      if (search.trim()) params.append('search', search.trim());
      params.append('page', String(targetPage));
      params.append('limit', String(limit));

      const appRes = await fetch(`/api/applications/admin?${params.toString()}`);
      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData.applications || []);
        
        // Load pagination details
        if (appData.pagination) {
          setPage(appData.pagination.page);
          setTotalPages(appData.pagination.pages);
          setTotalRecords(appData.pagination.total);
        }
      }
    } catch (err) {
      console.error('Failed to load admin queue:', err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch data on filter changes (resets page to 1)
  useEffect(() => {
    setPage(1);
    loadData(1);
  }, [statusFilter, progFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    loadData(newPage);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: 'hsl(210, 16%, 93%)', text: 'var(--text-light)', label: 'Draft' },
      submitted: { bg: 'hsl(38, 92%, 96%)', text: 'var(--accent-gold)', label: 'Submitted (Review)' },
      eligibility_failed: { bg: 'hsl(0, 72%, 97%)', text: 'hsl(0, 72%, 30%)', label: 'Ineligible' },
      rejected: { bg: 'hsl(0, 72%, 97%)', text: 'hsl(0, 72%, 30%)', label: 'Rejected' },
      letter_issued: { bg: 'hsl(142, 70%, 92%)', text: 'hsl(142, 76%, 15%)', label: 'Admitted' },
    };

    const badge = badges[status] || { bg: 'var(--border-light)', text: 'var(--text-light)', label: status };
    return (
      <span style={{ fontSize: '11px', background: badge.bg, color: badge.text, padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
        {badge.label}
      </span>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px' }}>Admissions Registry Queue</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Evaluate applicant profiles and issue digital admission letters.</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '20px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-gold)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>ACTIVE FILTERED</div>
          <h2 style={{ fontSize: '28px', margin: '4px 0 0', color: 'var(--text-dark)' }}>{totalRecords}</h2>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '20px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-teal)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>REGISTRY SERVICE</div>
          <h2 style={{ fontSize: '28px', margin: '4px 0 0', color: 'var(--text-dark)' }}>Online</h2>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '20px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary-blue)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>PAGES TOTAL</div>
          <h2 style={{ fontSize: '28px', margin: '4px 0 0', color: 'var(--text-dark)' }}>{totalPages}</h2>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div 
        style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-light)', 
          padding: '20px', 
          borderRadius: 'var(--radius-lg)', 
          marginBottom: '30px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flexGrow: 1, minWidth: '220px' }}>
            <label className="form-label">Search Applicant</label>
            <input
              type="text"
              placeholder="Name, Index Number, or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ width: '180px' }}>
            <label className="form-label">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="All">All Applications</option>
              <option value="submitted">Submitted (Pending)</option>
              <option value="letter_issued">Admitted (Issued)</option>
              <option value="rejected">Rejected</option>
              <option value="eligibility_failed">Ineligible (Auto-failed)</option>
              <option value="draft">Drafts</option>
            </select>
          </div>

          <div style={{ width: '180px' }}>
            <label className="form-label">Filter by Programme</label>
            <select
              value={progFilter}
              onChange={(e) => setProgFilter(e.target.value)}
              className="form-input"
            >
              <option value="All">All Courses</option>
              {programmes.map((p) => (
                <option key={p.id} value={p.id}>{p.code}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px' }}>
            🔍 Query
          </button>
        </form>
      </div>

      {/* Queue Table */}
      <div 
        style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-light)', 
          borderRadius: 'var(--radius-lg)', 
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-light)' }}>
            Loading queue records...
          </div>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-light)' }}>
            No applications match the search query parameters.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--primary-navy)', color: 'white' }}>
                  <th style={{ padding: '12px 16px' }}>Applicant Name</th>
                  <th style={{ padding: '12px 16px' }}>Course</th>
                  <th style={{ padding: '12px 16px' }}>KCSE Index No.</th>
                  <th style={{ padding: '12px 16px' }}>Mean</th>
                  <th style={{ padding: '12px 16px' }}>Pre-Check</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Submitted Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'var(--transition-fast)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-dark)' }}>
                      {app.user.fullName}
                      <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '400' }}>{app.user.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ color: 'var(--primary-blue)' }}>{app.programme.code}</strong>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: '600' }}>{app.kcseIndexNo || 'N/A'}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '700' }}>{app.kcseMeanGrade || 'N/A'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {app.eligibilityResult?.eligible ? (
                        <span style={{ color: 'var(--accent-teal)', fontWeight: '700' }}>Pass</span>
                      ) : app.status === 'draft' ? (
                        <span style={{ color: 'var(--text-light)' }}>Draft</span>
                      ) : (
                        <span style={{ color: 'hsl(0, 72%, 51%)', fontWeight: '700' }}>Fail</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>{getStatusBadge(app.status)}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-light)' }}>
                      {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      {app.status === 'draft' ? (
                        <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>No Action</span>
                      ) : (
                        <Link 
                          href={`/admin/applications/${app.id}`} 
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '11px', margin: 0 }}
                        >
                          Review File &rarr;
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-main)' }}>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px', margin: 0 }}
                >
                  &larr; Previous Page
                </button>
                <span style={{ fontSize: '12.5px', color: 'var(--text-light)' }}>
                  Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalRecords} records total)
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px', margin: 0 }}
                >
                  Next Page &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
