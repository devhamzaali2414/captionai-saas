'use client';

import { useState } from 'react';
import { generateCaptions } from '@/app/actions/generate';
import VoiceRecorder from '@/components/VoiceRecorder';
import SubmitButton from '@/components/SubmitButton';
import styles from '@/app/Generate.module.css';

export default function GeneratorForm() {
  const [topic, setTopic] = useState('');

  function handleVoiceTranscription(text: string) {
    setTopic((prev) => (prev ? `${prev} ${text}` : text));
  }

  return (
    <form action={generateCaptions} className={styles.card}>
      <div className={styles.formGroup}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label htmlFor="topic" className={styles.label}>
            What should we post about? (Optional)
          </label>
          <VoiceRecorder onTranscription={handleVoiceTranscription} />
        </div>
        <input
          type="text"
          id="topic"
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. June Invisalign Promo, or a fun fact about cavities"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="quantity" className={styles.label}>
          How many captions?
        </label>
        <select id="quantity" name="quantity" className={styles.select}>
          <option value="1">1 Caption</option>
          <option value="3">3 Captions</option>
          <option value="5">5 Captions</option>
          <option value="10">10 Captions</option>
        </select>
      </div>

      <SubmitButton className={`btn btn-primary ${styles.submitBtn}`}>
        ✨ Generate Magic Captions
      </SubmitButton>
    </form>
  );
}
