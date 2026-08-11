'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generate30DaysCalendar } from '@/app/actions/calendar-batch';
import styles from './Batch.module.css';

export default function BatchCalendarPage() {
  const router = useRouter();
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'alternate'>('daily');
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [focusTopics, setFocusTopics] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    await generate30DaysCalendar({
      frequency,
      autoSchedule,
      focusTopics,
    });
    router.push('/drafts');
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🗓️ 30-Day Content Calendar Planner</h1>
        <p className={styles.subtitle}>
          Generate a full month of engaging, categorized social media captions in 1 click.
        </p>
      </header>

      <div className={styles.card}>
        <div className={styles.formGroup}>
          <label className={styles.label}>1. Select Posting Frequency:</label>
          <div className={styles.frequencyOptions}>
            <div
              className={`${styles.frequencyCard} ${frequency === 'daily' ? styles.frequencyCardActive : ''}`}
              onClick={() => setFrequency('daily')}
            >
              <div className={styles.frequencyTitle}>⚡ Every Day</div>
              <div className={styles.frequencyDesc}>30 posts, 1 post every single day of the month</div>
            </div>

            <div
              className={`${styles.frequencyCard} ${frequency === 'weekdays' ? styles.frequencyCardActive : ''}`}
              onClick={() => setFrequency('weekdays')}
            >
              <div className={styles.frequencyTitle}>💼 Weekdays Only</div>
              <div className={styles.frequencyDesc}>Monday through Friday only (skip weekends)</div>
            </div>

            <div
              className={`${styles.frequencyCard} ${frequency === 'alternate' ? styles.frequencyCardActive : ''}`}
              onClick={() => setFrequency('alternate')}
            >
              <div className={styles.frequencyTitle}>🌿 Alternate Days</div>
              <div className={styles.frequencyDesc}>Every 2 days (approx. 15 posts spaced over month)</div>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="topics" className={styles.label}>2. Key Focus Topics / Promos this Month (Optional):</label>
          <input
            type="text"
            id="topics"
            value={focusTopics}
            onChange={(e) => setFocusTopics(e.target.value)}
            placeholder="e.g. Summer Whitening Promo, Clear Aligners, Back to School Checkups"
          />
        </div>

        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <div className={styles.toggleTitle}>Auto-Schedule to Calendar Dates</div>
            <div className={styles.toggleDesc}>
              Automatically assign optimal posting dates & times across your visual monthly calendar
            </div>
          </div>
          <input
            type="checkbox"
            checked={autoSchedule}
            onChange={(e) => setAutoSchedule(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
          />
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className={`btn btn-primary ${styles.submitBtn}`}
        >
          {loading ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="10"></circle>
              </svg>
              <span>Generating 30 Days of Content...</span>
            </>
          ) : (
            <>
              <span>✨ Generate Full 30-Day Content Calendar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
