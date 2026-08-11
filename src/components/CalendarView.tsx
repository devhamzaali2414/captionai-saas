'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';
import styles from './CalendarView.module.css';

interface Draft {
  id: number;
  content: string;
  status: string;
  scheduledAt: Date | string | null;
  imagePath?: string | null;
  hashtags?: string;
  createdAt: Date | string;
}

interface CalendarViewProps {
  drafts: Draft[];
}

export default function CalendarView({ drafts }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const scheduledDrafts = drafts.filter(d => d.scheduledAt);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function prevMonth() {
    setCurrentMonth(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth(new Date(year, month + 1, 1));
  }

  function jumpToToday() {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  }

  // Generate day cells
  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day);
    calendarCells.push({
      date,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Current month days
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day;

    calendarCells.push({
      date,
      dayNumber: day,
      isCurrentMonth: true,
      isToday,
    });
  }

  // Next month leading days to complete standard 35 or 42 grid
  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(year, month + 1, day);
    calendarCells.push({
      date,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Helper to get drafts on a given date
  function getDraftsForDate(date: Date) {
    const dateStr = date.toDateString();
    return scheduledDrafts.filter(d => {
      if (!d.scheduledAt) return false;
      const dDate = new Date(d.scheduledAt);
      return dDate.toDateString() === dateStr;
    });
  }

  const selectedDateDrafts = selectedDate ? getDraftsForDate(selectedDate) : [];

  return (
    <div className={styles.container}>
      <div className={styles.calendarCard}>
        <div className={styles.header}>
          <h2 className={styles.monthTitle}>
            {monthNames[month]} {year}
          </h2>
          <div className={styles.controls}>
            <button type="button" onClick={jumpToToday} className={styles.todayBtn}>
              Today
            </button>
            <button type="button" onClick={prevMonth} className={styles.navBtn} title="Previous Month">
              ‹
            </button>
            <button type="button" onClick={nextMonth} className={styles.navBtn} title="Next Month">
              ›
            </button>
          </div>
        </div>

        <div className={styles.daysGrid}>
          {dayHeaders.map(day => (
            <div key={day} className={styles.dayHeader}>
              {day}
            </div>
          ))}

          {calendarCells.map((cell, idx) => {
            const cellDrafts = getDraftsForDate(cell.date);
            const isSelected = selectedDate && selectedDate.toDateString() === cell.date.toDateString();

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(cell.date)}
                className={`${styles.dayCell} ${!cell.isCurrentMonth ? styles.outsideMonth : ''} ${cell.isToday ? styles.todayCell : ''}`}
                style={{
                  outline: isSelected ? '2px solid var(--primary)' : 'none',
                  zIndex: isSelected ? 1 : 0,
                }}
              >
                <div className={styles.dayNumberRow}>
                  <span className={`${styles.dayNumber} ${cell.isToday ? styles.todayBadge : ''}`}>
                    {cell.dayNumber}
                  </span>
                  {cellDrafts.length > 0 && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>
                      {cellDrafts.length} post{cellDrafts.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {cellDrafts.slice(0, 2).map(draft => (
                  <div key={draft.id} className={styles.postChip} title={draft.content}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{draft.content.substring(0, 24)}...</span>
                  </div>
                ))}

                {cellDrafts.length > 2 && (
                  <span className={styles.moreBadge}>
                    +{cellDrafts.length - 2} more
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Scheduled Posts Detail View */}
      {selectedDate && (
        <div className={styles.detailSection}>
          <div className={styles.detailHeader}>
            <h3 className={styles.detailTitle}>
              Scheduled Posts for {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {selectedDateDrafts.length} scheduled
            </span>
          </div>

          {selectedDateDrafts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No captions scheduled for this date. Go to the <strong>Card View</strong> to schedule a draft!
            </p>
          ) : (
            <div className={styles.detailList}>
              {selectedDateDrafts.map(draft => {
                const schedDate = draft.scheduledAt ? new Date(draft.scheduledAt) : null;
                const timeStr = schedDate ? schedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

                return (
                  <div key={draft.id} className={styles.detailItem}>
                    {timeStr && (
                      <div className={styles.timeTag}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>Scheduled for {timeStr}</span>
                      </div>
                    )}

                    {draft.imagePath && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <img
                          src={draft.imagePath}
                          alt="Post visual"
                          style={{ maxHeight: '140px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <div className={styles.detailContent}>
                      {draft.content}
                    </div>

                    <div className={styles.detailFooter}>
                      <CopyButton text={draft.content} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
