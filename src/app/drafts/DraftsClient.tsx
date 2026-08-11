'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';
import ImageUploader from '@/components/ImageUploader';
import CalendarView from '@/components/CalendarView';
import PhonePreviewModal from '@/components/PhonePreviewModal';
import AIImageModal from '@/components/AIImageModal';
import SubmitButton from '@/components/SubmitButton';
import { scheduleDraft, deleteDraft } from '@/app/actions/postiz';
import { enhanceDraftWithHashtags, updateDraftContent } from '@/app/actions/enhance';
import styles from './Drafts.module.css';

interface Draft {
  id: number;
  content: string;
  category?: string;
  status: string;
  scheduledAt: Date | string | null;
  imagePath?: string | null;
  hashtags?: string;
  createdAt: Date | string;
}

interface Integration {
  id: string;
  name: string;
  provider: string;
}

interface DraftsClientProps {
  initialDrafts: Draft[];
  integrations: Integration[];
}

export default function DraftsClient({ initialDrafts, integrations }: DraftsClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [filter, setFilter] = useState<'all' | 'draft' | 'scheduled'>('all');
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fix timezone: convert datetime-local (local time) to UTC ISO string before sending to server
  async function handleScheduleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const localDateStr = formData.get('scheduledDate') as string;
    if (localDateStr) {
      // new Date() in browser interprets datetime-local as LOCAL time and converts to UTC
      const utcIso = new Date(localDateStr).toISOString();
      formData.set('scheduledDate', utcIso);
    }
    await scheduleDraft(formData);
  }
  const [editContent, setEditContent] = useState<string>('');
  const [enhancingId, setEnhancingId] = useState<number | null>(null);

  // Modals state
  const [previewDraft, setPreviewDraft] = useState<Draft | null>(null);
  const [aiImageDraftId, setAiImageDraftId] = useState<number | null>(null);

  const filteredDrafts = drafts.filter((d) => {
    if (filter === 'draft') return d.status === 'draft';
    if (filter === 'scheduled') return d.status === 'scheduled';
    return true;
  });

  async function handleEnhance(draftId: number) {
    setEnhancingId(draftId);
    const res = await enhanceDraftWithHashtags(draftId);
    if (res.success && res.updatedContent) {
      setDrafts((prev) =>
        prev.map((d) => (d.id === draftId ? { ...d, content: res.updatedContent! } : d))
      );
    }
    setEnhancingId(null);
  }

  function startEditing(draft: Draft) {
    setEditingId(draft.id);
    setEditContent(draft.content);
  }

  async function saveEditing(draftId: number) {
    await updateDraftContent(draftId, editContent);
    setDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, content: editContent } : d))
    );
    setEditingId(null);
  }

  function handleImageGenerated(draftId: number, newImageUrl: string) {
    setDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, imagePath: newImageUrl } : d))
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Social Media Drafts & Calendar</h1>
          <p className={styles.subtitle}>
            Review, enhance with AI visuals, preview on simulated mobile feeds, and schedule posts.
          </p>
        </div>

        <div className={styles.tabControls}>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`${styles.tabBtn} ${viewMode === 'grid' ? styles.tabBtnActive : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Card View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`${styles.tabBtn} ${viewMode === 'calendar' ? styles.tabBtnActive : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Calendar View
          </button>
        </div>
      </header>

      {viewMode === 'calendar' ? (
        <CalendarView drafts={drafts} />
      ) : (
        <>
          <div className={styles.filterBar}>
            <div className={styles.filterChips}>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`${styles.filterChip} ${filter === 'all' ? styles.filterChipActive : ''}`}
              >
                All ({drafts.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('draft')}
                className={`${styles.filterChip} ${filter === 'draft' ? styles.filterChipActive : ''}`}
              >
                Drafts ({drafts.filter((d) => d.status === 'draft').length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('scheduled')}
                className={`${styles.filterChip} ${filter === 'scheduled' ? styles.filterChipActive : ''}`}
              >
                Scheduled ({drafts.filter((d) => d.status === 'scheduled').length})
              </button>
            </div>
          </div>

          <div className={styles.grid}>
            {filteredDrafts.length === 0 ? (
              <div className={styles.emptyState}>
                No {filter !== 'all' ? filter : ''} captions found. Head over to <strong>"Generate Caption"</strong> or <strong>"30-Day Planner"</strong> to create new posts!
              </div>
            ) : (
              filteredDrafts.map((draft) => (
                <div key={draft.id} className={styles.draftCard}>
                  <div className={styles.draftHeader}>
                    <div className={styles.headerLeft}>
                      <span
                        className={`${styles.badge} ${
                          draft.status === 'scheduled' ? styles.badgeScheduled : styles.badgeDraft
                        }`}
                      >
                        {draft.status}
                      </span>
                      {draft.category && draft.category !== 'General' && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            background: '#f1f5f9',
                            color: '#475569',
                          }}
                        >
                          {draft.category}
                        </span>
                      )}
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(draft.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className={styles.headerRight} style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => setPreviewDraft(draft)}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem', gap: '0.25rem' }}
                        title="Live Mobile Feed Preview"
                      >
                        📱 Preview
                      </button>
                      <CopyButton text={draft.content} />
                    </div>
                  </div>

                  <div className={styles.draftBody}>
                    {editingId === draft.id ? (
                      <div>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className={styles.editTextarea}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => saveEditing(draft.id)}
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.draftContent}>{draft.content}</div>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <ImageUploader draftId={draft.id} initialImagePath={draft.imagePath} />
                      <button
                        type="button"
                        onClick={() => setAiImageDraftId(draft.id)}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', gap: '0.3rem' }}
                      >
                        🎨 AI Visual Generator
                      </button>
                    </div>

                    <div className={styles.enhancementBar}>
                      <button
                        type="button"
                        onClick={() => handleEnhance(draft.id)}
                        disabled={enhancingId === draft.id}
                        className={styles.enhanceBtn}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        <span>{enhancingId === draft.id ? 'Generating...' : '✨ Enhance Hashtags'}</span>
                      </button>

                      {editingId !== draft.id && (
                        <button
                          type="button"
                          onClick={() => startEditing(draft)}
                          className={styles.editBtn}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          <span>Edit Text</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={styles.draftFooter}>
                    <div className={styles.actions}>
                      <form
                        action={async () => {
                          await deleteDraft(draft.id);
                          setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
                        }}
                      >
                        <button type="submit" className={styles.deleteBtn}>
                          Delete
                        </button>
                      </form>
                    </div>

                    {draft.status === 'draft' && (
                      <form onSubmit={handleScheduleSubmit} className={styles.scheduleForm}>
                        <input type="hidden" name="draftId" value={draft.id} />
                        <select name="integrationId" className={styles.select} required>
                          <option value="">Select account...</option>
                          {integrations.map((integration) => (
                            <option key={integration.id} value={integration.id}>
                              {integration.name} ({integration.provider})
                            </option>
                          ))}
                        </select>
                        <input
                          type="datetime-local"
                          name="scheduledDate"
                          className={styles.dateInput}
                          required
                        />
                        <SubmitButton
                          className="btn btn-primary"
                          style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                        >
                          Schedule
                        </SubmitButton>
                      </form>
                    )}

                    {draft.status === 'scheduled' && draft.scheduledAt && (
                      <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
                        📅 Scheduled for {new Date(draft.scheduledAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Phone Preview Modal */}
      {previewDraft && (
        <PhonePreviewModal
          isOpen={!!previewDraft}
          onClose={() => setPreviewDraft(null)}
          caption={previewDraft.content}
          imagePath={previewDraft.imagePath}
        />
      )}

      {/* AI Image Generator Modal */}
      {aiImageDraftId && (
        <AIImageModal
          isOpen={!!aiImageDraftId}
          onClose={() => setAiImageDraftId(null)}
          draftId={aiImageDraftId}
          onImageGenerated={(url) => handleImageGenerated(aiImageDraftId, url)}
        />
      )}
    </div>
  );
}
