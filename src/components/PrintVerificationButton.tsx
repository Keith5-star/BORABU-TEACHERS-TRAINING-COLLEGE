'use client';

export default function PrintVerificationButton({
  label = 'Print Verification Record',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className={`btn btn-secondary no-print ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '700',
        fontSize: '13.5px',
        padding: '10px 20px',
        cursor: 'pointer',
      }}
      title="Print or Save as PDF"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      <span>{label}</span>
    </button>
  );
}
