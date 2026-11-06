import cv2

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
    
    # Roof elements are all located at y < 170
    if y + h_box < 175:
        roof_paths.append((x, y, w_box, h_box, path_str))
    else:
        text_paths.append((x, y, w_box, h_box, path_str))

print(f"Roof components: {len(roof_paths)}, Text components: {len(text_paths)}")

# Compute bounding box of roof
min_x = min(r[0] for r in roof_paths)
min_y = min(r[1] for r in roof_paths)
max_x = max(r[0] + r[2] for r in roof_paths)
max_y = max(r[1] + r[3] for r in roof_paths)
roof_w = max_x - min_x
roof_h = max_y - min_y

print(f"Roof Bounding Box: {min_x},{min_y} to {max_x},{max_y} (size: {roof_w}x{roof_h})")

# Export roof icon SVG centered in a square viewbox (e.g. 100x100 or with padding)
padding = 10
vb_w = roof_w + 2 * padding
vb_h = roof_h + 2 * padding
# Shift paths
shifted_roof = []
for r in roof_paths:
    cnt_pts = r[4].split()
    # Replace coords
    new_parts = []
    k = 0
    while k < len(cnt_pts):
        token = cnt_pts[k]
        if token in ('M', 'L'):
            px = float(cnt_pts[k+1]) - min_x + padding
            py = float(cnt_pts[k+2]) - min_y + padding
            new_parts.append(f"{token} {px:.1f} {py:.1f}")
            k += 3
        elif token == 'Z':
            new_parts.append("Z")
            k += 1
        else:
            k += 1
    shifted_roof.append(" ".join(new_parts))

roof_combined_d = " ".join(shifted_roof)

# Write roof emblem SVG
roof_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vb_w:.1f} {vb_h:.1f}" fill="currentColor">
  <path fill-rule="evenodd" d="{roof_combined_d}" />
</svg>'''

with open(r"C:\Users\ghabr\Desktop\immo\public\icons\baytimmo-roof-symbol.svg", "w", encoding="utf-8") as f:
    f.write(roof_svg)

print("Saved baytimmo-roof-symbol.svg successfully!")

