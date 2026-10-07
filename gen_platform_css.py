# Generates the media-query blocks for style.css from the Blend Web
# export (keyframe values are website px at the designed width;
# horizontal values are emitted in vw so they scale inside the band).
# Bands: narrow desktop (1094-1365px, desktop design scaled down),
# tablet (606-1093px) and phone (<=605px). Rerun to regenerate: the
# generated section (everything from the first "===== layout" banner to
# the end of style.css) is replaced, never duplicated.

APPS = [
    # slug, play-class stem
    ('sun-tzu-ai', 'bw-sun-tzu-ai-sun-tzu-ai-open-close-animation'),
    ('blend-web', 'bw-blend-web-blend-web-open-close-animation'),
    ('blend-eda', 'bw-blend-eda-blend-eda-open-close-animation'),
    ('blend-acs', 'bw-blend-acs-blend-acs-open-close-animation'),
    ('kin-flow', 'bw-kin-flow-kin-flow-open-close-animation'),
]
CONTENT_STEM = 'bw-sun_szu_ai_content-sun_szu_ai_content---sun-tzu-ai-open-close-animation'

# per platform: design width, page height, tile w/h, translate per app
PLATFORMS = {
    # desktop design (1366 wide) squeezed onto screens narrower than the
    # design: same proportions, x/width scale with the screen width
    'desktop-narrow': {
        'dw': 1366.0, 'ph': '599px',
        'tw': 140.0, 'th': 140.0,
        'moves': {
            'sun-tzu-ai': (-80, -200),
            'blend-web': (-260, -200),
            'blend-eda': (-440, -200),
            'blend-acs': (-620, -200),
            'kin-flow': (-80, -380),
        },
    },
    'tablet': {
        'dw': 820.0, 'ph': '1180px',
        'tw': 84.041, 'th': 84.041,
        'moves': {
            'sun-tzu-ai': (-48.02, -120.06),
            'blend-web': (-156.08, -120.06),
            'blend-eda': (-264.13, -120.06),
            'blend-acs': (-372.18, -120.06),
            'kin-flow': (-48.02, -228.11),
        },
    },
    'phone': {
        'dw': 390.0, 'ph': '844px',
        'tw': 39.971, 'th': 39.971,
        'moves': {
            'sun-tzu-ai': (-22.84, -57.1),
            'blend-web': (-74.23, -57.1),
            'blend-eda': (-125.62, -57.1),
            'blend-acs': (-177.01, -57.1),
            'kin-flow': (-22.84, -108.49),
        },
    },
}

CB = 'cubic-bezier(0.333, 0, 0.667, 1)'


def move_kf(name, tx, ty, timing=True, dw=None):
    if dw:
        tx = f'{tx / dw * 100:.4f}vw'
    else:
        tx = f'{tx}px'
    ty = f'{ty}px'
    t0 = f' animation-timing-function: {CB};' if timing else ''
    return (
        f'@keyframes {name}-move {{\n'
        f'  0% {{ transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1);{t0} }}\n'
        f'  25% {{ transform: translate({tx}, {ty}) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }}\n'
        f'  100% {{ transform: translate({tx}, {ty}) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }}\n'
        f'}}'
    )


