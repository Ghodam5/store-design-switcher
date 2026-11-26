"""大口注文ページ用の画像を、今ある商品写真（白背景）から作る。
実際の納品写真が無いので「たくさん並んだ」「カタログから選ぶ」「サンプルを試す」を絵で伝える。
使い方: python3 samples/bulk-lp/tools/make-images.py （リポジトリ直下で）
"""
import os
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
OUT = os.path.join(ROOT, 'samples/bulk-lp/img')
FEAT = os.path.join(ROOT, 'images/features')
FONT = '/mnt/project-files/gif-bot/fonts/ipag.ttf'
CREAM = (251, 246, 238)


def prod(name):
    return Image.open(os.path.join(FEAT, name + '.jpg')).convert('RGB')


def font(size):
    try:
        return ImageFont.truetype(FONT, size)
    except OSError:
        return ImageFont.load_default()


def put(canvas, im, x, y, w, shadow=True):
    """白い背景を消すために multiply で重ねる。足元に影を落とす。"""
    h = int(im.height * w / im.width)
    im = im.resize((w, h), Image.LANCZOS)
    if shadow:
        sh = Image.new('L', canvas.size, 0)
        ImageDraw.Draw(sh).ellipse((x + w * .12, y + h * .86, x + w * .88, y + h * .98), fill=70)
        sh = sh.filter(ImageFilter.GaussianBlur(max(4, w // 18)))
        canvas.paste((150, 135, 115), (0, 0), sh)
    region = canvas.crop((x, y, x + w, y + h))
    canvas.paste(ImageChops.multiply(region, im), (x, y))


def cutout(im):
    """白背景を透明にした切り抜き（RGBA）。箱の中の白い部分は穴にしない"""
    g = im.convert('L')
    m = g.point(lambda v: 255 if v < 238 else 0).filter(ImageFilter.MaxFilter(5))
    # 外側から塗りつぶして、外とつながった白だけ透明にする
    w, h = m.size
    flood = m.copy()
    ImageDraw.floodfill(flood, (1, 1), 128)
    alpha = flood.point(lambda v: 0 if v == 128 else 255).filter(ImageFilter.GaussianBlur(1))
    out = im.convert('RGBA'); out.putalpha(alpha)
    return out


def recolor(im, rgb):
    """水色の箱の色を別の色に置きかえる（色の濃い所だけ）"""
    from PIL import ImageOps
    r, g, b, a = im.split()
    gray = ImageOps.grayscale(im.convert('RGB'))
    tinted = ImageOps.colorize(gray, black=(40, 40, 40), white=(255, 255, 255), mid=rgb)
    sat = Image.eval(ImageChops.difference(im.convert('RGB').split()[2], im.convert('RGB').split()[0]), lambda v: min(255, v * 4))
    mixed = Image.composite(tinted, im.convert('RGB'), sat)
    mixed = mixed.convert('RGBA'); mixed.putalpha(a)
    return mixed


def zurari():
    """同じ箱がずらりと並ぶ（大量のご注文のイメージ）。いちばん上の水色の箱を切り出し、色違いを作って並べる"""
    W, H = 1400, 1000
    c = Image.new('RGB', (W, H), CREAM)
    d = ImageDraw.Draw(c)
    for i in range(H):
        t = i / H
        d.line([(0, i), (W, i)], fill=(int(253 - 12 * t), int(249 - 16 * t), int(243 - 22 * t)))
    src = prod('pb289smilebox').crop((340, 40, 600, 244))
    blue = cutout(src)
    boxes = [blue, recolor(blue, (236, 214, 92)), recolor(blue, (240, 172, 180))]
    rows = [(120, 92, 16), (205, 120, 13), (315, 158, 10), (460, 210, 8), (655, 285, 6)]
    for k, (y, w, n) in enumerate(rows):
        gap = w * 0.05
        total = n * w + (n - 1) * gap
        x0 = (W - total) / 2
        for j in range(n):
            im = boxes[(j + k) % 3]
            hgt = int(im.height * w / im.width)
            im = im.resize((w, hgt), Image.LANCZOS)
            x = int(x0 + j * (w + gap))
            sh = Image.new('L', c.size, 0)
            ImageDraw.Draw(sh).ellipse((x + w * .05, y + hgt * .82, x + w * .98, y + hgt * 1.02), fill=80)
            c.paste((140, 125, 105), (0, 0), sh.filter(ImageFilter.GaussianBlur(max(4, w // 14))))
            c.paste(im, (x, y), im)
    c.save(os.path.join(OUT, 'zurari.jpg'), quality=84, optimize=True, progressive=True)


def catalog():
    """開いたカタログから選ぶ"""
    W, H = 1400, 1000
    c = Image.new('RGB', (W, H), (236, 228, 216))
    d = ImageDraw.Draw(c)
    # 本の影
    sh = Image.new('L', (W, H), 0)
    ImageDraw.Draw(sh).rounded_rectangle((110, 130, 1310, 900), 20, fill=110)
    c.paste((120, 105, 90), (0, 0), sh.filter(ImageFilter.GaussianBlur(26)))
    for x0 in (90, 700):
        d.rectangle((x0, 100, x0 + 610, 880), fill=(255, 253, 249))
    d.line([(700, 100), (700, 880)], fill=(210, 200, 188), width=3)
    for i in range(30):  # 綴じ目の陰
        a = int(40 * (1 - i / 30))
        d.line([(700 - i, 100), (700 - i, 880)], fill=(255 - a, 253 - a, 249 - a))
        d.line([(700 + i, 100), (700 + i, 880)], fill=(255 - a, 253 - a, 249 - a))
    f1, f2 = font(34), font(22)
    d.text((130, 130), 'Petit Gift Catalog', font=f1, fill=(33, 124, 119))
    d.text((740, 130), 'Name Gift Catalog', font=f1, fill=(191, 60, 41))
    names = [['pb-goen', 'pb289smilebox', 'pb313rhythmbox', 'pb318violinbox', 'japonesque-konpei2024', 'pb283ranbowbox'],
             ['fla111fufu', '58966', 'pb291nekogamibox', 'pb277pirotowel', 'fla505hanayaka2026', 'pb242pianobox']]
    for p, x0 in enumerate((110, 720)):
        for i, n in enumerate(names[p]):
            cx, cy = x0 + 10 + (i % 3) * 190, 200 + (i // 3) * 330
            d.rounded_rectangle((cx, cy, cx + 175, cy + 300), 10, outline=(230, 222, 210), width=2, fill=(255, 255, 255))
            put(c, prod(n), cx + 8, cy + 10, 160, shadow=False)
            d.rounded_rectangle((cx + 20, cy + 205, cx + 155, cy + 225), 4, fill=(236, 232, 226))
            d.rounded_rectangle((cx + 40, cy + 240, cx + 135, cy + 262), 4, fill=(250, 226, 220) if p else (220, 238, 236))
    # 付箋
    for (x, y, col) in [(520, 80, (247, 205, 96)), (1180, 80, (243, 160, 140))]:
        d.rectangle((x, y, x + 46, y + 90), fill=col)
    c.save(os.path.join(OUT, 'catalog.jpg'), quality=84, optimize=True, progressive=True)


def sample():
    """サンプルを2点お届け（手に取って選べる）"""
    W, H = 1400, 1000
    c = Image.new('RGB', (W, H), (238, 246, 245))
    d = ImageDraw.Draw(c)
    # 箱のふた（クラフト）
    sh = Image.new('L', (W, H), 0)
    ImageDraw.Draw(sh).rounded_rectangle((170, 250, 1230, 900), 24, fill=120)
    c.paste((110, 120, 118), (0, 0), sh.filter(ImageFilter.GaussianBlur(30)))
    d.rounded_rectangle((150, 220, 1250, 870), 24, fill=(214, 186, 150))
    d.rounded_rectangle((185, 255, 1215, 835), 18, fill=(250, 247, 241))
    put(c, prod('pb-goen'), 230, 300, 470)
    put(c, prod('pb313rhythmbox'), 700, 300, 470)
    # 札
    d.rounded_rectangle((520, 120, 880, 230), 16, fill=(191, 60, 41))
    d.ellipse((540, 160, 562, 182), fill=(250, 247, 241))
    f = font(54)
    d.text((585, 140), 'SAMPLE', font=f, fill=(255, 255, 255))
    c.save(os.path.join(OUT, 'sample.jpg'), quality=84, optimize=True, progressive=True)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    zurari(); catalog(); sample()
    print('作成:', sorted(os.listdir(OUT)))
