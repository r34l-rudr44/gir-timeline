import { useMemo } from 'react';
import type { FestEvent } from '../../data/festHistory';
import { getFestColor, getRankColor } from '../../data/festHistory';
import styles from './RankChart.module.css';

interface RankChartProps {
  events: FestEvent[];
  currentIndex: number;
  animate?: boolean;
}

// Chart dimensions
const CHART_WIDTH = 600;
const CHART_HEIGHT = 200;
const PADDING = { top: 30, right: 60, bottom: 40, left: 40 };
const INNER_WIDTH = CHART_WIDTH - PADDING.left - PADDING.right;
const INNER_HEIGHT = CHART_HEIGHT - PADDING.top - PADDING.bottom;

// Rank scale (inverted - rank 1 at top)
const RANK_MIN = 1;
const RANK_MAX = 5;

function rankToY(rank: number | null): number {
  if (rank === null) return PADDING.top + INNER_HEIGHT * 0.3; // Position for upcoming
  const normalized = (rank - RANK_MIN) / (RANK_MAX - RANK_MIN);
  return PADDING.top + normalized * INNER_HEIGHT;
}

function indexToX(index: number, total: number): number {
  if (total <= 1) return PADDING.left + INNER_WIDTH / 2;
  return PADDING.left + (index / (total - 1)) * INNER_WIDTH;
}

export function RankChart({ events, currentIndex, animate = true }: RankChartProps) {
  const completedEvents = events.filter(e => e.status === 'completed');
  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  
  // Generate path for completed events
  const completedPath = useMemo(() => {
    if (completedEvents.length === 0) return '';
    
    const points = completedEvents.map((event, i) => ({
      x: indexToX(i, events.length),
      y: rankToY(event.rank),
    }));
    
    // Create smooth bezier curve
    if (points.length === 1) {
      return `M${points[0].x},${points[0].y}`;
    }
    
    let path = `M${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      path += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
    }
    
    return path;
  }, [completedEvents, events.length]);
  
  // Generate dotted path for upcoming events
  const upcomingPath = useMemo(() => {
    if (upcomingEvents.length === 0 || completedEvents.length === 0) return '';
    
    const lastCompleted = completedEvents[completedEvents.length - 1];
    const lastIndex = events.indexOf(lastCompleted);
    const lastPoint = {
      x: indexToX(lastIndex, events.length),
      y: rankToY(lastCompleted.rank),
    };
    
    // Project to first upcoming
    const firstUpcoming = upcomingEvents[0];
    const upcomingIndex = events.indexOf(firstUpcoming);
    const upcomingPoint = {
      x: indexToX(upcomingIndex, events.length),
      y: rankToY(1), // Assume continuing at #1
    };
    
    const cpx = (lastPoint.x + upcomingPoint.x) / 2;
    return `M${lastPoint.x},${lastPoint.y} C${cpx},${lastPoint.y} ${cpx},${upcomingPoint.y} ${upcomingPoint.x},${upcomingPoint.y}`;
  }, [completedEvents, upcomingEvents, events]);
  
  // Calculate visible portion of path based on currentIndex
  const visibleRatio = (currentIndex + 1) / events.length;
  
  return (
    <div className={styles.container}>
      <svg 
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className={styles.chart}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y-axis labels (ranks) */}
        {[1, 2, 3, 4].map((rank) => (
          <g key={rank}>
            <line
              x1={PADDING.left}
              y1={rankToY(rank)}
              x2={PADDING.left + INNER_WIDTH}
              y2={rankToY(rank)}
              className={styles.gridLine}
            />
            <text
              x={PADDING.left - 12}
              y={rankToY(rank)}
              className={styles.rankLabel}
            >
              #{rank}
            </text>
          </g>
        ))}
        
        {/* Completed events path */}
        {completedPath && (
          <path
            d={completedPath}
            className={`${styles.line} ${animate ? styles.animate : ''}`}
            style={{
              '--line-length': '1000',
              '--visible-ratio': visibleRatio,
            } as React.CSSProperties}
          />
        )}
        
        {/* Upcoming events path (dotted) */}
        {upcomingPath && currentIndex >= completedEvents.length - 1 && (
          <path
            d={upcomingPath}
            className={`${styles.dottedLine} ${animate ? styles.animate : ''}`}
          />
        )}
        
        {/* Event markers */}
        {events.map((event, index) => {
          if (index > currentIndex) return null;
          
          const x = indexToX(index, events.length);
          const isUpcoming = event.status === 'upcoming';
          // For upcoming events, position at #1 (continuing dominance)
          const y = isUpcoming ? rankToY(1) : rankToY(event.rank);
          const festColor = getFestColor(event.fest);
          const rankColor = getRankColor(event.rank);
          
          return (
            <g 
              key={event.id}
              className={`${styles.marker} ${animate ? styles.animate : ''}`}
              style={{ '--delay': `${index * 0.15}s` } as React.CSSProperties}
            >
              {/* Outer ring */}
              <circle
                cx={x}
                cy={y}
                r={isUpcoming ? 8 : 12}
                fill="var(--bg-dark)"
                stroke={isUpcoming ? 'var(--border-subtle)' : festColor}
                strokeWidth={isUpcoming ? 1 : 2}
                strokeDasharray={isUpcoming ? '3 2' : 'none'}
              />
              
              {/* Inner circle */}
              {!isUpcoming && (
                <circle
                  cx={x}
                  cy={y}
                  r={6}
                  fill={rankColor}
                />
              )}
              
              {/* Trophy indicator */}
              {event.isTrophyWin && (
                <g className={styles.trophyMarker}>
                  <circle
                    cx={x}
                    cy={y - 20}
                    r={10}
                    fill="var(--gold-primary)"
                  />
                  <text
                    x={x}
                    y={y - 16}
                    className={styles.trophyIcon}
                  >
                    🏆
                  </text>
                </g>
              )}
              
              {/* Event label */}
              <text
                x={x}
                y={CHART_HEIGHT - 10}
                className={styles.eventLabel}
                style={{ fill: festColor }}
              >
                {event.fest.slice(0, 3)} '{String(event.year).slice(-2)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default RankChart;

