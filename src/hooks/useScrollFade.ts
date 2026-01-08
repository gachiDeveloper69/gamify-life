import { useEffect } from 'react';

type ScrollFadeOptions = {
  offset?: number; //отступ скролла до появления фейда
};

export function useScrollFade<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  opts: ScrollFadeOptions = {}
) {
  const offset = opts.offset ?? 10;
  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;

      const canScroll = scrollHeight > clientHeight + 1;
      const showTop = canScroll && scrollTop > offset;
      const showBottom = canScroll && scrollTop + clientHeight < scrollHeight - offset;

      el.classList.toggle('is-top-fade', canScroll && showTop);
      el.classList.toggle('is-bottom-fade', canScroll && showBottom);
    };

    update();
    el.addEventListener('scroll', update);
    window.addEventListener('resize', update);

    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [ref, offset]);
}
