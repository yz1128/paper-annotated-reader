---
name: paper-annotated-reader
description: Use when 用户说「用 HTML 讲论文/做成网页/双栏批注」。产出可打印的精读单页。
version: 1.2.3
author: W
license: MIT
metadata:
  hermes:
    tags:
      - paper-reading
      - annotated-html
      - teaching
      - deliverable
    related_skills:
      - research/paper-reading-coaching
      - productivity/docx
      - note-taking/obsidian
---

# 论文双栏批注件（paper-annotated-reader）

## When to Use

命中以下任一说法就直接开工，不反问形式：

| 用户说法 | 动作 |
| --- | --- |
| 「用 HTML 讲论文」「做成网页」「html 版」「网页版精读」 | 直接走本流程 |
| 「双栏批注」「英中对照」「论证结构可视化」 | 直接走本流程 |
| 「转 PDF」「导出图片/长图」「和网页端排版一样」 | 已有 html 就只走导出节，不要重做内容 |

与 `paper-reading-coaching` 的分工：那个是**交互式领读**（一站一停、等「下一个」）；这个是**一次性静态交付**——不提问、不逐站推进，直接产出可双击打开、可打印、可微信发送的 .html。

判据：用户说「讲给我听、带着我读」→ coaching；说「做成 HTML/网页/批注件」→ 本 skill；两者都要时说「先做一页报纸再领读」，先交付后领读。

## 交付形态（固定，不要每次重新设计）

- 单文件 `.html`，内容不依赖运行时 JS 才能看见
- 左栏：英文原文（五色高亮）+ 紧跟中文译文（浅米色块 #f0ece2 + 左侧细竖线）
- 右栏：逐段批注（段落功能 / 逻辑角色 / 技巧·漏洞 / 替代解释）
- 每节末尾：「停读点」卡片——一个问题 + 折叠答案，逼读者先自己判断再对照
- 全文之前：**「读前 N 问」卡片**（N=4–5）——针对本篇核心争议，读前带着、读后自答；只给问题不给答案，答案落在正文对应段落里
- 顶部：暖墨褐 #2a2419 导航 + 五色图例 + sticky 章节条（与纸色 #faf7f0 同色温；冷海军蓝 #0f2137 是旧版，不要再用）
- 文末：论证结构总览（问题→论点→证据→反驳→结论、一句话主张、最强处 vs 最弱处）；底色与正文同为 `--paper`，靠淡金卡片底与左竖线分层，不另起深色块
- 移动端单栏；`@media print` 单栏讲义版，且**必须同时含 `@page{size:A4;margin:12mm 13mm}` 与 `h3.sec{break-after:avoid}`**——缺前者导出的 PDF 是 Letter 纸型，缺后者章节标题会孤悬在页尾
- 字体 Lora / IBM Plex Sans，中文回落 Noto Serif SC / Songti SC / 宋体

## 流程

### 1 选篇

必须同时满足：

- 开放全文（arXiv / PMC / 作者主页 PDF），能抓到可引用的原文
- 论证链完整、有真争议可批注（AI 评测、医学影像、方法学论文尤其合适）
- 正文 20–30 段可控；60 页综述不选，批注量会失控

给用户一句选篇理由（为什么这篇值得做），然后直接开工——"做一篇试试"是执行指令，不是征询。

### 2 取全文并交叉核对

1. `web_extract` arXiv PDF 全文（`char_limit` 给到 30000 以上）
2. 同抓 `https://ar5iv.labs.arxiv.org/html/<arxiv-id>`（或 PMC HTML）
3. 逐节比对：PDF 抽取会**吞段、合并图注、丢序号**。任何要写进批注的"原文如此"，先在 HTML 版确认

判据：PDF 里出现 "First… Third…" 这种断裂，先怀疑抽取，不要直接当作者失误写进批注；两边都缺，才算原文缺陷。

### 3 切段

- 按正文章节切，一个论证单元一段（摘要 1、引言 3–4、方法 3–4、数据 3、结果 4–6、结论 2–3）
- 目标 20–25 段；超过 30 段说明切太细，合并
- **段数是硬指标**：渲染后 `.pair` 数量必须等于顶部元信息写的段数。元信息写"25 段"而实际 23 段是交付事故

