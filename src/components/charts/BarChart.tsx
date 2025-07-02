import React from 'react';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
  showValues?: boolean;
  showGrid?: boolean;
  className?: string;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  height = 200, 
  showValues = true, 
  showGrid = true,
  className = ""
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = 400;
  const chartHeight = height;
  const barWidth = (chartWidth - padding.left - padding.right) / data.length * 0.8;
  const barSpacing = (chartWidth - padding.left - padding.right) / data.length * 0.2;

  return (
    <div className={`w-full ${className}`}>
      <svg 
        width="100%" 
        height={chartHeight + padding.top + padding.bottom}
        viewBox={`0 0 ${chartWidth} ${chartHeight + padding.top + padding.bottom}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
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
          const value = Math.round((maxValue / 4) * (4 - i));
          const y = padding.top + (chartHeight / 4) * i;
          return (
            <text
              key={i}
              x={padding.left - 10}
              y={y + 5}
              textAnchor="end"
              className="text-xs fill-gray-500"
            >
              {value.toLocaleString()}
            </text>
          );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding.left + index * (barWidth + barSpacing) + barSpacing / 2;
          const y = padding.top + chartHeight - barHeight;
          
          return (
            <g key={index}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color || "url(#barGradient)"}
                rx="4"
                ry="4"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              
              {/* Value label on hover */}
              {showValues && (
                <g className="opacity-0 hover:opacity-100 transition-opacity">
                  <rect
                    x={x + barWidth / 2 - 25}
                    y={y - 25}
                    width="50"
                    height="20"
                    fill="#1F2937"
                    rx="4"
                    ry="4"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 10}
                    textAnchor="middle"
                    className="text-xs fill-white font-medium"
                  >
                    {item.value.toLocaleString()}
                  </text>
                </g>
              )}
              
              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={padding.top + chartHeight + 20}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;