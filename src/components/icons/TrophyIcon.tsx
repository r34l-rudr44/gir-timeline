interface TrophyIconProps {
  className?: string;
  size?: number;
  color?: string;
}

export function TrophyIcon({ className = '', size = 24, color = 'currentColor' }: TrophyIconProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
    >
      {/* Trophy cup */}
      <path d="M6 9H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2" />
      {/* Trophy base */}
      <path d="M6 9V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      {/* Trophy handles */}
      <path d="M6 9l-2 4h16l-2-4" />
      {/* Trophy top rim */}
      <path d="M4 9h16" />
      {/* Star on trophy */}
      <circle cx="12" cy="11" r="1.5" fill={color} />
    </svg>
  );
}

export default TrophyIcon;