### 4 写内容（质量线）

每段三样东西：

1. `en`：原文 + 五色 `<mark>`，一段 3–6 处，不要满屏花
2. `zh`：意译，读起来像中文学术论文；术语保留英文；**不加高亮**
3. 批注四段式：
   - 段落功能：4–6 字（结论先行 / 预先消解金标准 / 让步与自我限定 …）
   - 逻辑角色：这段在整条论证链里承担什么
   - 技巧 / 漏洞：**必须落到可核查的事实**
   - 替代解释（`alt`）：这段结果至少还能怎么解释；作者的实验排除了哪一种、留下了哪一种

停读点（`stop`，每节一个，不是每段）：

- 问题必须是**读者能自己动手判的**，不是知识点复述（「这个实验证明了什么、没证明什么」对，「什么是 AUC」错）
- 答案写成一个可操作的下一步或一句可写进综述的表述，不写「值得进一步研究」
- 每节最多一个，问题超过两句就说明这一节还没想清楚要读者拿走什么

读前 N 问（4–5 个，放在摘要之前，只给问题不给答案）：

- 每问必须是**这一篇的争议点**，不是通用科学素养题。「什么是 AUC」错，「只看院区不看片子能拿多少 AUC」对
- 问到具体数字或二选一上，读者读完能自己判对错：「先猜 AUC 会掉多少：0.01 还是 0.15？」
- 答案不要写进卡片。写出来就废掉了边读边想的作用，答案散在正文对应段落与停读点里
- 顺序跟论证链走：结果预期 → 衡量基准 → 证据强度 → 因果归属
- 卡片样式用浅米底 + 金色左竖线，比正文深一档就够，不要做成深色块抢摘要的位置

批注硬规则：

- 先算再写：置信区间宽度、差值下限、提升幅度、样本量、分母
- 优先抓这些真实缺陷：摘要强主张 vs 后置限定、两套实验之间偷换指标、边缘显著（CI 下限贴着 0）、cherry-picked 示例、金标准本身是"其余评分者的标注"、损失函数/预处理的隐性代价、相关工作只比排名不比协议
- 禁止"可能存在一定偏差""值得进一步研究"这类空批注——那是没读出来的证据
- 原文硬伤照实写（缺序号、双重否定、数字自相矛盾），标注"原文如此"，不替作者改
- 每个数字都要能在原文找到；找不到就不写

### 5 写数据文件（不手改模板）

新建 `<paper>_data.js`，放进 scratch 目录（不入库，交付只给 html）：

```js
const DATA = [
{id:'s-abs', title:'摘要', en:'Abstract', blocks:[
  {en:`...<mark class="y">核心论点</mark>...`,   // 原文，必填
   zh:`...中文意译，不加高亮...`,                 // 必填
   fn:'结论先行',                                 // 必填，4–6 字
   role:'这段在论证链里的位置。',                  // 必填
   note:'可核查的技巧或漏洞。',                    // 必填
   alt:'这段结果还能怎么解释；作者的实验排除了哪种、留下哪种。'}, // 选填
  {en:`...`, zh:`...`, fn:'...', role:'...', note:'...'}
],
 stop:{q:'读者能自己动手判的问题', a:'可操作的下一步或可写进综述的一句'}},
{id:'s-intro', title:'1 引言', en:'Introduction', blocks:[...]}
];

const META = {
'__PAPER_TITLE_CN__':'中文标题', '__COURSE__':'副标题/场景',
'__SOURCE_LINE__':'期刊 · 年份 · doi', '__PAPER_TITLE_EN__':'英文全名',
'__AUTHORS__':'作者列表',
'__DS1__':'问题', '__DS2__':'论点', '__DS3__':'证据', '__DS4__':'反驳处理', '__DS5__':'结论',
'__ONE_LINER__':'一句话主张', '__STRONG__':'最强处', '__WEAK__':'最弱处'
};
```

