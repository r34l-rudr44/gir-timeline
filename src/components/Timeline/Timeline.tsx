import { useMemo, useRef, useState, useEffect } from 'react';
import { festHistory, deriveTimelineState } from '../../data/festHistory';
import { FestBadge } from '../FestBadge';
import { PhaseIndicator } from '../PhaseIndicator';
import { TrophyCounter } from '../TrophyCounter';
import { StreakMeter } from '../StreakMeter';
import { CycleProgress } from '../CycleProgress';
import { RankChart } from '../RankChart';
import { SidebarTimeline } from '../SidebarTimeline';
import styles from './Timeline.module.css';

export function Timeline() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  // AI-2027-style: the middle column scroll sections drive which "frame" is active on the right.
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const timelineState = useMemo(
    () => deriveTimelineState(currentEventIndex),
    [currentEventIndex]
  );
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

  // Drive active section based on which section is closest to a viewport anchor (like AI-2027).
  useEffect(() => {
    let raf = 0;

    const updateActive = () => {
      raf = 0;
      const anchorY = window.innerHeight * 0.28;

      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      for (let i = 0; i < festHistory.length; i++) {
        const el = sectionRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - anchorY);
        if (dist < bestDistance) {
          bestDistance = dist;
          bestIndex = i;
        }
      }

      setCurrentEventIndex((prev) => (prev === bestIndex ? prev : bestIndex));
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(updateActive);
    };

    // Initial
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToIndex = (index: number) => {
    const el = sectionRefs.current[index];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
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
          <button
            type="button"
            className={styles.scrollHint}
            onClick={() => scrollToIndex(0)}
          >
            <span>Scroll to explore</span>
            <div className={styles.scrollArrow}>↓</div>
          </button>
        </div>
      </header>
      
      {/* AI-2027-inspired layout: left timeline, center content, right sticky panel */}
      <div className={styles.mainLayout}>
        <div className={styles.leftColumn}>
          <SidebarTimeline currentIndex={currentEventIndex} onEventClick={scrollToIndex} />
        </div>

        <main className={styles.centerColumn}>
          {festHistory.map((event, index) => (
            <section
              key={event.id}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              className={styles.contentSection}
            >
              <div className={styles.sectionKicker}>
                {event.fest} {event.year}
                {event.status === 'upcoming' ? <span className={styles.kickerUpcoming}>Upcoming</span> : null}
              </div>
              <h2 className={styles.sectionTitle}>
                {event.fest === 'Paradox' ? 'Paradox Cycle' : event.fest}
              </h2>

              <div className={styles.sectionBody}>
                <div className={styles.placeholder}>
                  Content will go here.
                </div>
              </div>
            </section>
          ))}
        </main>

        <aside className={styles.rightColumn}>
          <div
            className={`${styles.dashboardCard} ${
              phaseChanged ? styles.phaseTransition : ''
            } ${phase === 'dominance' ? styles.dominanceMode : ''}`}
          >
            <div className={styles.dashboardTop}>
              <FestBadge
                fest={currentEvent.fest}
                year={currentEvent.year}
                isTrophyWin={currentEvent.isTrophyWin}
              />
            </div>

            <div className={styles.dashboardChart}>
              <RankChart events={festHistory} currentIndex={currentEventIndex} />
            </div>

            <div className={styles.dashboardDescription}>
              <p className={styles.eventDescription}>{currentEvent.description}</p>
            </div>

            <div className={styles.dashboardPhase}>
              <PhaseIndicator currentPhase={phase} />
            </div>

            <div className={styles.dashboardStats}>
              <TrophyCounter count={totalTrophies} />
              <div className={styles.statDivider} />
              <StreakMeter streak={currentStreak} />
              <div className={styles.statDivider} />
              <CycleProgress completed={cycleProgress.completed} cycleId={currentEvent.cycleId} />

              {currentEvent.rank !== null && (
                <>
                  <div className={styles.statDivider} />
                  <div className={styles.rankStat}>
                    <span className={styles.rankStatLabel}>Current Rank</span>
                    <span
                      className={`${styles.rankStatValue} ${
                        currentEvent.rank === 1 ? styles.rankFirst : ''
                      }`}
                    >
                      #{currentEvent.rank}
                    </span>
                  </div>
                </>
              )}
            </div>
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
