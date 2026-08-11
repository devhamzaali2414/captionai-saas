'use client';

import { useState } from 'react';
import { addNote } from '@/app/actions/notes';
import VoiceRecorder from '@/components/VoiceRecorder';

export default function AddNoteForm() {
  const [content, setContent] = useState('');

  function handleVoiceTranscription(text: string) {
    setContent((prev) => (prev ? `${prev} ${text}` : text));
  }

  return (
    <form
      action={async (formData: FormData) => {
        await addNote(formData);
        setContent('');
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '2rem',
        background: 'var(--surface)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--foreground)' }}>
          Add Clinic Update / Thought:
        </label>
        <VoiceRecorder onTranscription={handleVoiceTranscription} />
      </div>

      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening at the practice? (e.g., We just got a new iTero scanner today or 20% off whitening this week!)"
        style={{
          width: '100%',
          minHeight: '90px',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          fontFamily: 'inherit',
          fontSize: '0.92rem',
        }}
        required
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn btn-primary">
          Add to Knowledge Bank
        </button>
      </div>
    </form>
  );
}
