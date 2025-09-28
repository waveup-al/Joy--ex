'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Upload, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useUploadThing } from "@/lib/uploadthing";
import { JoyerLoading } from '@/components/ui/joyer-loading'

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

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      console.log("Files: ", res);
      setIsUploading(false)
      
      // Process uploaded files with Uploadthing URLs
      const newImages: UploadedImage[] = res.map((file, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        file: new File([], `uploaded-${index}.jpg`), // Create a placeholder File object
        url: file.url
      }))

      const updatedImages = [...images, ...newImages].slice(0, maxImages)
      onImagesChange(updatedImages)
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error);
      setIsUploading(false)
      // Fallback to blob URLs if upload fails
      // This will be handled in the onDrop function
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    try {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(rejection => 
          rejection.errors.map((error: any) => error.message).join(', ')
        ).join('; ')
        console.warn('Some files were rejected:', errors)
      }

      setIsUploading(true)
      
      // Try to upload to Uploadthing first
      try {
        await startUpload(acceptedFiles)
      } catch (error) {
        console.error('Uploadthing failed, falling back to blob URLs:', error)
        setIsUploading(false)
        
        // Fallback to blob URLs if Uploadthing fails
        const newImages: UploadedImage[] = acceptedFiles.map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          url: URL.createObjectURL(file)
        }))
        const updatedImages = [...images, ...newImages].slice(0, maxImages)
        onImagesChange(updatedImages)
      }
    } catch (error) {
      console.error('Error processing uploaded files:', error)
      setIsUploading(false)
      
      // Final fallback to blob URLs
      const newImages: UploadedImage[] = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        url: URL.createObjectURL(file)
      }))
      const updatedImages = [...images, ...newImages].slice(0, maxImages)
      onImagesChange(updatedImages)
    }
  }, [images, onImagesChange, maxImages, startUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    maxFiles: maxImages - images.length,
    disabled: images.length >= maxImages || isUploading,
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
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <JoyerLoading message="Uploading your images..." />
        </div>
      )}
      
      {/* Upload Area */}
      {images.length < maxImages && (
        <Card
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed p-8 text-center cursor-pointer transition-colors bg-gradient-to-br from-pink-50/50 to-purple-50/50",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            isUploading && "pointer-events-none opacity-50"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? "Drop images here" : isUploading ? "Uploading..." : "Drag & drop images"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to select files
          </p>
          <Button variant="outline" type="button" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Choose Files"}
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