def app_keyframes(stem, tx, ty, tw, th, dw, ph):
    """All property keyframes for one app on one platform.
    tw/th: tile size px; dw: design width (for vw conversion); ph: page height px string."""
    w0 = f'{tw / dw * 100:.4f}vw'
    parts = [
        move_kf(stem, tx, ty, dw=dw),
        f'''@keyframes {stem}-color {{
  0% {{ background-color: #d9d9d9; }}
  25% {{ background-color: #d9d9d9; }}
  100% {{ background-color: #d9d9d9; }}
}}''',
        f'''@keyframes {stem}-fade {{
  0% {{ opacity: 1; }}
  25% {{ opacity: 1; }}
  100% {{ opacity: 1; }}
}}''',
        f'''@keyframes {stem}-css-border-radius {{
  0% {{ border-radius: 5px; animation-timing-function: {CB}; }}
  25% {{ border-radius: 0px; }}
  100% {{ border-radius: 0px; }}
}}''',
        f'''@keyframes {stem}-css-box-shadow {{
  0% {{ box-shadow: 0px 2px 6px 0 #9e9e9e; animation-timing-function: steps(1, end); }}
  25% {{ box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }}
  100% {{ box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }}
}}''',
        f'''@keyframes {stem}-css-height {{
  0% {{ height: {th}px; }}
  25% {{ height: {th}px; animation-timing-function: {CB}; }}
  100% {{ height: {ph}; }}
}}''',
        f'''@keyframes {stem}-css-opacity {{
  0% {{ opacity: 1; animation-timing-function: {CB}; }}
  25% {{ opacity: 0; animation-timing-function: {CB}; }}
  100% {{ opacity: 1; }}
}}''',
        f'''@keyframes {stem}-css-width {{
  0% {{ width: {w0}; }}
  25% {{ width: {w0}; animation-timing-function: {CB}; }}
  100% {{ width: 100vw; }}
}}''',
        f'''@keyframes {stem}-css-z-index {{
  0% {{ z-index: 1; animation-timing-function: {CB}; }}
  25% {{ z-index: 2; }}
  100% {{ z-index: 2; }}
}}''',
    ]
    return '\n'.join(parts)


def content_keyframes(tw, th, dw, ph):
    stem = CONTENT_STEM
    w0 = f'{tw / dw * 100:.4f}vw'
    move = (
        f'@keyframes {stem}-move {{\n'
        f'  0% {{ transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }}\n'
        f'  25% {{ transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }}\n'
        f'  100% {{ transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }}\n'
        f'}}'
    )
    parts = [
        move,
        f'''@keyframes {stem}-color {{
  0% {{ background-color: #d9d9d9; }}
  25% {{ background-color: #d9d9d9; }}
  100% {{ background-color: #d9d9d9; }}
}}''',
        f'''@keyframes {stem}-fade {{
  0% {{ opacity: 1; }}
  25% {{ opacity: 1; }}
  100% {{ opacity: 1; }}
}}''',
        f'''@keyframes {stem}-css-border-radius {{
  0% {{ border-radius: 5px; animation-timing-function: {CB}; }}
  25% {{ border-radius: 0px; }}
  100% {{ border-radius: 0px; }}
}}''',
        f'''@keyframes {stem}-css-box-shadow {{
  0% {{ box-shadow: 0px 2px 6px 0 #9e9e9e; animation-timing-function: steps(1, end); }}
  25% {{ box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }}
  100% {{ box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }}
}}''',
        f'''@keyframes {stem}-css-height {{
  0% {{ height: {th}px; }}
  25% {{ height: {th}px; animation-timing-function: {CB}; }}
  100% {{ height: {ph}; }}
}}''',
        f'''@keyframes {stem}-css-opacity {{
  0% {{ opacity: 1; animation-timing-function: {CB}; }}
  25% {{ opacity: 0; animation-timing-function: {CB}; }}
  100% {{ opacity: 1; }}
}}''',
        f'''@keyframes {stem}-css-width {{
  0% {{ width: {w0}; }}
  25% {{ width: {w0}; animation-timing-function: {CB}; }}
  100% {{ width: 100vw; }}
}}''',
        f'''@keyframes {stem}-css-z-index {{
  0% {{ z-index: 1; animation-timing-function: {CB}; }}
  25% {{ z-index: 2; }}
  100% {{ z-index: 2; }}
}}''',
    ]
    return '\n'.join(parts)


