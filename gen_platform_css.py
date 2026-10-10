# Generates the media-query blocks for style.css from the Blend Web
# export (keyframe values are website px at the designed width;
# horizontal values are emitted in vw so they scale inside the band).
# Bands: narrow desktop (1094-1365px, desktop design scaled down),
# tablet (606-1093px) and phone (<=605px). Rerun to regenerate: the
# generated section (everything from the first "===== layout" banner to
# the end of style.css) is replaced, never duplicated.
#
# The export's "Sun Tzu AI-Open/Close Animation" has no keys (nothing
# moves): constant @keyframes on its resting transform are defined once
# in the base stylesheet (they are the same on every platform), so the
# media queries emit no keyframes - the play still fires animationend
# for the click flow's Wait step. The other apps' click / double-click
# triggers have nothing connected in the node window, so no keyframes
# exist for them either.

# the app tiles, in the page's left-to-right order
TILES = ['.Sun_Tzu_AI', '.Blend_Web', '.Blend_EDA', '.Blend_ACS', '.Kin_Flow']


def platform_block(name, mq, layout_css):
    return f'''/* ===================== {name} layout =====================
   {mq.strip()} - same elements, same HTML; positions / sizes are
   scaled with the screen width (% / vw) so nothing overflows
   sideways. */
@media {mq} {{
{layout_css}
}}'''


def pct(x, dw):
    return f'{x / dw * 100:.4f}%'


def vw(x, dw):
    return f'{x / dw * 100:.4f}vw'


def tile_rules(dw, xs, top=None, tw=None, th=None):
    """One rule per app tile (each has its own class now)."""
    out = []
    for cls, x in zip(TILES, xs):
        rule = f'  {cls} {{ left: {pct(x, dw)} !important;'
        if top is not None:
            rule += f' top: {top}px !important;'
        if tw is not None:
            rule += f' width: {pct(tw, dw)};'
        if th is not None:
            # same unit as the width: the tile keeps its shape (a square
            # stays a square) on every screen width inside the band
            rule += f' height: {th / dw * 100:.4f}vw;'
        out.append(rule + ' }')
    return '\n'.join(out)


# 1366-wide desktop design on screens 1094-1365px: only x/width scale,
# every y/height keeps its desktop value (they're already in the base
# styles, so just the horizontal rules are overridden here).
# .Sun_Tzu_AI_Content sits inside its tile at page x 0 / y 0: left = the
# negative of the tile's x in % of the tile, so it keeps covering the
# page as the tile scales. Its children keep their relative places with
# vw positions inside the stretched window.
DESKTOP_NARROW_LAYOUT = f'''  body {{ width: auto; }}
  #bw-Rectangle-007 {{ width: 100%; }}
  #bw-p-001 {{ left: {pct(30, 1366)} !important; width: {pct(170.9, 1366)}; }}
  #bw-p-004 {{ left: {pct(340, 1366)} !important; width: {pct(26.1, 1366)}; }}
  .Front_Page_Time {{ left: {pct(370, 1366)} !important; width: {pct(104.4, 1366)}; }}
  .Front_Page_Date {{ left: {pct(180, 1366)} !important; width: {pct(156.5, 1366)}; }}
  .App_Counter {{ left: {pct(210, 1366)} !important; width: {pct(547.9, 1366)}; }}
  #bw-p-005 {{ left: {pct(100, 1366)} !important; width: {pct(78.3, 1366)}; }}
  /* the stat rows (the desktop design puts them below the 599px canvas) */
  #bw-p-009 {{ left: {pct(430, 1366)} !important; width: {pct(149.9, 1366)}; }}
  #bw-p-010 {{ left: {pct(630, 1366)} !important; width: {pct(166.6, 1366)}; }}
  #bw-p-008 {{ left: {pct(430, 1366)} !important; width: {pct(149.9, 1366)}; }}
  #bw-p-011 {{ left: {pct(630, 1366)} !important; width: {pct(166.6, 1366)}; }}
  #bw-p-012 {{ left: {pct(430, 1366)} !important; width: {pct(149.9, 1366)}; }}
  /* the app tiles, desktop x 100/200/300/400/500 scaled */
{tile_rules(1366, [100, 200, 300, 400, 500], tw=70, th=70)}
  /* the app window: covers the page (inside-container x -100 of 70px tile) */
  .Sun_Tzu_AI_Content {{ left: -142.8571% !important; top: -270px !important; width: 100vw; height: 599px; }}
  #bw-div {{ width: 100vw; }}
  #bw-p-006 {{ left: {vw(600, 1366)} !important; width: {vw(160, 1366)}; }}
  #bw-button-002 {{ left: {vw(433.12, 1366)} !important; width: {vw(199.9, 1366)}; }}
  #bw-button-003 {{ left: {vw(732.98, 1366)} !important; width: {vw(199.9, 1366)}; }}
  #bw-p-007 {{ left: {vw(633.02, 1366)} !important; width: {vw(166.6, 1366)}; }}
  .Donation_Progress_Label {{ left: {vw(441.45, 1366)} !important; width: {vw(483.1, 1366)}; }}
  .Donation_Progress {{ left: {vw(433.12, 1366)} !important; width: {vw(499.8, 1366)}; }}
  .Donation_Progress_Fill {{ left: {vw(8.33, 1366)} !important; width: {vw(20, 1366)}; }}
  /* the bottom app-switcher row inside the window */
  #bw-button-001 {{ left: {vw(0, 1366)} !important; width: {vw(316.5, 1366)}; }}
  #bw-button-004 {{ left: {vw(349.83, 1366)} !important; width: {vw(316.5, 1366)}; }}
  #bw-button-005 {{ left: {vw(699.66, 1366)} !important; width: {vw(316.5, 1366)}; }}
  #bw-button-006 {{ left: {vw(1049.49, 1366)} !important; width: {vw(316.5, 1366)}; }}'''

