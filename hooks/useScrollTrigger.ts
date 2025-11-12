import { useEffect, useState } from 'react';

interface UseScrollTriggerOptions {
  threshold?: number;
  disabled?: boolean;
}

/**
 * Custom hook to detect when user has scrolled past a threshold
 *
 * @param options.threshold - Scroll position in pixels to trigger (default: 200)
 * @param options.disabled - Disable scroll detection (default: false)
 * @returns isTriggered - Whether scroll position is past threshold
 *
 * @example
 * const isScrolled = useScrollTrigger({ threshold: 200 });
 *
 * // Use in component
 * <nav className={isScrolled ? 'sticky-mode' : 'normal-mode'}>
 */
export function useScrollTrigger({
  threshold = 200,
  disabled = false
}: UseScrollTriggerOptions = {}): boolean {
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    if (disabled) {
      setIsTriggered(false);
      return;
    }

    let rafId: number | null = null;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (rafId !== null) {
        return;
      }

      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Only update state if crossing the threshold boundary
        if (lastScrollY <= threshold && currentScrollY > threshold) {
          setIsTriggered(true);
        } else if (lastScrollY > threshold && currentScrollY <= threshold) {
          setIsTriggered(false);
        }

        lastScrollY = currentScrollY;
        rafId = null;
      });
    };

    // Set initial state
    setIsTriggered(window.scrollY > threshold);

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [threshold, disabled]);

  return isTriggered;
}