def platform_block(name, mq, layout_css, p):
    lines = [
        f'/* ===================== {name} layout =====================',
        f'   {mq.strip()} - same elements, same HTML; positions / sizes are',
        '   scaled with the screen width (%) so nothing overflows sideways.',
        '   The @keyframes below REPLACE the base ones of the same name',
        '   on this platform (same timing and nodes, platform values). */',
        f'@media {mq} {{',
        layout_css,
    ]
    # app keyframes: plain (reverse) and -0-12 (timeline) variants
    for slug, stem in APPS:
        tx, ty = p['moves'][slug]
        lines.append(app_keyframes(stem, tx, ty, p['tw'], p['th'], p['dw'], p['ph']))
        lines.append(app_keyframes(stem + '-0-12', tx, ty, p['tw'], p['th'], p['dw'], p['ph']))
    lines.append(content_keyframes(p['tw'], p['th'], p['dw'], p['ph']))
    lines.append('}')
    return '\n\n'.join(lines)


def pct(x, dw):
    return f'{x / dw * 100:.4f}%'


def vw(x, dw):
    return f'{x / dw * 100:.4f}vw'


# 1366-wide desktop design on screens 1094-1365px: only x/width scale,
# every y/height keeps its desktop value (they're already in the base
# styles, so just the horizontal rules are overridden here)
DESKTOP_NARROW_LAYOUT = f'''  body {{ width: auto; }}
  #bw-Rectangle-007 {{ width: 100%; }}
  #bw-p-001 {{ left: {pct(20, 1366)} !important; width: {pct(131, 1366)}; }}
  #bw-p-004 {{ left: {pct(260, 1366)} !important; width: {pct(20, 1366)}; }}
  .Front_Page_Time {{ left: {pct(280, 1366)} !important; width: {pct(80, 1366)}; }}
  .Front_Page_Date {{ left: {pct(140, 1366)} !important; width: {pct(120, 1366)}; }}
  .App_Counter {{ left: {pct(160, 1366)} !important; width: {pct(420, 1366)}; }}
  #bw-p-005 {{ left: {pct(80, 1366)} !important; width: {pct(60, 1366)}; }}
  #bw-Rectangle-005 {{ left: {pct(840, 1366)} !important; width: {pct(440, 1366)}; }}
  /* app tiles sit where the platform keyframes expect them */
  .Sun_Tzu_AI {{ left: {pct(80, 1366)} !important; width: {pct(140, 1366)}; }}
  .Blend_Web {{ left: {pct(260, 1366)} !important; width: {pct(140, 1366)}; }}
  .Blend_EDA {{ left: {pct(440, 1366)} !important; width: {pct(140, 1366)}; }}
  .Blend_ACS {{ left: {pct(620, 1366)} !important; width: {pct(140, 1366)}; }}
  .Kin_Flow {{ left: {pct(80, 1366)} !important; width: {pct(140, 1366)}; }}
  .Sun_Tzu_AI_Content-shadow-wrap,
  .Sun_Tzu_AI_Content {{ width: 100%; height: 100%; }}'''

TABLET_LAYOUT = f'''  body {{ width: auto; height: auto; min-height: 1180px; }}
  #bw-Rectangle-007 {{ width: 100%; height: 1180px; }}
  #bw-p-001 {{ left: {pct(220, 820)} !important; top: 260px !important; width: {pct(120, 820)}; height: 24px; }}
  #bw-p-004 {{ left: {pct(260, 820)} !important; top: 20px !important; width: {pct(12, 820)}; height: 12px; }}
  .Front_Page_Time {{ left: {pct(280, 820)} !important; top: 20px !important; width: {pct(80, 820)}; height: 12px; }}
  .Front_Page_Date {{ left: {pct(140, 820)} !important; top: 20px !important; width: {pct(115.96, 820)}; height: 12px; }}
  .App_Counter {{ left: {pct(96, 820)} !important; top: 84px !important; width: {pct(252.1, 820)}; height: 24px; }}
  #bw-p-005 {{ left: {pct(48, 820)} !important; top: 84px !important; width: {pct(36, 820)}; height: 24px; }}
  #bw-Rectangle-005 {{ left: {pct(504.2, 820)} !important; top: 72px !important; width: {pct(264.1, 820)}; height: 252.1px; }}
  /* app tiles sit where the platform keyframes expect them */
  .Sun_Tzu_AI {{ left: {pct(48.02, 820)} !important; top: 120.06px !important; width: {pct(84.041, 820)}; height: 84.041px; }}
  .Blend_Web {{ left: {pct(156.08, 820)} !important; top: 120.06px !important; width: {pct(84.041, 820)}; height: 84.041px; }}
  .Blend_EDA {{ left: {pct(264.13, 820)} !important; top: 120.06px !important; width: {pct(84.041, 820)}; height: 84.041px; }}
  .Blend_ACS {{ left: {pct(372.18, 820)} !important; top: 120.06px !important; width: {pct(84.041, 820)}; height: 84.041px; }}
  .Kin_Flow {{ left: {pct(48.02, 820)} !important; top: 228.11px !important; width: {pct(84.041, 820)}; height: 84.041px; }}
  .Sun_Tzu_AI_Content-shadow-wrap,
  .Sun_Tzu_AI_Content {{ width: 100%; height: 100%; }}'''

