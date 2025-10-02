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
  onBackgroundSelect?: (group: 'Joyex1' | 'Joyex2' | 'Joyex3', title: string) => void
}

const JOYEX1_PROMPTS = [
  "Create a professional Amazon advertising image featuring the provided Christmas ornament (must preserve 100% original artwork, text, and details). Scene: Ornament hanging on a beautifully decorated Christmas tree branch with fairy lights, pine garlands, and shiny baubles. Background softly blurred with festive bokeh. Lighting: Soft golden tones with candlelight reflections, highlighting the ornament's surface and material depth. Style: Photorealistic, high-resolution, professional Amazon listing style.",
  "Create an Amazon advertising image featuring the provided Christmas ornament (100% original detail, unchanged). Scene: Ornament placed on a festive holiday dining table surrounded by pine cones, candles, crystal glasses, and wrapped gifts. Warm cozy atmosphere of a family gathering. Lighting: Soft golden tones with candlelight reflections, emphasizing the ornament's texture and depth. Style: Photorealistic, high-resolution, natural holiday setting.",
  "Design a professional Amazon advertising image featuring the provided Christmas ornament (keep all original details unchanged). Scene: Ornament displayed on a wooden windowsill with frosted glass and snow gently falling outside. Nearby candles and pine garlands enhance the cozy setting. Lighting: Soft golden tones with candlelight reflections, highlighting the ornament's surface and material depth. Style: Photorealistic, premium Amazon style.",
  "Create a professional Amazon advertising image showing the provided Christmas ornament (100% true to input, no alterations). Scene: Ornament carefully placed inside an open festive gift box with tissue paper, surrounded by holiday wrapping paper, pine sprigs, and fairy lights. Atmosphere joyful and gift-focused. Lighting: Soft golden tones with candlelight reflections, emphasizing the ornament's layered material depth. Style: High-resolution, photorealistic, authentic Amazon listing style.",
  "Create an Amazon advertising image featuring the provided Christmas ornament (preserve 100% original details). Scene: Ornament displayed on a decorated fireplace mantel with stockings, pine garlands, and glowing candles. A warm fire glows in the background. Lighting: Soft golden tones with candlelight reflections, highlighting the ornament's surface and material depth. Style: Photorealistic, high-resolution, elegant Amazon holiday advertisement."
]

// Short titles for Joyex1 buttons
const JOYEX1_TITLES = [
  'Christmas Tree',
  'Holiday Dining Table',
  'Snowy Windowsill',
  'Gift Box',
  'Fireplace Mantel',
]

// Joyex2 block: 6 prompts styled similarly to Joyex1
const JOYEX2_PROMPTS = [
  "Create a professional Amazon advertising image featuring the provided Christmas ornament (preserve 100% original details). Scene: Outdoor winter market stall with twinkling lights, pine wreaths, and gentle snowfall. Lighting: Cool winter daylight with warm accent highlights. Style: Photorealistic, high-resolution retail scene.",
  "Create a professional Amazon advertising image featuring the provided Christmas ornament (no changes to original details). Scene: Cozy reading nook with wooden shelves, open book, soft blanket, and candlelight glow. Lighting: Warm ambient tones with gentle shadows. Style: Photorealistic, premium lifestyle setting.",
  "Design a professional advertising image with the provided ornament (preserve artwork and text 100%). Scene: Modern living room shelf with minimal decor, matte textures, and soft directional lighting. Lighting: Clean studio-like, subtle highlights. Style: Photorealistic, high-resolution, modern interior.",
  "Create a studio product shot for Amazon featuring the provided ornament (100% original details preserved). Scene: Minimalist backdrop with neutral colors, soft reflections, and controlled shadows. Lighting: Professional studio softbox illumination. Style: Photorealistic, high-resolution product photography.",
  "Create a professional advertising image featuring the provided ornament (keep all details unchanged). Scene: Snowy park bench with pine branches, soft winter light, and distant bokeh. Lighting: Cool daylight with warm accent glows. Style: Photorealistic, high-resolution outdoor winter scene.",
  "Design a professional advertising image featuring the provided ornament (no alterations). Scene: Holiday gift wrapping station with ribbon, craft paper, scissors, and fairy lights. Lighting: Warm indoor tones with focused highlights. Style: Photorealistic, high-resolution creative workspace."
]

