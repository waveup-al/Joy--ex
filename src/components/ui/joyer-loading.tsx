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
      {/* Comment Bubble - higher contrast */}
      <div className="relative rounded-xl px-4 py-3 shadow-lg max-w-xs bg-black/70 backdrop-blur text-white">
        <p className="text-sm font-semibold text-center drop-shadow">
          {commentQuotes[currentQuote]}
        </p>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-black/70 border-r border-b border-white/20"></div>
      </div>

      {/* Joyer Character with halo and motion */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        {/* Snow/Twinkle particles */}
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/70"
            style={{
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 9) % 70}%`,
              animation: `twinkle ${1.6 + (i % 5) * 0.4}s ease-in-out ${i * 0.15}s infinite`
            }}
          />
        ))}

        {/* Halo glow */}
        <div className="absolute w-40 h-40 rounded-full blur-2xl bg-blue-400/25 animate-pulse-halo" />

        {/* Character bobbing (larger) */}
        <div className="relative w-32 h-32 animate-[float_3s_ease-in-out_infinite]">
          <Image
            src="/joyer.png"
            alt="Joyer"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Message Display */}
      <div className="text-center space-y-3">
        <span className="inline-block px-3 py-2 rounded-lg bg-black/70 text-white text-base font-semibold drop-shadow">
          {message}{dots}
        </span>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2 mt-1">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-twinkle" />
          <div className="w-3 h-3 bg-cyan-300 rounded-full animate-twinkle" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-twinkle" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  )
}