PHONE_LAYOUT = f'''  body {{ width: auto; height: auto; min-height: 844px; }}
  #bw-Rectangle-007 {{ width: 100%; height: 844px; }}
  #bw-p-001 {{ left: {pct(5.7, 390)} !important; top: 5.7px !important; width: {pct(37.4, 390)}; height: 11.4px; }}
  #bw-p-004 {{ left: {pct(74.2, 390)} !important; top: 5.7px !important; width: {pct(5.7, 390)}; height: 5.7px; }}
  .Front_Page_Time {{ left: {pct(79.9, 390)} !important; top: 5.7px !important; width: {pct(22.8, 390)}; height: 5.7px; }}
  .Front_Page_Date {{ left: {pct(40, 390)} !important; top: 5.7px !important; width: {pct(34.3, 390)}; height: 5.7px; }}
  .App_Counter {{ left: {pct(45.7, 390)} !important; top: 40px !important; width: {pct(119.9, 390)}; height: 11.4px; }}
  #bw-p-005 {{ left: {pct(22.8, 390)} !important; top: 40px !important; width: {pct(17.1, 390)}; height: 11.4px; }}
  #bw-Rectangle-005 {{ left: {pct(239.8, 390)} !important; top: 34.3px !important; width: {pct(125.6, 390)}; height: 119.9px; }}
  /* app tiles sit where the platform keyframes expect them */
  .Sun_Tzu_AI {{ left: {pct(22.84, 390)} !important; top: 57.1px !important; width: {pct(39.971, 390)}; height: 39.971px; }}
  .Blend_Web {{ left: {pct(74.23, 390)} !important; top: 57.1px !important; width: {pct(39.971, 390)}; height: 39.971px; }}
  .Blend_EDA {{ left: {pct(125.62, 390)} !important; top: 57.1px !important; width: {pct(39.971, 390)}; height: 39.971px; }}
  .Blend_ACS {{ left: {pct(177.01, 390)} !important; top: 57.1px !important; width: {pct(39.971, 390)}; height: 39.971px; }}
  .Kin_Flow {{ left: {pct(22.84, 390)} !important; top: 108.49px !important; width: {pct(39.971, 390)}; height: 39.971px; }}
  .Sun_Tzu_AI_Content-shadow-wrap,
  .Sun_Tzu_AI_Content {{ width: 100%; height: 100%; }}'''

out = '\n\n'
out += platform_block(
    'Desktop (narrow)', '(min-width: 1094px) and (max-width: 1365px)',
    DESKTOP_NARROW_LAYOUT, PLATFORMS['desktop-narrow'])
out += '\n\n'
out += platform_block(
    'Tablet', '(min-width: 606px) and (max-width: 1093px)',
    TABLET_LAYOUT, PLATFORMS['tablet'])
out += '\n\n'
out += platform_block(
    'Phone', '(max-width: 605px)',
    PHONE_LAYOUT, PLATFORMS['phone'])
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