字段约定：`blocks[].alt` 与 `section.stop` 都可省略；有 `alt` 的段才会渲染第四行；`stop` 按节计，不是按段计。

### 6 生成 + 静态预渲染（两条命令）

```bash
node scripts/build-from-data.js <data.js> "C:/Users/Yanz/Desktop/xxx-annotated.html"
node scripts/prerender.js "C:/Users/Yanz/Desktop/xxx-annotated.html"
```

内容不能靠运行时 JS 生成。prerender 把 DATA 渲染成静态 DOM 写回文件，只保留进度条/回顶/打印展开这几条增强脚本。

理由：JS 被禁、CSP 收紧、内嵌查看器不执行脚本时，纯 JS 渲染的页面是**整页空白**，而且看起来像文件坏了。

### 7 验收（缺一不可）

1. 抽取 `<script>` 内容跑 `node --check`（模板字符串引号错配是最常见的语法事故）
2. 浏览器打开，断言计数：节数 / `.pair` / `.note` / `.stop-card` / `mark`，与元信息一致（`.stop-card` 数 = 有 `stop` 的节数）
3. 桌面 1440 截图 + 移动 390 截图：无横向溢出，双栏正确塌成单栏
4. 点一个章节锚点，确认标题 `top ≥ header 高度`（不被 sticky 导航遮住）
5. 底部总览完整
6. 交付：绝对路径 + `MEDIA:`，一句话说明怎么用（双击打开 / Ctrl+P 导出）

## 导出 PDF

用户要打印或发送时，走 Chromium headless，不要手工 Ctrl+P：

```bash
bash scripts/export-pdf.sh "C:/Users/Yanz/Desktop/xxx-annotated.html" "C:/Users/Yanz/Desktop/xxx-annotated.pdf"
```

等价手写命令（PowerShell，用户自己执行时给这个）：

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --no-pdf-header-footer --run-all-compositor-stages-before-draw --virtual-time-budget=8000 --print-to-pdf="C:\Users\Yanz\Desktop\out.pdf" "file:///C:/Users/Yanz/Desktop/x.html"
```

只选 Chromium 系（Edge 优先，Windows 自带）。wkhtmltopdf 与 WeasyPrint 都不支持 CSS grid，双栏会塌成竖排；Playwright/Puppeteer 底层是同一个 Chromium，多一层依赖没有收益。

导出后一次查完三项再交付：页数 > 0、页面尺寸 ≈ 210×297mm、抽一段中文能正常取出（`pymupdf`）。尺寸不对就是 `@page` 没生效，别去调浏览器参数。

## 导出长图（用户要「和网页端一样」时）

PDF 分页必然重排；要**完全保留网页双栏观感**就导长图，不要让 CSS 去模仿印刷版：

```bash
python scripts/html-to-longshot.py "C:/Users/Yanz/Desktop/xxx-annotated.html" "<scratch>/xxx_full.png" 1560
```

底层是 CDP `Page.captureScreenshot` + `captureBeyondViewport: true`，不是 `--screenshot`（后者没有整页模式，只能截视口）。截图高度受 Chromium 上限约束，约 16000px；超了要分段截再拼。

**宽度约束决定走 PDF 还是长图**，先算再动手：

| 载体 | 可用宽度 | vs 网页 | 结论 |
| --- | --- | --- | --- |
| 网页容器 | ≈41cm | 100% | 原排版 |
| A4 竖版 | 18.4cm | 46% | 正文得压到 ~7.6px，不可读 |
| A4 横版 | 28.1cm | 71% | 字号缩到 71% 仍可读，能打印 |
| 长图 1536px | 固定像素 | 100% | 观感一致，但不可分页打印 |

所以：要打印 → A4 竖版单栏 PDF（默认）；要屏幕看/发微信 → 长图；要打印又要双栏 → 横版 A4，字号整体乘 0.71。

长图直接发微信会被压成窄条。超过约 8000px 高时主动按空白行切成 2–5 段（`scripts/slice-image.py`，在目标切点 ±500px 内找整行单色背景，避免切断段落），先给一张整图让用户确认，再问他是否要分段。

## 改版：主题色与区块顺序

已交付的 html 被要求「换个主题色 / 把某块挪到前面」时，只改 CSS 与 DOM 顺序，不要重跑内容生成。

### 主题色换色温

深海军蓝 `#0f2137` 配米纸 `#faf7f0` 是冷暖撞色。用户说「和正文适配」时按同色温整体换：navy 三阶一起改成暖墨褐（`#2a2419 / #3a3325 / #4b4231`），`--ink` 同步 `#231f18`。只改 `:root` 不够。

