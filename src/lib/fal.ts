export interface FalSeedreamPayload {
  prompt: string;
  image_urls: string[];
  size?: "1024x1024" | "1280x720" | "2048x2048";
  seed?: number;
  strength?: number;
  guidance?: number;
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

    console.log('Sending payload to FAL AI:', {
      prompt: payload.prompt,
      image_urls: payload.image_urls,
      image_count: payload.image_urls.length,
      image_size: imageSize,
      seed: payload.seed,
      strength: payload.strength,
      guidance: payload.guidance
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
        guidance: payload.guidance
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
TASK: Transform and edit all ${imageCount} uploaded images according to the following detailed instructions.

USER REQUEST: ${userPrompt}

REQUIREMENTS:
- Apply the requested changes consistently across all ${imageCount} images
- Maintain high image quality and professional appearance
- Preserve the original composition and important elements unless specifically requested to change
- Ensure realistic lighting, shadows, and proportions
- Keep the same aspect ratio and resolution as the original images
- Make the changes look natural and seamless
- Pay attention to details like textures, colors, and materials
- If adding objects or elements, integrate them naturally into the scene
- Maintain visual coherence between all processed images

STYLE: Photorealistic, high-quality, professional result that looks natural and believable.

Please execute this transformation with precision and attention to detail.
  `.trim();
  
  return enhancedPrompt;
}

export function generateCompetitorReplacePrompt(addonPrompt?: string): string {
  const basePrompt = `
TASK: Replace the competitor product in the reference images with our product while maintaining professional advertising quality.

CORE REQUIREMENTS:
- Seamlessly replace the competitor product with our product
- Maintain the exact same style, lighting, and composition as the original
- Preserve the background, setting, and overall scene atmosphere
- Ensure our product fits naturally in the scene with proper scale and positioning
- Match the lighting direction, intensity, and color temperature
- Maintain realistic shadows, reflections, and depth of field
- Keep the same camera angle and perspective
- Preserve any text, logos, or branding elements that should remain
- Ensure the final result looks like a professional product photograph

QUALITY STANDARDS:
- Photorealistic, high-resolution output
- Professional advertising photography quality
- Natural integration without obvious editing artifacts
- Consistent visual style across all processed images
- Sharp details and proper focus
- Accurate colors and materials representation

STYLE: Professional product photography, commercial advertising quality, photorealistic.
  `.trim();
  
  if (addonPrompt) {
    return `${basePrompt}\n\nADDITIONAL REQUIREMENTS: ${addonPrompt}`;
  }
  
  return basePrompt;
}