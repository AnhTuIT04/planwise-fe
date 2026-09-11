"use client";

import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  enabled: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  root?: Element | null;
}

export function useInfiniteScroll<T extends HTMLElement>({
  enabled,
  isLoading,
  onLoadMore,
  rootMargin = "200px",
  root = null,
}: UseInfiniteScrollOptions) {
  const ref = useRef<T | null>(null);
  const loadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!enabled || isLoading) return;
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            loadMoreRef.current();
            break;
          }
        }
      },
      { root, rootMargin, threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, isLoading, root, rootMargin]);

  return ref;
}
