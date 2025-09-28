'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Edit3, Replace, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type EditMode = 'edit' | 'replace'

interface ModeSwitchProps {
  mode: EditMode
  onModeChange: (mode: EditMode) => void
  className?: string
}

const MODE_CONFIG = {
  edit: {
    icon: Edit3,
    title: 'Multi-image Edit',
    description: 'Upload multiple images and apply edits with AI',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  replace: {
    icon: Replace,
    title: 'Competitor Style Replace',
    description: 'Replace products while keeping background style',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
  },
}

export function ModeSwitch({ mode, onModeChange, className }: ModeSwitchProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Mode Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(MODE_CONFIG).map(([key, config]) => {
          const isActive = mode === key
          const Icon = config.icon

          return (
            <Card
              key={key}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                isActive ? config.bgColor : "hover:bg-muted/50"
              )}
              onClick={() => onModeChange(key as EditMode)}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isActive ? "bg-gradient-to-r from-pink-100 to-purple-100 shadow-sm" : "bg-muted"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5",
                      isActive ? config.color : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-medium text-sm",
                      isActive ? config.color : "text-foreground"
                    )}>
                      {config.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {config.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className={cn("w-2 h-2 rounded-full", config.color.replace('text-', 'bg-'))} />
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Mode Info */}
      <Card className="bg-muted/30">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              {mode === 'edit' ? (
                <div className="space-y-1">
                  <p><strong>Multi-image Edit:</strong> Upload multiple reference images and describe your desired edits.</p>
                  <p>Perfect for: Style transfers, artistic effects, combining multiple images, creative transformations.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p><strong>Competitor Style Replace:</strong> Keep competitor&apos;s background/style, replace with your product.</p>
                  <p>Perfect for: Product photography, maintaining brand consistency, competitive analysis.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Hook for mode management
export function useEditMode(initialMode: EditMode = 'edit') {
  const [mode, setMode] = useState<EditMode>(initialMode)

  const switchMode = (newMode: EditMode) => {
    setMode(newMode)
  }

  return {
    mode,
    switchMode,
    isEditMode: mode === 'edit',
    isReplaceMode: mode === 'replace',
  }
}