import { useMemo, useState, useEffect } from 'react';
import type { TimelineState } from '../data/festHistory';
import { 
  festHistory, 
  deriveTimelineState, 
  getCompletedEvents 
} from '../data/festHistory';

export function useTimelineState(eventIndex: number): TimelineState {
  return useMemo(() => deriveTimelineState(eventIndex), [eventIndex]);
}

export function useEventFromProgress(progress: number): TimelineState {
  const completedEvents = getCompletedEvents();
  const totalEvents = festHistory.length;
  
  // Map progress to event index
  // 0-90% covers completed events, 90-100% shows future
  const adjustedProgress = progress * 1.1; // Slight extension for future events
  const eventIndex = Math.min(
    Math.floor(adjustedProgress * totalEvents),
    totalEvents - 1
  );
  
  return deriveTimelineState(eventIndex);
}

// Animated counter hook
export function useCountUp(
  target: number,
  duration: number = 1000,
  isActive: boolean = true
): number {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isActive) {
      setCount(target);
      return;
    }
    
    let startTime: number | null = null;
    let animationFrame: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(target * eased));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, isActive]);
  
  return count;
}

