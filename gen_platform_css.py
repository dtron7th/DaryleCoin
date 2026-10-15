# Regenerates the platform media-query blocks at the END of style.css from
# the current Blend Web export (.blendweb/blend-web-data.txt).
#
# The current export requires the numbers EXACTLY as px inside each media
# query (no % / vw scaling, no aspect-ratio). Bands:
#   Desktop (base styles)  >= 1158px   designed 1366 x 599
#   Tablet                 670-1157px  designed  949 x 1334
#   Phone                  <=  669px   designed  390 x 844
#
# Rerun:  python gen_platform_css.py
# Everything from the "===== Tablet layout" banner to the end of style.css
# is replaced by the generated output; the base styles and the desktop
# "Automatic anchors" layout above it are hand-maintained and untouched.
#
# #bw-Triangle's clip-path (the export only gives the desktop path) is
# rescaled to each platform's size from the desktop rule in style.css.

import re
import sys

STYLE = 'style.css'

# (label, selector, left, top, width, height)
# The export lists each differing element's x / y on that platform - for a
# nested element already "from the top-left of its container", so the
# values below are used as-is. None = property not emitted.
# Special entries handled below.
# The current export's tablet / phone lists cover only the Under
# Construction layer and .Sun_Tzu_AI_Main - every element not listed
# keeps the base (desktop) design on that platform.
TABLET = [
    ('body', 'body', 'min-height: max(1334px, 100vh)'),
    # Sun Tzu AI Main: in the page at x -2 / y 0; its designed box is
    # 949 x 1334 (the tablet page), so the base's bottom stretch is
    # dropped for the fixed designed height
    ('Sun Tzu AI Main', '.Sun_Tzu_AI_Main', -2, 0, 949, 1334),
    ('Under Construction', '#bw-Under-Construction', 0, 0, 949, 1334),
    # inside Under Construction (canvas 0, 0 - the layer fills the page)
    ('Triangle', '#bw-Triangle', 'triangle', 427, 228.3, 95, 83.52),
    ('p.013', '#bw-p-013', 453.4, 254, 42.16, 48),
    ('p.014', '#bw-p-014', 292.2, 345, 364.61, 77),
    ('What Works Text', '#bw-What-Works-Text', 104.3, 494, 740.44, 198),
    ('Blend Web Box', '#bw-Blend-Web-Box', 'rect', 340, 890, 264, 405),
    ('Blend ACS', '#bw-Blend-ACS', 'rect', 650, 890, 264, 405),
    ('Sun Tzu AI Box', '#bw-Sun-Tzu-AI-Box', 'rect', 40, 780, 263, 33),
    # inside Sun Tzu AI Box (x / y from the box's top-left)
    ('Rectangle.003', '#bw-Rectangle-003', 'rect', 0, 60, 263, 458),
    ('Tun Tzu AI Title', '#bw-Tun-Tzu-AI-Title', 10, 10, 192, 20),
    ('p.018', '#bw-p-018', 10, 70, 245, 135),
    ('p.020', '#bw-p-020', 10, 240, 245, 15),
    ('p.016', '#bw-p-016', 10, 265, 190, 15),
    ('p.017', '#bw-p-017', 20, 285, 75, 40),
    ('Circle', '#bw-Circle', 10, 288, 5, 5),
    ('Circle.001', '#bw-Circle-001', 10, 301, 5, 5),
    ('Circle.002', '#bw-Circle-002', 10, 315, 5, 5),
    ('p.019', '#bw-p-019', 10, 340, 175, 15),
    ('p.021', '#bw-p-021', 10, 355, 205, 15),
    ('p.022', '#bw-p-022', 10, 370, 205, 15),
    ('p.023', '#bw-p-023', 130, 455, 60, 15),
    ('QR Code Background', '#bw-QR-Code-Background', 200, 455, 50, 50),
    # inside QR Code Background
    ('QR Code', '.QR_Code_Button', 6.9, 6.9, 36.21, 36.21),
]

PHONE = [
    ('body', 'body', 'min-height: max(844px, 100vh)'),
    ('Under Construction', '#bw-Under-Construction', 0, 0, 390, 844),
    # inside Under Construction (canvas 0, 0 - the layer fills the page)
    ('Triangle', '#bw-Triangle', 'triangle', 167.3, 218.3, 55.5, 48.8),
    ('p.013', '#bw-p-013', 190.3, 238.3, 9.4, 12.4),
    ('p.014', '#bw-p-014', 108.3, 275.9, 173.4, 10.5),
    ('What Works Text', '#bw-What-Works-Text', 42.9, 203, 304.3, 81.4),
    ('Blend Web Box', '#bw-Blend-Web-Box', 'rect', 163.2, 383.4, 143.6, 72.3),
    ('Blend ACS', '#bw-Blend-ACS', 'rect', 310.6, 383.4, 143.6, 72.3),
    ('Sun Tzu AI Box', '#bw-Sun-Tzu-AI-Box', 'rect', 20.5, 380.5, 143.6, 72.3),
    # inside Sun Tzu AI Box (x / y from the box's top-left)
    ('Rectangle.003', '#bw-Rectangle-003', 'rect', -9.3, -242.3, 143.6, 72.3),
    ('Tun Tzu AI Title', '#bw-Tun-Tzu-AI-Title', -9.2, -247.4, 78.9, 8.2),
    ('p.018', '#bw-p-018', -9.2, -235.7, 100.7, 55.5),
    ('p.020', '#bw-p-020', -9.2, -202.4, 100.7, 6.2),
    ('p.016', '#bw-p-016', -9.2, -197.5, 78.1, 6.2),
    ('p.017', '#bw-p-017', -7.3, -193.6, 30.8, 16.4),
    ('Circle', '#bw-Circle', -9.2, -193.1, 2.1, 2.1),
    ('Circle.001', '#bw-Circle-001', -9.2, -190.5, 2.1, 2.1),
    ('Circle.002', '#bw-Circle-002', -9.2, -187.8, 2.1, 2.1),
    ('p.019', '#bw-p-019', 1.9, 66.5, 71.9, 6.2),
    ('p.021', '#bw-p-021', 1.9, 71.3, 84.2, 6.2),
    ('p.022', '#bw-p-022', 1.9, 72.3, 84.2, 6.2),
    ('p.023', '#bw-p-023', 26.4, 88.9, 84.2, 6.2),
    ('QR Code Background', '#bw-QR-Code-Background', 'pos', 6.7, -150.8),
    # inside QR Code Background
    ('QR Code', '.QR_Code_Button', 'pos', -14.3, -128.8),
]

