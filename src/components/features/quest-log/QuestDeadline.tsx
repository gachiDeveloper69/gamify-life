import React, { useEffect, useMemo, useState } from 'react';

import Lightning from '@/assets/icons/lightning.svg?react';

type DeadlineState = 'ok' | 'warn' | 'danger' | 'overdue';

type Props = {
  deadline: Date | string;
};

function toDate(d: Date | string): Date {
  return d instanceof Date ? d : new Date(d);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatRemaining(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const totalMin = Math.floor(totalSec / 60);
  const totalH = Math.floor(totalMin / 60);
  const days = Math.floor(totalH / 24);

  const andHours = totalH % 24;
  const andMinutes = totalMin % 60;

  if (days >= 1) {
    const countdown = andHours ? `${days}д ${andHours}ч` : `${days}д`;
    return { text: countdown, unit: 'd' as const };
  }

  if (totalH >= 1) {
    return { text: `${totalH}ч ${andMinutes}м`, unit: 'm' as const };
  }

  return { text: `${Math.max(0, totalMin)}м`, unit: 'm' as const };
}

function getState(ms: number): DeadlineState {
  if (ms <= 0) return 'overdue';
  if (ms <= 60 * 60 * 1000) return 'danger'; //<1h
  if (ms <= 24 * 60 * 60 * 1000) return 'warn'; //<1d
  return 'ok';
}

function getLabel(state: DeadlineState) {
  switch (state) {
    case 'overdue':
      return 'ПРОСРОЧЕНО';
    case 'danger':
      return 'СРОЧНАЯ';
    default:
      return null;
  }
}

export function QuestDeadline({ deadline }: Props) {
  const deadlineDate = useMemo(() => toDate(deadline), [deadline]);
  const [now, setNow] = useState(() => Date.now());

  const msLeft = deadlineDate.getTime() - now;
  const state = getState(msLeft);

  useEffect(() => {
    const interval = state === 'danger' ? 10_000 : 60_000;

    setNow(Date.now());

    const id = window.setInterval(() => {
      setNow(Date.now());
    }, interval);

    return () => window.clearInterval(id);
  }, [state, deadlineDate.getTime()]);

  const label = getLabel(state);

  const timeText = useMemo(() => {
    if (state === 'overdue') return '00:00';
    return formatRemaining(msLeft).text;
  }, [msLeft, state]);

  return (
    <span className={`qdeadline qdeadline--${state}`}>
      <Lightning className={`qdeadline__icon qdeadline__icon--${state}`} />
      {/* {label && <span className="qdeadline__tag">{label}</span>} */}
      <span className="qdeadline__time" aria-label="Осталось времени">
        {timeText}
      </span>
    </span>
  );
}
