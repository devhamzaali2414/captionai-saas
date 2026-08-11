'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/app/actions/auth';
import SubmitButton from '@/components/SubmitButton';
import styles from './Login.module.css';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const res = await loginAction(formData);
    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.brandHeader}>
          <div className={styles.logoIcon}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your CaptionAI practice dashboard</p>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            {error}
          </div>
        )}

        <form action={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder="doctor@practice.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <SubmitButton className={`btn btn-primary ${styles.submitBtn}`}>
            Sign In
          </SubmitButton>

          <div style={{ position: 'relative', textAlign: 'center', margin: '0.75rem 0' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--surface)', padding: '0 0.5rem' }}>
              or quick access
            </span>
          </div>

          <button
            type="button"
            onClick={async () => {
              document.cookie = "demo-session=true; path=/";
              window.location.href = "/dashboard";
            }}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.85rem' }}
          >
            🚀 1-Click Demo Access
          </button>
        </form>

        <div className={styles.footer}>
          Don't have an account?
          <Link href="/signup" className={styles.link}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
