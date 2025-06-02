const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Ensure directories exist
async function ensureDir(dirPath) {
    try {
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`Directory created: ${dirPath}`);
    } catch (error) {
        if (error.code !== 'EEXIST') {
            console.error(`Error creating directory ${dirPath}:`, error);
            throw error;
        }
        console.log(`Directory exists: ${dirPath}`);
    }
}

// Generate SVG logo
const generateSVGLogo = () => {
    return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="256" cy="256" r="240" fill="url(#gradient)" stroke="#1e40af" stroke-width="8"/>
  
  <!-- Gradient Definition -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="50%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
    <linearGradient id="whiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff"/>
      <stop offset="100%" style="stop-color:#f8fafc"/>
    </linearGradient>
  </defs>
  
  <!-- Image Icon -->
  <rect x="140" y="140" width="232" height="160" rx="16" fill="url(#whiteGrad)" stroke="#1e40af" stroke-width="4"/>
  
  <!-- Image Placeholder -->
  <rect x="160" y="160" width="192" height="120" rx="8" fill="#e2e8f0"/>
  
  <!-- Mountain Shape -->
  <polygon points="160,260 200,220 240,240 280,200 320,220 352,280" fill="#94a3b8"/>
  
  <!-- Sun -->
  <circle cx="200" cy="190" r="12" fill="#fbbf24"/>
  
  <!-- Picture Frame -->
  <text x="256" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#1e40af">Picser</text>
</svg>`;
};

// Generate Open Graph SVG
const generateOGSVG = () => {
    return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)"/>
  
  <!-- Gradient Definition -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af"/>
      <stop offset="50%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#6366f1"/>
    </linearGradient>
    <linearGradient id="whiteGradOG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff"/>
      <stop offset="100%" style="stop-color:#f8fafc"/>
    </linearGradient>
  </defs>
  
  <!-- Main Content -->
  <text x="600" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white">Picser</text>
  <text x="600" y="260" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="white" opacity="0.9">Free Image Hosting</text>
  <text x="600" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="white" opacity="0.8">Upload images up to 100MB with GitHub integration</text>
  
  <!-- Decorative Image Icon -->
  <rect x="450" y="380" width="300" height="180" rx="20" fill="url(#whiteGradOG)" stroke="white" stroke-width="4" opacity="0.9"/>
  <rect x="470" y="400" width="260" height="140" rx="12" fill="#e2e8f0"/>
  <polygon points="470,520 520,470 580,500 640,450 700,480 730,540" fill="#94a3b8"/>
  <circle cx="520" cy="440" r="16" fill="#fbbf24"/>
</svg>`;
};

// Generate all assets
async function generateAssets() {
    const publicDir = path.join(__dirname, '..', 'public');
    const iconsDir = path.join(publicDir, 'icons');
    const ogDir = path.join(publicDir, 'og');

    console.log('Starting asset generation...');
    console.log('Public directory:', publicDir);
    console.log('Icons directory:', iconsDir);
    console.log('OG directory:', ogDir);

    try {
        // Ensure directories exist
        await ensureDir(iconsDir);
        await ensureDir(ogDir);

        // Generate SVG logo
        console.log('Generating SVG logo...');
        const svgLogo = generateSVGLogo();
        await fs.writeFile(path.join(publicDir, 'logo.svg'), svgLogo);
        console.log('SVG logo created successfully');

        // Generate OG image SVG
        console.log('Generating OG SVG...');
        const ogSVG = generateOGSVG();
        await fs.writeFile(path.join(ogDir, 'og-image.svg'), ogSVG);
        console.log('OG SVG created successfully');

        // Convert SVG to PNG for different sizes
        const svgBuffer = Buffer.from(svgLogo);

        // Favicon sizes
        const faviconSizes = [16, 32, 48, 64, 96, 128, 256, 512];
        console.log('Generating favicons...');

        for (const size of faviconSizes) {
            console.log(`Generating ${size}x${size} favicon...`);
            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(path.join(iconsDir, `favicon-${size}x${size}.png`));
        }

        // Generate main favicon.ico (using 32x32)
        console.log('Generating favicon.ico...');
        await sharp(svgBuffer)
            .resize(32, 32)
            .png()
            .toFile(path.join(publicDir, 'favicon.ico'));

        // Apple Touch Icons
        console.log('Generating Apple Touch Icons...');
        const appleSizes = [57, 60, 72, 76, 114, 120, 144, 152, 180];
        for (const size of appleSizes) {
            console.log(`Generating Apple Touch Icon ${size}x${size}...`);
            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(path.join(iconsDir, `apple-touch-icon-${size}x${size}.png`));
        }

        // Android Chrome Icons
        console.log('Generating Android Chrome Icons...');
        const androidSizes = [36, 48, 72, 96, 144, 192, 256, 384, 512];
        for (const size of androidSizes) {
            console.log(`Generating Android Chrome Icon ${size}x${size}...`);
            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(path.join(iconsDir, `android-chrome-${size}x${size}.png`));
        }

        // PWA Icons
        console.log('Generating PWA Icons...');
        await sharp(svgBuffer)
            .resize(192, 192)
            .png()
            .toFile(path.join(iconsDir, 'pwa-192x192.png'));

        await sharp(svgBuffer)
            .resize(512, 512)
            .png()
            .toFile(path.join(iconsDir, 'pwa-512x512.png'));

        // Generate OG images
        console.log('Generating Open Graph images...');
        const ogSVGBuffer = Buffer.from(ogSVG);

        // Standard OG image (1200x630)
        await sharp(ogSVGBuffer)
            .resize(1200, 630)
            .png()
            .toFile(path.join(ogDir, 'og-image.png'));

        // Twitter Card (1200x600)
        await sharp(ogSVGBuffer)
            .resize(1200, 600)
            .png()
            .toFile(path.join(ogDir, 'twitter-card.png'));

        // Square OG image for some platforms (1200x1200)
        await sharp(svgBuffer)
            .resize(1200, 1200)
            .png()
            .toFile(path.join(ogDir, 'og-square.png'));

        console.log('✅ All assets generated successfully!');
        console.log('\nGenerated files:');
        console.log('- Logo: public/logo.svg');
        console.log('- Favicon: public/favicon.ico');
        console.log('- Icons: public/icons/ (multiple sizes)');
        console.log('- Open Graph: public/og/ (multiple formats)');

    } catch (error) {
        console.error('❌ Error generating assets:', error);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    generateAssets().catch(console.error);
}

module.exports = { generateAssets };
