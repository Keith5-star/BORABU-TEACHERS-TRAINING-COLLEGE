'use client';

import { useEffect, useState } from 'react';

export default function ContrastToggle() {
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    const isContrast = localStorage.getItem('contrast-mode') === 'true';
    setContrast(isContrast);
    if (isContrast) {
      document.body.classList.add('theme-contrast');
    } else {
      document.body.classList.remove('theme-contrast');
    }
  }, []);

  const toggleContrast = () => {
    const nextState = !contrast;
    setContrast(nextState);
    localStorage.setItem('contrast-mode', String(nextState));
    if (nextState) {
      document.body.classList.add('theme-contrast');
    } else {
      document.body.classList.remove('theme-contrast');
    }
  };

  return (
    <button
      onClick={toggleContrast}
      className="btn btn-secondary"
      style={{
        padding: '8px 12px',
        fontSize: '12px',
        margin: 0,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        borderColor: 'var(--text-dark)',
        fontWeight: '600',
      }}
      aria-label="Toggle High Contrast Mode"
    >
      🌓 {contrast ? 'Normal Theme' : 'High Contrast'}
    </button>
  );
}
