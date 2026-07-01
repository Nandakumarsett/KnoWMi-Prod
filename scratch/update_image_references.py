import os

def update_references():
    src_dir = r"c:\Users\Nanda Kumar\Downloads\KnoWMi-Prod-main\KnoWMi-Prod-main\src"
    replacements = {
        'tshirt_front.png': 'tshirt_front.webp',
        'tshirt_back.png': 'tshirt_back.webp',
        'qr_code_glow.png': 'qr_code_glow.webp',
        'fabric_macro.png': 'fabric_macro.webp',
        'digital_profile.png': 'digital_profile.webp',
        'premium_heavyweight_fabric.png': 'premium_heavyweight_fabric.webp',
        'knowmi_wear_it.png': 'knowmi_wear_it.webp',
        'shirt_hero.png': 'shirt_hero.webp',
        'anime_shirt_nobg.png': 'anime_shirt_nobg.webp',
        'anime_shirt.jpg': 'anime_shirt.webp',
        'invisible_tech_new.jpg': 'invisible_tech_new.webp',
        'front.png': 'front.webp',
        'back.png': 'back.webp',
        'logo-square.png': 'logo-square.webp',
        'BrandKit.png': 'BrandKit.webp',
        'face-of-knowmi.jpg': 'face-of-knowmi.webp',
        'mock-profile.jpg': 'mock-profile.webp',
        'Founder-Portrait.jpg': 'Founder-Portrait.webp',
        'KnoWMi-Logo.png': 'KnoWMi-Logo.webp',
    }

    count = 0
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.js', '.jsx', '.ts', '.tsx', '.css', '.html']:
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original_content = content
                    for old_ref, new_ref in replacements.items():
                        content = content.replace(old_ref, new_ref)
                    
                    if content != original_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        count += 1
                        print(f"Updated image references in: {file}")
                except Exception as e:
                    print(f"Error updating references in {file}: {e}")

    print(f"\nDone! Updated references in {count} files.")

if __name__ == '__main__':
    update_references()
