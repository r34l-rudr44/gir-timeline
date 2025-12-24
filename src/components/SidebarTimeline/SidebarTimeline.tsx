import { festHistory } from '../../data/festHistory';
import styles from './SidebarTimeline.module.css';

interface SidebarTimelineProps {
  currentIndex: number;
  onEventClick?: (index: number) => void;
}

export function SidebarTimeline({ currentIndex, onEventClick }: SidebarTimelineProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.timeline}>
        {festHistory.map((event, index) => {
          const isActive = index === currentIndex;
          const isPast = index < currentIndex;
          const isUpcoming = event.status === 'upcoming';
          
          // Format date label
          const getDateLabel = () => {
            const monthMap: Record<string, string> = {
              'Saavan': 'Sep',
              'Margazhi': 'Jan',
              'Paradox': 'May'
            };
            const month = monthMap[event.fest] || event.fest.slice(0, 3);
            return `${month} ${event.year}`;
          };
          
          return (
            <div
              key={event.id}
              className={`
                ${styles.timelineItem}
                ${isActive ? styles.active : ''}
                ${isPast ? styles.past : ''}
                ${isUpcoming ? styles.upcoming : ''}
              `}
              onClick={() => onEventClick?.(index)}
            >
              {isActive && <div className={styles.activeIndicator} />}
              <div className={styles.dot} />
              <span className={styles.label}>{getDateLabel()}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default SidebarTimeline;

