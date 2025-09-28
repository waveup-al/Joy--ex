'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { qualityMonitor, ProcessingStats } from '@/lib/quality-monitor'
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Download,
  BarChart3,
  Zap,
  HardDrive
} from 'lucide-react'

export function QualityDashboard() {
  const [stats, setStats] = useState<ProcessingStats | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateStats = () => {
      const currentStats = qualityMonitor.getProcessingStats()
      const currentRecommendations = qualityMonitor.getQualityRecommendations()
      
      setStats(currentStats)
      setRecommendations(currentRecommendations)
    }

    updateStats()
    const interval = setInterval(updateStats, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const exportMetrics = () => {
    const data = qualityMonitor.exportMetrics()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `joy-ex-quality-metrics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!stats || stats.totalProcessed === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        className="mb-4"
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        {isVisible ? 'Hide' : 'Show'} Quality Analytics
      </Button>

      {isVisible && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Processing Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProcessed}</div>
              <p className="text-xs text-muted-foreground">
                Images optimized
              </p>
            </CardContent>
          </Card>

          {/* Success Rate */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
              <Progress value={stats.successRate} className="mt-2" />
            </CardContent>
          </Card>

          {/* Average Processing Time */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.averageProcessingTime / 1000).toFixed(1)}s
              </div>
              <p className="text-xs text-muted-foreground">
                Per image
              </p>
            </CardContent>
          </Card>

          {/* Data Saved */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Saved</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.totalDataSaved / 1024 / 1024).toFixed(1)}MB
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.optimizationEfficiency.toFixed(1)}% efficiency
              </p>
            </CardContent>
          </Card>

          {/* Quality Score */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
              <CardDescription>
                Overall processing quality assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold">
                  {stats.averageQualityScore.toFixed(1)}/10
                </div>
                <div className="flex-1">
                  <Progress value={stats.averageQualityScore * 10} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
                <Badge variant={stats.averageQualityScore >= 8 ? "default" : stats.averageQualityScore >= 6 ? "secondary" : "destructive"}>
                  {stats.averageQualityScore >= 8 ? "Excellent" : stats.averageQualityScore >= 6 ? "Good" : "Needs Improvement"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Controls */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Analytics Export</CardTitle>
              <CardDescription>
                Export detailed metrics for further analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button onClick={exportMetrics} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Metrics
                </Button>
                <Button 
                  onClick={() => {
                    qualityMonitor.clearMetrics()
                    setStats(qualityMonitor.getProcessingStats())
                  }} 
                  variant="outline" 
                  size="sm"
                >
                  Clear Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}