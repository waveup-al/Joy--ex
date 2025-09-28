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
import { Wand2, Shuffle } from 'lucide-react'
import { cn } from '@/lib/utils'

const promptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  size: z.enum(['1024x1024', '1280x720', '2048x2048']).default('2048x2048'),
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

  const form = useForm({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: '',
      size: '1024x1024' as const,
      strength: 0.8,
      guidance: 7.5,
    }
  })

  const handleSubmit = (data: PromptFormData) => {
    onSubmit(data)
  }

  const generateRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 2147483647)
    form.setValue('seed', randomSeed)
  }

  const strengthValue = form.watch('strength')
  const guidanceValue = form.watch('guidance')

  return (
    <Card className={cn("bg-gradient-to-br from-pink-50/50 to-purple-50/50", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Prompt Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Main Prompt */}
          <div className="space-y-2">
            <Label htmlFor="prompt">
              {mode === 'edit' ? 'Edit Instructions' : 'Additional Prompt'}
            </Label>
            <Textarea
              id="prompt"
              placeholder={
                mode === 'edit' 
                  ? "Describe how you want to edit the images..."
                  : "Additional styling or modifications..."
              }
              className="min-h-[100px]"
              {...form.register('prompt')}
            />
            {form.formState.errors.prompt && (
              <p className="text-sm text-destructive">
                {form.formState.errors.prompt.message}
              </p>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <Label>Quick Prompts</Label>
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
                onValueChange={(value) => form.setValue('size', value as '1024x1024' | '1280x720' | '2048x2048')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024x1024">Square (1024&times;1024)</SelectItem>
                  <SelectItem value="1280x720">Landscape (1280&times;720)</SelectItem>
                  <SelectItem value="2048x2048">Large Square (2048&times;2048)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Settings Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </Button>

            {showAdvanced && (
              <div className="space-y-4 pt-4 border-t">
                {/* Seed */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seed">Seed (Optional)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateRandomSeed}
                    >
                      <Shuffle className="h-4 w-4 mr-1" />
                      Random
                    </Button>
                  </div>
                  <Input
                    id="seed"
                    type="number"
                    placeholder="Leave empty for random"
                    {...form.register('seed', { valueAsNumber: true })}
                  />
                </div>

                {/* Strength */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Edit Strength</Label>
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
            size="lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}