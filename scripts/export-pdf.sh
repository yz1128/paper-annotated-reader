#!/usr/bin/env bash
# 论文批注件 html -> A4 PDF
# 用法: bash export-pdf.sh <input.html> <output.pdf>
# 依赖: Windows 自带 Edge 或 Chrome（Chromium 系）；不要用 wkhtmltopdf/WeasyPrint（不支持 CSS grid）
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "用法: bash export-pdf.sh <input.html> <output.pdf>" >&2
  exit 2
fi

IN="$1"
OUT="$2"

[ -f "$IN" ] || { echo "找不到输入: $IN" >&2; exit 1; }

# 没有 @page 就一定是 Letter 纸型，先在入口拦住
grep -q '@page' "$IN" || echo "警告: $IN 无 @page 规则，输出将是美制 Letter (612x792pt)。请先在 @media print 里加 @page{size:A4;margin:12mm 13mm;}" >&2

# native Windows 程序不认 /c/Users/... 路径，转成 C:/Users/... 再拼 file:///
to_win() {
  case "$1" in
    /?/*) printf '%s' "$(echo "$1" | sed -E 's|^/([a-zA-Z])/|\U\1:/|')" ;;
    *)    printf '%s' "$1" ;;
  esac
}
IN_WIN=$(to_win "$IN" | tr '\\' '/')
OUT_WIN=$(to_win "$OUT" | tr '\\' '/')
URL="file:///$IN_WIN"

BROWSERS=(
  "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  "/c/Program Files/Microsoft/Edge/Application/msedge.exe"
  "/c/Program Files/Google/Chrome/Application/chrome.exe"
  "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"
)

rm -f "$OUT"
for b in "${BROWSERS[@]}"; do
  [ -x "$b" ] || continue
  "$b" --headless=new --disable-gpu --no-sandbox \
       --no-pdf-header-footer \
       --run-all-compositor-stages-before-draw \
       --virtual-time-budget=8000 \
       --print-to-pdf="$OUT_WIN" "$URL" 2>&1 \
    | grep -E 'bytes written' || true
  if [ -s "$OUT" ]; then
    echo "OK: $OUT ($(stat -c%s "$OUT") bytes)"
    echo "下一步校验: 页数 / 210x297mm / 中文可抽取"
    exit 0
  fi
done

echo "失败: 未找到可用的 Edge/Chrome，或浏览器没有产出文件" >&2
exit 1
