import clsx from 'clsx';
import ChevronArrow from '@/assets/icons/chevron-right.svg?react';
import StripeLight from '@/assets/icons/stripe-2.svg?react';
import StripeMedium from '@/assets/icons/stripe-medium.svg?react';
import StripeHard from '@/assets/icons/stripe-hard-2.svg?react';
import type { TaskCategory } from '@/types/task';

type QuestDifficultyControlProps = {
  category: TaskCategory;
  canEdit: boolean;
  animating: boolean;
  onRotate: (dir: 1 | -1) => void;
};

const STRIPE_BY_DIFFICULTY = {
  easy: StripeLight,
  medium: StripeMedium,
  hard: StripeHard,
} as const;

export function QuestDifficultyControl({
  category,
  canEdit,
  animating,
  onRotate,
}: QuestDifficultyControlProps) {
  const StripeIcon = STRIPE_BY_DIFFICULTY[category];

  return (
    <div className="briefing__difficulty">
      {canEdit && (
        <button
          className={clsx(
            'difficulty__arrow',
            'difficulty__arrow--up',
            `difficulty__arrow--${category}`
          )}
          onClick={() => onRotate(1)}
          type="button"
          aria-label="Повысить сложность"
        >
          <ChevronArrow />
        </button>
      )}

      <div
        className={clsx(
          'qchev__chevron',
          `qchev__chevron--${category}`,
          animating && 'qchev__chevron--switching'
        )}
      >
        <span className="qchev__frame" aria-hidden="true" />
        <StripeIcon className="qchev__icon" />
      </div>

      {canEdit && (
        <button
          className={clsx(
            'difficulty__arrow',
            'difficulty__arrow--down',
            `difficulty__arrow--${category}`
          )}
          onClick={() => onRotate(-1)}
          type="button"
          aria-label="Понизить сложность"
        >
          <ChevronArrow />
        </button>
      )}
    </div>
  );
}
