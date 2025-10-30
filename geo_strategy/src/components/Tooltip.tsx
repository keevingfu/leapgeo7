import React, { useEffect, useState } from 'react';

interface TooltipProps {
  data: {
    type: 'prompt' | 'content' | 'citation';
    data: any;
  };
  position: {
    x: number;
    y: number;
  };
}

const Tooltip: React.FC<TooltipProps> = ({ data, position }) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Calculate position to avoid overflow
    const tooltipWidth = 300;
    const tooltipHeight = 150;
    let x = position.x + 15;
    let y = position.y + 15;

    // Prevent overflow on right
    if (x + tooltipWidth > window.innerWidth) {
      x = position.x - tooltipWidth - 15;
    }

    // Prevent overflow on bottom
    if (y + tooltipHeight > window.innerHeight) {
      y = position.y - tooltipHeight - 15;
    }

    setTooltipPosition({ x, y });
  }, [position]);

  const renderContent = () => {
    const { type, data: itemData } = data;

    if (type === 'prompt') {
      return (
        <>
          <div className="font-bold mb-1 text-indigo-200">{itemData.category}</div>
          <div className="space-y-1 text-sm">
            <div>Prompts数量: {itemData.count}</div>
            <div>优先级: {itemData.priority}</div>
          </div>
        </>
      );
    }

    if (type === 'content') {
      return (
        <>
          <div className="font-bold mb-1 text-indigo-200">{itemData.type}</div>
          <div className="space-y-1 text-sm">
            <div>数量: {itemData.count}</div>
            <div>字数: {itemData.word_count}</div>
            <div>重点: {itemData.focus}</div>
          </div>
        </>
      );
    }

    if (type === 'citation') {
      return (
        <>
          <div className="font-bold mb-1 text-indigo-200">{itemData.type}</div>
          <div className="space-y-1 text-sm">
            <div>占比: {itemData.percentage}%</div>
            <div>示例: {itemData.examples}</div>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div
      className="fixed bg-slate-800 text-white p-3 rounded-lg shadow-lg text-sm z-50 max-w-xs transition-opacity duration-200"
      style={{
        left: `${tooltipPosition.x}px`,
        top: `${tooltipPosition.y}px`,
      }}
    >
      {renderContent()}
    </div>
  );
};

export default Tooltip;