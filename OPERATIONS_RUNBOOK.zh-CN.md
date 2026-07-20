# 生产运行手册

[English](OPERATIONS_RUNBOOK.md) | [Français](OPERATIONS_RUNBOOK.fr.md) | [简体中文](OPERATIONS_RUNBOOK.zh-CN.md)

## 文档目的

本手册说明 FlightOps Secure Delivery Factory 如何监控 Production 可用性，以及如何处理失败的检查。

Production 地址：

<https://main.d2lh4ktwzmstsc.amplifyapp.com/>

监控工作流位于 `.github/workflows/smoke-test.yml`。

## 可用性目标

运行目标是：

- 每天执行一次自动化 Production 检查；
- 调查每一次已经完成的失败检查；
- 通过现有受控交付流程恢复服务；
- 在 GitHub Issue 中记录故障发现和恢复证据。

检查成功表示：端点在重定向后返回成功的 HTTP 响应，并且返回的 HTML 包含 React 根元素和前端资源引用。

这是项目内部运行目标，不是面向用户的服务等级协议。

## 执行计划与事故生命周期

工作流每天 `07:23 UTC` 运行，也可以手动启动。

工作流管理使用以下固定标题的 Issue：

```text
[Operational Monitor] Production availability failure
```

生命周期如下：

```text
检查正常
  → 不存在未关闭事故

首次检查失败
  → 创建事故 Issue

后续检查失败
  → 向现有 Issue 添加证据

检查恢复
  → 添加恢复评论
  → 关闭 Issue
```

任何时候都应至多存在一个使用该标题的未关闭 Issue。

## 失败证据

检查失败时，工作流记录：

- Production 地址和检查的 UTC 时间；
- 触发事件以及是否为受控模拟；
- GitHub Actions 运行链接；
- 可用的响应头、返回的 HTML 和 smoke test 日志。

失败 artifacts 保留三天。

## 初始响应

事故被创建或更新后：

1. 打开 Issue 中链接的工作流运行。
2. 检查 `Controlled simulation` 是否为 `true`。
3. 查看失败步骤和 `smoke-test.log`。
4. 判断失败发生在 HTTP 请求还是应用外壳验证。
5. 检查最近一次 Release 工作流和 Production 部署。
6. 在未启用失败模拟的情况下手动运行 Production Smoke Test。
7. 在自动化健康检查将 Issue 关闭前保持事故开启。

不得仅因为浏览器能够访问网站就手动关闭事故。

## 故障调查

如果 HTTP 请求失败：

1. 查看工作流日志中的 HTTP 状态和错误信息。
2. 在文件存在时检查 `response-headers.txt`。
3. 使用其他浏览器或网络测试 Production 地址。
4. 检查最近一次 Release 工作流。
5. 确认 Amplify Production 分支仍为 `main`。

如果应用外壳验证失败：

1. 检查 `production.html`。
2. 确认文件包含 `id="root"` 和 `/assets/` 引用。
3. 检查 Amplify 是否以成功 HTTP 状态返回了错误页面。
4. 检查近期对 `index.html`、Vite 构建和 Amplify 配置的修改。

## 服务恢复

恢复服务必须使用现有受控交付路径。

不得：

- 手动修改 Production 文件；
- 绕过 required checks 或 Production Environment 审批；
- 强制推送部署分支；
- 创建新的 AWS 资源；
- 使用长期 AWS 凭证。

完成纠正措施后：

1. 在未启用失败模拟的情况下手动运行 Production Smoke Test。
2. 确认检查成功。
3. 确认事故中添加了恢复评论。
4. 确认事故已关闭。
5. 保留 Issue 和工作流链接作为证据。

独立的受控回滚工作流将在后续任务中实现。在此之前，不得临时采用未经评审的回滚方式。

## 受控监控演练

可以在不中断 Production 的情况下验证事故生命周期。

模拟故障发现：

1. 手动运行 Production Smoke Test。
2. 将 `simulate_failure` 设置为 `true`。
3. 确认工作流按预期失败。
4. 确认创建了事故 Issue 和失败 artifact。

模拟恢复：

1. 再次运行工作流，并将 `simulate_failure` 设置为 `false`。
2. 确认 Production 检查成功。
3. 确认事故收到恢复评论并被关闭。

模拟仅改变监控结果，不会修改或中断 Production。

## 监控自动化故障

如果工作流无法管理 Issue：

1. 检查失败的 GitHub API 步骤。
2. 确认工作流授予了 `issues: write`。
3. 确认仓库策略允许工作流令牌写入 Issue。
4. 如果 Production 不可用，手动创建或更新事故。
5. 通过正常 Pull Request 流程修复自动化。

工作流使用仅限当前仓库的 `GITHUB_TOKEN`，正常运行不需要个人访问令牌。

## 已知限制

- GitHub Actions schedule 不是实时监控，可能延迟或被丢弃。
- 定时工作流只能从默认分支运行。
- 公共仓库连续 60 天没有活动时，定时工作流可能被禁用。
- 每天一次的采样无法衡量持续可用性。
- 检查只验证可访问性和应用外壳，不覆盖所有用户流程。
- GitHub 故障可能同时影响监控运行和 Issue 报告。
- GitHub Issues 不提供有保证的电话告警或响应时间。
- 个人项目没有独立值班团队，也不具备运行职责分离。

工作流成功不能证明 Production 持续可用，本项目不声明企业级 SLA。

## 成本约束

此控制使用公共仓库、GitHub 标准托管 Runner、GitHub Actions、GitHub Issues、仓库 `GITHUB_TOKEN` 和免费命令行工具。

它不引入商业监控平台、付费 Runner、新的 AWS 资源、付费事故管理服务或依赖试用期的服务。失败 artifacts 仅在需要时创建，并保留三天。

GitHub 参考资料：

- <https://docs.github.com/en/actions/concepts/billing-and-usage>
- <https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows>
- <https://docs.github.com/en/actions/concepts/security/github_token>

## 证据清单

保留以下链接：

- 失败的监控运行；
- 运行事故 Issue；
- 重复失败评论（如适用）；
- 成功的恢复运行；
- 恢复评论和已关闭 Issue；
- 纠正 Release 或回滚运行（如适用）。
