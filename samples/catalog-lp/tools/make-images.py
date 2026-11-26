"""カタログギフトのページ用の画像を、今ある商品写真（表紙の写真）から作る。
表紙を切り出して、やさしい色の台の上に扇のように並べる。実際の撮影写真ではなく「組み合わせた絵」。
使い方: python3 -I samples/catalog-lp/tools/make-images.py （リポジトリ直下で）
"""
import os
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
OUT = os.path.join(ROOT, 'samples/catalog-lp/img')
P = os.path.join(ROOT, 'images/products')


def cover(pid, inset=3):
    """白い背景の写真から表紙の四角だけを切り出す"""
    im = Image.open(os.path.join(P, pid + '.jpg')).convert('RGB')
    g = im.convert('L').point(lambda v: 255 if v < 240 else 0)
    l, t, r, b = g.getbbox()
    return im.crop((l + inset, t + inset, r - inset, b - inset))


def bg(w, h, top, bottom):
    """上から下へゆるやかに色が変わる台"""
    im = Image.new('RGB', (w, h), top)
    d = ImageDraw.Draw(im)
    for y in range(h):
        k = y / (h - 1)
        d.line([(0, y), (w, y)], fill=tuple(int(top[i] + (bottom[i] - top[i]) * k) for i in range(3)))
    return im


def place(canvas, im, cx, cy, width, angle, shadow=60):
    """表紙を回して影をつけて置く（cx, cy は中心）"""
    h = int(im.height * width / im.width)
    im = im.resize((width, h), Image.LANCZOS).convert('RGBA')
    pad = 40
    layer = Image.new('RGBA', (width + pad * 2, h + pad * 2), (0, 0, 0, 0))
    sh = Image.new('L', layer.size, 0)
    ImageDraw.Draw(sh).rectangle((pad + 6, pad + 12, pad + width + 6, pad + h + 12), fill=shadow)
    sh = sh.filter(ImageFilter.GaussianBlur(14))
    layer.paste((90, 70, 60, 255), (0, 0), sh)
    layer.alpha_composite(im, (pad, pad))
    layer = layer.rotate(angle, resample=Image.BICUBIC, expand=True)
    canvas.alpha_composite(layer, (int(cx - layer.width / 2), int(cy - layer.height / 2)))


def sparkle(d, x, y, r, col):
    d.polygon([(x, y - r), (x + r * .28, y - r * .28), (x + r, y), (x + r * .28, y + r * .28), (x, y + r), (x - r * .28, y + r * .28), (x - r, y), (x - r * .28, y - r * .28)], fill=col)


def hero():
    W, H = 1400, 900
    c = bg(W, H, (253, 246, 240), (246, 232, 226)).convert('RGBA')
    d = ImageDraw.Draw(c)
    # 丸いやわらかい色の玉
    for (x, y, r, col) in [(180, 170, 150, (250, 222, 214, 255)), (1240, 720, 190, (222, 238, 235, 255)), (1180, 150, 90, (246, 236, 210, 255))]:
        blob = Image.new('L', (W, H), 0)
        ImageDraw.Draw(blob).ellipse((x - r, y - r, x + r, y + r), fill=255)
        blob = blob.filter(ImageFilter.GaussianBlur(30))
        c.paste(Image.new('RGBA', (W, H), col), (0, 0), blob)
    place(c, cover('72156'), 330, 470, 330, 9)
    place(c, cover('72343'), 1060, 470, 330, -9)
    place(c, cover('72297'), 560, 450, 330, 4)
    place(c, cover('72333'), 840, 450, 330, -4)
    place(c, cover('72309'), 700, 470, 350, 0, 70)
    card = cover('72295', 2)
    place(c, card, 1010, 770, 280, -12)
    d = ImageDraw.Draw(c)
    for (x, y, r) in [(140, 640, 16), (1290, 300, 20), (980, 90, 12), (420, 110, 14), (620, 820, 10)]:
        sparkle(d, x, y, r, (214, 172, 110, 255))
    c.convert('RGB').save(os.path.join(OUT, 'hero.jpg'), quality=84, optimize=True, progressive=True)


def types():
    """冊子タイプとカードタイプを並べた絵"""
    W, H = 1000, 640
    c = bg(W, H, (250, 247, 242), (240, 234, 226)).convert('RGBA')
    place(c, cover('72309'), 330, 330, 330, -5)
    place(c, cover('72295', 2), 720, 360, 380, 6)
    c.convert('RGB').save(os.path.join(OUT, 'types.jpg'), quality=84, optimize=True, progressive=True)


def brand(name, ids, fname, colors):
    W, H = 900, 600
    c = bg(W, H, *colors).convert('RGBA')
    n = len(ids)
    for i, pid in enumerate(ids):
        x = W / 2 + (i - (n - 1) / 2) * 190
        place(c, cover(pid), x, H / 2 + abs(i - (n - 1) / 2) * 16, 250, (i - (n - 1) / 2) * -6)
    c.convert('RGB').save(os.path.join(OUT, fname), quality=84, optimize=True, progressive=True)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    hero()
    types()
    brand('ocean', ['72156', '72169', '72171', '72173'], 'brand-ocean.jpg', ((236, 233, 229), (214, 208, 200)))
    brand('shikisai', ['72297', '72309', '72313', '72325'], 'brand-shikisai.jpg', ((247, 242, 246), (232, 226, 238)))
    brand('grace', ['72333', '72343', '72347', '72349'], 'brand-grace.jpg', ((250, 244, 236), (238, 226, 212)))
    for f in sorted(os.listdir(OUT)):
        print(f, os.path.getsize(os.path.join(OUT, f)) // 1024, 'KB')