替换完必须**程序化扫一遍漏网的冷色**——硬编码的蓝散落在 `.chip`、`.flow-step .no`、`.note-val.alt`、`details summary`、以及 `rgba(255,255,255,.0x)` 半透明底里，肉眼查不全：

```python
for c in set(re.findall(r"#[0-9a-fA-F]{6}", s)):
    r,g,b = int(c[1:3],16), int(c[3:5],16), int(c[5:7],16)
    if b > r + 18 and b > 100: print(c)   # 仍偏蓝
```

**五色高亮 `#cfe4ff` / `#e4d7f8` 是语义色，不在替换范围内**——它们标的是「证据」「方法」，换了读者就丢了图例对应关系；顶部五色图例同理。

深色块里的白色半透明底（`rgba(255,255,255,.05)`）在暖色主题下会显灰发脏，换暖金 `rgba(201,168,106,.08)`。

### 论证总览去深色底

用户说「背景和正文一样」时，`.skeleton` 直接 `background:var(--paper);color:var(--ink)`，去掉深色底与 `border-radius`；内部 `.flow-step` / `.sk-card` 保留淡金底 `rgba(201,168,106,.14)` 与金色左边线承载结构，靠标题和留白分块。

**必须同步把浅色文字全部转深**：`.flow-step .nm`（原 `#fff`）、`.sk-card p`（原 `#e8e2d4`）、`.sk-card .big`（原 `#fff`）、`.skeleton .sk-sub`（原 `#b3a992`）、`.flow-step .ds`（原 `#c0b6a0`）。漏一个就是白字压米纸，整块内容消失。打印版同步去掉 `border:2px solid #000`，因为底已与纸同色。

### 挪区块位置

`s-skeleton` 之类整段搬到摘要之前后，**顶部章节条的锚点顺序必须同步改**，否则导航跳转和正文顺序对不上。搬完断言 `s.index('id="s-skeleton"') < s.index('id="content"')`，并回读 `class="pair"` 与 `class="stop-card"` 计数不变——搬动只改 DOM 位置，不许碰内容。

改完重新导出预览给用户看，他确认后再生效到其他同批 html。

## 坑

