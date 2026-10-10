import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  status?: 'not-started' | 'in-progress' | 'completed' | 'mastered';
  showLabel?: boolean;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 40,
  strokeWidth = 3.5,
  status,
  showLabel = true,
  className = ''
}) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  // Smooth animation effect on mount and value updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercent(Math.min(100, Math.max(0, percentage)));
    }, 50);
    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  const isCompleted = animatedPercent >= 100 || status === 'mastered' || status === 'completed';

  // Dynamic colors based on completion state
  const getStrokeColor = () => {
    if (isCompleted) return '#10b981'; // emerald-500
    if (animatedPercent > 50) return '#4f46e5'; // indigo-600
    if (animatedPercent > 0) return '#6366f1'; // indigo-500
    return '#94a3b8'; // slate-400
  };

  const getTrackColor = () => {
    if (isCompleted) return 'stroke-emerald-100 dark:stroke-emerald-950/60';
    if (animatedPercent > 0) return 'stroke-indigo-100 dark:stroke-indigo-950/50';
    return 'stroke-slate-100 dark:stroke-slate-800';
  };

  const strokeColor = getStrokeColor();

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title={`Progreso: ${Math.round(percentage)}% completado`}
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 origin-center"
      >
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={`${getTrackColor()} fill-none transition-colors duration-300`}
        />

        {/* Animated fill circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="fill-none transition-[stroke-dashoffset,stroke] duration-1000 ease-out"
        />
      </svg>

      {/* Center percentage label or checkmark */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isCompleted ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3] animate-in zoom-in-50 duration-300" />
          ) : (
            <span className="text-[10px] font-bold font-mono tracking-tight text-slate-700 dark:text-slate-200">
              {Math.round(animatedPercent)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};
