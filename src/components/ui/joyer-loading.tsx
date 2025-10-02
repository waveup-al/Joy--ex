'use client'

import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface JoyerLoadingProps {
  className?: string
  message?: string
}

export function JoyerLoading({ className, message = "Generating your image..." }: JoyerLoadingProps) {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [dots, setDots] = useState('')

  const commentQuotes = [
    "Calm down Joyer! 🎨",
    "Making art, not war! 🎭",
    "Almost there, buddy! 🚀",
    "Patience is a virtue! 🧘‍♂️",
    "Good things take time! ⏰",
    "Art in progress... 🎪",
    "Masterpiece loading... 🖼️"
  ]

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % commentQuotes.length)
    }, 3000)

    const dotsInterval = setInterval(() => {
      setDots((prev) => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    return () => {
      clearInterval(quoteInterval)
      clearInterval(dotsInterval)
    }
  }, [commentQuotes.length])

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 space-y-6 min-h-[300px] bg-transparent", className)}>
      {/* Comment Bubble - glass style */}
      <div className="relative glass rounded-xl px-4 py-3 shadow-md max-w-xs">
        <p className="text-sm font-medium text-gray-700 text-center">
          {commentQuotes[currentQuote]}
        </p>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white/30 border-r border-b border-white/30"></div>
      </div>

      {/* Joyer Character with transparent backdrop and motion */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Floating bubbles */}
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-blue-300/30 ring-1 ring-white/40"
            style={{
              width: `${8 + (i % 3) * 4}px`,
              height: `${8 + (i % 3) * 4}px`,
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 5) * 10}%`,
              animation: `bubbleFloat ${2.5 + (i % 4) * 0.6}s ease-in-out ${i * 0.2}s infinite`,
              filter: 'blur(0.2px)'
            }}
          />
        ))}

        {/* Character bobbing */}
        <div className="relative w-24 h-24 animate-[float_3s_ease-in-out_infinite]">
          <Image
            src="/joyer.png"
            alt="Joyer"
            fill
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>
      </div>

      {/* Message Display */}
      <div className="text-center space-y-3">
        <p className="text-base text-gray-700 font-medium">
          {message}{dots}
        </p>

        {/* Loading dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  )
}