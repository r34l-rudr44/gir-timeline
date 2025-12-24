import styles from './StreakMeter.module.css';

interface StreakMeterProps {
  streak: number;
  maxDisplay?: number;
  animate?: boolean;
}

export function StreakMeter({ streak, maxDisplay = 4, animate = true }: StreakMeterProps) {
  const blocks = Array.from({ length: maxDisplay }, (_, i) => i < streak);
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>#1 STREAK</span>
        <span className={styles.value}>{streak}</span>
      </div>
      <div className={styles.meter}>
        {blocks.map((filled, index) => (
          <div
            key={index}
            className={`
              ${styles.block} 
              ${filled ? styles.filled : styles.empty}
              ${animate ? styles.animate : ''}
            `}
            style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
          >
            {filled && <div className={styles.glow} />}
          </div>
        ))}
      </div>
      {streak > 0 && (
        <div className={styles.subtitle}>
          {streak === 1 && 'The beginning'}
          {streak === 2 && 'Building momentum'}
          {streak === 3 && 'Unstoppable'}
          {streak >= 4 && 'Legendary streak'}
        </div>
      )}
    </div>
  );
}

export default StreakMeter;

