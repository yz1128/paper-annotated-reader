# paper-annotated-reader

论文双栏批注件生成器：把一篇论文做成可读、可打印、可发微信的静态 HTML 精读单页。

不是摘要生成器。它做的是把论文的论证链摊开——每段原文配中文译文，右侧逐段给出「段落功能 / 逻辑角色 / 技巧与漏洞 / 替代解释」，每节末尾放一个停读点，摘要之前放 4–5 个带着读的问题。

## 产出物

```
┌─ 导航：读前五问 · 摘要 · 引言 · 方法 · 结果 · 讨论 · 结论 · 论证总览
├─ 封面：题目、作者、期刊、批注维度
├─ 读前 N 问         ← 只给问题，不给答案
├─ 左栏 原文+译文 │ 右栏 批注   （双栏，五色高亮）
├─ 每节末 停读点     ← 折叠答案
└─ 论证结构总览      ← 问题→论点→证据→反驳处理→结论
```

- 单文件 HTML，正文静态预渲染，禁用 JS 也能读
- 打印走单栏讲义版，`@page{size:A4}` 已内置
- 需要"和网页排版一模一样"时导出长图

## 使用

本仓库是 Hermes Agent 的 skill 目录，放进 `skills/` 下即可被加载。核心用法见 `SKILL.md`。

```bash
node scripts/build-from-data.js my-paper_data.js out.html
node scripts/prerender.js out.html
bash scripts/export-pdf.sh out.html out.pdf
python scripts/html-to-longshot.py out.html shot.png 1560
```

## 文件

| 路径 | 用途 |
| --- | --- |
| `SKILL.md` | 完整流程：选篇、切段、批注质量线、验收、导出 |
| `templates/annotated-reader.html` | 页面骨架（CSS + 渲染函数） |
| `templates/example-data.js` | 两段可运行数据样例 |
| `scripts/build-from-data.js` | 模板 + 数据 → 待预渲染 HTML |
| `scripts/prerender.js` | DATA 预渲染成静态 DOM |
| `scripts/export-pdf.sh` | HTML → A4 PDF（Chromium headless） |
| `scripts/html-to-longshot.py` | HTML → 整页长图（CDP captureBeyondViewport） |
| `scripts/slice-image.py` | 长图按空白行切段，适合微信分段看 |
| `references/annotation-rubric.md` | 五色边界、批注好/坏例、论证链审计清单 |

## 设计取舍

**为什么是静态预渲染**：纯 JS 渲染的页面在被禁脚本的查看器里是整页空白，看起来像文件坏了。

**为什么主题色是暖墨褐**：冷海军蓝配米纸背景会分裂成两个色系。`--navy:#2a2419` 与 `--paper:#faf7f0` 同色温。

**为什么 PDF 是单栏**：A4 竖版可用宽度只有网页的 46%，双栏正文得压到 7.6px。要双栏观感就导长图，不要勉强 CSS 去模仿印刷版。
