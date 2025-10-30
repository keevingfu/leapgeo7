# Content Mapping Network - React TypeScript 版本

这是一个基于 React + TypeScript 的 SweetNight CoolNest 冷感床垫 SEO 优化战略可视化应用。

## 📋 功能特点

- **三层数据映射可视化**: Prompts → Content → Citations
- **跨平台对比分析**: ChatGPT vs Google AIO vs Amazon Rufus
- **交互式 SVG 连接线**: 动态展示数据关联关系
- **雷达图和柱状图**: 多维度性能对比
- **响应式设计**: 支持桌面和移动设备

## 🚀 快速开始

### 安装依赖

```bash
cd /Users/cavin/Desktop/dev/eurekageo/react-app
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:3000 自动打开

### 构建生产版本

```bash
npm run build
```

构建输出将在 `dist` 目录

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
react-app/
├── src/
│   ├── Content Mapping Network.tsx  # 主组件
│   ├── components/                  # 子组件
│   │   ├── LandingPage.tsx         # 登陆页
│   │   ├── PlatformDetail.tsx      # 平台详情页
│   │   ├── ComparisonPage.tsx      # 对比页
│   │   ├── StatCard.tsx            # 统计卡片
│   │   └── Tooltip.tsx             # 工具提示
│   ├── data/
│   │   └── platformsData.ts        # 平台数据
│   ├── types/
│   │   └── index.ts                # TypeScript 类型定义
│   ├── styles/
│   │   └── index.css               # 全局样式
│   └── main.tsx                    # 应用入口
├── public/                          # 静态资源
├── index.html                       # HTML 入口
├── package.json                     # 项目配置
├── tsconfig.json                    # TypeScript 配置
├── tailwind.config.js               # Tailwind CSS 配置
├── postcss.config.js                # PostCSS 配置
└── vite.config.ts                   # Vite 配置
```

## 🛠 技术栈

- **React 18**: UI 框架
- **TypeScript 5**: 类型安全
- **Vite 5**: 构建工具
- **Tailwind CSS 3**: 样式框架
- **Chart.js 4**: 数据可视化
- **React Chart.js 2**: Chart.js React 封装

## 📊 数据结构

### 平台数据 (PlatformData)

```typescript
interface PlatformData {
  name: string;              // 平台名称
  icon: string;              // 图标emoji
  color: string;             // 主题色
  stats: PlatformStats;      // 统计数据
  prompts: PlatformPrompt[]; // 用户意图
  content: PlatformContent[]; // 内容资产
  citations: PlatformCitation[]; // 引用来源
  optimization_focus: string[]; // 优化重点
}
```

### 连接映射

- `promptContentLinks`: Prompts 到 Content 的映射关系
- `contentCitationLinks`: Content 到 Citations 的映射关系

## 🎨 自定义配置

### 修改平台数据

编辑 `src/data/platformsData.ts` 文件：

```typescript
export const platformsData = {
  chatgpt: { /* ... */ },
  google: { /* ... */ },
  rufus: { /* ... */ }
};
```

### 添加新平台

1. 在 `src/types/index.ts` 中扩展 `PlatformKey` 类型
2. 在 `src/data/platformsData.ts` 中添加新平台数据
3. 更新连接映射关系

### 自定义样式

编辑 `tailwind.config.js` 或 `src/styles/index.css`

## 📝 开发命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产版本 |
| `npm run type-check` | TypeScript 类型检查 |

## 🌐 部署

### 静态部署

构建后的 `dist` 目录可直接部署到任何静态服务器：

- Nginx
- Apache
- Vercel
- Netlify
- GitHub Pages

### Docker 部署

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 🔧 故障排除

### 依赖安装失败

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript 错误

```bash
npm run type-check
```

### 清除缓存

```bash
rm -rf node_modules/.vite
```

## 📄 许可证

内部项目 - SweetNight CoolNest

---

**注意**: 这是从原始 HTML 版本 (index02.htm) 重构的 React TypeScript 版本，保留了所有原始功能并添加了类型安全和组件化架构。