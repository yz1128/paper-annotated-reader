#!/usr/bin/env python3
"""HTML -> 整页长图（保留网页双栏排版）。

用法: python html-to-longshot.py <input.html> <output.png> [viewport_width]

要点:
  - 必须显式给 --window-size: headless 默认 innerWidth≈756px,
    会命中 @media (max-width:1080px) 把双栏打成单栏。
  - 用 CDP Page.captureScreenshot + captureBeyondViewport,
    --screenshot 没有整页模式。
  - 独立 --user-data-dir, 只 terminate 自己起的进程, 不碰用户的浏览器。
"""
import asyncio
import base64
import json
import os
import subprocess
import sys
import tempfile
import time
import urllib.request

import websockets

BROWSERS = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
]
PORT = 9333


def find_browser():
    for p in BROWSERS:
        if os.path.exists(p):
            return p
    sys.exit("no Edge/Chrome found")


def wait_target():
    for _ in range(75):
        try:
            with urllib.request.urlopen(
                f"http://127.0.0.1:{PORT}/json/list", timeout=2
            ) as r:
                for t in json.load(r):
                    if t.get("type") == "page" and t.get("webSocketDebuggerUrl"):
                        return t["webSocketDebuggerUrl"]
        except Exception:
            pass
        time.sleep(0.4)
    raise RuntimeError("CDP target not ready")


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    html, out = sys.argv[1], sys.argv[2]
    width = int(sys.argv[3]) if len(sys.argv) > 3 else 1560

    url = "file:///" + os.path.abspath(html).replace("\\", "/")
    profile = os.path.join(tempfile.gettempdir(), "_cdp_shot_profile")
    proc = subprocess.Popen(
        [
            find_browser(),
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--window-size={width},1200",
            f"--remote-debugging-port={PORT}",
            f"--user-data-dir={profile}",
            url,
        ]
    )
    try:
        ws_url = wait_target()
        asyncio.run(capture(ws_url, out, width))
    finally:
        proc.terminate()


async def capture(ws_url, out, width):
    _id = 0
    async with websockets.connect(ws_url, max_size=200 * 1024 * 1024) as ws:

        async def cmd(method, **params):
            nonlocal _id
            _id += 1
            await ws.send(json.dumps({"id": _id, "method": method, "params": params}))
            while True:
                msg = json.loads(await ws.recv())
                if msg.get("id") == _id:
                    if "error" in msg:
                        raise RuntimeError(msg["error"])
                    return msg.get("result", {})

        await cmd("Page.enable")
        await asyncio.sleep(3.5)  # 等 web font 与 prerender 脚本

        r = await cmd(
            "Runtime.evaluate",
            expression=(
                "JSON.stringify({h:document.documentElement.scrollHeight,"
                "w:document.documentElement.scrollWidth,"
                "vw:window.innerWidth})"
            ),
            returnByValue=True,
        )
        d = json.loads(r["result"]["value"])
        if abs(d["vw"] - width) > 40:
            print(f"WARN innerWidth={d['vw']} != {width}, 双栏可能已塌成单栏", file=sys.stderr)
        print(f"dims: {d['w']}x{d['h']}", file=sys.stderr)
        if d["h"] > 16000:
            print("WARN 高度超过 ~16000px, 可能被 Chromium 截断", file=sys.stderr)

        r2 = await cmd(
            "Page.captureScreenshot",
            format="png",
            captureBeyondViewport=True,
            clip={"x": 0, "y": 0, "width": d["w"], "height": d["h"], "scale": 1},
        )
        data = base64.b64decode(r2["data"])
        with open(out, "wb") as f:
            f.write(data)
        print(f"{out}  {len(data)} bytes")


if __name__ == "__main__":
    main()
