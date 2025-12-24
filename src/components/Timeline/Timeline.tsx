import { useRef, useState, useEffect } from 'react';
import { festHistory, deriveTimelineState } from '../../data/festHistory';
import { useScrollProgress, useCurrentEventIndex } from '../../hooks/useScrollProgress';
import { SidebarTimeline } from '../SidebarTimeline';
import { FestBadge } from '../FestBadge';
import { PhaseIndicator } from '../PhaseIndicator';
import { TrophyCounter } from '../TrophyCounter';
import { StreakMeter } from '../StreakMeter';
import { CycleProgress } from '../CycleProgress';
import { RankChart } from '../RankChart';
import styles from './Timeline.module.css';

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress
  const scrollProgress = useScrollProgress(containerRef, { offset: 100 });
  const currentEventIndex = useCurrentEventIndex(scrollProgress, festHistory.length);
  
  // Derive timeline state from current event
  const timelineState = deriveTimelineState(currentEventIndex);
  const { currentEvent, phase, totalTrophies, currentStreak, cycleProgress } = timelineState;
  
  // Track phase changes for animation triggers
  const [prevPhase, setPrevPhase] = useState(phase);
  const [phaseChanged, setPhaseChanged] = useState(false);
  
  useEffect(() => {
    if (phase !== prevPhase) {
      setPhaseChanged(true);
      setPrevPhase(phase);
      const timer = setTimeout(() => setPhaseChanged(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, prevPhase]);
  
  const handleEventClick = (index: number) => {
    // Scroll to the corresponding section
    if (containerRef.current) {
      const eventSection = containerRef.current.querySelector(`[data-event-index="${index}"]`);
      if (eventSection) {
        eventSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
  
  return (
    <div className={styles.wrapper}>
      {/* Left Sidebar Timeline */}
      <SidebarTimeline 
        currentIndex={currentEventIndex}
        onEventClick={handleEventClick}
      />
      
      {/* Main Content Area */}
      <div ref={containerRef} className={styles.mainContainer}>
        {/* Scrollable Content Sections */}
        <div className={styles.contentSections}>
          {festHistory.map((event, index) => (
            <section
              key={event.id}
              data-event-index={index}
              className={styles.contentSection}
            >
              {/* Sticky Dashboard */}
              <div className={styles.stickyDashboard}>
                <div 
                  className={`
                    ${styles.dashboard} 
                    ${index === currentEventIndex ? styles.active : ''}
                    ${phaseChanged && index === currentEventIndex ? styles.phaseTransition : ''}
                    ${phase === 'dominance' && index === currentEventIndex ? styles.dominanceMode : ''}
                  `}
                >
                  {/* Top Row: Date Badge + Phase */}
                  <div className={styles.topRow}>
                    <FestBadge 
                      fest={event.fest}
                      year={event.year}
                      isTrophyWin={event.isTrophyWin}
                    />
                    <PhaseIndicator currentPhase={event.phase} />
                  </div>
                  
                  {/* Chart Section */}
                  <div className={styles.chartSection}>
                    <RankChart 
                      events={festHistory}
                      currentIndex={index}
                    />
                  </div>
                  
                  {/* Content Area (empty for now, ready for future content) */}
                  <div className={styles.contentArea}>
                    {/* This area is reserved for narrative content */}
                    {/* Will be populated later with event descriptions and stories */}
                  </div>
                  
                  {/* Event Description */}
                  <div className={styles.description}>
                    <p className={styles.eventDescription}>
                      {event.description}
                    </p>
                    {event.rank !== null && (
                      <div className={styles.rankDisplay}>
                        <span className={styles.rankLabel}>Rank</span>
                        <span 
                          className={styles.rankValue}
                          style={{ 
                            color: event.rank === 1 
                              ? 'var(--rank-1)' 
                              : 'var(--text-primary)' 
                          }}
                        >
                          #{event.rank}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Metrics Row */}
                  <div className={styles.metricsRow}>
                    <TrophyCounter count={deriveTimelineState(index).totalTrophies} />
                    <div className={styles.divider} />
                    <StreakMeter streak={deriveTimelineState(index).currentStreak} />
                    <div className={styles.divider} />
                    <CycleProgress 
                      completed={deriveTimelineState(index).cycleProgress.completed}
                      cycleId={event.cycleId}
                    />
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${(index + 1) / festHistory.length * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.principle}>
            "Gir is defined not by one win, but by repeated excellence over time."
          </p>
          <p className={styles.credit}>
            IIT Madras BS Degree · House Competition Archives
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Timeline;
