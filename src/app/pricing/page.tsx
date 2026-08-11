'use client';

import { useState, useEffect } from 'react';
import { getUserSubscription, upgradeSubscriptionPlan } from '@/app/actions/subscription';
import styles from './Pricing.module.css';

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    getUserSubscription().then((sub) => setCurrentPlan(sub.plan));
  }, []);

  async function handleSelectPlan(plan: 'pro' | 'agency') {
    setLoadingPlan(plan);
    setSuccessNotice(null);
    await upgradeSubscriptionPlan(plan);
    setCurrentPlan(plan);
    setLoadingPlan(null);
    setSuccessNotice(`🎉 Successfully switched to the ${plan.toUpperCase()} plan!`);
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Simple, Transparent Pricing</h1>
        <p className={styles.subtitle}>
          Scale your healthcare practice's social media presence with AI-powered captions, image generation, and automated scheduling.
        </p>
      </header>

      {successNotice && (
        <div
          style={{
            background: '#ecfdf5',
            color: '#047857',
            border: '1px solid #a7f3d0',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            marginBottom: '2rem',
            fontWeight: 600,
          }}
        >
          {successNotice}
        </div>
      )}

      <div className={styles.pricingGrid}>
        {/* Free Starter */}
        <div className={styles.planCard}>
          <div className={styles.planHeader}>
            <div className={styles.planName}>Starter</div>
            <div className={styles.planDesc}>For solo doctors just testing AI content</div>
          </div>

          <div className={styles.priceWrapper}>
            <span className={styles.price}>$0</span>
            <span className={styles.period}>/month</span>
          </div>

          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>25 AI Captions / month</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>1 Social Media Channel</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>1-Click Copy & Hashtags</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Visual Calendar View</span>
            </li>
          </ul>

          <button
            type="button"
            disabled={currentPlan === 'free'}
            className="btn btn-secondary"
          >
            {currentPlan === 'free' ? 'Current Plan' : 'Free Tier'}
          </button>
        </div>

        {/* Pro Practice (Featured) */}
        <div className={`${styles.planCard} ${styles.featuredCard}`}>
          <div className={styles.popularBadge}>Most Popular</div>
          <div className={styles.planHeader}>
            <div className={styles.planName}>Pro Practice</div>
            <div className={styles.planDesc}>For growing dental & medical clinics</div>
          </div>

          <div className={styles.priceWrapper}>
            <span className={styles.price}>$29</span>
            <span className={styles.period}>/month</span>
          </div>

          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <strong>150 AI Captions / month</strong>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Unlimited Social Accounts</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>🎨 AI Image Generator</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>🗓️ 30-Day Content Planner</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>🎙️ Voice-to-Caption Dictation</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Direct Buffer & Meta Scheduling</span>
            </li>
          </ul>

          <button
            type="button"
            onClick={() => handleSelectPlan('pro')}
            disabled={loadingPlan === 'pro'}
            className="btn btn-primary"
          >
            {loadingPlan === 'pro'
              ? 'Upgrading...'
              : currentPlan === 'pro'
              ? 'Current Plan'
              : 'Upgrade to Pro'}
          </button>
        </div>

        {/* Agency / Multi-Clinic */}
        <div className={styles.planCard}>
          <div className={styles.planHeader}>
            <div className={styles.planName}>Agency & Multi-Clinic</div>
            <div className={styles.planDesc}>For healthcare groups & marketing agencies</div>
          </div>

          <div className={styles.priceWrapper}>
            <span className={styles.price}>$79</span>
            <span className={styles.period}>/month</span>
          </div>

          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <strong>500 AI Captions / month</strong>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>🏢 Multi-Clinic Switcher</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Dedicated AI Brand Voice Samples</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Executive Analytics Dashboard</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Priority 24/7 Support</span>
            </li>
          </ul>

          <button
            type="button"
            onClick={() => handleSelectPlan('agency')}
            disabled={loadingPlan === 'agency'}
            className="btn btn-secondary"
          >
            {loadingPlan === 'agency'
              ? 'Upgrading...'
              : currentPlan === 'agency'
              ? 'Current Plan'
              : 'Upgrade to Agency'}
          </button>
        </div>
      </div>
    </div>
  );
}
