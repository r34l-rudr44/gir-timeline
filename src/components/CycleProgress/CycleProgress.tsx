import styles from './CycleProgress.module.css';

interface CycleProgressProps {
  completed: number;
  total?: number;
  cycleId?: string;
  animate?: boolean;
}

const festOrder = ['Saavan', 'Margazhi', 'Paradox'];

export function CycleProgress({ 
  completed, 
  total = 3, 
  cycleId,
  animate = true 
}: CycleProgressProps) {
  const year = cycleId ? cycleId.split('-')[1] : '';
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>CYCLE PROGRESS</span>
        {year && <span className={styles.cycleYear}>Paradox {year}</span>}
      </div>
      <div className={styles.track}>
        {festOrder.map((fest, index) => {
          const isCompleted = index < completed;
          const isCurrent = index === completed - 1;
          
          return (
            <div key={fest} className={styles.segment}>
              <div 
                className={`
                  ${styles.bar} 
                  ${isCompleted ? styles.filled : styles.empty}
                  ${animate ? styles.animate : ''}
                `}
                style={{ '--delay': `${index * 0.15}s` } as React.CSSProperties}
              >
                {isCompleted && <div className={styles.shimmer} />}
              </div>
              <span 
                className={`
                  ${styles.festLabel} 
                  ${isCompleted ? styles.completedLabel : ''}
                  ${isCurrent ? styles.currentLabel : ''}
                `}
              >
                {fest}
              </span>
            </div>
          );
        })}
      </div>
      <div className={styles.counter}>
        <span className={styles.completedCount}>{completed}</span>
        <span className={styles.separator}>/</span>
        <span className={styles.totalCount}>{total}</span>
        <span className={styles.unit}>fests</span>
      </div>
    </div>
  );
}

export default CycleProgress;

