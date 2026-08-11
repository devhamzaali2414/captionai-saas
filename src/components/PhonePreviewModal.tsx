'use client';

import { useState } from 'react';
import styles from './PhonePreviewModal.module.css';

interface PhonePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  caption: string;
  imagePath?: string | null;
  practiceName?: string;
  specialty?: string;
}

export default function PhonePreviewModal({
  isOpen,
  onClose,
  caption,
  imagePath,
  practiceName = 'Smile Dental Clinic',
  specialty = 'Cosmetic Dentistry',
}: PhonePreviewModalProps) {
  const [platform, setPlatform] = useState<'instagram' | 'facebook' | 'linkedin'>('instagram');

  if (!isOpen) return null;

  const displayImage =
    imagePath ||
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60';

  const initial = practiceName.charAt(0).toUpperCase() || 'P';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>📱 Social Feed Preview</div>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        <div className={styles.platformTabs}>
          <button
            type="button"
            onClick={() => setPlatform('instagram')}
            className={`${styles.platformTab} ${platform === 'instagram' ? styles.platformTabActive : ''}`}
          >
            <span>📸 Instagram</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatform('facebook')}
            className={`${styles.platformTab} ${platform === 'facebook' ? styles.platformTabActive : ''}`}
          >
            <span>👥 Facebook</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatform('linkedin')}
            className={`${styles.platformTab} ${platform === 'linkedin' ? styles.platformTabActive : ''}`}
          >
            <span>💼 LinkedIn</span>
          </button>
        </div>

        <div className={styles.phoneBody}>
          <div className={styles.phoneDevice}>
            <div className={styles.phoneNotch}>
              <div className={styles.speaker}></div>
            </div>

            {/* Header */}
            <div className={styles.postHeader}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  <div className={styles.avatarInner}>{initial}</div>
                </div>
                <div>
                  <div className={styles.authorName}>
                    {practiceName}
                    <span className={styles.verifiedBadge} title="Verified Practice">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {platform === 'linkedin' ? `${specialty} • Just now` : 'Sponsored • Local Clinic'}
                  </div>
                </div>
              </div>
              <span style={{ color: '#64748b', cursor: 'pointer' }}>•••</span>
            </div>

            {/* Image Media */}
            <div className={styles.postMedia}>
              <img src={displayImage} alt="Post preview" />
            </div>

            {/* Action Bar */}
            <div className={styles.postActions}>
              <div className={styles.actionIcons}>
                {platform === 'instagram' && (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </>
                )}
                {platform === 'facebook' && (
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1877f2' }}>
                    👍 Like &nbsp; • &nbsp; 💬 Comment &nbsp; • &nbsp; ↗ Share
                  </span>
                )}
                {platform === 'linkedin' && (
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0a66c2' }}>
                    👏 Celebrate &nbsp; • &nbsp; 💬 Comment &nbsp; • &nbsp; 🔄 Repost
                  </span>
                )}
              </div>
            </div>

            {/* Caption & Details */}
            <div className={styles.postDetails}>
              <div className={styles.likesCount}>142 likes</div>
              <div className={styles.postCaption}>
                <strong>{practiceName.toLowerCase().replace(/\s+/g, '_')}</strong>{' '}
                {caption}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
