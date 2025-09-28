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
      actual_image_dimensions: result.images?.map((img: any) => ({
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
  return `Apply the following transformation to all ${imageCount} images: ${userPrompt}. Maintain consistency across all images while preserving their individual characteristics.`;
}

export function generateCompetitorReplacePrompt(addonPrompt?: string): string {
  const basePrompt = "Replace the competitor product in the image with our product while maintaining the same style, lighting, and composition.";
  return addonPrompt ? `${basePrompt} Additional requirements: ${addonPrompt}` : basePrompt;
}