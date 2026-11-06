# Generate exact SVG string from clean polygon vertices
outer = [(0, 86), (32, 86), (140, 5), (200, 53), (164, 87), (182, 87), (211, 62), (240, 84), (213, 61), (221, 53), (265, 85), (224, 49), (214, 44), (183, 18), (160, 17), (140, 0), (107, 0)]
inner = [(173, 27), (181, 21), (214, 47), (207, 48), (202, 52)]
p2 = [(123, 48), (123, 64), (138, 64), (138, 48)]
p3 = [(142, 48), (142, 64), (157, 64), (157, 48)]
p4 = [(123, 68), (123, 84), (138, 84), (138, 68)]
p5 = [(142, 68), (142, 84), (157, 84), (157, 68)]

def to_d(pts):
    return 'M ' + ' L '.join(f'{x} {y}' for x, y in pts) + ' Z'

all_d = ' '.join([to_d(p2), to_d(p3), to_d(p4), to_d(p5), to_d(outer), to_d(inner)])

# Bounding box
all_pts = outer + inner + p2 + p3 + p4 + p5
min_x = min(p[0] for p in all_pts)
min_y = min(p[1] for p in all_pts)
max_x = max(p[0] for p in all_pts)
max_y = max(p[1] for p in all_pts)

w = max_x - min_x
h = max_y - min_y
print(f'Clean Roof BBox: {w}x{h} (min: {min_x},{min_y}, max: {max_x},{max_y})')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="currentColor">
  <path fill-rule="evenodd" d="{all_d}" />
</svg>'''

with open('public/icons/baytimmo-roof-symbol.svg', 'w') as f:
    f.write(svg)
print('Updated public/icons/baytimmo-roof-symbol.svg')

# Also generate the favicon badge (public/favicon.svg, public/icons/tree-symbol.svg)
# Size 120x120 circle, gold gradient, roof scaled nicely inside
# w=265, h=87. Scale factor so width is ~76px -> scale = 76 / 265 ~ 0.2868
# Scaled height: 87 * 0.2868 = 24.95px
# Position: centered at (60, 60) -> dx = 60 - (76/2) = 22, dy = 60 - (25/2) = 47.5
badge_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#182017"/>
      <stop offset="100%" stop-color="#0A0E0A"/>
    </linearGradient>
    <linearGradient id="goldRoof" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCEFD8"/>
      <stop offset="50%" stop-color="#C5A880"/>
      <stop offset="100%" stop-color="#9E8055"/>
    </linearGradient>
  </defs>
  <!-- Luxury Circular Badge with Gold Trim -->
  <circle cx="60" cy="60" r="58" fill="url(#bgGrad)" stroke="#C5A880" stroke-width="2.5" />
  <circle cx="60" cy="60" r="54" fill="none" stroke="#C5A880" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.5" />
  <!-- Scaled BaytImmo Roof Symbol -->
  <g transform="translate(22, 47.5) scale(0.2868)" fill="url(#goldRoof)">
    <path fill-rule="evenodd" d="{all_d}" />
  </g>
</svg>'''

with open('public/favicon.svg', 'w') as f:
    f.write(badge_svg)
with open('public/icons/tree-symbol.svg', 'w') as f:
    f.write(badge_svg)
print('Updated public/favicon.svg and public/icons/tree-symbol.svg')

