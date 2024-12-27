'use client';

interface ProgressCircleProps {
  percentage: number;
  title: string;
  actual?: number;
  target?: number;
  color?: string;
}

export function ProgressCircle({ percentage, title, actual, target, color = '#FF1493' }: ProgressCircleProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-[100px] h-[100px]">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{percentage}%</span>
        </div>
      </div>
      {(actual || target) && (
        <div className="space-y-1">
          <p className="text-sm text-gray-600">{title}</p>
          {actual && <p className="text-sm">Факт: {actual}</p>}
          {target && <p className="text-sm text-gray-400">Цель: {target}</p>}
        </div>
      )}
    </div>
  );
}

