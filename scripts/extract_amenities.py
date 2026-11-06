import subprocess

out = subprocess.check_output(['git', 'show', '7a825f3:index.html'], text=True)
lines = out.splitlines()

start = None
end = None
for i, l in enumerate(lines):
    if 'id="Amenities"' in l:
        start = i
    if 'id="Horizontal"' in l:
        end = i

print(f"Amenities from {start} to {end}")
if start is not None and end is not None:
    with open('scripts/amenities_backup.html', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines[start-2:end]))
    print("Saved to scripts/amenities_backup.html")

