/**
 * Image optimization utilities for better AI processing quality
 * Optimizes images before upload to improve FAL API results
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  maintainAspectRatio?: boolean;
  enhanceContrast?: boolean;
  sharpen?: boolean;
}

export interface OptimizedImageResult {
  file: File;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  dimensions: {
    width: number;
    height: number;
  };
}

/**
 * Optimizes an image file for better AI processing
 */
export async function optimizeImageForAI(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImageResult> {
  const {
    maxWidth = 2048,
    maxHeight = 2048,
    quality = 0.92, // High quality for AI processing
    format = 'jpeg',
    maintainAspectRatio = true,
    enhanceContrast = true,
    sharpen = true
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      try {
        // Calculate optimal dimensions
        let { width, height } = calculateOptimalDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight,
          maintainAspectRatio
        );

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Enable high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image with high quality
        ctx.drawImage(img, 0, 0, width, height);

        // Apply image enhancements for better AI processing
        if (enhanceContrast || sharpen) {
          applyImageEnhancements(ctx, width, height, {
            enhanceContrast,
            sharpen
          });
        }

        // Convert to optimized format
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to optimize image'));
              return;
            }

            const optimizedFile = new File(
              [blob],
              `optimized_${file.name}`,
              { type: `image/${format}` }
            );

            const result: OptimizedImageResult = {
              file: optimizedFile,
              originalSize: file.size,
              optimizedSize: blob.size,
              compressionRatio: Math.round((1 - blob.size / file.size) * 100),
              dimensions: { width, height }
            };

            resolve(result);
          },
          `image/${format}`,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load image
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 */
function calculateOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  maintainAspectRatio: boolean
): { width: number; height: number } {
  if (!maintainAspectRatio) {
    return {
      width: Math.min(originalWidth, maxWidth),
      height: Math.min(originalHeight, maxHeight)
    };
  }

  const aspectRatio = originalWidth / originalHeight;
  
  let width = originalWidth;
  let height = originalHeight;

  // Scale down if needed
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  // Ensure dimensions are even numbers for better compression
  width = Math.floor(width / 2) * 2;
  height = Math.floor(height / 2) * 2;

  return { width, height };
}

/**
 * Apply image enhancements for better AI processing
 */
function applyImageEnhancements(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: { enhanceContrast: boolean; sharpen: boolean }
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  if (options.enhanceContrast) {
    // Apply contrast enhancement
    const contrast = 1.1; // Slight contrast boost
    const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128)); // Red
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128)); // Green
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128)); // Blue
    }
  }

  if (options.sharpen) {
    // Apply subtle sharpening filter
    const sharpenKernel = [
      0, -0.2, 0,
      -0.2, 1.8, -0.2,
      0, -0.2, 0
    ];
    
    applySharpenFilter(data, width, height, sharpenKernel);
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Apply sharpening filter to image data
 */
function applySharpenFilter(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  kernel: number[]
) {
  const output = new Uint8ClampedArray(data);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) { // RGB channels only
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            sum += data[idx] * kernel[kernelIdx];
          }
        }
        const outputIdx = (y * width + x) * 4 + c;
        output[outputIdx] = Math.min(255, Math.max(0, sum));
      }
    }
  }
  
  // Copy the processed data back
  for (let i = 0; i < data.length; i++) {
    data[i] = output[i];
  }
}

/**
 * Batch optimize multiple images
 */
export async function optimizeImagesForAI(
  files: File[],
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImageResult[]> {
  const results = await Promise.all(
    files.map(file => optimizeImageForAI(file, options))
  );
  
  return results;
}

/**
 * Validate image quality and provide recommendations
 */
export function analyzeImageQuality(file: File): Promise<{
  isOptimal: boolean;
  recommendations: string[];
  score: number;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const recommendations: string[] = [];
      let score = 100;

      // Check resolution
      if (img.width < 512 || img.height < 512) {
        recommendations.push('Image resolution is too low. Recommend at least 512x512 pixels.');
        score -= 30;
      }

      if (img.width > 4096 || img.height > 4096) {
        recommendations.push('Image resolution is very high. Consider resizing to 2048x2048 for optimal processing speed.');
        score -= 10;
      }

      // Check file size
      if (file.size > 10 * 1024 * 1024) { // 10MB
        recommendations.push('File size is large. Consider compression to improve upload speed.');
        score -= 15;
      }

      // Check aspect ratio
      const aspectRatio = img.width / img.height;
      if (aspectRatio > 3 || aspectRatio < 0.33) {
        recommendations.push('Extreme aspect ratio detected. Square or near-square images work best for AI processing.');
        score -= 20;
      }

      resolve({
        isOptimal: score >= 80,
        recommendations,
        score: Math.max(0, score)
      });
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}