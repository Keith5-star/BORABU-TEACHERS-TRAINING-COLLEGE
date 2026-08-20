'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  getDetailedRequirementBreakdown,
  GRADE_VALUES,
} from '@/lib/eligibility';

interface GradeRequirementBreakdownProps {
  programmeName: string;
  programmeCode: string;
  minGradeRequirement: any;
  kcseMeanGrade: string;
  subjectGrades: Record<string, string>;
  applicationStatus?: string;
  showCardWrapper?: boolean;
}

export default function GradeRequirementBreakdown({
  programmeName,
  programmeCode,
  minGradeRequirement,
  kcseMeanGrade,
  subjectGrades,
  showCardWrapper = true,
}: GradeRequirementBreakdownProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const breakdown = getDetailedRequirementBreakdown(
    minGradeRequirement,
    kcseMeanGrade,
    subjectGrades
  );

  const { overallEligible, items, summary } = breakdown;

  const hasGrades = Boolean(kcseMeanGrade || (subjectGrades && Object.keys(subjectGrades).length > 0));

  if (!hasGrades && items.length === 0) {
    return null;
  }

  // Calculate dynamic cumulative percentage of requirements met
  const totalCriteria = summary.totalRequired || items.length || 1;
  const passedCriteria = summary.passedCount;
  const cumulativePercentage = Math.min(100, Math.max(0, Math.round((passedCriteria / totalCriteria) * 100)));

  // Subject-only sub calculation (excluding mean grade if present)
  const subjectItems = items.filter((i) => !i.isMeanGrade);
  const subjectTotal = subjectItems.length;
  const subjectPassed = subjectItems.filter((i) => i.status === 'passed').length;
  const subjectPercentage = subjectTotal > 0 ? Math.round((subjectPassed / subjectTotal) * 100) : cumulativePercentage;

  // Determine indicator color theme based on cumulative percentage
  const getProgressColor = (pct: number) => {
    if (pct === 100) return { bar: 'linear-gradient(90deg, #10b981, #059669)', text: '#059669', bg: '#ecfdf5', border: '#a7f3d0' };
    if (pct >= 75) return { bar: 'linear-gradient(90deg, #0d9488, #059669)', text: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' };
    if (pct >= 50) return { bar: 'linear-gradient(90deg, #f59e0b, #d97706)', text: '#d97706', bg: '#fffbeb', border: '#fde68a' };
    return { bar: 'linear-gradient(90deg, #ef4444, #dc2626)', text: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
  };

  const progressTheme = getProgressColor(cumulativePercentage);

  const content = (
    <div className="grade-breakdown-container">
      {/* Header & Status Ribbon */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: '18px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'var(--primary-light)',
                color: 'var(--primary-blue)',
              }}
            >
              Academic Eligibility Matrix
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
              Course Code: <strong>{programmeCode || 'BTTC'}</strong>
            </span>
          </div>
          <h4
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: 'var(--text-dark)',
              marginTop: '4px',
              marginBottom: '2px',
            }}
          >
            Subject Grades vs. Minimum Entry Criteria
          </h4>
        </div>

        {/* Overall Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {overallEligible ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'hsl(142, 70%, 94%)',
                color: 'hsl(142, 76%, 20%)',
                border: '1px solid hsl(142, 70%, 80%)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: '700',
              }}
            >
              <span style={{ fontSize: '14px' }}>✓</span>
              <span>100% Met ({summary.passedCount}/{summary.totalRequired})</span>
            </div>
          ) : (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: progressTheme.bg,
                color: progressTheme.text,
                border: `1px solid ${progressTheme.border}`,
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: '700',
              }}
            >
              <span style={{ fontSize: '13px' }}>{cumulativePercentage >= 50 ? '⏳' : '✕'}</span>
              <span>
                {cumulativePercentage}% Requirements Met ({summary.passedCount}/{summary.totalRequired})
              </span>
            </div>
          )}

          {/* Toggle View Mode on Desktop */}
          <div
            style={{
              display: 'none',
              background: 'var(--bg-main)',
              borderRadius: '8px',
              padding: '2px',
              border: '1px solid var(--border-light)',
            }}
            className="md-flex-toggle"
          >
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              style={{
                border: 'none',
                background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                color: viewMode === 'grid' ? 'var(--primary-blue)' : 'var(--text-light)',
                fontWeight: viewMode === 'grid' ? '700' : '500',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11.5px',
                cursor: 'pointer',
                boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                border: 'none',
                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? 'var(--primary-blue)' : 'var(--text-light)',
                fontWeight: viewMode === 'table' ? '700' : '500',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11.5px',
                cursor: 'pointer',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC PROGRESS BAR & CUMULATIVE INDICATOR */}
      <div
        id="grade-requirements-progress-card"
        style={{
          background: 'var(--bg-main, #f8fafc)',
          border: '1px solid var(--border-light, #e2e8f0)',
          borderRadius: '12px',
          padding: '16px 18px',
          marginBottom: '20px',
        }}
      >
        {/* Metric Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📊</span>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark, #0b2545)' }}>
                Cumulative Subject Requirements Progress
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-light, #64748b)', display: 'block' }}>
                {programmeName} ({programmeCode})
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: progressTheme.text,
                lineHeight: 1,
                fontFamily: 'monospace',
              }}
            >
              {cumulativePercentage}%
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-light, #64748b)', fontWeight: 600 }}>
              ({passedCriteria} of {totalCriteria} requirements met)
            </span>
          </div>
        </div>

        {/* Visual Progress Bar Track */}
        <div
          style={{
            height: '10px',
            width: '100%',
            background: '#e2e8f0',
            borderRadius: '6px',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '12px',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
          }}
        >
          <div
            id="academic-cumulative-progress-fill"
            style={{
              height: '100%',
              width: `${cumulativePercentage}%`,
              background: progressTheme.bar,
              borderRadius: '6px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>

        {/* Individual Requirement Micro-Badges */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          {items.map((item) => {
            const isPassed = item.status === 'passed';
            const isMissing = item.status === 'missing';

            const chipBg = isPassed ? '#dcfce7' : isMissing ? '#fef3c7' : '#fee2e2';
            const chipText = isPassed ? '#166534' : isMissing ? '#92400e' : '#991b1b';
            const chipBorder = isPassed ? '#86efac' : isMissing ? '#fde68a' : '#fca5a5';
            const icon = isPassed ? '✓' : isMissing ? '⚠' : '✕';

            return (
              <div
                key={item.subjectKey}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: chipBg,
                  color: chipText,
                  border: `1px solid ${chipBorder}`,
                  borderRadius: '16px',
                  padding: '3px 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                }}
                title={`${item.label}: ${item.applicantGrade} (Min req: ${item.requiredGrade}) - ${item.status.toUpperCase()}`}
              >
                <span>{icon}</span>
                <span>{item.isMeanGrade ? 'Mean Grade' : item.label.split(' ')[0]}</span>
                <span style={{ opacity: 0.8, fontSize: '10.5px' }}>
                  ({item.applicantGrade !== 'Not Provided' ? item.applicantGrade : '—'})
                </span>
              </div>
            );
          })}
        </div>

        {/* Contextual Progress Advice */}
        <div
          style={{
            marginTop: '10px',
            fontSize: '11.5px',
            color: 'var(--text-light, #64748b)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '6px',
          }}
        >
          <span>
            {cumulativePercentage === 100 ? (
              <strong style={{ color: '#16a34a' }}>🎉 All subject criteria fulfilled. Your academic profile meets admission benchmarks.</strong>
            ) : summary.missingCount > 0 ? (
              <span>
                ℹ️ <strong>{summary.missingCount}</strong> subject grade{summary.missingCount > 1 ? 's' : ''} not yet entered. Enter all subject grades to calculate complete eligibility.
              </span>
            ) : (
              <span>
                ⚠️ <strong>{summary.failedCount}</strong> subject requirement{summary.failedCount > 1 ? 's' : ''} below the mandatory minimum grade threshold.
              </span>
            )}
          </span>

          {subjectTotal > 0 && (
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Subject Clusters: <strong>{subjectPassed}/{subjectTotal} Passed ({subjectPercentage}%)</strong>
            </span>
          )}
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginBottom: '16px',
          }}
        >
          {items.map((item) => {
            const isPassed = item.status === 'passed';
            const isMissing = item.status === 'missing';

            const borderColor = isPassed
              ? 'hsl(142, 60%, 82%)'
              : isMissing
              ? 'hsl(38, 92%, 80%)'
              : 'hsl(0, 72%, 85%)';

            const bgColor = isPassed
              ? 'hsl(142, 70%, 98%)'
              : isMissing
              ? 'hsl(38, 92%, 98%)'
              : 'hsl(0, 72%, 98%)';

            const badgeBg = isPassed
              ? 'hsl(142, 70%, 92%)'
              : isMissing
              ? 'hsl(38, 92%, 92%)'
              : 'hsl(0, 72%, 92%)';

            const badgeText = isPassed
              ? 'hsl(142, 76%, 20%)'
              : isMissing
              ? 'hsl(38, 92%, 25%)'
              : 'hsl(0, 72%, 35%)';

            const reqPoints = GRADE_VALUES[item.requiredGrade] || 6;
            const applicantPoints = GRADE_VALUES[item.applicantGrade] || 0;
            const percentage = Math.min(100, Math.max(8, (applicantPoints / 12) * 100));
            const reqPercentage = Math.min(100, Math.max(8, (reqPoints / 12) * 100));

            return (
              <div
                key={item.subjectKey}
                style={{
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  {/* Subject Title & Requirement Type */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <h5
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: 'var(--text-dark)',
                          margin: 0,
                        }}
                      >
                        {item.label}
                      </h5>
                      {item.isMeanGrade && (
                        <span style={{ fontSize: '10.5px', color: 'var(--text-light)', fontWeight: '600' }}>
                          (Overall Qualifying Metric)
                        </span>
                      )}
                    </div>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        background: badgeBg,
                        color: badgeText,
                        whiteSpace: 'nowrap',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {isPassed ? '✓ Passed' : isMissing ? '⚠ Missing' : '✕ Failed'}
                    </span>
                  </div>

                  {/* Grades Comparison Section */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#ffffff',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      border: '1px solid rgba(0,0,0,0.06)',
                      marginBottom: '10px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-light)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Required Minimum
                      </span>
                      <strong style={{ fontSize: '15px', color: 'var(--primary-navy, #0b2545)' }}>
                        {item.requiredGrade}
                      </strong>
                    </div>

                    <div style={{ fontSize: '14px', color: 'var(--text-light)', fontWeight: 'bold' }}>
                      &rarr;
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-light)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Your Grade
                      </span>
                      <strong
                        style={{
                          fontSize: '15px',
                          color: isPassed ? 'hsl(142, 76%, 25%)' : 'hsl(0, 72%, 40%)',
                        }}
                      >
                        {item.applicantGrade}
                      </strong>
                    </div>
                  </div>

                  {/* Visual Points Gauge */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-light)', marginBottom: '3px' }}>
                      <span>Min Required: {item.requiredGrade}</span>
                      <span>Your Score: {item.applicantGrade}</span>
                    </div>
                    <div
                      style={{
                        height: '6px',
                        background: 'rgba(0,0,0,0.08)',
                        borderRadius: '4px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Required Target Marker */}
                      <div
                        style={{
                          position: 'absolute',
                          left: `${reqPercentage}%`,
                          top: 0,
                          bottom: 0,
                          width: '2px',
                          background: 'var(--primary-navy, #0b2545)',
                          zIndex: 2,
                        }}
                        title={`Required threshold: ${item.requiredGrade}`}
                      />
                      {/* Applicant Grade Bar */}
                      <div
                        style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: isPassed
                            ? 'linear-gradient(90deg, #10b981, #059669)'
                            : 'linear-gradient(90deg, #ef4444, #dc2626)',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Explanation Footnote */}
                <div
                  style={{
                    fontSize: '11.5px',
                    lineHeight: '1.45',
                    color: isPassed ? 'hsl(142, 60%, 25%)' : isMissing ? 'hsl(38, 92%, 25%)' : 'hsl(0, 65%, 35%)',
                    background: 'rgba(255, 255, 255, 0.7)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                  }}
                >
                  {item.explanation}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Mode */
        <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-light)',
            }}
          >
            <thead>
              <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', fontWeight: '700', color: 'var(--text-dark)' }}>Academic Criterion</th>
                <th style={{ padding: '10px 14px', fontWeight: '700', color: 'var(--text-dark)' }}>Minimum Req.</th>
                <th style={{ padding: '10px 14px', fontWeight: '700', color: 'var(--text-dark)' }}>Your Grade</th>
                <th style={{ padding: '10px 14px', fontWeight: '700', color: 'var(--text-dark)' }}>Evaluation Status</th>
                <th style={{ padding: '10px 14px', fontWeight: '700', color: 'var(--text-dark)' }}>Details / Difference</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const isPassed = item.status === 'passed';
                const isMissing = item.status === 'missing';
                return (
                  <tr
                    key={item.subjectKey}
                    style={{
                      borderBottom: idx < items.length - 1 ? '1px solid var(--border-light)' : 'none',
                      background: isPassed ? 'transparent' : isMissing ? 'hsl(38, 92%, 99%)' : 'hsl(0, 72%, 99%)',
                    }}
                  >
                    <td style={{ padding: '10px 14px', fontWeight: '600', color: 'var(--text-dark)' }}>
                      {item.label}
                      {item.isMeanGrade && (
                        <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'block', fontWeight: '400' }}>
                          Mean Grade Requirement
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: '700', color: 'var(--primary-blue)' }}>
                      {item.requiredGrade}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          fontWeight: '700',
                          color: isPassed ? 'hsl(142, 76%, 25%)' : 'hsl(0, 72%, 40%)',
                          background: isPassed ? 'hsl(142, 70%, 94%)' : 'hsl(0, 72%, 94%)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {item.applicantGrade}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '10px',
                          background: isPassed
                            ? 'hsl(142, 70%, 92%)'
                            : isMissing
                            ? 'hsl(38, 92%, 92%)'
                            : 'hsl(0, 72%, 92%)',
                          color: isPassed
                            ? 'hsl(142, 76%, 20%)'
                            : isMissing
                            ? 'hsl(38, 92%, 25%)'
                            : 'hsl(0, 72%, 35%)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {isPassed ? '✓ Met' : isMissing ? '⚠ Incomplete' : '✕ Not Met'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--text-light)' }}>
                      {item.explanation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Advisory & Recommendation Banner */}
      <div
        style={{
          borderRadius: 'var(--radius-sm)',
          padding: '14px 16px',
          background: overallEligible ? 'hsl(142, 70%, 96%)' : 'hsl(0, 72%, 96%)',
          borderLeft: `4px solid ${overallEligible ? 'hsl(142, 76%, 36%)' : 'hsl(0, 72%, 50%)'}`,
          fontSize: '12.5px',
          lineHeight: '1.55',
          color: 'var(--text-dark)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ fontSize: '15px', lineHeight: '1' }}>
            {overallEligible ? '🎉' : '💡'}
          </span>
          <div>
            {overallEligible ? (
              <span>
                <strong>Academic Eligibility Confirmed:</strong> Your submitted KCSE grades meet or exceed all KNEC & TSC regulatory criteria for enrollment into <strong>{programmeName}</strong>. Final admission is subject to physical verification of your original certificates.
              </span>
            ) : (
              <span>
                <strong>Academic Action Required:</strong> You do not currently meet the minimum cluster threshold for <strong>{programmeName}</strong>. 
                {summary.failedCount > 0 && (
                  <span>
                    {' '}Failed subject(s): <strong>{items.filter(i => i.status === 'failed').map(i => `${i.label} (Required ${i.requiredGrade}, Got ${i.applicantGrade})`).join(', ')}</strong>.
                  </span>
                )}
                {' '}You can switch to another programme (such as <strong>Diploma / Certificate in Early Childhood Teacher Education</strong>) or reach out to the Admissions Registry for advisement.
              </span>
            )}
          </div>
        </div>

        {!overallEligible && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Link
              href="/programmes"
              className="btn btn-secondary"
              style={{ fontSize: '11.5px', padding: '5px 12px', background: '#ffffff' }}
            >
              Browse Alternative Programmes &rarr;
            </Link>
            <a
              href="https://wa.me/254101930121?text=Hello%20Admissions%20Office,%20I%20would%20like%20guidance%20on%20entry%20requirements%20for%20my%20grades."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ fontSize: '11.5px', padding: '5px 12px', background: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }}
            >
              💬 Consult Admissions Desk on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );

  if (!showCardWrapper) {
    return content;
  }

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginTop: '20px',
      }}
    >
      {content}
    </div>
  );
}