const JOYEX2_TITLES = [
  'Winter Market',
  'Cozy Reading Nook',
  'Modern Shelf',
  'Studio Product Shot',
  'Snowy Park Bench',
  'Gift Wrapping Station',
]

// Joyex3 block: 6 prompts (keep JSON and titles exactly as provided)
const JOYEX3_PROMPTS = [
  `{
    "prompt": {
      "title": "Christmas Ornament Ad - Frost Hero White Background",
      "type": "image",
      "requirements": {
        "product": "Show the ornament’s front side exactly as in Image 1, with full fidelity to artwork, text, and proportions.",
        "dimensions": "Scale ~10cm, centered on canvas.",
        "display": "Ornament isolated on icy white background with subtle frosted texture, ribbon visible.",
        "background": "Clean frosty white-blue gradient, soft snow particles faintly visible.",
        "lighting": "Cool white studio lighting with icy highlights and gentle shadow under product.",
        "style": "Amazon-compliant hero photo, ultra-realistic with cold winter tone.",
        "overlay_text": [
          "❄ Frost Edition ❄",
          "Premium Holiday Ornament"
        ]
      }
    }
  }`,
  `{
    "prompt": {
      "title": "Christmas Ornament Ad - Snowy Pine Tree Close-up",
      "type": "image",
      "requirements": {
        "product": "Preserve ornament details exactly, hanging on pine branch.",
        "dimensions": "Ornament realistic ~10cm vs pine needles.",
        "display": "Hang ornament on green pine branch dusted with snow.",
        "background": "Christmas tree bokeh lights in white-blue tone, blurred softly.",
        "lighting": "Cool icy highlights on ornament, white fairy lights glowing behind, shimmer reflections.",
        "style": "Ultra-realistic macro lifestyle with cold blue Christmas mood.",
        "overlay_text": [
          "✨ Frosted Elegance ✨",
          "Shine Bright on Snowy Nights"
        ]
      }
    }
  }`,
  `{
    "prompt": {
      "title": "Christmas Ornament Ad - Frosted Window Scene",
      "type": "image",
      "requirements": {
        "product": "Show ornament front faithfully, hanging by frosted window.",
        "dimensions": "Scale ~10cm compared with window frame.",
        "display": "Ornament placed near frosty wooden window frame with snowfall outside.",
        "background": "Cold blue snowy outdoors, pine silhouettes, frosty glass details.",
        "lighting": "Soft indoor warm light mixed with cold bluish outdoor light, creating contrast.",
        "style": "Premium lifestyle holiday photography.",
        "overlay_text": [
          "❄ Winter Glow ❄",
          "Bring Light to Frosty Nights"
        ]
      }
    }
  }`,
  `{
    "prompt": {
      "title": "Christmas Ornament Ad - Snow Gift Box Edition",
      "type": "image",
      "requirements": {
        "product": "Show ornament exactly as in Image 1, resting inside a silver gift box.",
        "dimensions": "Ornament scale ~10cm compared with box.",
        "display": "Ornament inside icy silver-white gift box with snowy ribbon.",
        "background": "Snow-dusted pine branches, frosted surface, subtle fairy lights white-blue.",
        "lighting": "Cool ambient glow with icy highlights reflecting off ornament.",
        "style": "Luxury winter gift scene with frosted elegance.",
        "overlay_text": [
          "🎁 Frost Gift 🎁",
          "Perfect Winter Present"
        ]
      }
    }
  }`,
  `{
    "prompt": {
      "title": "Christmas Ornament Ad - Snow Globe Magic",
      "type": "image",
      "requirements": {
        "product": "Ornament front displayed exactly, floating inside snow globe effect.",
        "dimensions": "Ornament realistic ~10cm inside sphere.",
        "display": "Glass-like snow globe with falling snow around ornament.",
        "background": "Blue-white wintry gradient with sparkle effects.",
        "lighting": "Icy glow around globe, reflections and highlights crisp.",
        "style": "Fantasy winter premium photo blending magic and realism.",
        "overlay_text": [
          "✨ Snow Globe Edition ✨",
          "Capture the Frosty Spirit"
        ]
      }
    }
  }`,
  `{
    "prompt": {
      "title": "Christmas Ornament Ad - Winter Forest Moonlight",
      "type": "image",
      "requirements": {
        "product": "Show ornament’s front exactly, hanging from snowy pine branch.",
        "dimensions": "Scale ~10cm, realistic ratio vs pine.",
        "display": "Ornament hanging in moonlit snowy forest.",
        "background": "Tall pine trees with snow, pale blue moonlight, faint stars in sky.",
        "lighting": "Cold silver-blue moonlight highlights snow, ornament softly illuminated to stand out.",
        "style": "Cinematic lifestyle with serene, mystical mood.",
        "overlay_text": [
          "🌙 Winter Night Charm 🌙",
          "Moonlit Magic for Your Tree"
        ]
      }
    }
  }`
]

