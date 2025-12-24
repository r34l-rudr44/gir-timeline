import { useState, useEffect, useCallback, RefObject } from 'react';

interface ScrollProgressOptions {
  threshold?: number;
  offset?: number;
}

export function useScrollProgress(
  containerRef: RefObject<HTMLElement | null>,
  options: ScrollProgressOptions = {}
): number {
  const { threshold = 0, offset = 0 } = options;
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how much of the container has been scrolled through
    const containerTop = rect.top;
    const containerHeight = rect.height;
    
    // Start tracking when container enters viewport
    const scrollStart = windowHeight - offset;
    const scrollEnd = -containerHeight + windowHeight + offset;
    
    // Calculate progress from 0 to 1
    let rawProgress = 0;
    
    if (containerTop <= scrollStart && containerTop >= scrollEnd) {
      rawProgress = (scrollStart - containerTop) / (scrollStart - scrollEnd);
    } else if (containerTop < scrollEnd) {
      rawProgress = 1;
    }
    
    // Clamp between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));
    
    // Apply threshold
    if (Math.abs(clampedProgress - progress) > threshold) {
      setProgress(clampedProgress);
    }
  }, [containerRef, progress, threshold, offset]);

  useEffect(() => {
    // Initial calculation
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return progress;
}

// Hook to get the current event index based on scroll progress
export function useCurrentEventIndex(
  progress: number,
  totalEvents: number
): number {
  // Map progress (0-1) to event index
  // We want to distribute events evenly across the scroll
  const index = Math.floor(progress * totalEvents);
  return Math.min(index, totalEvents - 1);
}

