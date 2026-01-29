import React, { useEffect, useLayoutEffect } from 'react';

export type ScrollFadeOptions = {
  offset?: number; //отступ скролла до появления фейда
};

/**
 * useScrollFade(ref)
 *   - legacy режим: ref = и контейнер, и скроллер (на него вешаем классы и по нему считаем scroll)
 *
 * useScrollFade(containerRef, { offset })
 *   - то же самое (с options)
 *
 * useScrollFade(containerRef, scrollerRef, { offset })
 *   - новый режим: классы вешаем на containerRef, а scroll считаем по scrollerRef
 */

export function useScrollFade<
  TContainer extends HTMLElement,
  TScroller extends HTMLElement = TContainer,
>(
  refOrContainerRef: React.RefObject<TContainer | null>,
  scrollerRefOrOpts?: React.RefObject<TScroller | null> | ScrollFadeOptions,
  maybeOpts?: ScrollFadeOptions,
  deps: unknown[] = []
) {
  const isSecondArgRef =
    scrollerRefOrOpts != null &&
    typeof scrollerRefOrOpts === 'object' &&
    'current' in scrollerRefOrOpts;

  const containerRef = refOrContainerRef;
  const scrollerRef = (
    isSecondArgRef ? (scrollerRefOrOpts as React.RefObject<TScroller | null>) : null
  ) as React.RefObject<TScroller | null> | null;

  const opts =
    (isSecondArgRef ? maybeOpts : (scrollerRefOrOpts as ScrollFadeOptions | undefined)) ?? {};
  const offset = opts.offset ?? 10;

  console.log('hook mounted');

  useLayoutEffect(() => {
    const container = containerRef.current;
    const scroller = (scrollerRef?.current ?? container) as HTMLElement | null;
    console.log('useLayoutEffect called');
    if (!container || !scroller) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = scroller;

      const canScroll = scrollHeight > clientHeight + 1;
      const showTop = canScroll && scrollTop > offset;
      const showBottom = canScroll && scrollTop + clientHeight < scrollHeight - offset;

      container.classList.toggle('is-top-fade', canScroll && showTop);
      container.classList.toggle('is-bottom-fade', canScroll && showBottom);
    };

    update();

    requestAnimationFrame(update);
    // первичная инициализация после layout

    let rafA = 0;
    let rafB = 0;

    rafA = requestAnimationFrame(() => {
      update();
      rafB = requestAnimationFrame(update);
    });

    scroller.addEventListener('scroll', update, { passive: true });

    const ro = new ResizeObserver(() => update);
    ro.observe(scroller);

    return () => {
      cancelAnimationFrame(rafA);
      cancelAnimationFrame(rafB);
      scroller.removeEventListener('scroll', update);
      ro.disconnect;
    };
  }, [containerRef, scrollerRef, offset, ...deps]);
}
