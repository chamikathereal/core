'use client';

import React, { useMemo } from 'react';

export interface DaySchedule {
  open?: string | null;
  close?: string | null;
  closed?: boolean | null;
}

export type WeeklyHours = Record<string, DaySchedule | string | null | undefined>;

export interface BusinessHoursProps {
  hours?: WeeklyHours | null;
  title?: string;
  fieldPath?: string;
  showStatusBadge?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

function formatTime(timeStr?: string | null): string {
  if (!timeStr) return '';
  const clean = timeStr.trim();
  // If already contains AM/PM
  if (/am|pm/i.test(clean)) return clean;

  const [hourStr, minStr = '00'] = clean.split(':');
  const hour = parseInt(hourStr, 10);
  if (isNaN(hour)) return clean;

  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minStr.padStart(2, '0')} ${ampm}`;
}

/**
 * BusinessHours component displaying weekly operating schedule with live Open/Closed status.
 */
export function BusinessHours({
  hours,
  title = 'Business Hours',
  fieldPath = 'common.business.hours',
  showStatusBadge = true,
  compact = false,
  className = '',
  style,
}: BusinessHoursProps) {
  // Determine current day and status
  const currentStatus = useMemo(() => {
    if (!hours) return null;
    const now = new Date();
    const dayIndex = (now.getDay() + 6) % 7; // Convert 0(Sun)-6(Sat) to 0(Mon)-6(Sun)
    const todayName = DAYS_OF_WEEK[dayIndex];
    const todaySched = hours[todayName];

    if (!todaySched) return { todayName, isOpen: false };

    if (typeof todaySched === 'string') {
      if (/closed/i.test(todaySched)) return { todayName, isOpen: false };
      return { todayName, isOpen: true };
    }

    if (todaySched.closed || !todaySched.open || !todaySched.close) {
      return { todayName, isOpen: false };
    }

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [openH = '0', openM = '0'] = todaySched.open.split(':');
    const [closeH = '0', closeM = '0'] = todaySched.close.split(':');
    const openMinutes = parseInt(openH, 10) * 60 + parseInt(openM, 10);
    const closeMinutes = parseInt(closeH, 10) * 60 + parseInt(closeM, 10);

    const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
    return { todayName, isOpen };
  }, [hours]);

  if (!hours) return null;

  const containerStyles: React.CSSProperties = {
    padding: compact ? '1rem' : '1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid var(--color-border, #e2e8f0)',
    backgroundColor: 'var(--color-surface, #ffffff)',
    ...style,
  };

  return (
    <div
      className={`deneb-business-hours ${className}`.trim()}
      style={containerStyles}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text, #0f172a)' }}>
          <span data-preview-field-path={fieldPath ? `${fieldPath}.title` : 'contact.businessHoursTitle'}>{title}</span>
        </h4>
        {showStatusBadge && currentStatus && (
          <span
            data-preview-static="business-hours-status"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: currentStatus.isOpen ? '#ecfdf5' : '#f1f5f9',
              color: currentStatus.isOpen ? '#059669' : '#64748b',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: currentStatus.isOpen ? '#10b981' : '#94a3b8',
              }}
            />
            {currentStatus.isOpen ? 'Open Now' : 'Closed'}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '0.35rem' : '0.5rem' }}>
        {DAYS_OF_WEEK.map((day) => {
          const sched = hours[day];
          const isToday = currentStatus?.todayName === day;
          const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);

          let scheduleText = 'Closed';
          if (sched) {
            if (typeof sched === 'string') {
              scheduleText = sched;
            } else if (!sched.closed && sched.open && sched.close) {
              scheduleText = `${formatTime(sched.open)} – ${formatTime(sched.close)}`;
            }
          }

          return (
            <div
              key={day}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                backgroundColor: isToday ? 'var(--color-secondary, #f8fafc)' : 'transparent',
                fontWeight: isToday ? 600 : 400,
                color: isToday ? 'var(--color-primary, #0f172a)' : 'var(--color-text-muted, #475569)',
              }}
            >
              <span data-preview-static="business-hours-day">{dayLabel}</span>
              <span data-preview-field-path={`${fieldPath}.${day}`}>{scheduleText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
