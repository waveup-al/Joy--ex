/**
 * Quality Monitoring and Analytics for AI Image Processing
 * Tracks performance metrics and quality scores for optimization
 */

export interface QualityMetrics {
  processingTime: number
  inputImageSize: number
  outputImageSize: number
  compressionRatio: number
  qualityScore: number
  aiProcessingSuccess: boolean
  errorRate: number
  userSatisfaction?: number
}

export interface ProcessingStats {
  totalProcessed: number
  successRate: number
  averageProcessingTime: number
  averageQualityScore: number
  totalDataSaved: number
  optimizationEfficiency: number
}

class QualityMonitor {
  private metrics: QualityMetrics[] = []
  private readonly maxMetrics = 1000 // Keep last 1000 metrics

  /**
   * Record processing metrics for analysis
   */
  recordMetrics(metrics: QualityMetrics): void {
    this.metrics.push({
      ...metrics,
      timestamp: Date.now()
    } as QualityMetrics & { timestamp: number })

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // Store in localStorage for persistence
    this.saveToStorage()
  }

  /**
   * Get comprehensive processing statistics
   */
  getProcessingStats(): ProcessingStats {
    if (this.metrics.length === 0) {
      return {
        totalProcessed: 0,
        successRate: 0,
        averageProcessingTime: 0,
        averageQualityScore: 0,
        totalDataSaved: 0,
        optimizationEfficiency: 0
      }
    }

    const successful = this.metrics.filter(m => m.aiProcessingSuccess)
    const totalDataSaved = this.metrics.reduce((sum, m) => 
      sum + (m.inputImageSize - m.outputImageSize), 0
    )

    return {
      totalProcessed: this.metrics.length,
      successRate: (successful.length / this.metrics.length) * 100,
      averageProcessingTime: this.metrics.reduce((sum, m) => sum + m.processingTime, 0) / this.metrics.length,
      averageQualityScore: this.metrics.reduce((sum, m) => sum + m.qualityScore, 0) / this.metrics.length,
      totalDataSaved,
      optimizationEfficiency: totalDataSaved > 0 ? (totalDataSaved / this.metrics.reduce((sum, m) => sum + m.inputImageSize, 0)) * 100 : 0
    }
  }

  /**
   * Get quality recommendations based on metrics
   */
  getQualityRecommendations(): string[] {
    const stats = this.getProcessingStats()
    const recommendations: string[] = []

    if (stats.successRate < 95) {
      recommendations.push("Consider adjusting image preprocessing parameters to improve success rate")
    }

    if (stats.averageQualityScore < 7) {
      recommendations.push("Image quality could be improved - try higher resolution inputs or better preprocessing")
    }

    if (stats.averageProcessingTime > 5000) {
      recommendations.push("Processing time is high - consider optimizing image sizes or compression settings")
    }

    if (stats.optimizationEfficiency < 20) {
      recommendations.push("Optimization efficiency is low - review compression and enhancement settings")
    }

    if (recommendations.length === 0) {
      recommendations.push("System is performing optimally! All metrics are within excellent ranges.")
    }

    return recommendations
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): string {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      stats: this.getProcessingStats(),
      recommendations: this.getQualityRecommendations(),
      rawMetrics: this.metrics.slice(-100) // Last 100 metrics
    }, null, 2)
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = []
    localStorage.removeItem('joy-ex-quality-metrics')
  }

  /**
   * Load metrics from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('joy-ex-quality-metrics')
      if (stored) {
        this.metrics = JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load quality metrics from storage:', error)
    }
  }

  /**
   * Save metrics to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem('joy-ex-quality-metrics', JSON.stringify(this.metrics))
    } catch (error) {
      console.warn('Failed to save quality metrics to storage:', error)
    }
  }

  /**
   * Initialize monitor and load existing data
   */
  init(): void {
    this.loadFromStorage()
  }
}

// Singleton instance
export const qualityMonitor = new QualityMonitor()

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  qualityMonitor.init()
}

/**
 * Helper function to calculate quality score based on various factors
 */
export function calculateQualityScore(
  originalSize: number,
  processedSize: number,
  processingTime: number,
  success: boolean
): number {
  if (!success) return 0

  let score = 10 // Start with perfect score

  // Penalize excessive compression (too small)
  const compressionRatio = processedSize / originalSize
  if (compressionRatio < 0.1) score -= 2 // Too much compression
  if (compressionRatio > 0.8) score -= 1 // Too little compression

  // Penalize long processing times
  if (processingTime > 10000) score -= 2 // > 10 seconds
  else if (processingTime > 5000) score -= 1 // > 5 seconds

  // Bonus for optimal ranges
  if (compressionRatio >= 0.3 && compressionRatio <= 0.6) score += 0.5
  if (processingTime < 3000) score += 0.5

  return Math.max(0, Math.min(10, score))
}