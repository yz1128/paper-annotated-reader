#!/usr/bin/env python3
"""长图按空白行切段，供微信分段查看。

用法: python slice-image.py <src.png> <out_prefix> [chunk_height]

在目标切点 ±CHUNK/5 范围内找「整行单色浅背景」的位置下刀，
避免把英文原文/译文/批注从中间切断。
"""
import sys

from PIL import Image

Image.MAX_IMAGE_PIXELS = None


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    src, prefix = sys.argv[1], sys.argv[2]
    chunk = int(sys.argv[3]) if len(sys.argv) > 3 else 2400

    im = Image.open(src).convert("RGB")
    W, H = im.size
    px = im.load()

    def blank(y, tol=8):
        vals = [px[x, y] for x in range(0, W, 17)]
        r0, g0, b0 = vals[0]
        for r, g, b in vals:
            if abs(r - r0) > tol or abs(g - g0) > tol or abs(b - b0) > tol:
                return False
        return r0 > 235 and g0 > 235

    cuts = [0]
    y = chunk
    while y < H - chunk // 4:
        found = None
        for d in range(0, chunk // 5, 4):
            for yy in (y + d, y - d):
                if 0 < yy < H and blank(yy):
                    found = yy
                    break
            if found:
                break
        cuts.append(found or y)
        y = (found or y) + chunk
    cuts.append(H)

    n = 0
    for a, b in zip(cuts, cuts[1:]):
        if b - a < 60:
            continue
        n += 1
        out = f"{prefix}_{n}.png"
        im.crop((0, a, W, b)).save(out)
        print(f"{out}  {W}x{b - a}")
    print(f"total {H}px -> {n} chunks")


if __name__ == "__main__":
    main()
