import React, { useEffect, useRef } from 'react';
import { ComparisonPageProps } from '../types';
import { platformsData, comparisonMetrics } from '../data/platformsData';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const ComparisonPage: React.FC<ComparisonPageProps> = ({ currentPlatform, onBack }) => {
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'rgba(255, 255, 255, 0.75)'
        },
        pointLabels: {
          font: {
            size: 13
          }
        },
        grid: {
          color: '#e2e8f0'
        },
        angleLines: {
          color: '#e2e8f0'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  };

  const radarData = {
    labels: comparisonMetrics.map(m => m.metric),
    datasets: [
      {
        label: 'ChatGPT',
        data: comparisonMetrics.map(m => m.chatgpt),
        backgroundColor: 'rgba(16, 163, 127, 0.2)',
        borderColor: '#10A37F',
        pointBackgroundColor: '#10A37F',
        borderWidth: 2
      },
      {
        label: 'Google AIO',
        data: comparisonMetrics.map(m => m.google),
        backgroundColor: 'rgba(66, 133, 244, 0.2)',
        borderColor: '#4285F4',
        pointBackgroundColor: '#4285F4',
        borderWidth: 2
      },
      {
        label: 'Amazon Rufus',
        data: comparisonMetrics.map(m => m.rufus),
        backgroundColor: 'rgba(255, 153, 0, 0.2)',
        borderColor: '#FF9900',
        pointBackgroundColor: '#FF9900',
        borderWidth: 2
      }
    ]
  };

  // Get all unique citation types
  const allCitationTypes = new Set<string>();
  Object.values(platformsData).forEach(p => {
    p.citations.forEach(c => allCitationTypes.add(c.type));
  });
  const citationLabels = Array.from(allCitationTypes);

  const citationData = {
    labels: ['ChatGPT', 'Google AIO', 'Amazon Rufus'],
    datasets: citationLabels.map((type, i) => ({
      label: type,
      data: ['chatgpt', 'google', 'rufus'].map(platformKey => {
        const platform = platformsData[platformKey as keyof typeof platformsData];
        const citation = platform.citations.find(c => c.type === type);
        return citation ? citation.percentage : 0;
      }),
      backgroundColor: ['#38bdf8', '#fbbf24', '#f87171', '#a78bfa', '#34d399'][i % 5]
    }))
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { display: false }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        },
        grid: {
          color: '#e2e8f0'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + '%';
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <header className="mb-6 flex justify-between items-center">
        <button
          onClick={onBack}
          className="btn btn-secondary bg-white text-slate-600 px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-100 transition-colors"
        >
          ← 返回
        </button>
        <h2 className="text-3xl font-bold text-center text-indigo-600">
          SweetNight GEO 战略对比 (CoolNest)
        </h2>
        <div className="w-24"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Strategy Comparison */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">核心策略对比 (CoolNest)</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 p-3 text-left font-semibold">优化重点</th>
                  <th className="border border-slate-200 p-3 text-left">ChatGPT</th>
                  <th className="border border-slate-200 p-3 text-left">Google AIO</th>
                  <th className="border border-slate-200 p-3 text-left">Amazon Rufus</th>
                </tr>
              </thead>
              <tbody>
                {platformsData.chatgpt.optimization_focus.map((_, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="border border-slate-200 p-3 font-semibold">
                      {i === 0 && '技术深度'}
                      {i === 1 && '响应速度'}
                      {i === 2 && '数据结构'}
                      {i === 3 && '引用质量'}
                    </td>
                    <td className="border border-slate-200 p-3 text-sm">
                      {platformsData.chatgpt.optimization_focus[i] || '-'}
                    </td>
                    <td className="border border-slate-200 p-3 text-sm">
                      {platformsData.google.optimization_focus[i] || '-'}
                    </td>
                    <td className="border border-slate-200 p-3 text-sm">
                      {platformsData.rufus.optimization_focus[i] || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">多平台表现雷达图 (CoolNest)</h3>
          <div className="relative h-80 md:h-96">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Citation Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">引用来源策略 (按平台)</h3>
          <div className="relative h-80 md:h-96">
            <Bar data={citationData} options={barOptions} />
          </div>
        </div>

        {/* Content Strategy */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">内容策略 (按平台)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(platformsData).map(([key, platform]) => (
              <div key={key} className="bg-white border border-slate-200 rounded-lg p-4 shadow-md">
                <h4 className="text-lg font-semibold mb-2">
                  {platform.icon} {platform.name}
                </h4>
                <ul className="space-y-1">
                  {platform.content.map((c, i) => (
                    <li key={i} className="text-sm text-slate-600 relative pl-5">
                      <span className="absolute left-0 top-0 text-emerald-500 font-bold">✓</span>
                      {c.type} ({c.count}篇)
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;