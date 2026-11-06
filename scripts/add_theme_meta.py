import glob

meta_block = '''  <meta name="theme-color" content="#10150F" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-capable" content="yes" />'''

for html_file in glob.glob('*.html'):
    if 'showcase' in html_file:
        continue
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<meta name="theme-color"' not in content:
        # Place right after <meta name="viewport" ... />
        if '<meta name="viewport"' in content:
            # find end of viewport line
            idx = content.find('<meta name="viewport"')
            end_idx = content.find('>', idx) + 1
            content = content[:end_idx] + '\n' + meta_block + content[end_idx:]
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Added theme-color meta to {html_file}')

