'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw, Eye, EyeOff, AlertCircle, ZoomIn, ZoomOut, Maximize2, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { JoyerLoading } from '@/components/ui/joyer-loading'

export interface GenerationResult {
  images: Array<{
    url: string
    width: number
    height: number
  }>
  jobId?: string
}

interface ResultViewerProps {
  result: GenerationResult | null
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  onDownload?: (imageUrl: string, filename?: string) => void
  className?: string
  beforeImages?: string[] // For before/after comparison
}

export function ResultViewer({
  result,
  loading = false,
  error = null,
  onRetry,
  onDownload,
  className,
  beforeImages = []
}: ResultViewerProps) {
  const [showComparison, setShowComparison] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMagnifying, setIsMagnifying] = useState(false)
  const [magnifyPosition, setMagnifyPosition] = useState({ x: 0, y: 0 })

  const handleDownload = async (imageUrl: string, index: number) => {
    if (onDownload) {
      const filename = `joy-ex-result-${Date.now()}-${index + 1}.png`
      onDownload(imageUrl, filename)
    } else {
      // Enhanced download behavior to preserve maximum quality
      try {
        // Fetch with no-cache headers to get original quality
        const response = await fetch(imageUrl, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const blob = await response.blob()
        
        // Verify we got a PNG blob for maximum quality
        console.log('Downloaded blob info:', {
          size: blob.size,
          type: blob.type,
          sizeInMB: (blob.size / (1024 * 1024)).toFixed(2) + 'MB'
        })
        
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `joy-ex-result-${Date.now()}-${index + 1}.png`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        // Show success message with file size info
        const sizeInMB = (blob.size / (1024 * 1024)).toFixed(2)
        console.log(`Download completed: ${sizeInMB}MB PNG file`)
        
      } catch (err) {
        console.error('Download failed:', err)
      }
    }
  }

  // Loading State
  if (loading) {
    return (
      <Card className={cn("bg-gradient-to-br from-pink-50/50 to-purple-50/50", className)}>
        <CardContent className="p-8">
          <JoyerLoading message="Generating your image..." />
        </CardContent>
      </Card>
    )
  }

  // Error State
  if (error) {
    return (
      <Card className={cn("border-destructive bg-gradient-to-br from-pink-50/50 to-purple-50/50", className)}>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-destructive">
                Generation Failed
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {error}
              </p>
            </div>
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Empty State
  if (!result || !result.images || !result.images.length) {
    return (
      <Card className={cn("border-dashed bg-gradient-to-br from-pink-50/50 to-purple-50/50", className)}>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Ready to Generate</h3>
              <p className="text-sm text-muted-foreground">
                Upload images and enter a prompt to get started
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const selectedImage = result.images[selectedImageIndex]

  return (
    <Card className={cn("bg-gradient-to-br from-pink-50/50 to-purple-50/50", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Generated Results</h3>
            <div className="flex items-center gap-2">
              {beforeImages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowComparison(!showComparison)}
                >
                  {showComparison ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Hide Comparison
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Show Comparison
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Main Image Display */}
          <div className="space-y-4">
            {showComparison && beforeImages.length > 0 ? (
              // Before/After Comparison
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Before</h4>
                  <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={beforeImages[selectedImageIndex] || beforeImages[0]}
                      alt="Before"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">After</h4>
                  <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={selectedImage.url}
                      alt="Generated result"
                      fill
                      className="object-cover"
                      quality={100}
                      priority={true}
                      unoptimized={selectedImage.url.includes('fal.media')}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Single Image Display - Enhanced with zoom and larger size
              <div className="space-y-4">
                {/* Image Container with Zoom Controls */}
                <div className="relative">
                  <div 
                    className={cn(
                      "relative rounded-lg overflow-hidden bg-muted mx-auto transition-all duration-300",
                      isFullscreen 
                        ? "fixed inset-4 z-50 max-w-none max-h-none" 
                        : "max-w-4xl",
                      selectedImage.width === selectedImage.height ? "aspect-square" :
                      selectedImage.width > selectedImage.height ? "aspect-video" : "aspect-[3/4]"
                    )}
                    style={{
                      transform: isFullscreen ? `scale(${zoomLevel})` : 'none',
                      transformOrigin: 'center'
                    }}
                    onMouseMove={(e) => {
                      if (isMagnifying) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMagnifyPosition({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      if (isMagnifying) {
                        setIsMagnifying(false);
                      }
                    }}
                  >
                    <Image
                      src={selectedImage.url}
                      alt="Generated result"
                      fill
                      className={cn(
                        "object-contain transition-all duration-200",
                        isMagnifying ? "cursor-none" : "cursor-zoom-in"
                      )}
                      onClick={() => !isMagnifying && setIsFullscreen(true)}
                      quality={100}
                      priority={true}
                      unoptimized={selectedImage.url.includes('fal.media')}
                    />
                    
                    {/* Magnifying Glass Overlay */}
                    {isMagnifying && (
                      <div
                        className="absolute pointer-events-none border-4 border-white rounded-full shadow-lg bg-white overflow-hidden"
                        style={{
                          width: '150px',
                          height: '150px',
                          left: magnifyPosition.x - 75,
                          top: magnifyPosition.y - 75,
                          zIndex: 10
                        }}
                      >
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `url(${selectedImage.url})`,
                            backgroundSize: `${selectedImage.width * 2}px ${selectedImage.height * 2}px`,
                            backgroundPosition: `-${(magnifyPosition.x * 2) - 75}px -${(magnifyPosition.y * 2) - 75}px`,
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                        <div className="absolute inset-0 border-2 border-gray-300 rounded-full" />
                      </div>
                    )}
                  </div>
                  
                  {/* Zoom Controls */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setZoomLevel(Math.min(zoomLevel + 0.5, 3))}
                      disabled={zoomLevel >= 3}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setZoomLevel(Math.max(zoomLevel - 0.5, 0.5))}
                      disabled={zoomLevel <= 0.5}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={isMagnifying ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setIsMagnifying(!isMagnifying)}
                      title="Magnifying Glass"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsFullscreen(true)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Fullscreen Modal */}
                {isFullscreen && (
                  <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div 
                        className="relative max-w-[90vw] max-h-[90vh]"
                        style={{
                          transform: `scale(${zoomLevel})`,
                          transformOrigin: 'center'
                        }}
                      >
                        <Image
                          src={selectedImage.url}
                          alt="Generated result"
                          width={selectedImage.width}
                          height={selectedImage.height}
                          className="object-contain"
                          quality={100}
                          priority={true}
                          unoptimized={selectedImage.url.includes('fal.media')}
                        />
                      </div>
                      
                      {/* Fullscreen Controls */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setZoomLevel(Math.min(zoomLevel + 0.5, 3))}
                          disabled={zoomLevel >= 3}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setZoomLevel(Math.max(zoomLevel - 0.5, 0.5))}
                          disabled={zoomLevel <= 0.5}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setIsFullscreen(false)
                            setZoomLevel(1)
                          }}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Image Selector (if multiple results) */}
            {result.images.length > 1 && (
              <div className="flex justify-center gap-2">
                {result.images.map((_, index) => (
                  <Button
                    key={index}
                    variant={selectedImageIndex === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-center gap-2">
              <Button
                onClick={() => handleDownload(selectedImage.url, selectedImageIndex)}
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
              {onRetry && (
                <Button onClick={onRetry} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Again
                </Button>
              )}
            </div>

            {/* Image Info */}
            <div className="text-center text-sm text-muted-foreground">
              {selectedImage.width} &times; {selectedImage.height} pixels
              {result.jobId && (
                <span className="block mt-1">
                  Job ID: {result.jobId.slice(0, 8)}...
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}