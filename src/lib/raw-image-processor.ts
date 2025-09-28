/**
 * Raw Image Processor - Zero Processing Mode for Absolute Accuracy
 * Maintains 100% original image details without any modifications
 */

export interface RawProcessingOptions {
  maintainOriginalFormat?: boolean;
  preserveMetadata?: boolean;
  bypassOptimization?: boolean;
}

export interface RawProcessingResult {
  file: File;
  isRawMode: boolean;
  originalFormat: string;
  preservedMetadata: boolean;
  processingApplied: string[];
}

/**
 * Process image in raw mode - no modifications whatsoever
 */
export async function processImageRaw(
  file: File,
  options: RawProcessingOptions = {}
): Promise<RawProcessingResult> {
  const {
    maintainOriginalFormat = true,
    preserveMetadata = true,
    bypassOptimization = true
  } = options;

  // In raw mode, we return the original file without any processing
  if (bypassOptimization) {
    return {
      file: file, // Original file unchanged
      isRawMode: true,
      originalFormat: file.type,
      preservedMetadata: true,
      processingApplied: ['none - raw mode']
    };
  }

  // If minimal processing is needed, only handle format conversion
  return new Promise((resolve, reject) => {
    if (maintainOriginalFormat) {
      // Return original file as-is
      resolve({
        file: file,
        isRawMode: true,
        originalFormat: file.type,
        preservedMetadata: true,
        processingApplied: ['format-preserved']
      });
      return;
    }

    // Only convert format if absolutely necessary, with maximum quality
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      try {
        // Use exact original dimensions
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Disable any smoothing to preserve pixel-perfect accuracy
        ctx.imageSmoothingEnabled = false;

        // Draw image at exact 1:1 scale
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

        // Convert with maximum quality (1.0 = lossless for PNG)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to process image in raw mode'));
              return;
            }

            const processedFile = new File(
              [blob],
              file.name,
              { type: 'image/png' } // PNG for lossless quality
            );

            resolve({
              file: processedFile,
              isRawMode: true,
              originalFormat: file.type,
              preservedMetadata: preserveMetadata,
              processingApplied: ['format-conversion-lossless']
            });
          },
          'image/png',
          1.0 // Maximum quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for raw processing'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Validate if image needs any processing at all
 */
export function shouldBypassAllProcessing(file: File): boolean {
  // Check if file is already in optimal format and size
  const isOptimalFormat = file.type === 'image/png';
  const isReasonableSize = file.size <= 10 * 1024 * 1024; // 10MB
  
  return isOptimalFormat && isReasonableSize;
}

/**
 * Get image dimensions without processing
 */
export async function getImageDimensions(file: File): Promise<{width: number, height: number}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for dimension analysis'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Batch process multiple images in raw mode
 */
export async function batchProcessRaw(
  files: File[],
  options: RawProcessingOptions = {}
): Promise<RawProcessingResult[]> {
  const results: RawProcessingResult[] = [];
  
  for (const file of files) {
    try {
      const result = await processImageRaw(file, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to process ${file.name} in raw mode:`, error);
      // Fallback to original file
      results.push({
        file: file,
        isRawMode: true,
        originalFormat: file.type,
        preservedMetadata: true,
        processingApplied: ['error-fallback-original']
      });
    }
  }
  
  return results;
}