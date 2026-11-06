import glob

icon_block = '''  <link rel="icon" type="image/svg+xml" href="/icons/tree-symbol.svg" />
  <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />'''

for html_file in glob.glob('*.html'):
    if html_file in ('logo_showcase.html', 'typography_showcase.html', 'typography_script_showcase.html'):
        continue
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<link rel="apple-touch-icon"' not in content and '<link rel="icon" type="image/svg+xml" href="/icons/tree-symbol.svg" />' in content:
        content = content.replace('<link rel="icon" type="image/svg+xml" href="/icons/tree-symbol.svg" />', icon_block)
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated favicon tags in {html_file}')

