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
    "Patience is a virtue! 😌",
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
      
      {/* Comment Bubble */}
      <div className="bg-white/90 border border-gray-200 rounded-xl px-4 py-3 shadow-md max-w-xs">
        <p className="text-sm font-medium text-gray-700 text-center">
          {commentQuotes[currentQuote]}
        </p>
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/90 border-r border-b border-gray-200 rotate-45"></div>
      </div>

      {/* Joyer Character */}
      <div className="relative w-32 h-32 rounded-full bg-white p-2 border border-gray-200 shadow-lg">
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
          <div className="relative w-24 h-24">
            <Image
              src="/joyer.png"
              alt="Joyer"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Message Display */}
      <div className="text-center space-y-3">
        <p className="text-base text-gray-600 font-medium">
          {message}{dots}
        </p>

        {/* Simple Loading Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  )
}