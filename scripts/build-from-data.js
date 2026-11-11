// 由模板 + 数据文件 + META 生成一份批注件
// 用法: node build-from-data.js <data.js> <out.html>
// data.js 里写 `const DATA = [...];` 与 `const META = {'__PAPER_TITLE_CN__':'...' ...};`
const fs = require('fs');
const path = require('path');

const DATA_PATH = process.argv[2];
const OUT = process.argv[3];
if (!DATA_PATH || !OUT) { console.error('usage: node build-from-data.js <data.js> <out.html>'); process.exit(1); }

const TPL = path.join(__dirname, '..', 'templates', 'annotated-reader.html');
let tpl = fs.readFileSync(TPL, 'utf8');
const src = fs.readFileSync(DATA_PATH, 'utf8');

const dataPart = src.split('const META')[0].trim();
const metaPart = src.split('const META')[1].replace(/^\s*=\s*/, '').trim().replace(/;\s*$/, '');
const META = eval('(' + metaPart + ')');

const re = /const DATA = \[[\s\S]*?\n\];/;
if (!re.test(tpl)) throw new Error('模板里没找到 DATA 块');
tpl = tpl.replace(re, dataPart);
for (const [k, v] of Object.entries(META)) tpl = tpl.split(k).join(v);

fs.writeFileSync(OUT, tpl, 'utf8');
console.log('built', OUT, Buffer.byteLength(tpl, 'utf8'), 'bytes — NEXT: node ../scripts/prerender.js <out.html>');
