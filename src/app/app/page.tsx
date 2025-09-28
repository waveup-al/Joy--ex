'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ModeSwitch, type EditMode } from '@/components/ui/mode-switch'
import { Edit3, Replace, ArrowRight, Sparkles } from 'lucide-react'

export default function AppDashboard() {
  const [selectedMode, setSelectedMode] = useState<EditMode>('edit')
  const router = useRouter()

  const handleStartEditing = () => {
    if (selectedMode === 'edit') {
      router.push('/app/edit')
    } else {
      router.push('/app/replace')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Welcome to Joy-ex</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose your editing mode and start transforming your images with AI-powered tools.
        </p>
      </div>

      {/* Mode Selection */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-center">Select Editing Mode</h2>
        <ModeSwitch 
          mode={selectedMode} 
          onModeChange={setSelectedMode}
        />
      </div>

      {/* Quick Start */}
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Ready to get started?</h3>
          <p className="text-muted-foreground">
            {selectedMode === 'edit' 
              ? 'Upload multiple images and describe your desired edits with natural language.'
              : 'Upload competitor and product images to seamlessly replace products while preserving style.'
            }
          </p>
          <Button 
            size="lg" 
            onClick={handleStartEditing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {selectedMode === 'edit' ? (
              <>
                <Edit3 className="mr-2 h-5 w-5" />
                Start Multi-image Edit
              </>
            ) : (
              <>
                <Replace className="mr-2 h-5 w-5" />
                Start Style Replace
              </>
            )}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <Button variant="outline" size="sm" onClick={() => router.push('/app/history')}>
            View All
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>No recent activity yet. Start editing to see your history here.</p>
        </div>
      </Card>

      {/* Quick Tips */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Edit3 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium mb-2">Multi-image Edit Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Upload 2-4 reference images for best results</li>
                <li>• Be specific in your prompts</li>
                <li>&bull; Use &quot;preserve&quot; or &quot;keep&quot; for elements you want unchanged</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Replace className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium mb-2">Style Replace Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use high-quality product images with clear backgrounds</li>
                <li>• Competitor images should have good lighting</li>
                <li>• Add specific prompts for better positioning</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}