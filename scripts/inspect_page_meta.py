import glob
import re

for f in glob.glob('*.html'):
    if 'showcase' in f: continue
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    theme_color = re.findall(r'<meta[^>]*theme-color[^>]*>', content, re.I)
    viewport = re.findall(r'<meta[^>]*viewport[^>]*>', content, re.I)
    print(f"=== {f} ===")
    print("  Theme color:", theme_color if theme_color else "NONE")
    print("  Viewport:", viewport if viewport else "NONE")

