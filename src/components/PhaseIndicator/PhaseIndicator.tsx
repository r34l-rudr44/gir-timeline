import type { Phase } from '../../data/festHistory';
import { getPhaseColor } from '../../data/festHistory';
import styles from './PhaseIndicator.module.css';

interface PhaseIndicatorProps {
  currentPhase: Phase;
  animate?: boolean;
}

const phases: Phase[] = ['contender', 'breakthrough', 'dominance'];

const phaseLabels: Record<Phase, string> = {
  contender: 'Contender',
  breakthrough: 'Breakthrough',
  dominance: 'Dominance',
};

const phaseDescriptions: Record<Phase, string> = {
  contender: 'Building momentum',
  breakthrough: 'First trophy claimed',
  dominance: 'Sustained excellence',
};

export function PhaseIndicator({ currentPhase, animate = true }: PhaseIndicatorProps) {
  const currentIndex = phases.indexOf(currentPhase);
  
  return (
    <div className={styles.container}>
      <div className={styles.label}>PHASE</div>
      <div className={styles.phases}>
        {phases.map((phase, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = phase === currentPhase;
          const phaseColor = getPhaseColor(phase);
          
          return (
            <div 
              key={phase}
              className={`
                ${styles.phase} 
                ${isActive ? styles.active : ''} 
                ${isCurrent ? styles.current : ''}
                ${animate ? styles.animate : ''}
              `}
              style={{ 
                '--phase-color': phaseColor,
                '--delay': `${index * 0.15}s`
              } as React.CSSProperties}
            >
              <div className={styles.dot}>
                {isCurrent && <div className={styles.pulse} />}
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{phaseLabels[phase]}</span>
                {isCurrent && (
                  <span className={styles.description}>
                    {phaseDescriptions[phase]}
                  </span>
                )}
              </div>
              {index < phases.length - 1 && (
                <div className={`${styles.connector} ${isActive ? styles.activeConnector : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PhaseIndicator;

