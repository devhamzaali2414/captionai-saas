'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signupAction } from '@/app/actions/auth';
import SubmitButton from '@/components/SubmitButton';
import styles from '@/app/login/Login.module.css';

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccessMessage(null);

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = await signupAction(formData);
    if (res?.error) {
      setError(res.error);
    } else if (res?.success && res?.message) {
      setSuccessMessage(res.message);
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
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Start generating high-converting practice captions</p>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            {error}
          </div>
        )}

        {successMessage && (
          <div className={styles.successBanner}>
            {successMessage}
          </div>
        )}

        <form action={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="practiceName" className={styles.label}>Practice Name (Optional)</label>
            <input
              type="text"
              id="practiceName"
              name="practiceName"
              className={styles.input}
              placeholder="e.g. Apex Dental Care"
            />
          </div>

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
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={styles.input}
              placeholder="Repeat your password"
              required
              minLength={6}
            />
          </div>

          <SubmitButton className={`btn btn-primary ${styles.submitBtn}`}>
            Create My Account
          </SubmitButton>
        </form>

        <div className={styles.footer}>
          Already have an account?
          <Link href="/login" className={styles.link}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
