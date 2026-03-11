import { useEffect, useRef } from 'react';
import type { QuestModalProps } from '../types';

export function useQuestTitleFocus(props: QuestModalProps) {
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (props.mode === 'edit' || props.mode === 'create') {
      titleRef.current?.focus();
      titleRef.current?.select();
    }
  }, [props.mode, props.mode === 'create' ? 'draft' : props.quest.id]);

  return {
    titleRef,
  };
}
