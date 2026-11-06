import cv2

# Read original
img_path = r"C:\Users\ghabr\.gemini\antigravity\brain\db659566-e772-44f8-93f0-e36abdb74f1a\.user_uploaded\media_1793965949642_3d067a09.png"
img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
_, thresh = cv2.threshold(img, 70, 255, cv2.THRESH_BINARY)
contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_TC89_KCOS)

roof_paths = []
text_paths = []

for i, cnt in enumerate(contours):
    if cv2.contourArea(cnt) < 10:
        continue
    x, y, w_box, h_box = cv2.boundingRect(cnt)
    
    epsilon = 0.001 * cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, epsilon, True)
    d = []
    for j, pt in enumerate(approx):
        px, py = pt[0]
        d.append(f"{'M' if j == 0 else 'L'} {px} {py}")
    d.append("Z")
    path_str = " ".join(d)
    
    if y + h_box < 175:
        roof_paths.append((x, y, w_box, h_box, path_str))
    else:
        text_paths.append((x, y, w_box, h_box, path_str))

# Overall bounding box of entire logo
all_paths = roof_paths + text_paths
min_x = min(p[0] for p in all_paths)
min_y = min(p[1] for p in all_paths)
max_x = max(p[0] + p[2] for p in all_paths)
max_y = max(p[1] + p[3] for p in all_paths)
total_w = max_x - min_x
total_h = max_y - min_y

print(f"Overall logo: {min_x},{min_y} to {max_x},{max_y} (size: {total_w}x{total_h})")

# Helper to shift paths
def shift_paths(path_tuples, ox, oy, pad_x, pad_y):
    shifted = []
    for p in path_tuples:
        tokens = p[4].split()
        res = []
        k = 0
        while k < len(tokens):
            t = tokens[k]
            if t in ('M', 'L'):
                x = float(tokens[k+1]) - ox + pad_x
                y = float(tokens[k+2]) - oy + pad_y
                res.append(f"{t} {x:.1f} {y:.1f}")
                k += 3
            elif t == 'Z':
                res.append("Z")
                k += 1
            else:
                k += 1
        shifted.append(" ".join(res))
    return " ".join(shifted)

# 1. FULL OFFICIAL LOGO (Horizontal / Vertical luxury layout)
pad = 20
full_w = total_w + 2 * pad
full_h = total_h + 2 * pad
full_roof_d = shift_paths(roof_paths, min_x, min_y, pad, pad)
full_text_d = shift_paths(text_paths, min_x, min_y, pad, pad)

full_logo_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {full_w:.1f} {full_h:.1f}" fill="none">
  <defs>
    <linearGradient id="goldGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCEFD8"/>
      <stop offset="50%" stop-color="#C5A880"/>
      <stop offset="100%" stop-color="#8E7148"/>
    </linearGradient>
  </defs>
  <!-- Roof Emblem in Warm Champagne Gold -->
  <path fill-rule="evenodd" d="{full_roof_d}" fill="url(#goldGradFull)" />
  <!-- Typography in Clean Warm Lin / Gold -->
  <path fill-rule="evenodd" d="{full_text_d}" fill="#FAF7EF" />
</svg>'''

with open(r"C:\Users\ghabr\Desktop\immo\public\icons\baytimmo-official-gold.svg", "w", encoding="utf-8") as f:
    f.write(full_logo_svg)

# 2. STANDALONE ROOF SYMBOL (Centered)
min_rx = min(r[0] for r in roof_paths)
min_ry = min(r[1] for r in roof_paths)
max_rx = max(r[0] + r[2] for r in roof_paths)
max_ry = max(r[1] + r[3] for r in roof_paths)
rw = max_rx - min_rx
rh = max_ry - min_ry

roof_d = shift_paths(roof_paths, min_rx, min_ry, 0, 0)

# 3. FAVICON / EMBLEM BADGE (Circular / Rounded badge with Gold Roof)
# In a 100x100 square, center the roof (aspect ratio is 269:92 ~ 2.92:1)
# Scale roof to width ~66, height ~23, centered at x=50, y=50
scale = 68.0 / rw
scaled_rw = rw * scale
scaled_rh = rh * scale
offset_x = (100.0 - scaled_rw) / 2.0
offset_y = (100.0 - scaled_rh) / 2.0

favicon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="goldGradFav" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCEFD8"/>
      <stop offset="50%" stop-color="#C5A880"/>
      <stop offset="100%" stop-color="#8E7148"/>
    </linearGradient>
  </defs>
  <!-- Luxury Dark Round Badge -->
  <rect width="100" height="100" rx="50" fill="#10150F"/>
  <circle cx="50" cy="50" r="46" stroke="url(#goldGradFav)" stroke-width="1.5" stroke-dasharray="2 3" opacity="0.6"/>
  <circle cx="50" cy="50" r="42" stroke="url(#goldGradFav)" stroke-width="1.2"/>
  
  <!-- Scaled Official Roof Emblem -->
  <g transform="translate({offset_x:.2f}, {offset_y:.2f}) scale({scale:.4f})">
    <path fill-rule="evenodd" d="{roof_d}" fill="url(#goldGradFav)"/>
  </g>
</svg>'''

with open(r"C:\Users\ghabr\Desktop\immo\public\icons\tree-symbol.svg", "w", encoding="utf-8") as f:
    f.write(favicon_svg)

with open(r"C:\Users\ghabr\Desktop\immo\public\favicon.svg", "w", encoding="utf-8") as f:
    f.write(favicon_svg)

print("Saved official gold logo and official roof favicon successfully!")

