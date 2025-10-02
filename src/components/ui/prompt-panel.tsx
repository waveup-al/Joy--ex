'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Wand2, Shuffle, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const promptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  size: z.enum(['2560x1440', '4096x4096']).default('2560x1440'),
  seed: z.number().min(0).max(2147483647).optional(),
  strength: z.number().min(0).max(1).default(0.75),
  guidance: z.number().min(1).max(20).default(12),
})

export type PromptFormData = z.infer<typeof promptSchema>

interface PromptPanelProps {
  onSubmit: (data: PromptFormData) => void
  loading?: boolean
  className?: string
  mode?: 'edit' | 'replace'
}

const JOYEX1_PROMPTS = [
  "Create a professional Amazon advertising image featuring the provided Christmas ornament (must preserve 100% original artwork, text, and details). Scene: Ornament hanging on a beautifully decorated Christmas tree branch with fairy lights, pine garlands, and shiny baubles. Background softly blurred with festive bokeh. Lighting: Soft golden tones with candlelight reflections, highlighting the ornament's surface and material depth. Style: Photorealistic, high-resolution, professional Amazon listing style.",
  "Create an Amazon advertising image featuring the provided Christmas ornament (100% original detail, unchanged). Scene: Ornament placed on a festive holiday dining table surrounded by pine cones, candles, crystal glasses, and wrapped gifts. Warm cozy atmosphere of a family gathering. Lighting: Soft golden tones with candlelight reflections, emphasizing the ornament's texture and depth. Style: Photorealistic, high-resolution, natural holiday setting.",
  "Design a professional Amazon advertising image featuring the provided Christmas ornament (keep all original details unchanged). Scene: Ornament displayed on a wooden windowsill with frosted glass and snow gently falling outside. Nearby candles and pine garlands enhance the cozy setting. Lighting: Soft golden tones with candlelight reflections, highlighting the ornament's surface and material depth. Style: Photorealistic, premium Amazon style.",
  "Create a professional Amazon advertising image showing the provided Christmas ornament (100% true to input, no alterations). Scene: Ornament carefully placed inside an open festive gift box with tissue paper, surrounded by holiday wrapping paper, pine sprigs, and fairy lights. Atmosphere joyful and gift-focused. Lighting: Soft golden tones with candlelight reflections, emphasizing the ornament's layered material depth. Style: High-resolution, photorealistic, authentic Amazon listing style."
]

const QUICK_PROMPTS = {
  edit: [
    "Christmas Tree",
    "Holiday Dining Table", 
    "Snowy Windowsill",
    "Gift Box",
    "Fireplace Mantel"
  ],
  replace: [
    "Match the lighting perfectly",
    "Blend seamlessly with background",
    "Maintain realistic proportions",
    "Add natural shadows and reflections",
    "Preserve the original atmosphere"
  ]
}

const BACKGROUND_PROMPTS = {
  "Christmas Tree": "Create a professional Amazon advertising image featuring the provided Christmas ornament (must preserve 100% original artwork, text, and details). Scene: Ornament hanging on a beautifully decorated Christmas tree branch with fairy lights, pine garlands, and shiny baubles. Background softly blurred with festive bokeh. Lighting: Soft golden tones with candlelight reflections, highlighting the ornament's surface and material depth. Style: Photorealistic, high-resolution, professional Amazon listing style.",
  "Holiday Dining Table": "Create an Amazon advertising image featuring the provided Christmas ornament (100% original detail, unchanged). Scene: Ornament placed on a festive holiday dining table surrounded by pine cones, candles, crystal glasses, and wrapped gifts. Warm cozy atmosphere of a family gathering. Lighting: Soft golden tones with candlelight reflections, emphasizing the ornament's texture and depth. Style: Photorealistic, high-resolution, natural holiday setting.",
  "Snowy Windowsill": "Design a professional Amazon advertising image featuring the provided Christmas ornament (keep all original details unchanged). Scene: Ornament displayed on a wooden windowsill with frosted glass and snow gently falling outside. Nearby candles and pine garlands enhance the cozy setting. Lighting: Soft golden tones with candlelight reflections, highlighting the ornament's surface and material depth. Style: Photorealistic, premium Amazon style.",
  "Gift Box": "Create a professional Amazon advertising image showing the provided Christmas ornament (100% true to input, no alterations). Scene: Ornament carefully placed inside an open festive gift box with tissue paper, surrounded by holiday wrapping paper, pine sprigs, and fairy lights. Atmosphere joyful and gift-focused. Lighting: Soft golden tones with candlelight reflections, emphasizing the ornament's layered material depth. Style: High-resolution, photorealistic, authentic Amazon listing style.",
  "Fireplace Mantel": "Create an Amazon advertising image featuring the provided Christmas ornament (preserve 100% original details). Scene: Ornament displayed on a decorated fireplace mantel with stockings, pine garlands, and glowing candles. A warm fire glows in the background. Lighting: Soft golden tones with candlelight reflections, highlighting the ornament's surface and material depth. Style: Photorealistic, high-resolution, elegant Amazon holiday advertisement."
}

