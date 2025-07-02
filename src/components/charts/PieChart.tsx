import React from 'react';

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  showLabels?: boolean;
  className?: string;
}

const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  size = 200, 
  showLabels = true,
  className = ""
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 20;
  const center = size / 2;

  let currentAngle = 0;
  const segments = data.map(item => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    currentAngle += angle;
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
      angle
    };
  });

  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", center, center,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="drop-shadow-lg">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.1"/>
          </filter>
        </defs>
        
        {/* Pie segments */}
        {segments.map((segment, index) => (
          <path
            key={index}
            d={createArcPath(segment.startAngle, segment.endAngle, radius)}
            fill={segment.color}
            stroke="white"
            strokeWidth="2"
            filter="url(#shadow)"
            className="hover:opacity-80 transition-opacity cursor-pointer"
          />
        ))}
        
        {/* Center circle */}
        <circle 
          cx={center} 
          cy={center} 
          r={radius * 0.4} 
          fill="white" 
          stroke="#E5E7EB" 
          strokeWidth="2"
        />
        
        {/* Center text */}
        <text 
          x={center} 
          y={center - 5} 
          textAnchor="middle" 
          className="text-xs fill-gray-600"
        >
          Total
        </text>
        <text 
          x={center} 
          y={center + 10} 
          textAnchor="middle" 
          className="text-sm font-bold fill-gray-900"
        >
          {total.toLocaleString()}
        </text>
      </svg>
      
      {/* Legend */}
      {showLabels && (
        <div className="ml-6 space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: segment.color }}
              />
              <div className="text-sm">
                <div className="font-medium text-gray-900">{segment.label}</div>
                <div className="text-xs text-gray-500">
                  {Math.round(segment.percentage * 100)}% • {segment.value.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieChart;