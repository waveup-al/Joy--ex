export interface FalSeedreamPayload {
  prompt: string;
  image_urls: string[];
  size?: "1024x1024" | "1280x720" | "2048x2048" | "2560x1440" | "3072x3072" | "4096x4096";
  seed?: number;
  strength?: number;
  guidance?: number;
  num_inference_steps?: number;
  enable_safety_checker?: boolean;
  format?: string;
  quality?: number;
  // Thêm các tham số chuyên gia 2025
  scheduler?: string;
  cfg_scale?: number;
  clip_skip?: number;
  eta?: number;
  lossless?: boolean;
  output_format?: string;
}

export interface FalSeedreamResponse {
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  request_id?: string;
  timings?: {
    inference: number;
  };
}

// Mock function for demo purposes
async function mockFalSeedreamEdit(payload: FalSeedreamPayload): Promise<FalSeedreamResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
  
  // Parse size parameter to get width and height
  const size = payload.size || "1024x1024";
  const [width, height] = size.split('x').map(Number);
  
  // Return mock result with placeholder images using correct dimensions
  const imageCount = payload.image_urls.length;
  const mockImages = Array.from({ length: imageCount }, (_, index) => ({
    url: `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000) + index}`,
    width: width,
    height: height,
  }));

  return {
    images: mockImages,
    request_id: `mock_${Math.random().toString(36).substr(2, 9)}`,
    timings: {
      inference: 2.5 + Math.random() * 2
    }
  };
}

export async function falSeedreamEdit(payload: FalSeedreamPayload): Promise<FalSeedreamResponse> {
  const falKey = process.env.FAL_KEY;
  
  try {
    // If no FAL key is set, use demo mode
    if (!falKey || falKey === 'demo-key-for-testing') {
      console.log('Using demo mode for FAL API - no valid key found');
      return await mockFalSeedreamEdit(payload);
    }

    console.log('Using real FAL API with key:', falKey.substring(0, 8) + '...');
    // Convert size to proper image_size format
    let imageSize;
    if (payload.size) {
      const [width, height] = payload.size.split('x').map(Number);
      imageSize = { width, height };
    } else {
      imageSize = { width: 1024, height: 1024 };
    }

    console.log('Calling FAL API with ULTRA HIGH-QUALITY settings (Professional 2025):', {
      prompt_length: payload.prompt.length,
      image_count: payload.image_urls.length,
      size: imageSize,
      seed: payload.seed,
      strength: payload.strength,
      guidance: payload.guidance,
      num_inference_steps: 100, // Tăng từ 75 lên 100 để đạt chất lượng tối đa như chuyên gia 2025
      enable_safety_checker: false, // Tắt safety checker để tránh làm giảm chất lượng
      format: "png", // PNG format để giữ chất lượng lossless 1MB+
      quality: 100, // Maximum quality 100%
      output_format: "png", // Đảm bảo output format là PNG
      lossless: true // Thêm tham số lossless compression
    });

    // Try to use real FAL API
    const res = await fetch("https://fal.run/fal-ai/bytedance/seedream/v4/edit", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: payload.prompt,
        image_urls: payload.image_urls,
        image_size: imageSize,
        seed: payload.seed,
        strength: payload.strength,
        guidance: payload.guidance,
        num_inference_steps: 100, // Tăng từ 75 lên 100 để đạt chất lượng tối đa như chuyên gia 2025
        enable_safety_checker: false, // Tắt safety checker
        format: "png", // PNG format để giữ chất lượng lossless 1MB+
        quality: 100, // Maximum quality 100%
        output_format: "png", // Đảm bảo output format là PNG
        lossless: true, // Thêm tham số lossless compression
        // Thêm các tham số chuyên gia 2025 cho chất lượng tối đa
        scheduler: "dpm_solver_multistep", // Scheduler tốt nhất cho chất lượng
        cfg_scale: payload.guidance || 7.5, // CFG scale tối ưu
        clip_skip: 1, // CLIP skip tối ưu cho detail
        eta: 0.0 // Deterministic sampling cho consistency
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`FAL API Error ${res.status}: ${errorText}`);
      throw new Error(`FAL API Error: ${res.status} - ${errorText}`);
    }

    const result = await res.json();
    console.log('FAL AI response received:', {
      images_count: result.images?.length,
      request_id: result.request_id,
      actual_image_dimensions: result.images?.map((img: { url: string; width: number; height: number }) => ({
        width: img.width,
        height: img.height,
        url_preview: img.url?.substring(0, 50) + '...'
      }))
    });
    
    return result;
  } catch (error) {
    console.error('FAL API error:', error);
    // Only fallback to demo mode if there's no API key
    if (!falKey || falKey === 'demo-key-for-testing') {
      console.log('Falling back to demo mode due to missing API key');
      return await mockFalSeedreamEdit(payload);
    }
    // If we have a key but there's an error, throw it
    throw error;
  }
}

