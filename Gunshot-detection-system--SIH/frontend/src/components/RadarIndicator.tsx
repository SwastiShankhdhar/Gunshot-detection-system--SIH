import { useEffect, useState } from "react";

interface RadarIndicatorProps {
  detectionAngle?: number | null;
  isAlert?: boolean;
}

export default function RadarIndicator({ detectionAngle, isAlert = false }: RadarIndicatorProps) {
  const [sweepAngle, setSweepAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle(prev => (prev + 2) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;

  // Generate concentric circles
  const circles = [30, 60, 90, 120].map(radius => (
    <circle
      key={radius}
      cx={centerX}
      cy={centerY}
      r={radius}
      fill="none"
      stroke="hsl(var(--radar-secondary))"
      strokeWidth="1"
      opacity="0.5"
    />
  ));

  // Generate radial grid lines every 30 degrees
  const gridLines = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30;
    const radian = (angle * Math.PI) / 180;
    const x2 = centerX + maxRadius * Math.cos(radian - Math.PI / 2);
    const y2 = centerY + maxRadius * Math.sin(radian - Math.PI / 2);
    
    return (
      <g key={angle}>
        <line
          x1={centerX}
          y1={centerY}
          x2={x2}
          y2={y2}
          stroke="hsl(var(--radar-secondary))"
          strokeWidth="1"
          opacity="0.3"
        />
        <text
          x={centerX + (maxRadius + 15) * Math.cos(radian - Math.PI / 2)}
          y={centerY + (maxRadius + 15) * Math.sin(radian - Math.PI / 2)}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs fill-current text-muted-foreground"
        >
          {angle}°
        </text>
      </g>
    );
  });

  // Sweep line
  const sweepRadian = (sweepAngle * Math.PI) / 180;
  const sweepX = centerX + maxRadius * Math.cos(sweepRadian - Math.PI / 2);
  const sweepY = centerY + maxRadius * Math.sin(sweepRadian - Math.PI / 2);

  // Detection indicator
  let detectionIndicator = null;
  if (detectionAngle !== null && detectionAngle !== undefined) {
    const detectionRadian = (detectionAngle * Math.PI) / 180;
    const detectionX = centerX + maxRadius * Math.cos(detectionRadian - Math.PI / 2);
    const detectionY = centerY + maxRadius * Math.sin(detectionRadian - Math.PI / 2);

    detectionIndicator = (
      <g>
        <line
          x1={centerX}
          y1={centerY}
          x2={detectionX}
          y2={detectionY}
          stroke="hsl(var(--radar-alert))"
          strokeWidth="3"
          className={isAlert ? "animate-pulse" : ""}
        />
        <circle
          cx={detectionX}
          cy={detectionY}
          r="8"
          fill="hsl(var(--radar-alert))"
          className={isAlert ? "animate-pulse" : ""}
        />
        <circle
          cx={detectionX}
          cy={detectionY}
          r="15"
          fill="none"
          stroke="hsl(var(--radar-alert))"
          strokeWidth="2"
          opacity="0.5"
          className={isAlert ? "animate-ping" : ""}
        />
      </g>
    );
  }

  return (
    <div className="flex justify-center items-center h-80">
      <svg width="300" height="300" className="transform rotate-0">
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={maxRadius}
          fill="hsl(var(--radar-primary))"
          fillOpacity="0.1"
        />
        
        {/* Grid */}
        {circles}
        {gridLines}
        
        {/* Sweep line */}
        <line
          x1={centerX}
          y1={centerY}
          x2={sweepX}
          y2={sweepY}
          stroke="hsl(var(--radar-sweep))"
          strokeWidth="2"
          opacity="0.8"
        />
        
        {/* Sweep gradient effect */}
        <defs>
          <radialGradient id="sweepGradient">
            <stop offset="0%" stopColor="hsl(var(--radar-sweep))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--radar-sweep))" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Center dot */}
        <circle
          cx={centerX}
          cy={centerY}
          r="4"
          fill="hsl(var(--radar-primary))"
        />
        
        {/* Detection indicator */}
        {detectionIndicator}
      </svg>
    </div>
  );
}