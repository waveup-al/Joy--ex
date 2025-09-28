import { getAccuracyConfig, validateAccuracyConfig } from './absolute-accuracy-config'

export interface FalSeedreamPayload {
  prompt: string;
  image_urls: string[];
  size?: "1024x1024" | "1280x720" | "2048x2048";
  seed?: number;
  strength?: number;
  guidance?: number;
  // Advanced quality parameters
  guidance_scale?: number;
  num_inference_steps?: number;
  enable_safety_checker?: boolean;
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

    // Get absolute accuracy configuration
    const accuracyConfig = getAccuracyConfig('ultra-conservative');
    
    // Validate configuration meets accuracy requirements
    if (!validateAccuracyConfig(accuracyConfig)) {
      console.warn('Accuracy configuration does not meet requirements, using fallback');
    }

    // Apply ultra-conservative parameters for absolute accuracy
    const optimizedPayload = {
      prompt: payload.prompt,
      image_urls: payload.image_urls,
      image_size: imageSize,
      seed: payload.seed,
      // Ultra-conservative strength for maximum original image preservation
      strength: payload.strength ?? accuracyConfig.falApi.strength,
      // Optimized guidance for better prompt adherence
      guidance: payload.guidance ?? accuracyConfig.falApi.guidance,
      // Advanced parameters for maximum quality
      guidance_scale: payload.guidance_scale ?? accuracyConfig.falApi.guidance_scale,
      // Maximum inference steps for absolute quality
      num_inference_steps: payload.num_inference_steps ?? accuracyConfig.falApi.num_inference_steps,
      enable_safety_checker: payload.enable_safety_checker ?? accuracyConfig.falApi.enable_safety_checker
    };

    console.log('🎯 Ultra-Conservative Mode Activated:', {
      strength: `${optimizedPayload.strength} (preserves ${(1-optimizedPayload.strength)*100}% of original)`,
      inference_steps: optimizedPayload.num_inference_steps,
      guidance: optimizedPayload.guidance,
      mode: 'absolute-accuracy'
    });

    // Processing callback for absolute accuracy mode
    const onQueueUpdate = (update: any) => {
      if (update.status === "IN_PROGRESS") {
        console.log("🔄 Processing with absolute accuracy mode...", update.logs?.map((log: any) => log.message))
      }
    };

    console.log('Sending optimized payload to FAL AI:', optimizedPayload);

    // Try to use real FAL API
    const res = await fetch("https://fal.run/fal-ai/bytedance/seedream/v4/edit", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(optimizedPayload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`FAL API Error ${res.status}: ${errorText}`);
      throw new Error(`FAL API Error: ${res.status} - ${errorText}`);
    }

    const result = await res.json();
    
    console.log('✅ Absolute accuracy processing completed:', {
      originalStrength: payload.strength,
      appliedStrength: optimizedPayload.strength,
      preservationRate: `${(1-optimizedPayload.strength)*100}%`,
      inferenceSteps: optimizedPayload.num_inference_steps
    });
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

export function generateMultiImagePrompt(userInstruction: string): string {
  // Enhanced prompt engineering for better accuracy and quality
  const basePrompt = `Professional high-quality image transformation: ${userInstruction}. 

QUALITY REQUIREMENTS:
- Ultra-high resolution and sharp details
- Photorealistic rendering with perfect lighting
- Maintain original composition and perspective
- Preserve all important visual elements
- Professional photography quality
- Natural color grading and contrast
- Crisp edges and fine textures

TECHNICAL SPECIFICATIONS:
- 4K resolution quality
- Professional color accuracy
- Optimal exposure and dynamic range
- No artifacts or distortions
- Seamless integration of changes

Style: Professional photography, commercial quality, studio lighting, perfect composition, award-winning image quality.`;

  return basePrompt;
}

export function generateCompetitorReplacePrompt(userInstruction: string): string {
  // Enhanced prompt for competitor replacement with quality focus
  const basePrompt = `Professional product replacement and brand transformation: ${userInstruction}

REPLACEMENT REQUIREMENTS:
- Seamlessly replace competitor products with specified alternatives
- Maintain exact positioning, scale, and perspective
- Perfect lighting and shadow matching
- Natural integration with existing environment
- Preserve all background elements and context
- Professional product photography quality

QUALITY STANDARDS:
- Ultra-high resolution commercial photography
- Perfect color matching and consistency  
- Realistic material textures and finishes
- Professional studio lighting simulation
- No visible editing artifacts or seams
- Photorealistic product rendering
- Commercial advertising quality output

TECHNICAL PRECISION:
- Exact dimensional accuracy
- Proper perspective and depth
- Natural shadow casting and reflections
- Consistent lighting direction and intensity
- Professional color grading
- Sharp focus and crisp details

Style: Commercial product photography, professional advertising quality, studio-perfect lighting, award-winning commercial imagery, photorealistic rendering.`;

  return basePrompt;
}