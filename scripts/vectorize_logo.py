import cv2
import numpy as np

img_path = r"C:\Users\ghabr\.gemini\antigravity\brain\db659566-e772-44f8-93f0-e36abdb74f1a\.user_uploaded\media_1793965949642_3d067a09.png"
img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)

# Convert to grayscale
if len(img.shape) == 3 and img.shape[2] == 4:
    # Has alpha channel
    alpha = img[:, :, 3]
    gray = cv2.cvtColor(img[:, :, :3], cv2.COLOR_BGR2GRAY)
    # Mask by alpha
    gray = cv2.bitwise_and(gray, gray, mask=alpha)
else:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Threshold to isolate white logo on black background
_, thresh = cv2.threshold(gray, 80, 255, cv2.THRESH_BINARY)

# Find contours
contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_TC89_KCOS)

h, w = thresh.shape
print(f"Image dimensions: {w}x{h}, found {len(contours)} contours")

# Generate SVG
svg_paths = []
# Sort or process contours with hierarchy to handle holes properly
for i, cnt in enumerate(contours):
    area = cv2.contourArea(cnt)
    if area < 10:  # ignore noise
        continue
    
    # Approximate polygon
    epsilon = 0.0015 * cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, epsilon, True)
    
    # Build SVG path
    d = []
    for j, pt in enumerate(approx):
        x, y = pt[0]
        if j == 0:
            d.append(f"M {x} {y}")
        else:
            d.append(f"L {x} {y}")
    d.append("Z")
    
    # Check if this contour is a hole
    parent = hierarchy[0][i][3]
    svg_paths.append((parent, " ".join(d)))

print(f"Kept {len(svg_paths)} valid paths")

# Group into fill-rule="evenodd" path
combined_d = " ".join([p[1] for p in svg_paths])

# Save full SVG
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="currentColor">
  <path fill-rule="evenodd" d="{combined_d}" />
</svg>'''

with open(r"C:\Users\ghabr\Desktop\immo\public\icons\baytimmo-official-full.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Saved baytimmo-official-full.svg")

