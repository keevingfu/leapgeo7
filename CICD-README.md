# CI/CD 自动化部署 - 快速开始

## 🚀 一键部署

完成开发后，运行一条命令即可自动部署：

```bash
# 使用自定义提交信息部署
npm run deploy:msg "feat: add new feature"

# 或使用默认提交信息
npm run deploy
```

**自动执行**:
✅ TypeScript 类型检查
✅ 生产环境构建
✅ Git 提交和推送
✅ 触发 Vercel 自动部署

## 📋 可用命令

| 命令 | 说明 |
|------|------|
| `npm run deploy` | 使用默认消息自动部署 |
| `npm run deploy:msg "message"` | 使用自定义消息部署 |
| `npm run health-check` | 检查部署环境健康状态 |
| `npm run setup:git` | 配置 Git 环境（首次使用） |
| `npm run ci` | 本地运行完整 CI 流程 |

## 🔄 工作流程

```
本地开发 → 类型检查 → 构建验证 → Git 提交
    ↓
推送到 GitHub → GitHub Actions CI → Vercel 自动部署
    ↓
生产环境更新 ✨
```

## 📊 监控部署

- **GitHub Actions**: https://github.com/keevingfu/leapgeo7/actions
- **Vercel Dashboard**: https://vercel.com/dashboard

## 🔧 提交信息规范

建议使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更新
- `style:` - 代码格式调整
- `refactor:` - 代码重构
- `test:` - 测试相关
- `chore:` - 构建/工具链更新

## 📖 详细文档

查看 [CICD-GUIDE.md](./CICD-GUIDE.md) 获取完整的 CI/CD 配置和故障排查指南。

---

**配置完成时间**: 2025-01-23
**自动化级别**: 完全自动化 ✨
