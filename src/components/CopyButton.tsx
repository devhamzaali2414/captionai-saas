'use client';

import { useState } from 'react';

export default function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className}
      title="Copy to clipboard"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.4rem 0.75rem',
        fontSize: '0.82rem',
        fontWeight: 500,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        backgroundColor: copied ? '#ecfdf5' : '#ffffff',
        color: copied ? '#059669' : 'var(--foreground)',
        borderColor: copied ? '#a7f3d0' : 'var(--border)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
