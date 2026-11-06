import re
import glob

new_svg = '''<svg width="46" height="15" viewBox="0 0 265 87" fill="none" xmlns="http://www.w3.org/2000/svg" class="arbor-logo-symbol" id="arborHeaderSymbol">
            <path fill-rule="evenodd" d="M 123 48 L 123 64 L 138 64 L 138 48 Z M 142 48 L 142 64 L 157 64 L 157 48 Z M 123 68 L 123 84 L 138 84 L 138 68 Z M 142 68 L 142 84 L 157 84 L 157 68 Z M 0 86 L 32 86 L 140 5 L 200 53 L 164 87 L 182 87 L 211 62 L 240 84 L 213 61 L 221 53 L 265 85 L 224 49 L 214 44 L 183 18 L 160 17 L 140 0 L 107 0 Z M 173 27 L 181 21 L 214 47 L 207 48 L 202 52 Z" fill="currentColor"></path>
          </svg>'''

pattern = re.compile(r'<svg[^>]*id="arborHeaderSymbol"[^>]*>.*?</svg>', re.DOTALL)

for html_file in glob.glob('*.html'):
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'id="arborHeaderSymbol"' in content:
        updated = pattern.sub(new_svg, content)
        if updated != content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(updated)
            print(f'Updated {html_file}')