export function PromptPanel({ 
  onSubmit, 
  loading = false, 
  className,
  mode = 'edit'
}: PromptPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showJoyex1, setShowJoyex1] = useState(false)

  const form = useForm({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: '',
      size: '2560x1440' as const,
      strength: 0.8,
      guidance: 7.5,
    }
  })

  const handleSubmit = (data: PromptFormData) => {
    onSubmit(data)
  }

  const strengthValue = form.watch('strength')
  const guidanceValue = form.watch('guidance')

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          {mode === 'edit' ? 'Edit Settings' : 'Replace Settings'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Prompt Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              <Label className="text-base font-medium">Prompt Settings</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prompt">
                {mode === 'edit' ? 'Edit Instructions' : 'Replace Instructions'}
              </Label>
              <Textarea
                id="prompt"
                placeholder={mode === 'edit' 
                  ? "Describe how you want to edit the image..." 
                  : "Describe what you want to replace in the image..."
                }
                className="min-h-[100px] resize-none"
                {...form.register('prompt')}
              />
              {form.formState.errors.prompt && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.prompt.message}
                </p>
              )}
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Prompts</Label>
            
            {/* Joyex1 Dropdown */}
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowJoyex1(!showJoyex1)}
              >
                Joyex1
                <ChevronDown className={cn("h-4 w-4 transition-transform", showJoyex1 && "rotate-180")} />
              </Button>
              
              {showJoyex1 && (
                <div className="space-y-2 pl-4 border-l-2 border-muted">
                  {JOYEX1_PROMPTS.map((prompt, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="justify-start text-left h-auto py-2 px-3 w-full text-xs"
                      onClick={() => {
                        form.setValue('prompt', prompt)
                        setShowJoyex1(false)
                      }}
                    >
                      Prompt {index + 1}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Original Quick Prompts */}
            <div className="grid grid-cols-1 gap-2">
              {QUICK_PROMPTS[mode].map((prompt, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto py-2 px-3"
                  onClick={() => {
                    // Check if this is a background prompt title for edit mode
                    if (mode === 'edit' && BACKGROUND_PROMPTS[prompt as keyof typeof BACKGROUND_PROMPTS]) {
                      form.setValue('prompt', BACKGROUND_PROMPTS[prompt as keyof typeof BACKGROUND_PROMPTS])
                    } else {
                      form.setValue('prompt', prompt)
                    }
                  }}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          {/* Basic Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="size">Output Size</Label>
              <Select
                value={form.watch('size')}
                onValueChange={(value) => form.setValue('size', value as '2560x1440' | '4096x4096')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2560x1440">Ultra HD (2560×1440)</SelectItem>
                  <SelectItem value="4096x4096">4K Ultra Square (4096×4096)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Settings Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full justify-between"
            >
              Advanced Settings
              <ChevronDown className={cn("h-4 w-4 transition-transform", showAdvanced && "rotate-180")} />
            </Button>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="space-y-4 pt-2 border-t">
                {/* Seed */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seed">Seed (Optional)</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const randomSeed = Math.floor(Math.random() * 2147483647)
                        form.setValue('seed', randomSeed)
                      }}
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    id="seed"
                    type="number"
                    min={0}
                    max={2147483647}
                    placeholder="Random"
                    {...form.register('seed', { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use the same seed for consistent results
                  </p>
                </div>

                {/* Strength */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Strength</Label>
                    <span className="text-sm text-muted-foreground">
                      {(strengthValue ?? 0.8).toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    value={[strengthValue ?? 0.8]}
                    onValueChange={([value]) => form.setValue('strength', value)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher values = more dramatic changes
                  </p>
                </div>

                {/* Guidance */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Guidance Scale</Label>
                    <span className="text-sm text-muted-foreground">
                      {(guidanceValue ?? 7.5).toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    value={[guidanceValue ?? 7.5]}
                    onValueChange={([value]) => form.setValue('guidance', value)}
                    min={1}
                    max={20}
                    step={0.5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher values = more adherence to prompt
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {mode === 'edit' ? 'Editing...' : 'Replacing...'}
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                {mode === 'edit' ? 'Edit Image' : 'Replace Object'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}