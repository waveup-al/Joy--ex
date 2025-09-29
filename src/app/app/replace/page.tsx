'use client'

import { useState } from 'react'
import { UploadPanel } from '@/components/ui/upload-panel'
import { PromptPanel } from '@/components/ui/prompt-panel'
import { ResultViewer } from '@/components/ui/result-viewer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Replace, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { startEditJob } from '@/app/actions'
import { toast } from 'sonner'

import { UploadedImage } from '@/components/ui/upload-panel'

interface ReplaceFormData {
  prompt: string
  size: '1024x1024' | '1280x720' | '2048x2048' | '2560x1440' | '3072x3072' | '4096x4096'
  seed?: number
  strength?: number
  guidance?: number
}

export default function CompetitorStyleReplacePage() {
  const [competitorImages, setCompetitorImages] = useState<UploadedImage[]>([])
  const [productImages, setProductImages] = useState<UploadedImage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{ output_url?: string; error?: string; size?: string } | null>(null)

  const handleGenerate = async (formData: ReplaceFormData) => {
    if (competitorImages.length === 0) {
      toast.error('Please upload at least one competitor image')
      return
    }
    if (productImages.length === 0) {
      toast.error('Please upload at least one product image')
      return
    }

    setIsGenerating(true)
    setResult(null)

    try {
      // Convert UploadedImage to URLs
      const allImages = [...competitorImages, ...productImages]
      const imageUrls = allImages.map(img => img.url)

      const jobResult = await startEditJob({
        mode: 'replace',
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
        toast.success('Style replacement completed successfully!')
      } else {
        setResult({ error: jobResult.error })
        toast.error(jobResult.error || 'Unable to create replacement image')
      }
    } catch (error) {
        console.error('Error in handleGenerate:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unable to create replacement image'
      setResult({ error: errorMessage })
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  // const handleReset = () => {
  //   setCompetitorImages([])
  //   setProductImages([])
  //   setResult(null)
  // }

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
          <Replace className="h-5 w-5 text-purple-600" />
          <h1 className="text-2xl font-bold">Competitor Style Replace</h1>
        </div>
      </div>

      {/* 3-Box Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Competitor Images */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h2 className="text-lg font-semibold">Competitor Images</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Upload competitor product images to preserve their background and style
            </p>
            <UploadPanel
              images={competitorImages}
              onImagesChange={setCompetitorImages}
              maxImages={3}
            />
          </Card>
        </div>

        {/* Center Panel - Results */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Generated Result</h2>
            <ResultViewer
              result={result ? {
                images: result.output_url ? [{
                  url: result.output_url,
                  width: result.size === '1280x720' ? 1280 : 
                         result.size === '2048x2048' ? 2048 : 
                         result.size === '2560x1440' ? 2560 :
                         result.size === '3072x3072' ? 3072 : 1024,
                  height: result.size === '1280x720' ? 720 : 
                          result.size === '2048x2048' ? 2048 : 
                          result.size === '2560x1440' ? 1440 :
                          result.size === '3072x3072' ? 3072 : 1024
                }] : []
              } : null}
              loading={isGenerating}
            />
          </Card>
          
          {/* Controls */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Replace Settings</h2>
            <PromptPanel
              mode="replace"
              onSubmit={handleGenerate}
              loading={isGenerating}
            />
          </Card>
        </div>

        {/* Right Panel - Product Images */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h2 className="text-lg font-semibold">Your Product Images</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your product images that will replace the competitor products
            </p>
            <UploadPanel
              images={productImages}
              onImagesChange={setProductImages}
              maxImages={3}
            />
          </Card>
        </div>
      </div>

      {/* Instructions */}
      <Card className="p-6 bg-purple-50 border-purple-200">
        <div className="flex items-start gap-3">
          <Replace className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-purple-900 mb-2">Style Replace Instructions</h3>
            <div className="text-sm text-purple-800 space-y-1">
              <p>1. <strong>Competitor Images:</strong> Upload 1-3 competitor product images with good backgrounds/lighting</p>
              <p>2. <strong>Your Products:</strong> Upload 1-3 clear product images (preferably with transparent/clean backgrounds)</p>
              <p>3. <strong>Prompt:</strong> Describe how to position and integrate your product into the competitor&apos;s style</p>
              <p>4. <strong>Generate:</strong> The AI will preserve the competitor&apos;s background while replacing with your product</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-medium mb-3 text-purple-900">Best Practices</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Use high-resolution competitor images (1024px+)</li>
            <li>• Ensure your product images have good lighting</li>
            <li>• Match the perspective and angle when possible</li>
            <li>• Be specific about positioning in your prompt</li>
          </ul>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-medium mb-3 text-purple-900">Example Prompts</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>&bull; &quot;Replace the product while keeping the same lighting and shadows&quot;</li>
            <li>&bull; &quot;Position my product in the center, matching the competitor&apos;s angle&quot;</li>
            <li>&bull; &quot;Preserve the background and table surface, replace only the product&quot;</li>
            <li>&bull; &quot;Match the scale and perspective of the original product&quot;</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}