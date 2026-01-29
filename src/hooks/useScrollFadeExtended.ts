import { useEffect, useLayoutEffect } from 'react';
import type { ScrollFadeOptions } from './useScrollFade';

export function useScrollFadeExtended(
  containerRef: React.RefObject<HTMLElement | null>, // куда вешаем классы
  scrollRef: React.RefObject<HTMLElement | null>, // что скроллится
  opts: ScrollFadeOptions = {}
) {
  const offset = opts.offset ?? 10;

  useLayoutEffect(() => {
    const container = containerRef.current;
    const scroller = scrollRef.current;

    if (!container || !scroller) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = scroller;

      const canScroll = scrollHeight > clientHeight + 1;
      const showTop = canScroll && scrollTop > offset;
      const showBottom = canScroll && scrollTop + clientHeight < scrollHeight - offset;

      container.classList.toggle('is-top-fade', showTop);
      container.classList.toggle('is-bottom-fade', showBottom);
    };

    update();
    requestAnimationFrame(update);

    // важное: после layout
    const raf1 = requestAnimationFrame(() => {
      update();
      requestAnimationFrame(update);
    });

    scroller.addEventListener('scroll', update, { passive: true });

    const ro = new ResizeObserver(() => update());
    ro.observe(scroller);

    return () => {
      cancelAnimationFrame(raf1);
      scroller.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [containerRef, scrollRef, offset]);
}
