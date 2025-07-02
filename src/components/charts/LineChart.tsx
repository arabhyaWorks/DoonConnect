import React from 'react';

interface LineChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartData[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  showArea?: boolean;
  className?: string;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  height = 200, 
  color = "#3B82F6",
  showGrid = true,
  showArea = true,
  className = ""
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = 400;
  const chartHeight = height;

  const getX = (index: number) => {
    return padding.left + (index / (data.length - 1)) * (chartWidth - padding.left - padding.right);
  };

  const getY = (value: number) => {
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    return padding.top + chartHeight - (normalizedValue * chartHeight);
  };

  // Create path for line
  const linePath = data.map((point, index) => {
    const x = getX(index);
    const y = getY(point.value);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Create path for area
  const areaPath = showArea ? [
    linePath,
    `L ${getX(data.length - 1)} ${padding.top + chartHeight}`,
    `L ${getX(0)} ${padding.top + chartHeight}`,
    'Z'
  ].join(' ') : '';

  return (
    <div className={`w-full ${className}`}>
      <svg 
        width="100%" 
        height={chartHeight + padding.top + padding.bottom}
        viewBox={`0 0 ${chartWidth} ${chartHeight + padding.top + padding.bottom}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.05"/>
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {showGrid && (
          <g>
            {[0, 1, 2, 3, 4].map(i => {
              const y = padding.top + (chartHeight / 4) * i;
              return (
                <line
                  key={i}
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        )}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map(i => {
          const value = Math.round(maxValue - (maxValue - minValue) / 4 * i);
          const y = padding.top + (chartHeight / 4) * i;
          return (
            <text
              key={i}
              x={padding.left - 10}
              y={y + 5}
              textAnchor="end"
              className="text-xs fill-gray-500"
            >
              {value}
            </text>
          );
        })}

        {/* Area fill */}
        {showArea && (
          <path
            d={areaPath}
            fill="url(#areaGradient)"
          />
        )}

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((point, index) => {
          const x = getX(index);
          const y = getY(point.value);
          
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill={color}
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all cursor-pointer"
              />
              
              {/* Tooltip on hover */}
              <g className="opacity-0 hover:opacity-100 transition-opacity">
                <rect
                  x={x - 20}
                  y={y - 30}
                  width="40"
                  height="20"
                  fill="#1F2937"
                  rx="4"
                  ry="4"
                />
                <text
                  x={x}
                  y={y - 15}
                  textAnchor="middle"
                  className="text-xs fill-white font-medium"
                >
                  {point.value}
                </text>
              </g>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((point, index) => {
          const x = getX(index);
          return (
            <text
              key={index}
              x={x}
              y={padding.top + chartHeight + 20}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {point.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default LineChart;