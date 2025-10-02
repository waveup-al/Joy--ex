'use client'

import { useState } from 'react'
import { UploadPanel } from '@/components/ui/upload-panel'
import { PromptPanel } from '@/components/ui/prompt-panel'
import { ResultViewer } from '@/components/ui/result-viewer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit3, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { startEditJob } from '@/app/actions'
import { toast } from 'sonner'

import { UploadedImage } from '@/components/ui/upload-panel'

interface EditFormData {
  prompt: string
  size: '2560x1440' | '4096x4096'
  seed?: number
  strength?: number
  guidance?: number
}

export default function MultiImageEditPage() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{ output_url?: string; error?: string; size?: string } | null>(null)
  const [backgroundInfo, setBackgroundInfo] = useState<{ group: 'Joyex1' | 'Joyex2' | 'Joyex3'; title: string } | null>(null)

  const handleGenerate = async (formData: EditFormData) => {
    if (images.length === 0) {
      toast.error('Please upload at least one image')
      return
    }

    setIsGenerating(true)
    setResult(null)

    try {
      // Convert UploadedImage to URLs
      const imageUrls = images.map(img => img.url)

      const jobResult = await startEditJob({
        mode: 'edit',
        prompt: formData.prompt,
        imageUrls: imageUrls,
        userId: 'demo-user', // Demo user ID
        size: formData.size,
        seed: formData.seed,
        strength: formData.strength,
        guidance: formData.guidance,
      })

      if (jobResult.success && jobResult.data) {
        setResult({ 
          output_url: jobResult.data.images[0]?.url,
          size: formData.size
        })
        toast.success('Image created successfully!')
      } else {
        setResult({ error: jobResult.error })
        toast.error(jobResult.error || 'Unable to create image')
      }
    } catch (error) {
        console.error('Generation error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unable to create image'
      setResult({ error: errorMessage })
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/app">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Edit3 className="h-5 w-5 text-blue-600" />
          <h1 className="text-2xl font-bold">Multi-image Edit</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Prompt Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Settings</h2>
            <PromptPanel
              mode="edit"
              onSubmit={handleGenerate}
              loading={isGenerating}
              onBackgroundSelect={(group, title) => setBackgroundInfo({ group, title })}
            />
          </Card>
        </div>

        {/* Center Panel - Canvas/Results */}
        <div className="lg:col-span-1">
          <Card className="p-6 h-full">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <ResultViewer
              result={result ? {
                images: result.output_url ? [{
                  url: result.output_url,
                  width: result.size === '2560x1440' ? 2560 :
                          result.size === '4096x4096' ? 4096 : 2560,
                  height: result.size === '2560x1440' ? 1440 :
                          result.size === '4096x4096' ? 4096 : 1440
                }] : []
              } : null}
              loading={isGenerating}
              loadingMessage={backgroundInfo ? `Generating from ${backgroundInfo.group}: ${backgroundInfo.title}` : undefined}
            />
          </Card>
        </div>

        {/* Right Panel - Upload */}
        <div className="lg:col-span-1">
          <Card className="p-6 h-full">
            <h2 className="text-lg font-semibold mb-4">Upload Images</h2>
            <UploadPanel
              images={images}
              onImagesChange={setImages}
              maxImages={6}
            />
          </Card>
        </div>
      </div>

      {/* Instructions */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Edit3 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Multi-image Edit Instructions</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>1. Upload 2-6 reference images that will guide the AI editing process</p>
              <p>2. Write a detailed prompt describing the edits you want to apply</p>
              <p>3. Adjust settings like strength and guidance for fine control</p>
              <p>4. Click Generate to create your edited image</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}