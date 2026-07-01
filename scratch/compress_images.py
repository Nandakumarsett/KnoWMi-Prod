import os
from PIL import Image

def compress_images():
    public_dir = r"c:\Users\Nanda Kumar\Downloads\KnoWMi-Prod-main\KnoWMi-Prod-main\public"
    converted_count = 0
    total_saved = 0

    for root, dirs, files in os.walk(public_dir):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.png', '.jpg', '.jpeg']:
                file_path = os.path.join(root, file)
                # Skip favicon and og-image or anything that shouldn't be touched
                if 'favicon' in file.lower() or 'og-image' in file.lower() or 'robots' in file.lower() or 'manifest' in file.lower():
                    continue

                webp_path = os.path.splitext(file_path)[0] + ".webp"
                
                try:
                    img = Image.open(file_path)
                    original_size = os.path.getsize(file_path)
                    
                    # Convert transparent pngs using RGBA/RGB mode handling
                    if img.mode in ('RGBA', 'LA'):
                        img.save(webp_path, 'WEBP', quality=75, lossless=False)
                    else:
                        img.save(webp_path, 'WEBP', quality=80)
                    
                    new_size = os.path.getsize(webp_path)
                    saved = original_size - new_size
                    converted_count += 1
                    total_saved += saved
                    print(f"Converted: {file} -> {os.path.basename(webp_path)} ({original_size/1024:.1f}KB -> {new_size/1024:.1f}KB, Saved: {saved/1024:.1f}KB)")
                except Exception as e:
                    print(f"Error converting {file}: {e}")

    print(f"\nDone! Converted {converted_count} files. Total space saved: {total_saved/1024/1024:.2f} MB")

if __name__ == '__main__':
    compress_images()
