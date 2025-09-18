import { useEffect, useState } from "react";

interface AudioWaveformProps {
  isActive?: boolean;
}

export default function AudioWaveform({ isActive = false }: AudioWaveformProps) {
  const [waveformData, setWaveformData] = useState<number[]>([]);

  useEffect(() => {
    const generateWaveform = () => {
      const data = Array.from({ length: 100 }, (_, i) => {
        if (isActive) {
          // More dramatic waveform during alert
          return Math.sin(i * 0.2) * 0.8 + Math.sin(i * 0.1) * 0.4 + (Math.random() - 0.5) * 0.6;
        } else {
          // Gentle background noise
          return Math.sin(i * 0.1) * 0.2 + (Math.random() - 0.5) * 0.1;
        }
      });
      setWaveformData(data);
    };

    generateWaveform();
    const interval = setInterval(generateWaveform, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  const height = 200;
  const width = 400;
  const centerY = height / 2;

  const pathData = waveformData
    .map((value, index) => {
      const x = (index / (waveformData.length - 1)) * width;
      const y = centerY + value * (height / 3);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
      <svg width={width} height={height}>
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Center line */}
        <line 
          x1="0" 
          y1={centerY} 
          x2={width} 
          y2={centerY} 
          stroke="hsl(var(--muted-foreground))" 
          strokeWidth="1" 
          opacity="0.5"
        />
        
        {/* Waveform */}
        <path
          d={pathData}
          fill="none"
          stroke={isActive ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
          strokeWidth={isActive ? "3" : "2"}
          className={isActive ? "animate-pulse" : ""}
        />
        
        {/* Frequency bars */}
        {Array.from({ length: 20 }, (_, i) => {
          const barHeight = Math.abs(waveformData[i * 5] || 0) * 60 + 5;
          return (
            <rect
              key={i}
              x={i * 20}
              y={height - 80}
              width="15"
              height={barHeight}
              fill={isActive ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
              opacity="0.6"
              className={isActive ? "animate-pulse" : ""}
            />
          );
        })}
      </svg>
      
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
        {isActive ? 'HIGH ACTIVITY DETECTED' : 'Background Monitoring'}
      </div>
    </div>
  );
}