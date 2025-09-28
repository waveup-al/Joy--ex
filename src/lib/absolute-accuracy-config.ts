/**
 * Absolute Accuracy Configuration
 * Cấu hình để đạt độ chính xác tuyệt đối 100% từ ảnh đầu vào
 */

export interface AbsoluteAccuracyConfig {
  // FAL API Parameters for maximum accuracy
  falApi: {
    strength: number;           // Mức độ thay đổi ảnh gốc (càng thấp càng giữ nguyên)
    guidance: number;           // Hướng dẫn AI
    guidance_scale: number;     // Tỷ lệ hướng dẫn
    num_inference_steps: number; // Số bước xử lý (càng cao càng chính xác)
    enable_safety_checker: boolean;
  };
  
  // Image Processing Settings
  imageProcessing: {
    bypassOptimization: boolean;    // Bỏ qua tối ưu hóa
    maintainOriginalFormat: boolean; // Giữ nguyên định dạng gốc
    preserveMetadata: boolean;      // Giữ nguyên metadata
    disableEnhancements: boolean;   // Tắt các cải tiến ảnh
    useRawMode: boolean;           // Sử dụng chế độ raw
  };
  
  // Quality Thresholds
  qualityThresholds: {
    minFileSize: number;        // Kích thước file tối thiểu để xử lý
    maxDimensions: number;      // Kích thước tối đa (0 = không giới hạn)
    qualityScore: number;       // Điểm chất lượng tối thiểu
  };
}

// Default configuration for absolute accuracy
export const ABSOLUTE_ACCURACY_CONFIG: AbsoluteAccuracyConfig = {
  falApi: {
    strength: 0.15,              // Cực kỳ thấp để giữ nguyên 85% ảnh gốc
    guidance: 7.0,               // Cân bằng giữa chất lượng và độ chính xác
    guidance_scale: 7.0,
    num_inference_steps: 150,    // Tối đa để đạt chất lượng cao nhất
    enable_safety_checker: true
  },
  
  imageProcessing: {
    bypassOptimization: true,    // Bỏ qua mọi tối ưu hóa
    maintainOriginalFormat: true, // Giữ nguyên định dạng gốc
    preserveMetadata: true,      // Giữ nguyên metadata
    disableEnhancements: true,   // Tắt contrast, sharpen, v.v.
    useRawMode: true            // Sử dụng chế độ raw processing
  },
  
  qualityThresholds: {
    minFileSize: 50 * 1024,     // 50KB - chỉ xử lý file đủ lớn
    maxDimensions: 0,           // Không giới hạn kích thước
    qualityScore: 0.95          // Điểm chất lượng tối thiểu 95%
  }
};

// Ultra-conservative mode for critical accuracy requirements
export const ULTRA_CONSERVATIVE_CONFIG: AbsoluteAccuracyConfig = {
  falApi: {
    strength: 0.1,               // Chỉ thay đổi 10% ảnh gốc
    guidance: 6.0,               // Thấp hơn để tránh over-processing
    guidance_scale: 6.0,
    num_inference_steps: 200,    // Tối đa tuyệt đối
    enable_safety_checker: true
  },
  
  imageProcessing: {
    bypassOptimization: true,
    maintainOriginalFormat: true,
    preserveMetadata: true,
    disableEnhancements: true,
    useRawMode: true
  },
  
  qualityThresholds: {
    minFileSize: 100 * 1024,    // 100KB
    maxDimensions: 0,
    qualityScore: 0.98          // 98% chất lượng tối thiểu
  }
};

// Function to get config based on accuracy requirement
export function getAccuracyConfig(mode: 'absolute' | 'ultra-conservative' = 'absolute'): AbsoluteAccuracyConfig {
  return mode === 'ultra-conservative' ? ULTRA_CONSERVATIVE_CONFIG : ABSOLUTE_ACCURACY_CONFIG;
}

// Validation function to ensure config meets accuracy requirements
export function validateAccuracyConfig(config: AbsoluteAccuracyConfig): boolean {
  const checks = [
    config.falApi.strength <= 0.2,           // Strength phải <= 20%
    config.falApi.num_inference_steps >= 100, // Ít nhất 100 steps
    config.imageProcessing.useRawMode === true, // Phải dùng raw mode
    config.qualityThresholds.qualityScore >= 0.9 // Chất lượng >= 90%
  ];
  
  return checks.every(check => check);
}