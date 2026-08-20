'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintTriggerButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn btn-accent"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        fontSize: '12px',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
      id="direct-print-button"
    >
      <Printer size={15} /> 🖨️ Print Admission Letter
    </button>
  );
}