const JOYEX3_TITLES = [
  'Christmas Ornament Ad - Frost Hero White Background',
  'Christmas Ornament Ad - Snowy Pine Tree Close-up',
  'Christmas Ornament Ad - Frosted Window Scene',
  'Christmas Ornament Ad - Snow Gift Box Edition',
  'Christmas Ornament Ad - Snow Globe Magic',
  'Christmas Ornament Ad - Winter Forest Moonlight',
]

// Removed legacy QUICK_PROMPTS list per request

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
  mode = 'edit',
  onBackgroundSelect,
}: PromptPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showJoyex1, setShowJoyex1] = useState(false)
  const [showJoyex2, setShowJoyex2] = useState(false)
  const [showJoyex3, setShowJoyex3] = useState(false)

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
                      onBackgroundSelect?.('Joyex1', JOYEX1_TITLES[index] ?? `Prompt ${index + 1}`)
                    }}
                  >
                      {JOYEX1_TITLES[index] ?? `Prompt ${index + 1}`}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Joyex2 Dropdown */}
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowJoyex2(!showJoyex2)}
              >
                Joyex2
                <ChevronDown className={cn("h-4 w-4 transition-transform", showJoyex2 && "rotate-180")} />
              </Button>
              {showJoyex2 && (
                <div className="space-y-2 pl-4 border-l-2 border-muted">
                  {JOYEX2_PROMPTS.map((prompt, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="justify-start text-left h-auto py-2 px-3 w-full text-xs"
                    onClick={() => {
                      form.setValue('prompt', prompt)
                      setShowJoyex2(false)
                      onBackgroundSelect?.('Joyex2', JOYEX2_TITLES[index] ?? `Prompt ${index + 1}`)
                    }}
                  >
                      {JOYEX2_TITLES[index] ?? `Prompt ${index + 1}`}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Joyex3 Dropdown */}
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowJoyex3(!showJoyex3)}
              >
                Joyex3
                <ChevronDown className={cn("h-4 w-4 transition-transform", showJoyex3 && "rotate-180")} />
              </Button>
              {showJoyex3 && (
                <div className="space-y-2 pl-4 border-l-2 border-muted">
                  {JOYEX3_PROMPTS.map((prompt, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="justify-start text-left h-auto py-2 px-3 w-full text-xs"
                      onClick={() => {
                        form.setValue('prompt', prompt)
                        setShowJoyex3(false)
                        onBackgroundSelect?.('Joyex3', JOYEX3_TITLES[index] ?? `Prompt ${index + 1}`)
                      }}
                    >
                      {JOYEX3_TITLES[index] ?? `Prompt ${index + 1}`}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Legacy quick prompts removed */}
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