'use client'

import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface JoyerLoadingProps {
  className?: string
  message?: string
}

export function JoyerLoading({ className, message = "Generating your image..." }: JoyerLoadingProps) {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [dots, setDots] = useState('')

  const messages = [
    "Calm down Joyer! 🎨",
    "Hold your horses! AI is cooking... 🍳",
    "Joyer's having a creative moment... 🤔",
    "Brewing some pixel magic! ✨",
    "Teaching pixels to dance... 💃",
    "AI is caffeinated and ready! ☕",
    "Joyer's in the zone... shh! 🤫",
    "Making art, not war! 🎭",
    "Pixels are getting their makeover! 💄",
    "Joyer says: 'Almost there, buddy!' 🚀"
  ]

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 2500)

    const dotsInterval = setInterval(() => {
      setDots((prev) => prev.length >= 3 ? '' : prev + '.')
    }, 400)

    return () => {
      clearInterval(messageInterval)
      clearInterval(dotsInterval)
    }
  }, [messages.length])

  return (
    <div className={cn("relative flex flex-col items-center justify-center p-12 space-y-8 min-h-[400px] overflow-hidden bg-white", className)}>
      
      {/* Main Joyer Container */}
      <div className="relative z-10">
        
        {/* Joyer Character Container - Clean white background */}
        <div className="relative w-40 h-40 rounded-full bg-white p-2 border-2 border-gray-200 shadow-lg">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden">
            
            {/* Real Joyer Image - Clean background */}
            <div className="relative w-28 h-28 z-10">
              <Image
                src="/joyer.png"
                alt="Joyer"
                fill
                className="object-contain"
                priority
                style={{ background: 'transparent' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Simple Message Display */}
      <div className="text-center space-y-4 z-10 relative">
        <div className="text-2xl font-bold text-gray-800">
          <span className="inline-block">
            {messages[currentMessage]}
          </span>
        </div>
        
        <p className="text-base text-gray-600 font-medium">
          {message}{dots}
        </p>

        {/* Simple Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Simple Loading Bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gray-400 rounded-full animate-pulse" />
        </div>
        
        {/* Simple Status Text */}
        <div className="text-sm text-gray-500 font-medium">
          ✨ Joyer's working his magic... patience, young padawan! ✨
        </div>
      </div>
    </div>
  )
}