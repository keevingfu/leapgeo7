import React from 'react';
import { LandingPageProps, PlatformKey } from '../types';
import { platformsData } from '../data/platformsData';

const LandingPage: React.FC<LandingPageProps> = ({ onPlatformSelect, onCompareClick }) => {
  const platforms: PlatformKey[] = ['chatgpt', 'google', 'rufus'];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
          SweetNight (CoolNest) AI搜索引擎优化 (GEO) 战略仪表盘
        </h1>
        <p className="text-lg md:text-xl text-slate-600">
          SweetNight CoolNest 冷感床垫 跨平台AI引擎可见性策略
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {platforms.map((platformKey) => {
          const platform = platformsData[platformKey];
          return (
            <div
              key={platformKey}
              className="platform-card bg-white p-6 rounded-xl shadow-lg border border-slate-200 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl"
              onClick={() => onPlatformSelect(platformKey)}
            >
              <div className="flex items-center mb-4">
                <span className="text-5xl mr-4">{platform.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: platform.color }}>
                    {platform.name}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500">
                    {platformKey === 'chatgpt' && '对话式AI优化'}
                    {platformKey === 'google' && 'AI Overview优化'}
                    {platformKey === 'rufus' && '购物助手优化'}
                  </p>
                </div>
              </div>
              <p className="text-slate-700">
                {platformKey === 'chatgpt' &&
                  'CoolNest技术深度和睡眠解决方案。优化方向：深度技术内容、睡眠科学、完整解答和权威引用。'}
                {platformKey === 'google' &&
                  'CoolNest结构化数据和快速答案。优化方向：快速问答、结构化数据、精选摘要和Schema标记。'}
                {platformKey === 'rufus' &&
                  'CoolNest产品详情和购买引导。优化方向：购买意图、产品对比、客户评论和促销优化。'}
              </p>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={onCompareClick}
          className="btn btn-primary bg-indigo-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-indigo-700 transition-colors"
        >
          查看跨平台战略总览
        </button>
      </div>
    </div>
  );
};

export default LandingPage;