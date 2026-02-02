/**
 * Compresses an image data URL or File to a specific size/quality
 * Default limits are set for 300 DPI at 8.5" x 11" (approx 2550 x 3300)
 */
export async function compressImage(dataUrl: string, maxWidth = 2550, maxHeight = 3300, quality = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Maintain aspect ratio
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Convert to JPEG with quality compression (much smaller than PNG for photos/drawings)
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image for compression'));
        img.src = dataUrl;
    });
}
