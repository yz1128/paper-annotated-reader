#!/usr/bin/env node
/*
 * 把论文批注件的 DATA 数组预渲染成静态 DOM，并剥离运行时渲染脚本。
 *
 * 用法: node prerender.js "C:/path/to/reader.html"
 *
 * 为什么要预渲染：JS 被禁 / CSP 收紧 / 内嵌查看器不执行脚本时，
 * 纯 JS 渲染的页面整页空白，看起来像文件损坏。
 * 保留 DATA 数组以便后续改内容，只把"渲染"这一步固化进 HTML。
 */
const fs = require('fs');

const P = process.argv[2];
if (!P) { console.error('usage: node prerender.js <file.html>'); process.exit(1); }
let html = fs.readFileSync(P, 'utf8');

const m = html.match(/const DATA = (\[[\s\S]*?\n\]);/);
if (!m) { console.error('FAIL: 未找到 `const DATA = [...]`'); process.exit(1); }
const DATA = eval('(' + m[1] + ')');

const fnColor = f => {
  if(/结论|主张|升级|收束/.test(f)) return '#ffe9a8';
  if(/证据|结果|定位/.test(f)) return '#cfe4ff';
  if(/让步|消解|先例/.test(f)) return '#cfeccf';
  if(/方法|预处理|架构|训练|形式化|扩展|设定|引入/.test(f)) return '#e4d7f8';
  return '#ffd2cd';
};

let out = '';
let nBlocks = 0;
let nStops = 0;
const chapterLinks = [];
DATA.forEach(sec=>{
  chapterLinks.push(`<a href="#${sec.id}">${sec.title}</a>`);
  out += `<h3 class="sec" id="${sec.id}">${sec.title}<span class="en">${sec.en}</span></h3>\n`;
  sec.blocks.forEach(b=>{
    nBlocks++;
    out += `<div class="pair">
<div class="col-en">
<p class="en-text">${b.en}</p>
<div class="zh-block"><span class="zh-label">中 文 译 文</span><p class="zh-text">${b.zh}</p></div>
</div>
<div class="col-note"><div class="note">
<div class="note-row"><div class="note-key">段落功能</div><div class="note-val"><span class="chip" style="background:${fnColor(b.fn)}">${b.fn}</span></div></div>
<div class="note-row"><div class="note-key">逻辑角色</div><div class="note-val">${b.role}</div></div>
<div class="note-row"><div class="note-key">技巧 / 漏洞</div><div class="note-val em">${b.note}</div></div>
${b.alt ? `<div class="note-row"><div class="note-key">替代解释</div><div class="note-val alt">${b.alt}</div></div>` : ''}
</div></div>
</div>\n`;
  });
  if(sec.stop){
    nStops++;
    out += `<div class="stop-card">
<div class="stop-h">STOP · 停读点</div>
<p class="stop-q">${sec.stop.q}</p>
<details><summary></summary><p class="stop-a">${sec.stop.a}</p></details>
</div>\n`;
  }
});

// 1) 注入静态内容（可重复执行）
if (!html.includes('<div id="content"></div>')) {
  html = html.replace(/<div id="content">[\s\S]*?<\/div>\s*<section class="skeleton"/, '<div id="content"></div>\n\n  <section class="skeleton"');
}
html = html.replace('<div id="content"></div>', '<div id="content">\n' + out + '</div>');

// 2) 章节导航
html = html.replace(/<div class="chapters-in">[\s\S]*?(<a href="#s-skeleton")/, '<div class="chapters-in">' + chapterLinks.join('') + '$1');

// 3) 段数回填（元信息写死段数是交付事故）
html = html.replace(/全文\s*\d+\s*段/g, '全文 ' + nBlocks + ' 段');

// 4) 剥离渲染脚本，只留增强交互
const scriptRe = /<script id="render-src">[\s\S]*?<\/script>/;
const slim = `<script>
const bar=document.getElementById('progress'),top=document.getElementById('toTop');
if(bar&&top){window.addEventListener('scroll',function(){const h=document.documentElement,max=h.scrollHeight-h.clientHeight;
bar.style.width=(max>0?(h.scrollTop/max*100):0)+'%';top.classList.toggle('on',h.scrollTop>600);},{passive:true});
top.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});}
window.addEventListener('beforeprint',function(){document.querySelectorAll('.stop-card details').forEach(function(d){d.open=true;});});
</script>`;
html = html.replace(scriptRe, slim);

fs.writeFileSync(P, html, 'utf8');
console.log(`sections=${DATA.length} blocks=${nBlocks} stops=${nStops} bytes=${Buffer.byteLength(html,'utf8')}`);
console.log('NEXT: node --check 抽取脚本；浏览器断言 .pair 数 == ' + nBlocks);
