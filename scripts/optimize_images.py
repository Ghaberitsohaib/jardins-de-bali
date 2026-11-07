import os
import shutil
from PIL import Image

def optimize():
    total_saved = 0
    count = 0
    backup_dir = 'image_originals_backup'
    os.makedirs(backup_dir, exist_ok=True)

    for root, _, files in os.walk('public'):
        for f in files:
            if f.lower().endswith(('.jpg', '.jpeg')):
                p = os.path.join(root, f)
                orig_size = os.path.getsize(p)
                temp_p = p + '.tmp'
                try:
                    img = Image.open(p)
                    # Convert RGBA/P to RGB if needed
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    
                    # Save optimized with high quality 82
                    img.save(temp_p, 'JPEG', quality=82, optimize=True, progressive=True)
                    new_size = os.path.getsize(temp_p)

                    if new_size < orig_size:
                        # Backup original
                        rel = os.path.relpath(p, 'public')
                        bak_path = os.path.join(backup_dir, rel)
                        os.makedirs(os.path.dirname(bak_path), exist_ok=True)
                        if not os.path.exists(bak_path):
                            shutil.copy2(p, bak_path)

                        # Replace with optimized
                        shutil.move(temp_p, p)
                        saved = orig_size - new_size
                        total_saved += saved
                        count += 1
                        print(f"Optimized {rel}: {orig_size/1024:.1f} KB -> {new_size/1024:.1f} KB (saved {saved/1024:.1f} KB)")
                    else:
                        if os.path.exists(temp_p):
                            os.remove(temp_p)
                except Exception as e:
                    if os.path.exists(temp_p):
                        os.remove(temp_p)
                    print(f"Skipping {p}: {e}")

    print(f"\nDone! Optimized {count} images, saved {total_saved / (1024*1024):.2f} MB.")

if __name__ == '__main__':
    optimize()

