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
  const stickyRef = useRef<HTMLDivElement>(null);
  
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
      
      {/* Scrollable Timeline Container */}
      <div ref={containerRef} className={styles.container}>
        {/* Sticky Dashboard */}
        <div ref={stickyRef} className={styles.sticky}>
          <div 
            className={`
              ${styles.dashboard} 
              ${phaseChanged ? styles.phaseTransition : ''}
              ${phase === 'dominance' ? styles.dominanceMode : ''}
            `}
          >
            {/* Top Row: Fest Badge + Phase */}
            <div className={styles.topRow}>
              <FestBadge 
                fest={currentEvent.fest}
                year={currentEvent.year}
                isTrophyWin={currentEvent.isTrophyWin}
              />
              <PhaseIndicator currentPhase={phase} />
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
              {currentEvent.rank !== null && (
                <div className={styles.rankDisplay}>
                  <span className={styles.rankLabel}>Rank</span>
                  <span 
                    className={styles.rankValue}
                    style={{ 
                      color: currentEvent.rank === 1 
                        ? 'var(--rank-1)' 
                        : 'var(--text-primary)' 
                    }}
                  >
                    #{currentEvent.rank}
                  </span>
                </div>
              )}
            </div>
            
            {/* Metrics Row */}
            <div className={styles.metricsRow}>
              <TrophyCounter count={totalTrophies} />
              <div className={styles.divider} />
              <StreakMeter streak={currentStreak} />
              <div className={styles.divider} />
              <CycleProgress 
                completed={cycleProgress.completed}
                cycleId={currentEvent.cycleId}
              />
            </div>
            
            {/* Progress Indicator */}
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Scroll Spacer - Creates scrollable area */}
        <div className={styles.scrollSpacer}>
          {festHistory.map((event, index) => (
            <div 
              key={event.id}
              className={`
                ${styles.eventSection}
                ${index === currentEventIndex ? styles.activeSection : ''}
              `}
            />
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

