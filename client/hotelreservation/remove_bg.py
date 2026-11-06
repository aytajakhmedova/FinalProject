from PIL import Image
import os

# Faylın yolu
input_path = r"src\assets\images\logoAe.png"
output_path = r"src\assets\images\logoAe_transparent.png"

print("Şəkil yüklənir...")

# Şəkli aç
img = Image.open(input_path)

# RGBA formatına çevir (alpha kanal əlavə et)
img = img.convert("RGBA")

# Pixel məlumatlarını al
datas = img.getdata()

new_data = []
for item in datas:
    # Ağ və ya açıq rəngli pikselləri şəffaf et
    # RGB dəyəri (200, 200, 200)-dən yüksək olanları şəffaf edir
    if item[0] > 200 and item[1] > 200 and item[2] > 200:
        # Şəffaf et (alpha = 0)
        new_data.append((255, 255, 255, 0))
    else:
        # Saxla
        new_data.append(item)

# Yeni məlumatı tətbiq et
img.putdata(new_data)

# Yadda saxla
img.save(output_path, "PNG")
print(f"✅ Şəffaf logo yaradıldı: {output_path}")

# Köhnəsini yenisi ilə əvəz et
if os.path.exists(output_path):
    os.replace(output_path, input_path)
    print(f"✅ {input_path} şəffaf versiya ilə əvəz edildi!")
