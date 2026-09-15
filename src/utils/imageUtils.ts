/**
 * Utility to process, normalize, and format images for the Gemini Multimodal API.
 * Ensures that:
 * 1. Image is converted to clean standard base64 (strictly without data URI prefixes or whitespace).
 * 2. Transparent backgrounds (common in SVGs and PNGs) are filled with white to prevent black artifacts.
 * 3. Dimensions are capped at 1200px max width/height to optimize payload size and response speed.
 * 4. SVG vectors and photos alike are reliably rasterized to high-quality image/jpeg or image/png.
 */
export async function normalizeImageForApi(sourceDataUrl: string): Promise<{
  base64: string;
  mimeType: string;
}> {
  // If the source is an SVG data URI or raw SVG, convert via Blob URL for high browser reliability
  let objectUrlToRevoke: string | null = null;
  let imageSource = sourceDataUrl;

  if (sourceDataUrl.startsWith('data:image/svg+xml') || sourceDataUrl.trim().startsWith('<svg')) {
    try {
      let svgText = sourceDataUrl;
      if (sourceDataUrl.startsWith('data:image/svg+xml;base64,')) {
        svgText = atob(sourceDataUrl.replace(/^data:image\/svg\+xml;base64,/, ''));
      } else if (sourceDataUrl.startsWith('data:image/svg+xml')) {
        const commaIndex = sourceDataUrl.indexOf(',');
        if (commaIndex !== -1) {
          svgText = decodeURIComponent(sourceDataUrl.slice(commaIndex + 1));
        }
      }
      const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      imageSource = URL.createObjectURL(blob);
      objectUrlToRevoke = imageSource;
    } catch {
      // Fallback to original if blob creation fails
      imageSource = sourceDataUrl;
    }
  }

  return new Promise((resolve) => {
    const cleanup = () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const maxDimension = 1200;
        let width = img.naturalWidth || img.width || 800;
        let height = img.naturalHeight || img.height || 800;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('No se pudo inicializar canvas 2D');
        }

        // Fill white background for transparent logos/SVGs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to high-quality JPEG
        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        const cleanBase64 = jpegDataUrl
          .replace(/^data:image\/jpeg;base64,/, '')
          .replace(/[\r\n\s]/g, '');

        cleanup();
        resolve({
          base64: cleanBase64,
          mimeType: 'image/jpeg',
        });
      } catch {
        cleanup();
        fallbackExtract();
      }
    };

    img.onerror = () => {
      cleanup();
      fallbackExtract();
    };

    function fallbackExtract() {
      // Direct regex extraction from data URI or raw base64
      let clean = sourceDataUrl;
      let detectedMime = 'image/jpeg';

      const dataUriMatch = sourceDataUrl.match(/^data:([^;,]+)(?:;[^;,]+)*;base64,(.+)$/s);
      if (dataUriMatch) {
        detectedMime = dataUriMatch[1];
        clean = dataUriMatch[2];
      } else {
        clean = sourceDataUrl.replace(/^data:[^,]+,/, '');
      }

      // Remove any whitespaces/carriage returns
      clean = clean.replace(/[\r\n\s]/g, '');

      // Normalize MIME type to JPEG or PNG
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(detectedMime)) {
        detectedMime = 'image/jpeg';
      }

      resolve({
        base64: clean,
        mimeType: detectedMime,
      });
    }

    img.src = imageSource;
  });
}
