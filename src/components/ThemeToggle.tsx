'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'simple' | 'compact' | 'dropdown';
  className?: string;
}

export default function ThemeToggle({ variant = 'simple', className = '' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className={`theme-toggle-btn ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-sm, 4px)',
          border: '1px solid var(--border-light)',
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          cursor: 'pointer',
          padding: 0,
        }}
        aria-label="Toggle theme"
        disabled
      >
        <span style={{ width: '16px', height: '16px', opacity: 0.5 }}>◐</span>
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }} className={className}>
        <button
          type="button"
          onClick={() => setOpenDropdown(!openDropdown)}
          className="theme-toggle-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm, 4px)',
            border: '1px solid var(--border-light)',
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
          }}
          aria-label="Select theme"
          id="theme-dropdown-trigger"
        >
          {resolvedTheme === 'dark' ? <Moon size={15} color="var(--accent-gold)" /> : <Sun size={15} color="var(--accent-gold)" />}
          <span style={{ textTransform: 'capitalize' }}>{theme}</span>
        </button>

        {openDropdown && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 6px)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md, 6px)',
              boxShadow: 'var(--shadow-md)',
              minWidth: '130px',
              zIndex: 1000,
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                setOpenDropdown(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '4px',
                border: 'none',
                background: theme === 'light' ? 'var(--primary-light)' : 'transparent',
                color: theme === 'light' ? 'var(--primary-blue)' : 'var(--text-main)',
                fontSize: '12px',
                fontWeight: theme === 'light' ? 700 : 500,
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <Sun size={14} /> Light
            </button>
            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                setOpenDropdown(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '4px',
                border: 'none',
                background: theme === 'dark' ? 'var(--primary-light)' : 'transparent',
                color: theme === 'dark' ? 'var(--primary-blue)' : 'var(--text-main)',
                fontSize: '12px',
                fontWeight: theme === 'dark' ? 700 : 500,
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <Moon size={14} /> Dark
            </button>
            <button
              type="button"
              onClick={() => {
                setTheme('system');
                setOpenDropdown(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '4px',
                border: 'none',
                background: theme === 'system' ? 'var(--primary-light)' : 'transparent',
                color: theme === 'system' ? 'var(--primary-blue)' : 'var(--text-main)',
                fontSize: '12px',
                fontWeight: theme === 'system' ? 700 : 500,
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <Monitor size={14} /> System
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-sm, 4px)',
        border: '1px solid var(--border-light)',
        background: 'var(--bg-card)',
        color: resolvedTheme === 'dark' ? 'var(--accent-gold)' : 'var(--primary-navy)',
        cursor: 'pointer',
        transition: 'var(--transition-smooth)',
        padding: 0,
      }}
      title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
      id="global-theme-toggle"
    >
      {resolvedTheme === 'dark' ? (
        <Sun size={17} strokeWidth={2.2} />
      ) : (
        <Moon size={17} strokeWidth={2.2} />
      )}
    </button>
  );
}