// Helper function to validate image URLs
export function validateImageUrls(urls: string[]): boolean {
  return urls.every(url => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  });
}

export function generateMultiImagePrompt(userPrompt: string, imageCount: number): string {
  // Enhanced prompt with more specific instructions for better AI understanding
  const enhancedPrompt = `
TASK: Transform and edit all ${imageCount} uploaded images according to the following detailed instructions with ULTRA MAXIMUM QUALITY and PRECISION (Professional 2025 Standards).

USER REQUEST: ${userPrompt}

🎯 ULTRA HIGH-QUALITY REQUIREMENTS (2025 Professional Standards):
- Generate images at MAXIMUM possible resolution and quality (1MB+ file size target)
- Maintain PERFECT detail preservation from original images with ZERO quality loss
- Use MAXIMUM inference steps (100+) for absolute best quality
- Apply changes with PHOTOREALISTIC precision and professional studio quality
- Preserve ALL fine details, textures, micro-details, and subtle elements
- Ensure ULTRA-CRISP, RAZOR-SHARP output with professional-grade clarity
- Maintain original image fidelity at 100% where not modified
- Target output file size: 1MB+ for maximum quality retention
- Use lossless PNG format for zero compression artifacts

🔧 TECHNICAL REQUIREMENTS (Expert Level 2025):
- Apply the requested changes consistently across all ${imageCount} images
- Maintain ultra-high image quality and professional studio appearance
- Preserve the original composition and important elements unless specifically requested to change
- Ensure realistic lighting, shadows, and proportions with professional accuracy
- Keep the same aspect ratio and resolution as the original images (or higher)
- Make the changes look natural and seamless with expert-level blending
- Pay attention to micro-details like textures, colors, materials, and surface properties
- If adding objects or elements, integrate them naturally with professional compositing
- Maintain visual coherence between all processed images
- Ensure maximum detail retention and sharpness throughout the process

STYLE: Ultra-photorealistic, MAXIMUM QUALITY (1MB+ target), professional studio result that looks natural and believable with ABSOLUTE MAXIMUM detail preservation and professional 2025 standards.

Please execute this transformation with MAXIMUM precision and attention to detail.
  `.trim();
  
  return enhancedPrompt;
}

export function generateCompetitorReplacePrompt(addonPrompt?: string): string {
  const basePrompt = `
TASK: Replace the competitor product in the reference images with our product while maintaining ULTRA MAXIMUM QUALITY and PROFESSIONAL advertising standards (2025 Expert Level).

🎯 ULTRA HIGH-QUALITY REQUIREMENTS (2025 Professional Standards):
- Generate images at MAXIMUM possible resolution and quality (1MB+ file size target)
- Maintain PERFECT detail preservation from original images with ZERO quality loss
- Use MAXIMUM inference steps (100+) for absolute best quality
- Apply changes with PHOTOREALISTIC precision and professional studio quality
- Preserve ALL fine details, textures, micro-details, and subtle elements
- Ensure ULTRA-CRISP, RAZOR-SHARP output with professional-grade clarity
- Maintain original image fidelity at 100% where not modified
- Target output file size: 1MB+ for maximum quality retention
- Use lossless PNG format for zero compression artifacts

🔧 CORE REQUIREMENTS (Expert Level 2025):
- Seamlessly replace the competitor product with our product using professional compositing
- Maintain the exact same style, lighting, and composition as the original with pixel-perfect accuracy
- Preserve the background, setting, and overall scene atmosphere with maximum fidelity
- Ensure our product fits naturally in the scene with proper scale and positioning
- Match the lighting direction, intensity, and color temperature with professional precision
- Maintain realistic shadows, reflections, and depth of field with studio-quality accuracy
- Keep the same camera angle and perspective with exact positioning
- Preserve any text, logos, or branding elements that should remain
- Ensure the final result looks like a professional product photograph with commercial quality

🏆 QUALITY STANDARDS (Professional 2025):
- Ultra-photorealistic, MAXIMUM RESOLUTION output (1MB+ target)
- Professional advertising photography quality with studio-grade results
- Natural integration without obvious editing artifacts or quality loss
- Consistent visual style across all processed images
- Razor-sharp details and perfect focus with professional clarity
- Accurate colors and materials representation with color-grading quality
- Professional lighting and shadow work with studio-quality results

STYLE: Professional product photography, commercial advertising quality, ultra-photorealistic with ABSOLUTE MAXIMUM detail preservation and professional 2025 standards (1MB+ target).
  `.trim();
  
  if (addonPrompt) {
    return `${basePrompt}\n\nADDITIONAL REQUIREMENTS: ${addonPrompt}`;
  }
  
  return basePrompt;
}