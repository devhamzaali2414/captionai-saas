'use client';

import { useState } from 'react';
import { generateAIImageForDraft } from '@/app/actions/ai-image';

interface AIImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftId: number;
  onImageGenerated: (imageUrl: string) => void;
}

const STYLES = [
  { id: 'clinic-minimal', label: '🏥 Modern Clinic Interior', desc: 'Clean, professional medical atmosphere' },
  { id: 'smile-transformation', label: '✨ Smile Transformation', desc: 'Bright, healthy, aesthetic results' },
  { id: 'doctor-advice', label: '🩺 Friendly Healthcare Team', desc: 'Approachable doctors and patient consultation' },
  { id: 'promo-special', label: '🎉 Special Promo & Wellness', desc: 'Vibrant graphic suited for offers and discounts' },
];

export default function AIImageModal({ isOpen, onClose, draftId, onImageGenerated }: AIImageModalProps) {
  const [selectedStyle, setSelectedStyle] = useState('clinic-minimal');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleGenerate() {
    setLoading(true);
    const res = await generateAIImageForDraft(draftId, selectedStyle, customPrompt);
    if (res.success && res.imageUrl) {
      onImageGenerated(res.imageUrl);
      onClose();
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '520px',
          width: '100%',
          padding: '2rem',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>🎨 AI Image Generator</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Generate aesthetic visual graphics matching your caption
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
            Choose Graphic Style:
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {STYLES.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedStyle(st.id)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${selectedStyle === st.id ? 'var(--primary)' : 'var(--border)'}`,
                  background: selectedStyle === st.id ? 'var(--secondary)' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--foreground)' }}>{st.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{st.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
            Custom Visual Details (Optional):
          </label>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. Modern dentist chair with soft blue lighting"
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              fontSize: '0.9rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {loading ? 'Generating Visual...' : '✨ Generate & Attach Visual'}
          </button>
        </div>
      </div>
    </div>
  );
}
