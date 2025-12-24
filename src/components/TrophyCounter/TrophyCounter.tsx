import { useCountUp } from '../../hooks/useTimelineState';
import { TrophyIcon } from '../icons/TrophyIcon';
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
        <div className={styles.trophies}>
          {Array.from({ length: count }).map((_, i) => (
            <div 
              key={i} 
              className={`${styles.trophy} ${animate ? styles.animate : ''}`}
              style={{ '--delay': `${i * 0.2 + 0.3}s` } as React.CSSProperties}
            >
              <TrophyIcon size={24} color="var(--bg-dark)" />
            </div>
          ))}
        </div>
      </div>
      {count > 0 && (
        <div className={styles.subtitle}>
          {count === 1 ? 'Champion' : count === 2 ? 'Back-to-Back Champions' : `${count}x Champions`}
        </div>
      )}
    </div>
  );
}


export default TrophyCounter;

