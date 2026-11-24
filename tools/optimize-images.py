#!/usr/bin/env python3
"""画像の軽量化（v73 PageSpeed対策）。見た目を変えずにファイルを小さくする。

使い方:
  python3 tools/optimize-images.py            # images/ 全体を確認だけ（何も書き換えない）
  python3 tools/optimize-images.py --write    # 実際に書き換える
  python3 tools/optimize-images.py --write images/new-photo.jpg   # 1枚だけ
  python3 tools/optimize-images.py --hero images/main-flavor.jpg  # トップの大きな写真のスマホ用（-1100.webp）を作る（v75）

やること（ファイル名は変えない。参照しているHTML・JSON・OMSはそのまま動く）:
  - 画質100相当で保存された大きなJPEG（量子化テーブル平均が4以下）だけを、画質85・色の間引きなし(4:4:4)・プログレッシブで保存し直す。
    すでに圧縮済みのJPEGは触らない（何度も圧縮して画質が落ちるのを防ぐ）。
  - 2000pxを超える辺は2000pxに縮める（スマホ3倍・PC2倍でも足りる大きさ）。
  - CMYKのJPEGは色が変わるおそれがあるので触らない。
  - 2割以上小さくならないときは元のまま。
--hero: トップのメッセージのカードの写真から、横1100pxのWebP（例 images/main-flavor-1100.webp）を作る。
  元の写真はそのまま。ページを作り直す（node tools/build-site.cjs）と、スマホでは小さい方が自動で使われる。
PNG・GIF・SVGは触らない（特集バナーPNGは別名の .jpg を作って参照を切り替え済み、元のPNGも残す）。
Pillow が必要（pip install Pillow）。
"""
import io
import os
import sys

from PIL import Image

MAX_SIDE = 2000
QUALITY = 85
MIN_SAVING = 0.2


def is_bloated(im):
    qt = getattr(im, 'quantization', None)
    if not qt or 0 not in qt:
        return False
    return sum(qt[0]) / 64 <= 4


def optimize(path, write):
    try:
        im = Image.open(path)
    except Exception:
        return None
    if im.format != 'JPEG' or im.mode not in ('RGB', 'L') or not is_bloated(im):
        return None
    before = os.path.getsize(path)
    out = im
    if max(im.size) > MAX_SIDE:
        r = MAX_SIDE / max(im.size)
        out = im.resize((round(im.size[0] * r), round(im.size[1] * r)), Image.LANCZOS)
    buf = io.BytesIO()
    kw = dict(quality=QUALITY, subsampling=0, optimize=True, progressive=True)  # 4:4:4（色付き文字のにじみを防ぐ）
    if im.info.get('icc_profile'):
        kw['icc_profile'] = im.info['icc_profile']
    exif = im.info.get('exif')
    if exif:
        kw['exif'] = exif
    out.save(buf, 'JPEG', **kw)
    after = len(buf.getvalue())
    if after > before * (1 - MIN_SAVING):
        return None
    if write:
        with open(path, 'wb') as f:
            f.write(buf.getvalue())
    return before, after


def make_hero(path):
    im = Image.open(path)
    if im.size[0] <= 1100:
        print(f'{path}: 横{im.size[0]}pxなので作りません（1100pxより大きい写真だけ）')
        return
    h = round(im.size[1] * 1100 / im.size[0])
    out = os.path.splitext(path)[0] + '-1100.webp'
    im.convert('RGB').resize((1100, h), Image.LANCZOS).save(out, 'WEBP', quality=82, method=6)
    print(f'作成: {out} {os.path.getsize(out) // 1024}KB（元 {os.path.getsize(path) // 1024}KB）')


def main():
    if '--hero' in sys.argv:
        for f in [a for a in sys.argv[1:] if not a.startswith('--')]:
            make_hero(f)
        return
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    write = '--write' in sys.argv
    files = []
    if args:
        files = args
    else:
        for root, _, names in os.walk('images'):
            files += [os.path.join(root, n) for n in names if n.lower().endswith(('.jpg', '.jpeg'))]
    total_b = total_a = n = 0
    for f in sorted(files):
        r = optimize(f, write)
        if r:
            n += 1
            total_b += r[0]
            total_a += r[1]
    print(('書き換え' if write else '対象（確認のみ）') + f': {n}枚 {total_b // 1024}KB → {total_a // 1024}KB')


if __name__ == '__main__':
    main()
