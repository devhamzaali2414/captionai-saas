'use client';

import { useState, useRef } from 'react';
import { attachImageToDraft, removeImageFromDraft } from '@/app/actions/enhance';

interface ImageUploaderProps {
  draftId: number;
  initialImagePath?: string | null;
}

export default function ImageUploader({ draftId, initialImagePath }: ImageUploaderProps) {
  const [imagePath, setImagePath] = useState<string | null>(initialImagePath || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.url) {
          setImagePath(data.url);
          await attachImageToDraft(draftId, data.url);
        } else {
          alert('Image upload failed: ' + (data.error || 'Unknown error'));
        }
        setUploading(false);
      })
      .catch(() => {
        alert('Failed to upload image. Please try again.');
        setUploading(false);
      });
  }

  async function handleRemove() {
    setImagePath(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    await removeImageFromDraft(draftId);
  }

  return (
    <div style={{ marginTop: '0.75rem' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        style={{ display: 'none' }}
      />

      {imagePath ? (
        <div style={{ position: 'relative', display: 'inline-block', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', maxWidth: '100%' }}>
          <img
            src={imagePath}
            alt="Attached post visual"
            style={{
              maxHeight: '160px',
              maxWidth: '100%',
              objectFit: 'cover',
              display: 'block',
              borderRadius: 'var(--radius-md)'
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            title="Remove image"
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              background: 'rgba(0, 0, 0, 0.65)',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              cursor: 'pointer',
              border: 'none',
              transition: 'background 0.2s',
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.75rem',
            fontSize: '0.82rem',
            fontWeight: 500,
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border)',
            background: 'var(--background)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span>{uploading ? 'Attaching...' : 'Attach Image'}</span>
        </button>
      )}
    </div>
  );
}
