# CI/CD 自动化部署指南

## 📋 目录

- [概述](#概述)
- [架构说明](#架构说明)
- [快速开始](#快速开始)
- [部署命令](#部署命令)
- [工作流程](#工作流程)
- [GitHub Actions](#github-actions)
- [Vercel 集成](#vercel-集成)
- [故障排查](#故障排查)
- [最佳实践](#最佳实践)

---

## 概述

LeapGEO7 项目已配置完整的 CI/CD 自动化流程，实现：

✅ **自动化代码检查** - TypeScript 类型检查和代码质量验证
✅ **自动化构建** - 生产环境代码打包和优化
✅ **自动化部署** - 推送到 GitHub 后自动触发 Vercel 部署
✅ **持续集成** - GitHub Actions 自动运行测试和构建
✅ **健康检查** - 部署前验证环境配置

---

## 架构说明

### 部署流程图

```
本地开发 → 运行健康检查 → 类型检查 → 构建验证
    ↓
自动提交 → 推送到 GitHub → 触发 GitHub Actions
    ↓                           ↓
Vercel 检测到推送 ← ────── CI 检查通过
    ↓
自动部署到生产环境 → 部署完成通知
```

### 技术栈

- **版本控制**: Git + GitHub
- **CI/CD**: GitHub Actions
- **部署平台**: Vercel
- **构建工具**: Vite + TypeScript
- **自动化脚本**: Bash Scripts

---

## 快速开始

### 1. 首次配置

```bash
# 运行健康检查，确保环境就绪
npm run health-check

# 设置 Git 配置（如果需要）
npm run setup:git
```

### 2. 日常开发部署

完成开发后，运行一条命令自动部署：

```bash
# 使用默认提交信息
npm run deploy

# 或使用自定义提交信息
npm run deploy:msg "feat: add new feature"
```

**这个命令会自动执行**:
1. ✅ TypeScript 类型检查
2. ✅ 生产环境构建
3. ✅ Git 提交（带格式化的消息）
4. ✅ 推送到 GitHub
5. ✅ 触发 Vercel 自动部署

### 3. 监控部署状态

```bash
# 本地构建测试
npm run ci

# 查看部署日志
# 访问 https://vercel.com/dashboard
```

---

## 部署命令

### `npm run deploy`

**功能**: 一键自动化部署到生产环境

**执行步骤**:
1. 运行 `npm run type-check` 检查 TypeScript 错误
2. 运行 `npm run build` 验证生产构建
3. 使用默认消息创建 Git 提交
4. 推送到 GitHub 远程仓库
5. Vercel 自动检测并部署

**示例**:
```bash
npm run deploy
```

### `npm run deploy:msg`

**功能**: 使用自定义提交信息部署

**参数**: 提交信息（字符串）

**示例**:
```bash
npm run deploy:msg "feat: implement user authentication"
npm run deploy:msg "fix: resolve navigation bug"
npm run deploy:msg "docs: update README"
```

**提交信息规范** (建议使用 Conventional Commits):
- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更新
- `style:` - 代码格式调整
- `refactor:` - 代码重构
- `test:` - 测试相关
- `chore:` - 构建/工具链更新

### `npm run health-check`

**功能**: 检查部署环境健康状态

**检查项目**:
- ✅ Node.js 和 npm 版本
- ✅ Git 配置和远程仓库
- ✅ TypeScript 和 Vite 配置文件
- ✅ 依赖安装状态
- ✅ 工作目录清洁度

**示例**:
```bash
npm run health-check
```

### `npm run setup:git`

**功能**: 配置 Git 环境（首次使用）

**配置内容**:
- 设置 Git 用户名和邮箱
- 配置默认分支为 main
- 启用彩色输出
- 设置推送策略

**示例**:
```bash
npm run setup:git
```

### `npm run ci`

**功能**: 本地运行完整 CI 流程

**执行步骤**:
1. TypeScript 类型检查
2. 生产环境构建

**示例**:
```bash
npm run ci
```

---

## 工作流程

### 标准开发流程

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 开发功能
npm run dev
# ... 进行开发 ...

# 3. 运行健康检查（可选，建议）
npm run health-check

# 4. 一键部署
npm run deploy:msg "feat: add new dashboard widget"

# 5. 监控部署
# 访问 Vercel Dashboard 查看部署状态
```

### 紧急修复流程

```bash
# 1. 创建修复分支
git checkout -b hotfix/critical-bug

# 2. 修复问题
# ... 修复代码 ...

# 3. 本地测试
npm run ci

# 4. 推送到 GitHub
git push origin hotfix/critical-bug

# 5. 创建 Pull Request
# GitHub Actions 会自动运行 CI 检查

# 6. 合并后自动部署到生产环境
```

---

## GitHub Actions

### 配置文件

位置: `.github/workflows/deploy.yml`

### 触发条件

- **Push 到 main 分支**: 自动运行完整 CI/CD 流程
- **Push 到 develop 分支**: 运行 CI 检查（不部署）
- **Pull Request**: 运行 CI 检查（不部署）

### CI Jobs

#### 1. **quality-checks** (代码质量检查)
- TypeScript 类型检查
- ESLint 代码检查
- 代码格式验证

#### 2. **build** (构建)
- 安装依赖
- 构建生产版本
- 上传构建产物（保留 7 天）

#### 3. **test** (测试)
- 单元测试
- E2E 测试
- （当前禁用，可在测试就绪后启用）

#### 4. **notify-deployment** (部署通知)
- 仅在 main 分支推送时触发
- 通知 Vercel 部署状态

### 查看 CI 状态

```bash
# 访问 GitHub Actions 页面
https://github.com/keevingfu/leapgeo7/actions

# 或在本地查看最新 commit 状态
git log --oneline -1
```

---

## Vercel 集成

### 自动部署配置

Vercel 已通过 GitHub 集成自动配置，当检测到以下情况时自动部署：

✅ **生产部署** (main 分支):
- Push 到 main 分支
- Pull Request 合并到 main

✅ **预览部署** (其他分支):
- Push 到任何其他分支
- Pull Request 创建时

### Vercel 配置文件

位置: `vercel.json`

关键配置:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 监控部署

**Vercel Dashboard**:
- URL: https://vercel.com/dashboard
- 实时查看部署日志
- 监控构建状态和错误
- 查看部署历史

**部署 URL**:
- 生产环境: `https://leapgeo7.vercel.app` (示例)
- 预览环境: `https://leapgeo7-{branch}-{hash}.vercel.app`

### 环境变量配置

在 Vercel Dashboard 中配置环境变量：

1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加必要的环境变量：
   - `VITE_API_URL`
   - `VITE_NEO4J_URI`
   - 其他应用配置

---

## 故障排查

### 问题 1: 类型检查失败

**错误信息**:
```
Type-check failed. Please fix TypeScript errors before deploying.
```

**解决方案**:
```bash
# 运行类型检查查看详细错误
npm run type-check

# 修复 TypeScript 错误后重试
npm run deploy
```

### 问题 2: 构建失败

**错误信息**:
```
Build failed. Please fix build errors before deploying.
```

**解决方案**:
```bash
# 本地运行构建查看详细错误
npm run build

# 检查依赖是否安装
npm install

# 修复错误后重试
npm run deploy
```

### 问题 3: Git 推送失败

**错误信息**:
```
Failed to push to GitHub. Please check your credentials and network connection.
```

**解决方案**:
```bash
# 检查 Git 配置
git config --list

# 检查远程仓库配置
git remote -v

# 手动推送测试
git push origin main

# 如果需要重新配置 Git
npm run setup:git
```

### 问题 4: Vercel 部署失败

**解决方案**:
1. 访问 Vercel Dashboard 查看详细日志
2. 检查 `vercel.json` 配置是否正确
3. 确认环境变量已正确设置
4. 查看构建日志中的具体错误信息

### 问题 5: 无法执行脚本

**错误信息**:
```
Permission denied: scripts/auto-deploy.sh
```

**解决方案**:
```bash
# 添加执行权限
chmod +x scripts/*.sh

# 重试部署
npm run deploy
```

---

## 最佳实践

### 1. **部署前检查**

始终在部署前运行健康检查：
```bash
npm run health-check && npm run deploy:msg "your message"
```

### 2. **提交信息规范**

使用清晰、描述性的提交信息：
```bash
# ✅ 好的提交信息
npm run deploy:msg "feat: add user profile page"
npm run deploy:msg "fix: resolve login redirect issue"

# ❌ 不好的提交信息
npm run deploy:msg "update"
npm run deploy:msg "fix bug"
```

### 3. **分支策略**

- `main` - 生产环境，稳定版本
- `develop` - 开发环境，最新功能
- `feature/*` - 功能分支
- `hotfix/*` - 紧急修复分支

### 4. **定期测试 CI**

定期运行完整 CI 流程确保环境正常：
```bash
npm run ci
```

### 5. **监控部署**

每次部署后：
1. ✅ 检查 Vercel Dashboard 确认部署成功
2. ✅ 访问生产 URL 验证功能正常
3. ✅ 查看部署日志确认没有警告

### 6. **回滚计划**

如果部署出现问题：
```bash
# 方法 1: 在 Vercel Dashboard 回滚到上一个版本

# 方法 2: Git 回滚并重新部署
git revert HEAD
npm run deploy:msg "revert: rollback problematic changes"
```

### 7. **环境变量管理**

- 敏感信息不要提交到 Git
- 使用 `.env.example` 作为模板
- 在 Vercel Dashboard 中配置生产环境变量

---

## 脚本文件说明

### `scripts/auto-deploy.sh`

**功能**: 自动化部署主脚本

**流程**:
1. 检查 Git 仓库状态
2. 运行类型检查
3. 运行生产构建
4. 创建 Git 提交
5. 推送到 GitHub
6. 显示部署状态

### `scripts/health-check.sh`

**功能**: 环境健康检查脚本

**检查内容**:
- Node.js/npm 版本
- Git 配置
- 项目配置文件
- 依赖安装状态
- 工作目录状态

### `scripts/setup-git.sh`

**功能**: Git 环境配置脚本

**配置内容**:
- 用户名和邮箱
- 默认分支
- 推送策略
- UI 配置

---

## 常见问题 FAQ

### Q1: 如何跳过 CI 检查？

**A**: 不建议跳过 CI 检查，但如果紧急情况需要：
```bash
git commit -m "your message" --no-verify
git push origin main
```

### Q2: 部署需要多长时间？

**A**:
- CI 检查: 2-3 分钟
- Vercel 部署: 1-2 分钟
- 总计: 约 3-5 分钟

### Q3: 如何查看部署历史？

**A**:
- GitHub: `git log --oneline`
- Vercel: Dashboard → Deployments 页面

### Q4: 可以手动触发部署吗？

**A**: 是的，有三种方式：
```bash
# 方式 1: 使用自动化脚本
npm run deploy

# 方式 2: 手动 Git 操作
git add .
git commit -m "manual deploy"
git push origin main

# 方式 3: 在 Vercel Dashboard 手动触发重新部署
```

### Q5: 如何禁用自动部署？

**A**: 在 Vercel Dashboard 中：
1. 进入项目设置
2. Git Integration
3. 禁用 "Automatic Deployments"

---

## 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vercel 部署文档](https://vercel.com/docs)
- [Conventional Commits 规范](https://www.conventionalcommits.org/)
- [Git 最佳实践](https://git-scm.com/book/zh/v2)

---

## 技术支持

如遇到问题：

1. 📖 查看本文档的故障排查部分
2. 🔍 检查 GitHub Actions 日志
3. 📊 查看 Vercel Dashboard 部署日志
4. 💬 联系开发团队

---

**最后更新**: 2025-01-23
**版本**: v1.0.0
**维护者**: Claude Code
