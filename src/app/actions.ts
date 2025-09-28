'use server'

import { falSeedreamEdit, FalSeedreamPayload, generateMultiImagePrompt, generateCompetitorReplacePrompt } from '@/lib/fal'
import { saveJobToHistory, Job } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export interface EditJobInput {
  mode: 'edit' | 'replace'
  prompt: string
  imageUrls: string[]
  userId: string
  size?: "1024x1024" | "1280x720" | "2048x2048" | "2560x1440" | "3072x3072" | "4096x4096"
  seed?: number
  strength?: number
  guidance?: number
  addonPrompt?: string // For Mode B
}

export interface EditJobResult {
  success: boolean
  data?: {
    images: Array<{
      url: string
      width: number
      height: number
    }>
    jobId: string
  }
  error?: string
}

export async function startEditJob(input: EditJobInput): Promise<EditJobResult> {
  try {
    // Validate inputs
    if (!input.imageUrls || input.imageUrls.length === 0) {
      return { success: false, error: 'At least one image is required' }
    }

    if (!input.prompt.trim()) {
      return { success: false, error: 'Prompt is required' }
    }

    // Generate appropriate prompt based on mode
    let finalPrompt: string
    if (input.mode === 'edit') {
      finalPrompt = generateMultiImagePrompt(input.prompt, input.imageUrls.length)
    } else {
      // Mode B: Competitor Style Replace
      if (input.imageUrls.length < 2) {
        return { success: false, error: 'Competitor replace mode requires at least 2 images' }
      }
      finalPrompt = generateCompetitorReplacePrompt(input.addonPrompt)
    }

    // Prepare FAL API payload
    const falPayload: FalSeedreamPayload = {
      prompt: finalPrompt,
      image_urls: input.imageUrls,
      size: input.size,
      seed: input.seed,
      strength: input.strength,
      guidance: input.guidance
    }

    // Call FAL API
    const result = await falSeedreamEdit(falPayload)

    // Save to database
    const jobData: Omit<Job, 'id' | 'created_at'> = {
      user_id: input.userId,
      mode: input.mode,
      prompt: input.prompt,
      images: input.imageUrls,
      output_url: result.images[0]?.url || undefined,
      meta: {
        originalPrompt: input.prompt,
        finalPrompt,
        falResponse: result,
        parameters: {
          size: input.size,
          seed: input.seed,
          strength: input.strength,
          guidance: input.guidance
        }
      }
    }

    const savedJob = await saveJobToHistory(jobData)

    // Revalidate history page
    revalidatePath('/app/history')

    return {
      success: true,
      data: {
        images: result.images,
        jobId: savedJob.id
      }
    }
  } catch (error) {
    console.error('Edit job error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export async function saveHistoryMeta(jobId: string, userId: string, meta: Record<string, unknown>) {
  try {
    // This would update job metadata if needed
    // Implementation depends on specific requirements
    console.log('Saving history meta for job:', jobId, 'user:', userId, 'meta:', meta)
    revalidatePath('/app/history')
    return { success: true }
  } catch (error) {
    console.error('Save history meta error:', error)
    return { success: false, error: 'Failed to save metadata' }
  }
}