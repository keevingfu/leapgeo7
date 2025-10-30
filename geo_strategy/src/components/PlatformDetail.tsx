import React, { useState, useEffect, useRef } from 'react';
import { PlatformDetailProps, ActiveFilters } from '../types';
import { platformsData, promptContentLinks, contentCitationLinks } from '../data/platformsData';
import StatCard from './StatCard';
import Tooltip from './Tooltip';

const PlatformDetail: React.FC<PlatformDetailProps> = ({ platform, onBack, onCompareClick }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [selectedContent, setSelectedContent] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    priority: 'all',
    product: 'all',
    search: ''
  });
  const [tooltipData, setTooltipData] = useState<any>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const platformData = platformsData[platform];

  useEffect(() => {
    drawConnections();
    window.addEventListener('resize', drawConnections);
    return () => window.removeEventListener('resize', drawConnections);
  }, [selectedPrompt, selectedContent]);

  const drawConnections = () => {
    const svg = svgRef.current;
    if (!svg || !containerRef.current) return;

    // Clear existing connections
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    if (selectedPrompt !== null) {
      const promptItems = containerRef.current.querySelectorAll('.prompt-item');
      const contentItems = containerRef.current.querySelectorAll('.content-item');

      const connectedContent = promptContentLinks[selectedPrompt] || [];

      connectedContent.forEach((contentIndex) => {
        if (promptItems[selectedPrompt] && contentItems[contentIndex]) {
          const path = createConnection(
            promptItems[selectedPrompt] as HTMLElement,
            contentItems[contentIndex] as HTMLElement
          );
          if (path) svg.appendChild(path);
        }
      });
    }

    if (selectedContent !== null) {
      const contentItems = containerRef.current.querySelectorAll('.content-item');
      const citationItems = containerRef.current.querySelectorAll('.citation-item');

      const connectedCitations = contentCitationLinks[selectedContent] || [];

      connectedCitations.forEach((citationIndex) => {
        if (contentItems[selectedContent] && citationItems[citationIndex]) {
          const path = createConnection(
            contentItems[selectedContent] as HTMLElement,
            citationItems[citationIndex] as HTMLElement
          );
          if (path) svg.appendChild(path);
        }
      });
    }
  };

  const createConnection = (from: HTMLElement, to: HTMLElement): SVGPathElement | null => {
    if (!from || !to || !containerRef.current) return null;

    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    if (fromRect.width === 0 || toRect.width === 0) return null;

    const x1 = fromRect.right - containerRect.left;
    const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
    const x2 = toRect.left - containerRect.left;
    const y2 = toRect.top + toRect.height / 2 - containerRect.top;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const midX = (x1 + x2) / 2;
    const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

    path.setAttribute('d', d);
    path.setAttribute('class', 'connection-line');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', platformData.color);
    path.setAttribute('stroke-width', '3');
    path.setAttribute('opacity', '0.8');

    return path;
  };

  const handlePromptClick = (index: number) => {
    setSelectedPrompt(selectedPrompt === index ? null : index);
    setSelectedContent(null);
  };

  const handleContentClick = (index: number) => {
    setSelectedContent(selectedContent === index ? null : index);
  };

  const showAllConnections = () => {
    setSelectedPrompt(null);
    setSelectedContent(null);

    const svg = svgRef.current;
    if (!svg || !containerRef.current) return;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const promptItems = containerRef.current.querySelectorAll('.prompt-item');
    const contentItems = containerRef.current.querySelectorAll('.content-item');

    Object.entries(promptContentLinks).forEach(([promptIndex, contentIndices]) => {
      const pIndex = parseInt(promptIndex);
      contentIndices.forEach((cIndex) => {
        if (promptItems[pIndex] && contentItems[cIndex]) {
          const path = createConnection(
            promptItems[pIndex] as HTMLElement,
            contentItems[cIndex] as HTMLElement
          );
          if (path) {
            path.setAttribute('opacity', '0.3');
            svg.appendChild(path);
          }
        }
      });
    });
  };

  const applyFilters = () => {
    // Filter logic is simplified here
    // In a real app, you'd filter the displayed items
  };

  const resetFilters = () => {
    setActiveFilters({
      priority: 'all',
      product: 'all',
      search: ''
    });
    setSelectedPrompt(null);
    setSelectedContent(null);
  };

  const isPromptDimmed = (index: number): boolean => {
    if (selectedPrompt === null) return false;
    const connectedContent = promptContentLinks[selectedPrompt] || [];
    return !connectedContent.includes(index);
  };

  const isContentDimmed = (index: number): boolean => {
    if (selectedPrompt !== null) {
      const connectedContent = promptContentLinks[selectedPrompt] || [];
      return !connectedContent.includes(index);
    }
    if (selectedContent === null) return false;
    return selectedContent !== index;
  };

  const isCitationDimmed = (index: number): boolean => {
    if (selectedContent === null) return selectedPrompt !== null;
    const connectedCitations = contentCitationLinks[selectedContent] || [];
    return !connectedCitations.includes(index);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="btn btn-secondary bg-white text-slate-600 px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-100 transition-colors"
          >
            ← 返回
          </button>
          <div className="flex items-center">
            <span className="text-4xl mr-3">{platformData.icon}</span>
            <h2 className="text-3xl font-bold" style={{ color: platformData.color }}>
              {platformData.name}
            </h2>
          </div>
        </div>
        <button
          onClick={onCompareClick}
          className="btn btn-primary bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          对比所有平台 →
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard value={platformData.stats.visibility_target} label="目标可见度" />
        <StatCard value={platformData.stats.priority_prompts} label="优先Prompts数量" />
        <StatCard value={platformData.stats.content_pieces} label="内容数量" />
        <StatCard value={platformData.stats.citation_density} label="引用密度" />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap items-center gap-4">
        <div className="flex-grow min-w-[150px]">
          <label className="block text-sm font-medium text-slate-700">按优先级筛选</label>
          <select
            value={activeFilters.priority}
            onChange={(e) => setActiveFilters({ ...activeFilters, priority: e.target.value as any })}
            className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">所有优先级</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="flex-grow min-w-[150px]">
          <label className="block text-sm font-medium text-slate-700">按产品系列筛选</label>
          <select
            value={activeFilters.product}
            onChange={(e) => setActiveFilters({ ...activeFilters, product: e.target.value as any })}
            className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">所有系列</option>
            <option value="coolnest">CoolNest (冷感)</option>
            <option value="dreamy">Dreamy (梦境)</option>
            <option value="island">Island (岛屿)</option>
          </select>
        </div>
        <div className="flex-grow min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700">搜索 Prompt/内容</label>
          <input
            type="text"
            value={activeFilters.search}
            onChange={(e) => setActiveFilters({ ...activeFilters, search: e.target.value })}
            placeholder="例如: '对比', '价格'..."
            className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="self-end">
          <button
            onClick={resetFilters}
            className="btn btn-secondary bg-white text-slate-600 px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-100"
          >
            重置
          </button>
        </div>
      </div>

      {/* Visualization Container */}
      <div ref={containerRef} className="relative grid grid-cols-3 gap-4">
        {/* Layer 1: Prompts */}
        <div className="bg-slate-100 rounded-lg p-4 h-[600px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b-2 border-slate-300 text-blue-600">
            用户意图 (User Prompts)
          </h3>
          <div>
            {platformData.prompts.map((prompt, index) => (
              <div
                key={index}
                className={`prompt-item bg-white rounded-lg p-3 mb-2 border border-slate-300 cursor-pointer transition-all duration-200 hover:border-indigo-600 hover:shadow-md ${
                  selectedPrompt === index ? 'border-2 border-indigo-600 bg-indigo-50' : ''
                } ${isPromptDimmed(index) ? 'opacity-40 bg-slate-100' : ''}`}
                onClick={() => handlePromptClick(index)}
                onMouseEnter={(e) => {
                  setTooltipData({ type: 'prompt', data: prompt });
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPosition({ x: rect.left, y: rect.top });
                }}
                onMouseLeave={() => setTooltipData(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{prompt.category}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    prompt.priority === 'High' ? 'bg-red-100 text-red-800' :
                    prompt.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {prompt.priority}
                  </span>
                </div>
                <div className="text-sm text-slate-600">Prompts数量: {prompt.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 2: Content */}
        <div className="bg-slate-100 rounded-lg p-4 h-[600px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b-2 border-slate-300 text-green-600">
            内容资产 (Content Assets)
          </h3>
          <div>
            {platformData.content.map((content, index) => (
              <div
                key={index}
                className={`content-item bg-white rounded-lg p-3 mb-2 border border-slate-300 cursor-pointer transition-all duration-200 hover:border-indigo-600 hover:shadow-md ${
                  selectedContent === index ? 'border-2 border-indigo-600 bg-indigo-50' : ''
                } ${isContentDimmed(index) ? 'opacity-40 bg-slate-100' : ''}`}
                onClick={() => handleContentClick(index)}
                onMouseEnter={(e) => {
                  setTooltipData({ type: 'content', data: content });
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPosition({ x: rect.left, y: rect.top });
                }}
                onMouseLeave={() => setTooltipData(null)}
              >
                <div className="font-semibold mb-1">{content.type}</div>
                <div className="text-sm text-slate-600">数量: {content.count}</div>
                <div className="text-sm text-slate-600">字数: {content.word_count}</div>
                <div className="text-sm text-slate-600">重点: {content.focus}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 3: Citations */}
        <div className="bg-slate-100 rounded-lg p-4 h-[600px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b-2 border-slate-300 text-purple-600">
            引用来源 (Citation Sources)
          </h3>
          <div>
            {platformData.citations.map((citation, index) => (
              <div
                key={index}
                className={`citation-item bg-white rounded-lg p-3 mb-2 border border-slate-300 transition-all duration-200 ${
                  isCitationDimmed(index) ? 'opacity-40 bg-slate-100' : ''
                }`}
                onMouseEnter={(e) => {
                  setTooltipData({ type: 'citation', data: citation });
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPosition({ x: rect.left, y: rect.top });
                }}
                onMouseLeave={() => setTooltipData(null)}
              >
                <div className="float-right text-xl font-bold text-indigo-600 ml-2">
                  {citation.percentage}%
                </div>
                <div className="font-semibold">{citation.type}</div>
                <div className="text-sm text-slate-600">示例: {citation.examples}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SVG Connection Layer */}
        <svg
          ref={svgRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        />
      </div>

      <div className="text-center mt-4">
        <button
          onClick={showAllConnections}
          className="btn btn-secondary bg-white text-slate-600 px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-100"
        >
          显示所有关联
        </button>
      </div>

      {/* Tooltip */}
      {tooltipData && (
        <Tooltip
          data={tooltipData}
          position={tooltipPosition}
        />
      )}
    </div>
  );
};

export default PlatformDetail;