- **反引号开头、单引号结尾的模板字符串**会让整个脚本不执行；症状是"只有骨架没有正文"。提取脚本跑 `node --check` 定位，别肉眼扫几千行
- **file:// 打开正文为空，先怀疑脚本没执行**（`typeof DATA`、`window.__RAN` 一分钟定位），确认后走静态预渲染，不要换浏览器反复重试
- **PDF 抽取吞段**（Limitations、Related Work 这类小标题段高发）：ar5iv/PMC 对照后再引用
- **元信息段数靠手写必然错**：用渲染后的 DOM 计数回填；模板里的段数占位必须写成数字（如 `全文 0 段`），prerender 用 `/全文\\s*\\d+\\s*段/` 回填，写 `__N__` 不会被替换
- **`.note` 里加新行要同时改模板渲染函数和 prerender.js**：交付走的是 prerender，模板只用于预览，改一处会出现「预览有、交付没有」
- **Google Fonts 断网**：字体栈必须写全回落，否则离线打开是默认 serif 排版
- **中文长段落撑破双栏**：两侧 grid 列都要 `minmax(0, …)` + `min-width:0`，否则右栏被挤没
- **sticky 头部高度会变**（图例换行时）：锚点偏移用 CSS 变量 `--navH` 动态量，别写死
- **截图验收前先断言 `scrollY === 0`**：切到 390px 模拟后浏览器会恢复上次滚动位置，截出来的图顶部标题像被导航遮住，其实是滚过了。`scrollTo(0,0)` 后断言 scrollY 再截，否则会白改一轮 CSS
- **`--print-to-pdf` 的 CLI 没有纸型参数**：HTML 里不给 `@page{size:A4;margin:...}` 就输出美制 Letter（612×792pt），中文打印的边距和分页全错，而且从命令行看不出来。纸型只能由 CSS 决定
- **漏 `--no-pdf-header-footer`**：每页页脚会印 `file:///C:/...` 和打印时间，交付件不能带
- **`page-break-inside:avoid` 把 23 段撑成 25 页**（每页下半空着）。这是不把英文/译文/批注撕开的取舍，默认保留；只有用户明确要求压页数时才改 `break-inside:auto`，并说明会出现一段跨两页
- **CDP 截图不设 `--window-size` 会触发响应式断点**：headless 默认 innerWidth≈756px，`@media (max-width:1080px)` 把 `.pair` 打成单栏，导出的「长图」是单栏版而且看起来像样式坏了。按网页端宽度传 `--window-size=1560,1200`，并在截图前用 `Runtime.evaluate` 回读 `innerWidth` 断言
- **禁止 `taskkill /IM msedge.exe`**：会连带杀掉用户正在浏览的所有 Edge 窗口和标签页。用独立 `--user-data-dir`（放 scratch）起实例，只 `terminate()` 自己那个 PID
- 微信交付 .html 是**文档附件**，不是网页：附一句"下载后双击打开"

## 附录：五色语义

| 色 | 语义 | 用法 |
| --- | --- | --- |
| 黄 #ffe9a8 | 核心论点/thesis | 作者要你相信的那句，每段最多 1 处 |
| 红 #ffd2cd | 关键概念/术语 | 首次定义、指标名、损失函数 |
| 蓝 #cfe4ff | 实证证据/数据 | 样本量、CI、AUROC/F1、对比结果 |
| 绿 #cfeccf | 让步/反驳处理 | 限制、however、先例支撑 |
| 紫 #e4d7f8 | 方法论 | 架构、训练配置、预处理、统计方法 |

高亮用 `box-shadow: inset 0 -0.56em 0 <color>`，不做背景块——不遮字、可打印。

## 发布到 GitHub

仓库：`https://github.com/yz1128/paper-annotated-reader`（private）。

skill 本体在 hermes 仓库维护，发布是单向导出，**不要把 hermes 整个仓推上去**——它的历史里有 71 个版本的 `config.yaml` 和 `memories/USER.md`。

```bash
SRC="$LOCALAPPDATA/hermes/skills/paper-annotated-reader"
DST="$LOCALAPPDATA/hermes/cache/scratch/gh-skill-repo"
rm -rf "$DST"/{scripts,templates,references} "$DST"/SKILL.md
cp -r "$SRC"/. "$DST"/
cd "$DST" && git add -A && git commit -m "sync: $(date +%F)" && git push
```

FlClash 代理在 `127.0.0.1:7890`，push 前 `export HTTPS_PROXY=http://127.0.0.1:7890`。GitHub API 的匿名配额很低，验证推送结果用 `git ls-remote origin refs/heads/main` 对比本地 HEAD，别靠 curl 打 API。

## 支持文件

- `templates/annotated-reader.html` — 完整骨架（CSS + DATA 占位 + 渲染函数）
- `templates/example-data.js` — 两段的可运行数据样例（含 alt / stop 字段）
- `scripts/build-from-data.js` — 模板 + 数据文件 → 待预渲染 html
- `scripts/prerender.js` — 把 DATA 预渲染成静态 DOM 并剥离渲染脚本
- `scripts/export-pdf.sh` — html → A4 PDF（自动挑 Edge/Chrome，缺 `@page` 会告警）
- `scripts/html-to-longshot.py` — html → 整页长图（CDP captureBeyondViewport，保留网页双栏）
- `scripts/slice-image.py` — 长图按空白行切段，供微信分段查看
- `references/annotation-rubric.md` — 五色边界、批注好/坏例、论证链审计清单