# Tablet (820 x 1180): the export lists .Sun_Tzu_AI_Content at x 60 / y 120
# inside its container (60px = 120% of the 50px tile), 820 x 1180 - it keeps
# its shape, so the height is the width x 1180/820. The window's children
# get their listed inside-container spots (x in % of the window, y and the
# listed heights in px at the designed width). The Donation Progress
# Fill's exported x 265 is the absolute page x - inside its bar that is
# left 5px (its y 468 is stale: top 0 keeps it flush with the bar).
TABLET_LAYOUT = f'''  body {{ width: auto; height: auto; min-height: 1180px; }}
  #bw-Rectangle-007 {{ width: 100%; height: 1180px; }}
  #bw-p-001 {{ left: {pct(220, 820)} !important; top: 260px !important; width: {pct(120, 820)}; height: 24px; }}
  #bw-p-004 {{ left: {pct(260, 820)} !important; top: 20px !important; width: {pct(12, 820)}; height: 12px; }}
  .Front_Page_Time {{ left: {pct(280, 820)} !important; top: 20px !important; width: {pct(80, 820)}; height: 12px; }}
  .Front_Page_Date {{ left: {pct(140, 820)} !important; top: 20px !important; width: {pct(115.96, 820)}; height: 12px; }}
  .App_Counter {{ left: {pct(100, 820)} !important; top: 80px !important; width: {pct(252.1, 820)}; height: 24px; }}
  #bw-p-005 {{ left: {pct(40, 820)} !important; top: 80px !important; width: {pct(36, 820)}; height: 24px; }}
  /* the stat rows: (p-012, p-010) y620, (p-009, p-011) y660, (p-008, p-007) y700 */
  #bw-p-012 {{ left: {pct(260, 820)} !important; top: 620px !important; width: {pct(90, 820)}; height: 20px; }}
  #bw-p-010 {{ left: {pct(380, 820)} !important; top: 620px !important; width: {pct(100, 820)}; height: 20px; }}
  #bw-p-009 {{ left: {pct(260, 820)} !important; top: 660px !important; width: {pct(90, 820)}; height: 20px; }}
  #bw-p-011 {{ left: {pct(380, 820)} !important; top: 660px !important; width: {pct(100, 820)}; height: 20px; }}
  #bw-p-008 {{ left: {pct(260, 820)} !important; top: 700px !important; width: {pct(90, 820)}; height: 20px; }}
  /* the app tiles: x 40/120/180/240/320, y 160, 50px high */
{tile_rules(820, [40, 120, 180, 240, 320], top=160, tw=50, th=50)}
  /* the app window: x 60 / y 120 inside its tile, 820 x 1180 */
  .Sun_Tzu_AI_Content {{ left: 120% !important; top: 120px !important; width: 100vw; height: {1180 / 820 * 100:.4f}vw; }}
  #bw-div {{ width: 100vw; height: {1180 / 820 * 100:.4f}vw; }}
  /* the window's children (x / y inside the 820px-wide window) */
  #bw-p-006 {{ left: {pct(240.5, 820)} !important; top: 210px !important; width: {pct(339, 820)}; height: 74px; }}
  #bw-button-002 {{ left: {pct(180, 820)} !important; top: 380px !important; width: {pct(200, 820)}; height: 60px; }}
  #bw-button-003 {{ left: {pct(440, 820)} !important; top: 380px !important; width: {pct(200, 820)}; height: 60px; }}
  .Donation_Progress_Label {{ left: {pct(260, 820)} !important; top: 520px !important; width: {pct(300, 820)}; height: 16px; }}
  .Donation_Progress {{ left: {pct(260, 820)} !important; top: 560px !important; width: {pct(300, 820)}; height: 12px; }}
  .Donation_Progress_Fill {{ left: 5px !important; top: 0px !important; width: 12px; height: 12px; }}
  #bw-p-007 {{ left: {pct(380, 820)} !important; top: 700px !important; width: {pct(100, 820)}; height: 20px; }}
  /* the bottom app-switcher row inside the window, y 1140 */
  #bw-button-001 {{ left: {pct(0, 820)} !important; top: 1140px !important; width: {pct(190, 820)}; height: 40px; }}
  #bw-button-004 {{ left: {pct(210, 820)} !important; top: 1140px !important; width: {pct(190, 820)}; height: 40px; }}
  #bw-button-005 {{ left: {pct(420, 820)} !important; top: 1140px !important; width: {pct(190, 820)}; height: 40px; }}
  #bw-button-006 {{ left: {pct(630, 820)} !important; top: 1140px !important; width: {pct(190, 820)}; height: 40px; }}'''

