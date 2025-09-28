'use client'

import { useState, useCallback } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Upload, GripVertical, Zap, CheckCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from 'sonner'
import { JoyerLoading } from '@/components/ui/joyer-loading'
import { optimizeImageForAI, analyzeImageQuality, OptimizedImageResult } from '@/lib/image-optimizer'
import { qualityMonitor, calculateQualityScore } from '@/lib/quality-monitor'

export interface UploadedImage {
  id: string
  file: File
  url: string
  caption?: string
}

interface UploadPanelProps {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
  className?: string
}

export function UploadPanel({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  className 
}: UploadPanelProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationStats, setOptimizationStats] = useState<{
    totalSaved: number;
    filesOptimized: number;
  } | null>(null)

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      console.log("Upload completed successfully:", res);
      setIsUploading(false)
      
      // Process uploaded files with Uploadthing URLs
      const newImages: UploadedImage[] = res.map((file, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        file: new File([], file.name || `uploaded-${index}.jpg`), // Use actual filename
        url: file.url
      }))

      const updatedImages = [...images, ...newImages].slice(0, maxImages)
      onImagesChange(updatedImages)
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error);
      setIsUploading(false)
      // Show error message to user
      toast.error(`Upload failed: ${error.message}`)
    },
    onUploadBegin: (name) => {
      console.log("Upload started for:", name);
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    try {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(rejection => 
          rejection.errors.map((error) => error.message).join(', ')
        ).join('; ')
        console.warn('Some files were rejected:', errors)
        toast.error(`Some files were rejected: ${errors}`)
      }

      if (acceptedFiles.length === 0) {
        return
      }

      console.log('Starting optimization and upload for files:', acceptedFiles.map(f => f.name))
      setIsOptimizing(true)
      setOptimizationStats(null)

      // Step 1: Analyze and optimize images for better AI processing
      const optimizedResults: OptimizedImageResult[] = []
      let totalOriginalSize = 0
      let totalOptimizedSize = 0

      for (const file of acceptedFiles) {
        try {
          // Analyze image quality first
          const analysis = await analyzeImageQuality(file)
          
          if (!analysis.isOptimal) {
            console.log(`Image quality analysis for ${file.name}:`, analysis)
            toast.info(`Optimizing ${file.name} for better AI processing...`)
          }

          // Optimize image for AI processing with maximum quality preservation
          const optimized = await optimizeImageForAI(file, {
            maxWidth: 2048,
            maxHeight: 2048,
            quality: 0.98, // Maximum quality to preserve details
            format: 'png', // Lossless format for better preservation
            preserveOriginalQuality: true, // Preserve original image quality
            enhanceContrast: false, // Disable to preserve original
            sharpen: false // Disable to preserve original
          })

          optimizedResults.push(optimized)
          totalOriginalSize += optimized.originalSize
          totalOptimizedSize += optimized.optimizedSize

          console.log(`Optimized ${file.name}:`, {
            originalSize: `${(optimized.originalSize / 1024 / 1024).toFixed(2)}MB`,
            optimizedSize: `${(optimized.optimizedSize / 1024 / 1024).toFixed(2)}MB`,
            compressionRatio: `${optimized.compressionRatio}%`,
            dimensions: optimized.dimensions
          })
        } catch (error) {
          console.error(`Failed to optimize ${file.name}:`, error)
          // Fallback to original file if optimization fails
          optimizedResults.push({
            file,
            originalSize: file.size,
            optimizedSize: file.size,
            compressionRatio: 0,
            dimensions: { width: 0, height: 0 }
          })
        }
      }

      // Update optimization stats
      const totalSaved = totalOriginalSize - totalOptimizedSize
      setOptimizationStats({
        totalSaved,
        filesOptimized: optimizedResults.length
      })

      if (totalSaved > 0) {
        toast.success(`Images optimized! Saved ${(totalSaved / 1024 / 1024).toFixed(2)}MB for better AI processing`)
      }

      setIsOptimizing(false)
      setIsUploading(true)

      // Step 2: Upload optimized images
      try {
        const filesToUpload = optimizedResults.map(result => {
          const startTime = Date.now()
          
          // Record quality metrics for monitoring
          const qualityScore = calculateQualityScore(
            result.originalSize,
            result.optimizedSize,
            Date.now() - startTime,
            true
          )

          qualityMonitor.recordMetrics({
            processingTime: Date.now() - startTime,
            inputImageSize: result.originalSize,
            outputImageSize: result.optimizedSize,
            compressionRatio: result.optimizedSize / result.originalSize,
            qualityScore,
            aiProcessingSuccess: true,
            errorRate: 0
          })

          return result.file
        })
        await startUpload(filesToUpload)
      } catch (error) {
        console.error('Uploadthing upload failed:', error)
        setIsUploading(false)
        
        // Show specific error message
        const errorMessage = error instanceof Error ? error.message : 'Unknown upload error'
        toast.error(`Upload failed: ${errorMessage}. Please ensure UploadThing is properly configured for FAL API to work.`)
        
        // DO NOT fallback to blob URLs as they won't work with FAL API
        // FAL API requires publicly accessible URLs
        console.warn('Cannot use blob URLs with FAL API - upload to UploadThing is required')
        return
      }
    } catch (error) {
      console.error('Error processing uploaded files:', error)
      setIsOptimizing(false)
      setIsUploading(false)
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Error processing files: ${errorMessage}. Please ensure UploadThing is properly configured for FAL API to work.`)
      
      // DO NOT fallback to blob URLs as they won't work with FAL API
      // FAL API requires publicly accessible URLs
      console.warn('Cannot use blob URLs with FAL API - upload to UploadThing is required')
    }
  }, [images, onImagesChange, maxImages, startUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    maxFiles: maxImages - images.length,
    disabled: images.length >= maxImages || isUploading || isOptimizing,
    maxSize: 10 * 1024 * 1024, // 10MB limit
    onError: (error) => {
      console.error('Dropzone error:', error)
    }
  })

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id)
    onImagesChange(updatedImages)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null) return

    const newImages = [...images]
    const draggedImage = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedImage)
    
    onImagesChange(newImages)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Joyer Loading Overlay */}
      {(isUploading || isOptimizing) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <JoyerLoading 
            message={
              isOptimizing 
                ? "Optimizing images for better AI processing..." 
                : "Uploading your optimized images..."
            } 
          />
        </div>
      )}

      {/* Optimization Stats */}
      {optimizationStats && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Zap className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-green-900">Images Optimized for AI Processing</h4>
              <p className="text-sm text-green-700">
                {optimizationStats.filesOptimized} files processed • 
                Saved {(optimizationStats.totalSaved / 1024 / 1024).toFixed(2)}MB • 
                Enhanced for better AI results
              </p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Upload Area */}
      {images.length < maxImages && (
        <Card
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed p-8 text-center cursor-pointer transition-colors bg-gradient-to-br from-pink-50/50 to-purple-50/50",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            (isUploading || isOptimizing) && "pointer-events-none opacity-50"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? "Drop images here" : 
             isOptimizing ? "Optimizing images..." :
             isUploading ? "Uploading..." : 
             "Drag & drop images"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {isOptimizing ? "AI-powered optimization in progress" :
             isUploading ? "Upload in progress" :
             "or click to select files • Auto-optimized for AI processing"}
          </p>
          <Button variant="outline" type="button" disabled={isUploading || isOptimizing}>
            {isOptimizing ? "Optimizing..." : isUploading ? "Uploading..." : "Choose Files"}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            {images.length}/{maxImages} images uploaded
          </p>
        </Card>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card
              key={image.id}
              className="relative group overflow-hidden bg-gradient-to-br from-pink-50/30 to-purple-50/30"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                
                {/* Controls */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Drag Handle */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                  <div className="bg-black/50 rounded p-1">
                    <GripVertical className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* Index */}
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Upload className="mx-auto h-16 w-16 mb-4 opacity-50" />
          <p>No images uploaded yet</p>
          <p className="text-sm">Add images to get started</p>
        </div>
      )}
    </div>
  )
}