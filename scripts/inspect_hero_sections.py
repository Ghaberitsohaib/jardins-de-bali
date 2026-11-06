import glob

for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as fp:
        for i, line in enumerate(fp):
            if 'id="Hero"' in line or 'id="arborHero"' in line:
                print(f'{f}:{i+1}: {line.strip()[:100]}')

