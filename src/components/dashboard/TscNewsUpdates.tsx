'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Newspaper,
  RefreshCw,
  ExternalLink,
  GraduationCap,
  Briefcase,
  BookOpen,
  Sparkles,
  Globe,
  Search,
  ShieldCheck,
  Clock,
  Database,
  Check,
} from 'lucide-react';

export interface GroundingSource {
  title: string;
  url: string;
}

export interface TscUpdateItem {
  id: string;
  title: string;
  category: 'registration' | 'recruitment' | 'upgrades' | 'circulars';
  summary: string;
  keyPoints: string[];
  date: string;
  officialSource?: string;
  officialUrl?: string;
  relevance: string;
}

interface CachedTscPayload {
  updates: TscUpdateItem[];
  groundingSources: GroundingSource[];
  searchQueries: string[];
  lastUpdated: string;
  cachedAt: number; // unix timestamp in ms
}

const STORAGE_CACHE_KEY = 'borabu_tsc_news_grounding_cache_v2';
// 2 hours default cache TTL to drastically conserve API tokens
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;

function formatTimeAgo(timestampMs: number): string {
  const diffSecs = Math.floor((Date.now() - timestampMs) / 1000);
  if (diffSecs < 60) return 'Just now';
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function TscNewsUpdates() {
  const [updates, setUpdates] = useState<TscUpdateItem[]>([]);
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);
  const [cachedAt, setCachedAt] = useState<number | null>(null);
  const [cacheAgeStr, setCacheAgeStr] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [showEligibilityGuide, setShowEligibilityGuide] = useState<boolean>(false);
  const [refreshSuccessBadge, setRefreshSuccessBadge] = useState<boolean>(false);

  // Update time-ago ticker periodically
  useEffect(() => {
    if (!cachedAt) return;
    setCacheAgeStr(formatTimeAgo(cachedAt));

    const interval = setInterval(() => {
      setCacheAgeStr(formatTimeAgo(cachedAt));
    }, 30000);

    return () => clearInterval(interval);
  }, [cachedAt]);

  const saveToLocalStorage = (payload: CachedTscPayload) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Unable to persist TSC news to localStorage:', e);
    }
  };

  const loadFromLocalStorage = useCallback((): CachedTscPayload | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_CACHE_KEY);
      if (!raw) return null;
      const parsed: CachedTscPayload = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.updates) || !parsed.cachedAt) {
        return null;
      }
      return parsed;
    } catch (e) {
      console.warn('Failed parsing cached TSC news from localStorage:', e);
      return null;
    }
  }, []);

  const fetchTscUpdates = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // If not forcing refresh, check localStorage first
      if (!forceRefresh) {
        const cached = loadFromLocalStorage();
        if (cached) {
          const isFresh = Date.now() - cached.cachedAt < CACHE_TTL_MS;
          if (isFresh && cached.updates.length > 0) {
            setUpdates(cached.updates);
            setGroundingSources(cached.groundingSources || []);
            setSearchQueries(cached.searchQueries || []);
            setLastUpdated(cached.lastUpdated || new Date(cached.cachedAt).toISOString());
            setCachedAt(cached.cachedAt);
            setIsFromCache(true);
            setLoading(false);
            return;
          }
        }
      }

      // Perform actual network request to Search-Grounded API endpoint
      const url = `/api/tsc-updates?refresh=${forceRefresh}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const now = Date.now();
        const newUpdates = data.updates || [];
        const newSources = data.groundingSources || [];
        const newQueries = data.searchQueries || [];
        const newTimestamp = data.lastUpdated || new Date().toISOString();

        setUpdates(newUpdates);
        setGroundingSources(newSources);
        setSearchQueries(newQueries);
        setLastUpdated(newTimestamp);
        setCachedAt(now);
        setIsFromCache(false);

        // Store in localStorage
        saveToLocalStorage({
          updates: newUpdates,
          groundingSources: newSources,
          searchQueries: newQueries,
          lastUpdated: newTimestamp,
          cachedAt: now,
        });

        if (forceRefresh) {
          setRefreshSuccessBadge(true);
          setTimeout(() => setRefreshSuccessBadge(false), 3000);
        }
      }
    } catch (err) {
      console.error('Failed to fetch TSC updates:', err);
      // If network fails, try stale cache as fallback
      const cached = loadFromLocalStorage();
      if (cached && cached.updates.length > 0) {
        setUpdates(cached.updates);
        setGroundingSources(cached.groundingSources || []);
        setSearchQueries(cached.searchQueries || []);
        setLastUpdated(cached.lastUpdated);
        setCachedAt(cached.cachedAt);
        setIsFromCache(true);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [loadFromLocalStorage]);

  useEffect(() => {
    fetchTscUpdates(false);
  }, [fetchTscUpdates]);

  const categories = [
    { id: 'all', label: 'All Updates', icon: Globe },
    { id: 'registration', label: 'Teacher Registration', icon: ShieldCheck },
    { id: 'recruitment', label: 'Recruitment & Vacancies', icon: Briefcase },
    { id: 'upgrades', label: 'CBC Upgrades (UDPTE)', icon: GraduationCap },
    { id: 'circulars', label: 'Circulars & Portals', icon: BookOpen },
  ];

  const filteredUpdates = updates.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const query = filterSearch.toLowerCase().trim();
    if (!query) return matchesCat;

    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.relevance.toLowerCase().includes(query) ||
      item.keyPoints.some((p) => p.toLowerCase().includes(query));

    return matchesCat && matchesSearch;
  });

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'registration':
        return {
          bg: '#f0fdf4',
          border: '#bbf7d0',
          text: '#166534',
          badgeBg: '#dcfce7',
          label: 'Teacher Registration',
        };
      case 'recruitment':
        return {
          bg: '#eff6ff',
          border: '#bfdbfe',
          text: '#1e40af',
          badgeBg: '#dbeafe',
          label: 'Recruitment & Vacancies',
        };
      case 'upgrades':
        return {
          bg: '#faf5ff',
          border: '#e9d5ff',
          text: '#6b21a8',
          badgeBg: '#f3e8ff',
          label: 'CBC Diploma Upgrades',
        };
      case 'circulars':
      default:
        return {
          bg: '#fffbeb',
          border: '#fde68a',
          text: '#92400e',
          badgeBg: '#fef3c7',
          label: 'Official Directives',
        };
    }
  };

  return (
    <div
      style={{
        background: 'var(--bg-card, #ffffff)',
        border: '1px solid var(--border-light, #e2e8f0)',
        borderRadius: 'var(--radius-lg, 12px)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
        marginBottom: '28px',
      }}
      id="tsc-news-section"
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid var(--border-light, #e2e8f0)',
          paddingBottom: '18px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                background: '#eff6ff',
                color: 'var(--primary-blue, #1d4ed8)',
                padding: '4px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Newspaper size={18} />
            </span>
            <h2 style={{ fontSize: '18px', color: 'var(--text-dark, #0f172a)', margin: 0, fontWeight: 700 }}>
              TSC News & Official Registration Updates
            </h2>
          </div>
          <p style={{ color: 'var(--text-light, #64748b)', fontSize: '13px', margin: 0 }}>
            Search-grounded announcements from the Teachers Service Commission (Kenya) and Ministry of Education.
          </p>
        </div>

        {/* Refresh, Cache Status & Search Grounding Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Caching Status Pill */}
          {cachedAt && (
            <span
              title="Persistent localStorage cache saves API bandwidth and loads instantly"
              style={{
                fontSize: '11.5px',
                background: isFromCache ? '#f8fafc' : '#f0fdf4',
                color: isFromCache ? '#475569' : '#15803d',
                border: `1px solid ${isFromCache ? '#cbd5e1' : '#bbf7d0'}`,
                padding: '4px 10px',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 600,
              }}
            >
              {isFromCache ? <Database size={12} style={{ color: '#64748b' }} /> : <Sparkles size={12} style={{ color: '#16a34a' }} />}
              {isFromCache ? `Cached (${cacheAgeStr || 'stored'})` : 'Fresh Grounding'}
            </span>
          )}

          {/* Refresh Success Notice */}
          {refreshSuccessBadge && (
            <span
              style={{
                fontSize: '11px',
                background: '#dcfce7',
                color: '#15803d',
                padding: '4px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 700,
              }}
            >
              <Check size={12} /> Cache Refreshed
            </span>
          )}

          {/* Interactive Refresh Button */}
          <button
            type="button"
            onClick={() => fetchTscUpdates(true)}
            disabled={isRefreshing || loading}
            className="btn btn-primary"
            style={{
              fontSize: '12px',
              padding: '6px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              margin: 0,
              cursor: isRefreshing || loading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
            id="refresh-tsc-news-btn"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Grounding Live Search...' : 'Refresh Feed'}
          </button>
        </div>
      </div>

      {/* Category Filter Pills & Search Input */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  fontSize: '12px',
                  fontWeight: isSelected ? 700 : 500,
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: isSelected ? '1px solid var(--primary-blue, #1d4ed8)' : '1px solid var(--border-light, #e2e8f0)',
                  background: isSelected ? 'var(--primary-blue, #1d4ed8)' : 'var(--bg-main, #f8fafc)',
                  color: isSelected ? '#ffffff' : 'var(--text-main, #334155)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={13} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Live Filter Input */}
        <div style={{ position: 'relative', minWidth: '220px', flexGrow: 0 }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-light, #94a3b8)',
            }}
          />
          <input
            type="text"
            placeholder="Search keywords..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="form-input"
            style={{
              fontSize: '12px',
              padding: '6px 10px 6px 30px',
              borderRadius: '6px',
              width: '100%',
            }}
          />
        </div>
      </div>

      {/* Quick Registration Eligibility Banner Toggle */}
      <div
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🎓</span>
          <div>
            <strong style={{ fontSize: '13px', color: '#1e3a8a', display: 'block' }}>
              Are you eligible for immediate TSC registration upon completing your course?
            </strong>
            <span style={{ fontSize: '12px', color: '#3b82f6' }}>
              Check required KCSE subject cluster points and Ministry of Education compliance.
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowEligibilityGuide(!showEligibilityGuide)}
          style={{
            fontSize: '12px',
            color: '#1d4ed8',
            background: '#ffffff',
            border: '1px solid #93c5fd',
            borderRadius: '6px',
            padding: '5px 12px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {showEligibilityGuide ? 'Hide Criteria ✕' : 'View TSC Criteria ➔'}
        </button>
      </div>

      {/* Collapsible Eligibility Guide */}
      {showEligibilityGuide && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            fontSize: '12.5px',
            lineHeight: 1.5,
            color: 'var(--text-main, #334155)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                1. DPTE (Primary Education):
              </strong>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#475569' }}>
                <li>KCSE Mean Grade: <strong>C (Plain)</strong></li>
                <li>Grade C in English, Kiswahili, Math</li>
                <li>Grade C in one Science & one Humanities</li>
                <li>Direct allocation of standard TSC Teacher Number</li>
              </ul>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                2. DECTE (Early Childhood):
              </strong>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#475569' }}>
                <li>KCSE Mean Grade: <strong>C (Plain)</strong></li>
                <li>Specialization in Pre-Primary & Foundational CBC</li>
                <li>Certificate holders can upgrade via UDECTE</li>
                <li>Accreditation for public and private ECDE centers</li>
              </ul>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                3. UDPTE (P1 Upgrade):
              </strong>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#475569' }}>
                <li>Existing P1 Certificate holders</li>
                <li>Modular 1-2 Year flexible schedule</li>
                <li>Automatic transition to CBC Diploma level</li>
                <li>Meets TSC career progression requirements</li>
              </ul>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                4. DSTE (Junior Secondary):
              </strong>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#475569' }}>
                <li>KCSE Mean Grade: <strong>C+ (Plus)</strong></li>
                <li>Grade C+ in two teaching specialization subjects</li>
                <li>Direct eligibility for JSS permanent recruitment</li>
                <li>High demand in STEM, Languages, and Technicals</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-light, #64748b)' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px', display: 'block', color: 'var(--primary-blue, #1d4ed8)' }} />
          <p style={{ fontSize: '13px', margin: 0 }}>Grounding latest TSC announcements and registration guidelines...</p>
        </div>
      ) : filteredUpdates.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '30px 20px',
            background: 'var(--bg-main, #f8fafc)',
            borderRadius: '8px',
            color: 'var(--text-light, #64748b)',
            fontSize: '13px',
          }}
        >
          No updates found matching your search. Try resetting the category or keyword filters.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredUpdates.map((item) => {
            const theme = getCategoryTheme(item.category);
            return (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '10px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  {/* Category Pill and Date */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        background: theme.badgeBg,
                        color: theme.text,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {theme.label}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-light, #64748b)' }}>
                      {item.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark, #0f172a)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                    {item.title}
                  </h4>

                  {/* Summary */}
                  <p style={{ fontSize: '12.5px', color: 'var(--text-main, #334155)', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                    {item.summary}
                  </p>

                  {/* Key points checklist */}
                  <div style={{ marginBottom: '14px' }}>
                    <strong style={{ fontSize: '11.5px', color: 'var(--text-dark, #0f172a)', display: 'block', marginBottom: '6px' }}>
                      Key Policy Provisions:
                    </strong>
                    <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {item.keyPoints.slice(0, 3).map((pt, idx) => (
                        <li key={idx} style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Relevance Strip & Direct Official Portal Link */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#0369a1', background: '#f0f9ff', padding: '6px 8px', borderRadius: '6px', marginBottom: '10px' }}>
                    <strong>💡 Borabu TTC Trainee Note:</strong> {item.relevance}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-light, #64748b)' }}>
                      Source: {item.officialSource || 'TSC Kenya'}
                    </span>
                    <a
                      href={item.officialUrl || 'https://teachersonline.tsc.go.ke/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '11.5px',
                        color: 'var(--primary-blue, #1d4ed8)',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Official Portal <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Grounding Citations and Search Query Footprint */}
      <div
        style={{
          marginTop: '24px',
          background: 'var(--bg-main, #f8fafc)',
          border: '1px solid var(--border-light, #e2e8f0)',
          borderRadius: '8px',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-dark, #0f172a)', fontWeight: 600 }}>
            <Globe size={14} style={{ color: 'var(--primary-blue, #1d4ed8)' }} />
            Official Sources & Grounding Citations:
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {lastUpdated && (
              <span style={{ fontSize: '11px', color: 'var(--text-light, #64748b)' }}>
                Verified: {new Date(lastUpdated).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
            {cachedAt && (
              <span style={{ fontSize: '11px', color: 'var(--text-light, #64748b)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={11} /> Cached {cacheAgeStr || 'recently'} (Valid for 2h)
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {groundingSources.map((source, idx) => (
            <a
              key={idx}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '11.5px',
                background: '#ffffff',
                border: '1px solid var(--border-light, #cbd5e1)',
                padding: '4px 10px',
                borderRadius: '6px',
                color: 'var(--primary-blue, #1d4ed8)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {source.title} <ExternalLink size={10} />
            </a>
          ))}
        </div>

        {searchQueries.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '6px', fontSize: '11px', color: 'var(--text-light, #64748b)' }}>
            <span>Grounding Topics:</span>
            {searchQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFilterSearch(q)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '10.5px',
                  color: 'var(--text-main, #334155)',
                  cursor: 'pointer',
                }}
              >
                🔍 {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
