// 数据文件最小样例：两段 + 一个停读点。字段全在这，照抄改内容即可。
// 用法：node scripts/build-from-data.js templates/example-data.js /path/out.html
const DATA = [
{id:'s-abs', title:'摘要', en:'Abstract', blocks:[
{en:`We <mark class="y">evaluated whether models generalize</mark> across <mark class="b">three hospital systems</mark>, and found <mark class="b">AUC 0.931 internal versus 0.815 external</mark>.`,
 zh:`我们在三个医院系统上评估模型的泛化能力：院内 AUC 0.931，院外降至 0.815。`,
 fn:'结论先行', role:'把内部与外部两个数字并置，先立靶心，后文再解释落差来源。',
 note:'摘要未给外部测试的样本量；IU 仅约 38 例阳性，这个分母决定了 0.815 的置信区间宽度。',
 alt:'落差的两种解释：①模型依赖院区指纹；②三院标签口径不同。本文用同一架构控制了模型差异，但标签差异直到讨论才承认。'},
{en:`A <mark class="y">trivial model</mark> that ignored the image and ranked by <mark class="b">hospital-level prevalence</mark> reached <mark class="b">AUC 0.861</mark>.`,
 zh:`一个不看影像、只按医院患病率排序的平凡模型，达到了 AUC 0.861。`,
 fn:'自设天花板', role:'给出零信息基线，使前面所有模型分数有了可比较的下限。',
 note:'0.861 与外部 0.815 不是同一测试集，不能直接相减；但这个并置已经足以说明外部成绩低于零信息基线所在的量级。'}
],
stop:{q:'如果零信息基线已有 0.861，那 0.931 里有多少是影像信息？作者分解了吗？',
a:'没有。要做分解，需在同一院内、患病率匹配的子集上重测；本文只做了相反方向的操纵（人为拉开患病率）。'}}
];

const META = {
'__PAPER_TITLE_CN__':'示例：跨院泛化',
'__COURSE__':'example · 两段样例',
'__SOURCE_LINE__':'Journal · Year · doi:xx/xxxx',
'__PAPER_TITLE_EN__':'Example Paper Title: A Cross-sectional Study',
'__AUTHORS__':'Author A, Author B',
'__DS1__':'内部测试成绩被当作可部署证据。',
'__DS2__':'跨院后表现系统性下降。',
'__DS3__':'两组对照、两种训练组合、零信息基线。',
'__DS4__':'承认标签口径与样本量限制。',
'__DS5__':'内部分数不构成泛化证据。',
'__ONE_LINER__':'不看影像的基线就有 0.861，而跨院模型只有 0.815。',
'__STRONG__':'用操纵实验把内部高分与真实识别能力分开。',
'__WEAK__':'标签口径与数据分布同时变化，无法分离。'
};
