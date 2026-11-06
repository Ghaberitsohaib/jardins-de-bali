from PIL import Image

img_path = r"C:\Users\ghabr\.gemini\antigravity\brain\db659566-e772-44f8-93f0-e36abdb74f1a\.user_uploaded\media_1793965949642_3d067a09.png"
img = Image.open(img_path)
print("Image size:", img.size, img.mode)

# Save cropped roof icon
w, h = img.size
# Let's crop upper 55% where the roof icon is
roof_crop = img.crop((0, 0, w, int(h * 0.45)))
roof_crop.save(r"C:\Users\ghabr\.gemini\antigravity\brain\db659566-e772-44f8-93f0-e36abdb74f1a\roof_icon_crop.png")
print("Saved roof_icon_crop.png")

