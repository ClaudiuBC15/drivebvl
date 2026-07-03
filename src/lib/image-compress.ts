/**
 * Compresses an image file and converts it to WebP format on the client side.
 * @param file The original image file.
 * @param quality Compression quality from 0.0 to 1.0 (default is 0.82).
 * @param maxWidth Max width of the image (default is 1200px).
 */
export async function compressAndConvertToWebP(
  file: File,
  quality = 0.82,
  maxWidth = 1200
): Promise<File> {
  // If it's not an image, return it as-is
  if (!file.type.startsWith('image/')) {
    return file;
  }
  
  // If it's already WebP and is relatively small (e.g. < 200KB), return it as-is
  if (file.type === 'image/webp' && file.size < 200 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if it exceeds maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas contents to WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas conversion to blob failed'));
              return;
            }
            // Replace the extension with .webp
            const newFilename = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const newFile = new File([blob], newFilename, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(newFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image in browser'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