# Phone (390 x 844): .Sun_Tzu_AI_Content isn't listed, so it keeps the
# base design scaled with the screen width (-100 x / 1366 x 599). The new
# paragraphs and the window's children aren't listed either - they keep
# their desktop px places.
PHONE_LAYOUT = f'''  body {{ width: auto; height: auto; min-height: 844px; }}
  #bw-Rectangle-007 {{ width: 100%; height: 844px; }}
  #bw-p-001 {{ left: {pct(10, 390)} !important; top: 10px !important; width: {pct(130, 390)}; height: 30px; }}
  #bw-p-004 {{ left: {pct(290, 390)} !important; top: 10px !important; width: {pct(10, 390)}; height: 20px; }}
  .Front_Page_Time {{ left: {pct(310, 390)} !important; top: 10px !important; width: {pct(70, 390)}; height: 20px; }}
  .Front_Page_Date {{ left: {pct(160, 390)} !important; top: 10px !important; width: {pct(120, 390)}; height: 20px; }}
  .App_Counter {{ left: {pct(100, 390)} !important; top: 60px !important; width: {pct(270, 390)}; height: 40px; }}
  #bw-p-005 {{ left: {pct(20, 390)} !important; top: 60px !important; width: {pct(70, 390)}; height: 40px; }}
  /* the app tiles: x 20/80/140/200/260, y 120, 39.971px */
{tile_rules(390, [20, 80, 140, 200, 260], top=120, tw=39.971, th=39.971)}
  /* the app window keeps the base design, scaled with the screen width */
  .Sun_Tzu_AI_Content {{ left: {vw(-100, 1366)} !important; top: -270px !important; width: 100vw; height: {599 / 1366 * 100:.4f}vw; }}'''

out = '\n\n'
out += platform_block(
    'Desktop (narrow)', '(min-width: 1094px) and (max-width: 1365px)',
    DESKTOP_NARROW_LAYOUT)
out += '\n\n'
out += platform_block(
    'Tablet', '(min-width: 606px) and (max-width: 1093px)',
    TABLET_LAYOUT)
out += '\n\n'
out += platform_block(
    'Phone', '(max-width: 605px)',
    PHONE_LAYOUT)
out += '\n'

# replace the generated tail (everything from the first banner down)
src = open('style.css', encoding='utf-8').read()
marker = '/* ===================== '
i = src.find(marker)
if i != -1:
    src = src[:i].rstrip('\n')
with open('style.css', 'w', encoding='utf-8') as f:
    f.write(src + out)
print('wrote', len(out), 'chars of generated platform CSS')