# #bw-Triangle's clip-path is emitted once (desktop size 194.3 x 170.8);
# the platform rules get it rescaled to each platform's own size.
TRI_DESKTOP_W = 194.3
TRI_DESKTOP_H = 170.8

TAIL = ' transform: none; aspect-ratio: auto;'


def px(v):
    s = f'{v:g}'
    return s + 'px'


def desktop_clip(src):
    """The desktop #bw-Triangle clip-path, from the base rules."""
    m = re.search(
        r'#bw-Triangle \{[^}]*clip-path: path\((?:evenodd,\s*)?'
        r'\'([^\']+)\'\)',
        src)
    return m.group(1) if m else None


def scale_clip(path, w, h):
    """Rescale the path()'s absolute x/y pairs to a w x h element box."""
    sx, sy = w / TRI_DESKTOP_W, h / TRI_DESKTOP_H

    def rep(m):
        return (f"{m.group(1)} {float(m.group(2)) * sx:.4g} "
                f"{float(m.group(3)) * sy:.4g}")

    scaled = re.sub(r'([ML]) (-?[\d.]+) (-?[\d.]+)', rep, path)
    return f"path(evenodd, '{scaled}')"


def rule(label, sel, *a, clip=None):
    if label == 'body':
        return f'  {sel} {{ {a[0]}; }}'
    if a[0] == 'stretch':
        body = ('left: 0; right: 0; top: 0; bottom: 0;'
                ' width: auto; height: auto;')
    elif a[0] == 'size':
        body = f'width: {px(a[1])}; height: {px(a[2])};'
    elif a[0] == 'pos':
        body = f'left: {px(a[1])}; top: {px(a[2])}; right: auto; bottom: auto;'
    elif a[0] == 'posstretch':
        # left/top move, but the base's bottom stays (vertical stretch)
        body = f'left: {px(a[1])}; top: {px(a[2])}; right: auto;'
    else:
        kind = a[0] if isinstance(a[0], str) else 'box'
        vals = a[1:] if isinstance(a[0], str) else a
        body = (f'left: {px(vals[0])}; top: {px(vals[1])}; right: auto; '
                f'bottom: auto; width: {px(vals[2])}; height: {px(vals[3])};')
        if kind == 'rect':
            clip = 'none'
    tail = TAIL + (f' clip-path: {clip};' if clip else '')
    return f'  /* {label} */\n  {sel} {{ {body}{tail} }}'


def emit(rows, tri_src):
    out = []
    for r in rows:
        label, sel = r[0], r[1]
        if sel == 'body':
            out.append(rule('body', sel, r[2]))
        elif r[2] == 'triangle':
            clip = scale_clip(tri_src, r[5], r[6]) if tri_src else None
            out.append(rule(label, sel, 'box', *r[3:], clip=clip))
        else:
            out.append(rule(label, sel, *r[2:]))
    return '\n'.join(out)


def main():
    src = open(STYLE, encoding='utf-8').read()

    tri_src = desktop_clip(src)
    if not tri_src:
        print('warning: desktop #bw-Triangle clip-path not found in'
              ' style.css - platform rules emitted without it',
              file=sys.stderr)

    out = '\n\n'
    out += ('/* ===================== Tablet layout =====================\n'
            '   (min-width: 670px) and (max-width: 1157px) - same elements,\n'
            '   same HTML; designed at 949 x 1334. */\n')
    out += '@media (min-width: 670px) and (max-width: 1157px) {\n'
    out += ('  /* Tablet, exactly as designed in Blender at 949 x 1334:'
            ' every place and size in px, nothing scaled */\n')
    out += emit(TABLET, tri_src)
    out += '\n}\n\n'
    out += ('/* ===================== Phone layout =====================\n'
            '   (max-width: 669px) - same elements, same HTML;'
            ' designed at 390 x 844. */\n')
    out += '@media (max-width: 669px) {\n'
    out += ('  /* Phone, exactly as designed in Blender at 390 x 844:'
            ' every place and size in px, nothing scaled */\n')
    out += emit(PHONE, tri_src)
    out += '\n}\n'

    # replace only the generated tail (from the Tablet banner or the
    # tablet @media line, whichever is present, to EOF)
    for marker in ('/* ===================== Tablet layout',
                   '@media (min-width: 670px)'):
        i = src.find(marker)
        if i != -1:
            src = src[:i].rstrip('\n')
            break
    else:
        sys.exit('generated-section marker not found in ' + STYLE)

    with open(STYLE, 'w', encoding='utf-8') as f:
        f.write(src + out)
    print('wrote', len(out), 'chars of generated platform CSS')


if __name__ == '__main__':
    main()
