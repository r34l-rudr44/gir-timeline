import { useRef, useState, useEffect } from 'react';
import { festHistory, deriveTimelineState } from '../../data/festHistory';
import { useScrollProgress, useCurrentEventIndex } from '../../hooks/useScrollProgress';
import { FestBadge } from '../FestBadge';
import { PhaseIndicator } from '../PhaseIndicator';
import { TrophyCounter } from '../TrophyCounter';
import { StreakMeter } from '../StreakMeter';
import { CycleProgress } from '../CycleProgress';
import { RankChart } from '../RankChart';
import styles from './Timeline.module.css';

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  
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
  
  return (
    <div className={styles.wrapper}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            <span className={styles.house}>Gir</span>
            <span className={styles.subtitle}>House Trophy Timeline</span>
          </h1>
          <p className={styles.tagline}>
            A story of growth, breakthrough, and sustained excellence
          </p>
          <div className={styles.scrollHint}>
            <span>Scroll to explore</span>
            <div className={styles.scrollArrow}>↓</div>
          </div>
        </div>
      </header>
      
      {/* Main Timeline Layout - 3 Column */}
      <div ref={containerRef} className={styles.mainLayout}>
        {/* Left Sidebar - Timeline Navigation */}
        <aside className={styles.timelineSidebar}>
          <div className={styles.sidebarContent}>
            {festHistory.map((event, index) => {
              const isActive = index === currentEventIndex;
              const isPast = index < currentEventIndex;
              
              return (
                <div
                  key={event.id}
                  className={`
                    ${styles.timelineItem}
                    ${isActive ? styles.active : ''}
                    ${isPast ? styles.past : ''}
                  `}
                >
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineDate}>
                      {event.fest} {event.year}
                    </div>
                    {isActive && (
                      <div className={styles.timelineRank}>
                        {event.rank !== null ? `Rank #${event.rank}` : 'Upcoming'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
        
        {/* Center Content Area */}
        <main className={styles.contentArea}>
          <div className={styles.contentWrapper}>
            {/* Date Badge */}
            <div className={styles.contentHeader}>
              <FestBadge 
                fest={currentEvent.fest}
                year={currentEvent.year}
                isTrophyWin={currentEvent.isTrophyWin}
              />
            </div>
            
            {/* Chart Section */}
            <div className={styles.chartSection}>
              <RankChart 
                events={festHistory}
                currentIndex={currentEventIndex}
              />
            </div>
            
            {/* Event Description */}
            <div className={styles.description}>
              <p className={styles.eventDescription}>
                {currentEvent.description}
              </p>
            </div>
            
            {/* Phase Indicator */}
            <div className={styles.phaseSection}>
              <PhaseIndicator currentPhase={phase} />
            </div>
            
            {/* Scroll Spacer - Creates scrollable area */}
            <div className={styles.scrollSpacer}>
              {festHistory.map((event, index) => (
                <div 
                  key={event.id}
                  className={styles.eventSection}
                />
              ))}
            </div>
          </div>
        </main>
        
        {/* Right Sidebar - Fixed Stats Bar */}
        <aside className={styles.statsSidebar}>
          <div className={styles.statsContent}>
            <div className={styles.statsHeader}>
              <span className={styles.statsTitle}>STATS</span>
            </div>
            
            <div className={styles.statsMetrics}>
              <TrophyCounter count={totalTrophies} />
              
              <div className={styles.statDivider} />
              
              <StreakMeter streak={currentStreak} />
              
              <div className={styles.statDivider} />
              
              <CycleProgress 
                completed={cycleProgress.completed}
                cycleId={currentEvent.cycleId}
              />
            </div>
            
            {/* Rank Display */}
            {currentEvent.rank !== null && (
              <>
                <div className={styles.statDivider} />
                <div className={styles.rankStat}>
                  <span className={styles.rankStatLabel}>Current Rank</span>
                  <span 
                    className={styles.rankStatValue}
                    style={{ 
                      color: currentEvent.rank === 1 
                        ? 'var(--rank-1)' 
                        : 'var(--text-primary)' 
                    }}
                  >
                    #{currentEvent.rank}
                  </span>
                </div>
              </>
            )}
          </div>
        </aside>
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
