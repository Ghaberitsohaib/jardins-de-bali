import glob
import re

for f in ['index.html', 'retail-spaces.html', 'residences.html', 'business.html', 'ventes.html', 'about-the-investor.html']:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # Check body classes and style tags
    body_tag = re.findall(r'<body[^>]*>', content)
    html_tag = re.findall(r'<html[^>]*>', content)
    inline_styles = re.findall(r'<style>.*?</style>', content, re.DOTALL)
    print(f"=== {f} ===")
    print("  HTML:", html_tag)
    print("  BODY:", body_tag)
    for s in inline_styles:
        if 'background' in s.lower() or 'hero' in s.lower():
            print("  STYLE SNIPPET:", s[:200].replace('\n', ' '))

