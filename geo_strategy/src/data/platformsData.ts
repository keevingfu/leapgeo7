import { PlatformData, ComparisonMetric, PlatformKey } from '../types';

export const platformsData: Record<PlatformKey, PlatformData> = {
  chatgpt: {
    name: 'ChatGPT',
    icon: '🤖',
    color: '#10A37F',
    description: '对话式AI优化 - CoolNest技术深度和睡眠解决方案',
    stats: {
      visibility_target: '80%',
      priority_prompts: 150,
      content_pieces: 200,
      citation_density: '15-20/篇'
    },
    optimization_focus: [
      'CoolNest技术解析',
      '深度睡眠科学',
      '个性化推荐',
      '权威来源引用'
    ],
    prompts: [
      { category: 'CoolNest技术原理 (如: 冷感材料)', count: 100, priority: 'High' },
      { category: 'SweetNight vs. 其他品牌 (深度对比)', count: 80, priority: 'High' },
      { category: '适合人群 (如: 易热体质, 运动员)', count: 70, priority: 'Medium' },
      { category: '保养与清洁指导', count: 50, priority: 'Medium' },
      { category: '睡眠健康与床垫关系', count: 40, priority: 'High' },
      { category: '真实用户长期体验', count: 60, priority: 'Medium' },
      { category: '行业趋势 (如: 智能床垫)', count: 20, priority: 'Low' }
    ],
    content: [
      {
        type: 'CoolNest技术白皮书 (伪)',
        count: 40,
        word_count: '2000-3500字',
        focus: '材料科学与散热原理'
      },
      {
        type: '完整对比分析 (vs. Tempur, Serta)',
        count: 50,
        word_count: '2000-3000字',
        focus: '多维度性能对比'
      },
      {
        type: '睡眠指南 (结合CoolNest)',
        count: 60,
        word_count: '1800-3000字',
        focus: '改善睡眠质量'
      },
      {
        type: 'FAQ深度解答 (如: 异味, 寿命)',
        count: 50,
        word_count: '1500-2500字',
        focus: '常见问题全面解答'
      }
    ],
    citations: [
      {
        type: '官方技术文档/专利',
        percentage: 40,
        examples: 'CoolNest材料测试报告, 专利文件'
      },
      {
        type: '睡眠科学研究',
        percentage: 30,
        examples: '医学期刊, 睡眠实验室数据'
      },
      {
        type: '深度用户测评 (Reddit, 博客)',
        percentage: 30,
        examples: '用户长期使用故事, 论坛讨论'
      }
    ]
  },
  google: {
    name: 'Google AIO',
    icon: '🔍',
    color: '#4285F4',
    description: 'AI Overview优化 - CoolNest结构化数据和快速答案',
    stats: {
      visibility_target: '95%',
      priority_prompts: 200,
      content_pieces: 250,
      citation_density: '12-18/篇'
    },
    optimization_focus: [
      '快速回答 (Quick answers)',
      '结构化数据 (Structured data)',
      '精选摘要 (Featured snippets)',
      '产品Schema标记'
    ],
    prompts: [
      { category: '最佳冷感床垫 (Best cooling mattress)', count: 120, priority: 'High' },
      { category: 'SweetNight CoolNest 价格', count: 100, priority: 'High' },
      { category: 'SweetNight CoolNest 评价 (reviews)', count: 90, priority: 'High' },
      { category: 'CoolNest 床垫保修/试用', count: 70, priority: 'Medium' },
      { category: '哪里买 SweetNight CoolNest', count: 60, priority: 'High' },
      { category: 'CoolNest vs. 某竞品', count: 50, priority: 'Medium' },
      { category: '床垫行业新闻', count: 20, priority: 'Low' }
    ],
    content: [
      {
        type: '结构化购买指南 (含表格)',
        count: 70,
        word_count: '1500-2500字',
        focus: '清晰列表和对比表格'
      },
      {
        type: '快速产品对比页',
        count: 60,
        word_count: '1200-2000字',
        focus: '对比表格突出, 优缺点'
      },
      {
        type: '最佳冷感床垫榜单 (Top 5)',
        count: 60,
        word_count: '2000-3000字',
        focus: '评分和推荐理由 (CoolNest #1)'
      },
      {
        type: 'FAQ简洁回答 (Schema优化)',
        count: 60,
        word_count: '800-1500字',
        focus: '直接答案前置, 优化snippet'
      }
    ],
    citations: [
      {
        type: '第三方权威评测 (如: Sleep Foundation)',
        percentage: 35,
        examples: 'Wirecutter, CNET, Good Housekeeping'
      },
      {
        type: '官方产品页 (SweetNight.com)',
        percentage: 30,
        examples: 'CoolNest产品详情页, 品牌商城'
      },
      {
        type: '主流媒体报道 (如: Forbes)',
        percentage: 20,
        examples: 'TechRadar, Tom\'s Guide, Forbes Vetted'
      },
      {
        type: '用户生成内容 (YouTube, IG)',
        percentage: 15,
        examples: '开箱视频, Instagram 卧室美图'
      }
    ]
  },
  rufus: {
    name: 'Amazon Rufus',
    icon: '🛒',
    color: '#FF9900',
    description: '购物助手优化 - CoolNest产品详情和购买引导',
    stats: {
      visibility_target: '90%',
      priority_prompts: 180,
      content_pieces: 220,
      citation_density: '10-15/篇'
    },
    optimization_focus: [
      '购买意图 (Purchase intent)',
      '产品对比 (Comparison)',
      '客户评论 (Customer reviews)',
      '优惠与促销 (Deal optimization)'
    ],
    prompts: [
      { category: 'SweetNight CoolNest vs. Zinus (站内)', count: 100, priority: 'High' },
      { category: 'CoolNest 10英寸 vs. 12英寸', count: 90, priority: 'High' },
      { category: '寻找适合热睡者的床垫 (Amazon)', count: 80, priority: 'High' },
      { category: 'CoolNest 是否有折扣 (deal)', count: 70, priority: 'Medium' },
      { category: 'CoolNest 安装与设置', count: 50, priority: 'Low' },
      { category: '场景化应用 (如: 小户型卧室)', count: 40, priority: 'Medium' },
      { category: '退货政策', count: 30, priority: 'Low' }
    ],
    content: [
      {
        type: 'A+ 详情页内容',
        count: 80,
        word_count: 'N/A',
        focus: '图文并茂, 突出卖点'
      },
      {
        type: '优化的用户Q&A (SOP回答)',
        count: 60,
        word_count: '50-150字/条',
        focus: '主动回答客户疑问'
      },
      {
        type: '对比图表 (品牌内)',
        count: 40,
        word_count: 'N/A',
        focus: 'SweetNight不同型号对比'
      },
      {
        type: '优惠信息与Posts',
        count: 40,
        word_count: 'N/A',
        focus: '促销信息, 品牌Post'
      }
    ],
    citations: [
      {
        type: 'Amazon产品信息',
        percentage: 60,
        examples: '标题, 五点描述, A+内容, Q&A, Reviews'
      },
      {
        type: '官方产品规格',
        percentage: 20,
        examples: '技术参数, 认证 (CertiPUR-US)'
      },
      {
        type: '用户评论 (Reviews)',
        percentage: 15,
        examples: '高分评论, 提及"cooling"的评论'
      },
      {
        type: '促销与优惠 (Deals)',
        percentage: 5,
        examples: 'Deal页面, 折扣码, Prime专享'
      }
    ]
  }
};

export const comparisonMetrics: ComparisonMetric[] = [
  { metric: 'CoolNest技术深度', chatgpt: 95, google: 70, rufus: 50 },
  { metric: '购买意图强度', chatgpt: 40, google: 75, rufus: 95 },
  { metric: '快速答案优化', chatgpt: 60, google: 95, rufus: 80 },
  { metric: '引用源多样性', chatgpt: 85, google: 90, rufus: 60 },
  { metric: '转化优化重点', chatgpt: 50, google: 70, rufus: 90 },
  { metric: '内容新鲜度要求', chatgpt: 75, google: 85, rufus: 70 }
];

// Connection mappings
export const promptContentLinks: Record<number, number[]> = {
  0: [0, 1],
  1: [0, 1],
  2: [0, 1],
  3: [2, 3],
  4: [2, 3],
  5: [2, 3],
  6: [2, 3]
};

export const contentCitationLinks: Record<number, number[]> = {
  0: [0, 1, 2],
  1: [0, 1, 2],
  2: [0, 1, 2, 3],
  3: [0, 1, 2, 3]
};