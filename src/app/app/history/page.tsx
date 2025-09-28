'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  History, 
  Edit3, 
  Replace, 
  Download, 
  Trash2, 
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { getUserJobs, deleteJob, type Job } from '@/lib/supabase'
import { useUser } from '@/components/auth/AuthGuard'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

export default function HistoryPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const { user } = useUser()

  const loadJobs = useCallback(async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const userJobs = await getUserJobs(user?.id || '')
      setJobs(userJobs)
    } catch (error) {
      console.error('Failed to load job history:', error)
      toast.error('Failed to load job history')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  const handleDelete = async (jobId: string) => {
    if (!user) return

    setDeletingIds(prev => new Set(prev).add(jobId))
    try {
      await deleteJob(jobId, user?.id || '')
      setJobs(prev => prev.filter(job => job.id !== jobId))
      toast.success('Job deleted successfully')
    } catch (error) {
      console.error('Failed to delete job:', error)
      toast.error('Failed to delete job')
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(jobId)
        return newSet
      })
    }
  }

  const handleDownload = async (url: string, jobId: string) => {
    try {
      // Enhanced download with no-cache headers to preserve maximum quality
      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const blob = await response.blob()
      
      // Log quality info
      console.log('Downloaded blob info:', {
        size: blob.size,
        type: blob.type,
        sizeInMB: (blob.size / (1024 * 1024)).toFixed(2) + 'MB'
      })
      
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `joy-ex-${jobId}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      const sizeInMB = (blob.size / (1024 * 1024)).toFixed(2)
      toast.success(`Download completed: ${sizeInMB}MB PNG file`)
    } catch (error) {
      console.error('Failed to download image:', error)
      toast.error('Failed to download image')
    }
  }

  const getModeIcon = (mode: string) => {
    return mode === 'edit' ? Edit3 : Replace
  }

  const getModeColor = (mode: string) => {
    return mode === 'edit' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
  }

  const getModeName = (mode: string) => {
    return mode === 'edit' ? 'Multi-image Edit' : 'Style Replace'
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/app">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <h1 className="text-2xl font-bold">History</h1>
          </div>
        </div>
        
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/app">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <h1 className="text-2xl font-bold">History</h1>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} total
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No editing history yet</h3>
          <p className="text-muted-foreground mb-6">
            Start creating with our AI-powered editing tools to see your work here.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/app/edit">
              <Button>
                <Edit3 className="mr-2 h-4 w-4" />
                Multi-image Edit
              </Button>
            </Link>
            <Link href="/app/replace">
              <Button variant="outline">
                <Replace className="mr-2 h-4 w-4" />
                Style Replace
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => {
            const ModeIcon = getModeIcon(job.mode)
            const isDeleting = deletingIds.has(job.id)
            
            return (
              <Card key={job.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getModeColor(job.mode)}`}>
                      <ModeIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{getModeName(job.mode)}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {job.mode}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                        </div>
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          {job.images.length} {job.images.length === 1 ? 'image' : 'images'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {job.output_url && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(job.output_url!, job.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(job.output_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(job.id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Prompt */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Prompt:</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{job.prompt}</p>
                </div>

                {/* Images and Result */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Input Images */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Input Images ({job.images.length})
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {job.images.slice(0, 4).map((imageUrl, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={`Input ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {job.images.length > 4 && (
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">
                            +{job.images.length - 4} more
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Output */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Result</p>
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      {job.output_url ? (
                        <Image
                          src={job.output_url}
                          alt="Generated result"
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">No result available</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}