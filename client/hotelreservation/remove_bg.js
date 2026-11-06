const sharp = require('sharp');
const fs = require('fs');

const inputPath = './src/assets/images/logoAe.png';
const outputPath = './src/assets/images/logoAe_transparent.png';

console.log('Şəkil işlənir...');

sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    const { width, height, channels } = info;
    
    // Hər pikseli yoxla və ağ arxa planı şəffaf et
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Ağ və ya açıq rəngli pikselləri şəffaf et
      if (r > 200 && g > 200 && b > 200) {
        data[i + 3] = 0; // Alpha kanalı 0 et (şəffaf)
      }
    }
    
    // Yeni şəkli yarat
    return sharp(data, {
      raw: {
        width,
        height,
        channels
      }
    })
    .png()
    .toFile(outputPath);
  })
  .then(() => {
    console.log('✅ Şəffaf logo yaradıldı!');
    
    // Köhnəsini sil və yenisini adlandır
    fs.unlinkSync(inputPath);
    fs.renameSync(outputPath, inputPath);
    console.log('✅ logoAe.png indi şəffafdır!');
  })
  .catch(err => {
    console.error('❌ Xəta:', err.message);
  });
