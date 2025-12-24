export type FestType = 'Saavan' | 'Margazhi' | 'Paradox';
export type Phase = 'contender' | 'breakthrough' | 'dominance';
export type EventStatus = 'completed' | 'upcoming';

export interface FestEvent {
  id: string;
  fest: FestType;
  year: number;
  rank: number | null;
  isTrophyWin: boolean;
  phase: Phase;
  cycleId: string;
  status: EventStatus;
  description?: string;
}

export interface TimelineState {
  currentEventIndex: number;
  currentEvent: FestEvent;
  phase: Phase;
  totalTrophies: number;
  currentStreak: number;
  cycleProgress: { completed: number; total: number };
  eventsUpToNow: FestEvent[];
}

// Canonical Gir Performance History
export const festHistory: FestEvent[] = [
  {
    id: 'saavan-2023',
    fest: 'Saavan',
    year: 2023,
    rank: 4,
    isTrophyWin: false,
    phase: 'contender',
    cycleId: 'paradox-2024',
    status: 'completed',
    description: 'Gir enters the arena. A solid #4 finish marks the beginning.',
  },
  {
    id: 'margazhi-2024',
    fest: 'Margazhi',
    year: 2024,
    rank: 4,
    isTrophyWin: false,
    phase: 'contender',
    cycleId: 'paradox-2024',
    status: 'completed',
    description: 'Consistency builds. Gir holds steady at #4.',
  },
  {
    id: 'paradox-2024',
    fest: 'Paradox',
    year: 2024,
    rank: 1,
    isTrophyWin: true,
    phase: 'breakthrough',
    cycleId: 'paradox-2024',
    status: 'completed',
    description: 'THE BREAKTHROUGH. Gir claims the throne with a stunning #1 finish and the House Trophy.',
  },
  {
    id: 'margazhi-2025',
    fest: 'Margazhi',
    year: 2025,
    rank: 1,
    isTrophyWin: false,
    phase: 'dominance',
    cycleId: 'paradox-2025',
    status: 'completed',
    description: 'Dominance begins. Gir defends the #1 position.',
  },
  {
    id: 'paradox-2025',
    fest: 'Paradox',
    year: 2025,
    rank: 1,
    isTrophyWin: true,
    phase: 'dominance',
    cycleId: 'paradox-2025',
    status: 'completed',
    description: 'BACK-TO-BACK. Gir secures the second consecutive House Trophy.',
  },
  {
    id: 'saavan-2025',
    fest: 'Saavan',
    year: 2025,
    rank: 1,
    isTrophyWin: false,
    phase: 'dominance',
    cycleId: 'paradox-2026',
    status: 'completed',
    description: 'The streak continues. Four consecutive #1 finishes.',
  },
  {
    id: 'margazhi-2026',
    fest: 'Margazhi',
    year: 2026,
    rank: null,
    isTrophyWin: false,
    phase: 'dominance',
    cycleId: 'paradox-2026',
    status: 'upcoming',
    description: 'The journey continues...',
  },
  {
    id: 'paradox-2026',
    fest: 'Paradox',
    year: 2026,
    rank: null,
    isTrophyWin: false,
    phase: 'dominance',
    cycleId: 'paradox-2026',
    status: 'upcoming',
    description: 'Can Gir claim a third consecutive trophy?',
  },
];

// Helper functions
export function getCompletedEvents(): FestEvent[] {
  return festHistory.filter(e => e.status === 'completed');
}

export function getUpcomingEvents(): FestEvent[] {
  return festHistory.filter(e => e.status === 'upcoming');
}

export function getTrophyCount(upToIndex: number): number {
  return festHistory
    .slice(0, upToIndex + 1)
    .filter(e => e.isTrophyWin)
    .length;
}

export function getCurrentStreak(upToIndex: number): number {
  let streak = 0;
  for (let i = upToIndex; i >= 0; i--) {
    if (festHistory[i].rank === 1 && festHistory[i].status === 'completed') {
      streak++;
    } else if (festHistory[i].status === 'completed') {
      break;
    }
  }
  return streak;
}

export function getCycleProgress(eventIndex: number): { completed: number; total: number } {
  const event = festHistory[eventIndex];
  if (!event) return { completed: 0, total: 3 };
  
  const cycleEvents = festHistory.filter(e => e.cycleId === event.cycleId);
  const completedInCycle = cycleEvents.filter(e => 
    e.status === 'completed' && 
    festHistory.indexOf(e) <= eventIndex
  ).length;
  
  return { completed: completedInCycle, total: 3 };
}

export function getFestColor(fest: FestType): string {
  switch (fest) {
    case 'Saavan': return 'var(--fest-saavan)';
    case 'Margazhi': return 'var(--fest-margazhi)';
    case 'Paradox': return 'var(--fest-paradox)';
  }
}

export function getPhaseColor(phase: Phase): string {
  switch (phase) {
    case 'contender': return 'var(--phase-contender)';
    case 'breakthrough': return 'var(--phase-breakthrough)';
    case 'dominance': return 'var(--phase-dominance)';
  }
}

export function getRankColor(rank: number | null): string {
  if (rank === null) return 'var(--text-muted)';
  switch (rank) {
    case 1: return 'var(--rank-1)';
    case 2: return 'var(--rank-2)';
    case 3: return 'var(--rank-3)';
    default: return 'var(--rank-4)';
  }
}

export function deriveTimelineState(eventIndex: number): TimelineState {
  const clampedIndex = Math.max(0, Math.min(eventIndex, festHistory.length - 1));
  const currentEvent = festHistory[clampedIndex];
  
  return {
    currentEventIndex: clampedIndex,
    currentEvent,
    phase: currentEvent.phase,
    totalTrophies: getTrophyCount(clampedIndex),
    currentStreak: getCurrentStreak(clampedIndex),
    cycleProgress: getCycleProgress(clampedIndex),
    eventsUpToNow: festHistory.slice(0, clampedIndex + 1),
  };
}

