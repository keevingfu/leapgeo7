import React, { useState, useMemo } from 'react';
import { Network, Settings, Filter } from 'lucide-react';

export default function MappingGraph() {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [showAllEdges, setShowAllEdges] = useState(false);
  const [graphScale, setGraphScale] = useState(1);

  // 数据结构：Prompts -> Contents -> Citations
  const data = {
    prompts: [
      { id: 'p1', name: 'best cooling mattress', level: 'P0', score: 155 },
      { id: 'p2', name: 'mattress for back pain', level: 'P0', score: 150 },
      { id: 'p3', name: 'best memory foam', level: 'P0', score: 147 },
      { id: 'p4', name: 'mattress for couples', level: 'P0', score: 145 },
      { id: 'p5', name: 'mattress reviews', level: 'P0', score: 147 },
      { id: 'p6', name: 'reddit recommendations', level: 'P1', score: 135 },
    ],
    contents: [
      { id: 'c1', name: 'Blog #1: 技术白皮书', type: 'Blog深度', status: '已有' },
      { id: 'c2', name: 'FAQ: 冷却数据', type: 'FAQ', status: '需新增' },
      { id: 'c3', name: 'Blog #9: 背痛解决', type: 'Problem-Solution', status: '已有' },
      { id: 'c4', name: 'Blog #13: 情侣指南', type: 'Couples Guide', status: '已有' },
      { id: 'c5', name: 'Product Page: CoolNest', type: '产品页优化', status: '已有' },
      { id: 'c6', name: 'Review汇总页', type: 'Review汇总', status: '已有' },
      { id: 'c7', name: 'Reddit发帖', type: 'Reddit发帖', status: '已有' },
    ],
    citations: [
      { id: 'ct1', platform: 'YouTube', color: '#ff0000' },
      { id: 'ct2', platform: 'Reddit', color: '#ff4500' },
      { id: 'ct3', platform: 'Medium', color: '#000000' },
      { id: 'ct4', platform: '官网Blog', color: '#1e40af' },
      { id: 'ct5', platform: 'Amazon PDP', color: '#ff9900' },
      { id: 'ct6', platform: 'Quora', color: '#b92b27' },
    ],
    links: [
      // Prompts -> Contents
      { source: 'p1', target: 'c1', type: 'prompt-content' },
      { source: 'p1', target: 'c2', type: 'prompt-content' },
      { source: 'p1', target: 'c5', type: 'prompt-content' },
      { source: 'p2', target: 'c3', type: 'prompt-content' },
      { source: 'p2', target: 'c5', type: 'prompt-content' },
      { source: 'p3', target: 'c4', type: 'prompt-content' },
      { source: 'p4', target: 'c4', type: 'prompt-content' },
      { source: 'p5', target: 'c6', type: 'prompt-content' },
      { source: 'p6', target: 'c7', type: 'prompt-content' },
      
      // Contents -> Citations
      { source: 'c1', target: 'ct3', type: 'content-citation' },
      { source: 'c1', target: 'ct4', type: 'content-citation' },
      { source: 'c2', target: 'ct4', type: 'content-citation' },
      { source: 'c3', target: 'ct1', type: 'content-citation' },
      { source: 'c3', target: 'ct4', type: 'content-citation' },
      { source: 'c4', target: 'ct1', type: 'content-citation' },
      { source: 'c5', target: 'ct5', type: 'content-citation' },
      { source: 'c6', target: 'ct1', type: 'content-citation' },
      { source: 'c6', target: 'ct6', type: 'content-citation' },
      { source: 'c7', target: 'ct2', type: 'content-citation' },
    ]
  };

  // 计算节点位置 (分层布局)
  const positions = useMemo(() => {
    const pos = {};
    const layers = {
      prompts: 0,
      contents: 1,
      citations: 2
    };

    // Prompts层 (左侧)
    data.prompts.forEach((p, i) => {
      pos[p.id] = {
        x: 100,
        y: 80 + i * 100,
        category: 'prompts'
      };
    });

    // Contents层 (中间)
    data.contents.forEach((c, i) => {
      pos[c.id] = {
        x: 400,
        y: 80 + i * 80,
        category: 'contents'
      };
    });

    // Citations层 (右侧)
    data.citations.forEach((ct, i) => {
      pos[ct.id] = {
        x: 700,
        y: 150 + i * 90,
        category: 'citations'
      };
    });

    return pos;
  }, []);

  // 根据选中Prompt过滤链接
  const visibleLinks = useMemo(() => {
    if (!selectedPrompt && !showAllEdges) return [];
    if (showAllEdges) return data.links;

    if (selectedPrompt) {
      return data.links.filter(link => {
        if (link.source === selectedPrompt) return true;
        // 显示该prompt连接的content，以及这些content连接的citations
        const connectedContents = data.links
          .filter(l => l.source === selectedPrompt)
          .map(l => l.target);
        return connectedContents.includes(link.source);
      });
    }
    return [];
  }, [selectedPrompt, showAllEdges]);

  const highlightedNodes = useMemo(() => {
    const nodes = new Set();
    visibleLinks.forEach(link => {
      nodes.add(link.source);
      nodes.add(link.target);
    });
    return nodes;
  }, [visibleLinks]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      {/* 标题栏 */}
      <div className="bg-slate-800/50 border-b border-slate-700 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Network className="text-blue-400" size={32} />
            Prompts → Contents → Citations 映射关系
          </h1>
          <p className="text-slate-400">GEO飞轮的三层内容分布与引用链路可视化</p>
        </div>
      </div>

      {/* 控制面板 */}
      <div className="bg-slate-800/30 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-blue-400" />
            <label className="text-sm">选择Prompt查看映射：</label>
          </div>
          
          <select
            value={selectedPrompt || ''}
            onChange={(e) => setSelectedPrompt(e.target.value || null)}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm hover:border-slate-500 transition"
          >
            <option value="">-- 展示全部 --</option>
            {data.prompts.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.level} - 评分{p.score})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAllEdges(!showAllEdges)}
            className={`px-4 py-2 rounded transition text-sm font-medium ${
              showAllEdges
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {showAllEdges ? '✓ 显示全部链接' : '展示全部链接'}
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <Settings size={18} className="text-slate-500" />
            <label className="text-sm">缩放:</label>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.1"
              value={graphScale}
              onChange={(e) => setGraphScale(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-slate-400">{(graphScale * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* SVG Graph */}
      <div className="flex-1 overflow-hidden bg-slate-900/50">
        <svg className="w-full h-full" style={{ transform: `scale(${graphScale})`, transformOrigin: 'top left' }}>
          <defs>
            <marker id="arrowPrompt" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#60a5fa" />
            </marker>
            <marker id="arrowContent" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#34d399" />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 连接线 */}
          {visibleLinks.map((link, idx) => {
            const from = positions[link.source];
            const to = positions[link.target];
            const isPromptLink = link.type === 'prompt-content';
            return (
              <line
                key={idx}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isPromptLink ? '#60a5fa' : '#34d399'}
                strokeWidth="2"
                opacity="0.6"
                markerEnd={isPromptLink ? 'url(#arrowPrompt)' : 'url(#arrowContent)'}
              />
            );
          })}

          {/* Prompts节点 */}
          {data.prompts.map(p => {
            const pos = positions[p.id];
            const isHighlighted = highlightedNodes.has(p.id) || !selectedPrompt || showAllEdges;
            const isSelected = p.id === selectedPrompt;
            return (
              <g key={p.id} opacity={isHighlighted ? 1 : 0.2} filter={isSelected ? 'url(#glow)' : ''}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 45 : 35}
                  fill={p.level === 'P0' ? '#ef4444' : '#f97316'}
                  opacity={isSelected ? 1 : 0.8}
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedPrompt(p.id)}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold select-none"
                  fill="white"
                  style={{ pointerEvents: 'none' }}
                >
                  <tspan x={pos.x} dy="0">{p.level}</tspan>
                  <tspan x={pos.x} dy="14" className="text-[10px]">{p.score}</tspan>
                </text>
                <title>{p.name}</title>
              </g>
            );
          })}

          {/* Contents节点 */}
          {data.contents.map(c => {
            const pos = positions[c.id];
            const isHighlighted = highlightedNodes.has(c.id) || !selectedPrompt || showAllEdges;
            const bgColor = c.status === '已有' ? '#10b981' : '#f59e0b';
            return (
              <g key={c.id} opacity={isHighlighted ? 1 : 0.2}>
                <rect
                  x={pos.x - 50}
                  y={pos.y - 25}
                  width="100"
                  height="50"
                  rx="8"
                  fill={bgColor}
                  opacity="0.8"
                />
                <text
                  x={pos.x}
                  y={pos.y - 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold select-none"
                  fill="white"
                  style={{ pointerEvents: 'none' }}
                >
                  {c.type}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] select-none"
                  fill="white"
                  style={{ pointerEvents: 'none' }}
                >
                  {c.status}
                </text>
                <title>{c.name}</title>
              </g>
            );
          })}

          {/* Citations节点 */}
          {data.citations.map(ct => {
            const pos = positions[ct.id];
            const isHighlighted = highlightedNodes.has(ct.id) || !selectedPrompt || showAllEdges;
            return (
              <g key={ct.id} opacity={isHighlighted ? 1 : 0.2}>
                <polygon
                  points={`${pos.x},${pos.y - 30} ${pos.x + 35},${pos.y + 15} ${pos.x - 35},${pos.y + 15}`}
                  fill={ct.color}
                  opacity="0.8"
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold select-none"
                  fill="white"
                  style={{ pointerEvents: 'none' }}
                >
                  {ct.platform}
                </text>
                <title>{ct.platform}</title>
              </g>
            );
          })}

          {/* 层级标签 */}
          <text x="100" y="40" className="text-lg font-bold" fill="#60a5fa">Prompts</text>
          <text x="400" y="40" className="text-lg font-bold" fill="#34d399">Contents</text>
          <text x="700" y="40" className="text-lg font-bold" fill="#f97316">Citations</text>
        </svg>
      </div>

      {/* 图例 */}
      <div className="bg-slate-800/50 border-t border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span className="font-semibold">P0高优先级</span>
            </div>
            <p className="text-slate-400">核心GEO关键词</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-orange-500" />
              <span className="font-semibold">P1次要</span>
            </div>
            <p className="text-slate-400">长尾关键词</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span className="font-semibold">已有内容</span>
            </div>
            <p className="text-slate-400">已发布资产</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-amber-500" />
              <span className="font-semibold">需新增</span>
            </div>
            <p className="text-slate-400">待创建内容</p>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      {selectedPrompt && (
        <div className="bg-blue-500/10 border-t border-blue-500/30 px-6 py-3 text-sm">
          <div className="max-w-7xl mx-auto">
            <span className="font-semibold text-blue-400">📊 当前选中：</span>
            <span className="ml-2">
              {data.prompts.find(p => p.id === selectedPrompt)?.name} →
              {data.links.filter(l => l.source === selectedPrompt).length}个内容 →
              {data.links.filter(l => data.links.filter(ll => ll.source === selectedPrompt).map(m => m.target).includes(l.source)).length}个引用平台
            </span>
          </div>
        </div>
      )}
    </div>
  );
}