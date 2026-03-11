import React from 'react';
import clsx from 'clsx';
import { TASK_RULES } from '@/config/taskRules';

type QuestDescriptionSectionProps = {
  mode: 'view' | 'edit' | 'create';
  description: string;
  fadeRef?: React.RefObject<HTMLDivElement | null>;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onChange: (value: string) => void;
};

export function QuestDescriptionSection({
  mode,
  description,
  fadeRef,
  scrollRef,
  onChange,
}: QuestDescriptionSectionProps) {
  const isEditable = mode === 'edit' || mode === 'create';
  const isView = mode === 'view';

  return (
    <div
      className={clsx('briefing__body', isEditable && 'briefing__body--editable')}
      ref={isView ? fadeRef : undefined}
    >
      <div className="briefing__scroll" ref={isView ? scrollRef : undefined}>
        {isView ? (
          description ? (
            <p className="briefing__desc">{description}</p>
          ) : (
            <p className="briefing__desc briefing__desc--muted">Описание отсутствует</p>
          )
        ) : (
          <textarea
            className="briefing__desc briefing__desc--textarea"
            value={description}
            onChange={e => onChange(e.target.value)}
            placeholder="Описание миссии (необязательно)"
            aria-label="Описание миссии"
            rows={6}
            maxLength={TASK_RULES.description.max}
          />
        )}
      </div>
    </div>
  );
}
