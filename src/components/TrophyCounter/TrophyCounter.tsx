import { useCountUp } from '../../hooks/useTimelineState';
import styles from './TrophyCounter.module.css';

interface TrophyCounterProps {
  count: number;
  animate?: boolean;
}

export function TrophyCounter({ count, animate = true }: TrophyCounterProps) {
  const displayCount = useCountUp(count, 800, animate);
  
  return (
    <div className={styles.container}>
      <div className={styles.label}>HOUSE TROPHIES</div>
      <div className={styles.counter}>
        <div className={styles.number}>
          <span className={styles.value}>{displayCount}</span>
        </div>
        {count > 0 && (
          <div className={styles.trophies}>
            {Array.from({ length: Math.min(count, 2) }).map((_, i) => (
              <div 
                key={i} 
                className={`${styles.trophy} ${animate ? styles.animate : ''}`}
                style={{ '--delay': `${i * 0.2 + 0.3}s` } as React.CSSProperties}
              >
                <TrophyIcon />
              </div>
            ))}
          </div>
        )}
      </div>
      {count > 0 && (
        <div className={styles.subtitle}>
          {count === 1 ? 'Champion' : count === 2 ? 'Back-to-Back Champions' : `${count}x Champions`}
        </div>
      )}
    </div>
  );
}

function TrophyIcon() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor"
      className={styles.trophyIcon}
    >
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
    </svg>
  );
}

export default TrophyCounter;

