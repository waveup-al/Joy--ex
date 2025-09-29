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
  const [currentQuote, setCurrentQuote] = useState(0)

  const messages = [
    "Calm down Joyer! 🎨",
    "Hold your horses! AI is cooking... 🍳",
    "Joyer's having a creative moment... 🤔",
    "Joyer's in the zone... shh! 🤫",
    "Making art, not war! 🎭",
    "Joyer says: 'Almost there, buddy!' 🚀"
  ]

  const commentQuotes = [
    "Calm down Joyer! 🎨",
    "Making art, not war! 🎭",
    "Almost there, buddy! 🚀",
    "Patience is a virtue! 😌",
    "Good things take time! ⏰",
    "Art in progress... 🎪",
    "Masterpiece loading... 🖼️",
    "Coffee break? Nah, still working! ☕",
    "Pixels are dancing! 💃",
    "Magic happens here! ✨",
    "Brewing some digital awesomeness! 🧙‍♂️",
    "Hold tight, genius at work! 🤓",
    "Creating unicorns and rainbows! 🦄",
    "Joyer's in beast mode! 🔥"
  ]

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 2500)

    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % commentQuotes.length)
    }, 3000)

    const dotsInterval = setInterval(() => {
      setDots((prev) => prev.length >= 3 ? '' : prev + '.')
    }, 400)

    return () => {
      clearInterval(messageInterval)
      clearInterval(quoteInterval)
      clearInterval(dotsInterval)
    }
  }, [messages.length, commentQuotes.length])

  return (
    <div className={cn("relative flex flex-col items-center justify-center p-12 space-y-8 min-h-[400px] overflow-hidden bg-transparent", className)}>
      
      {/* Comment Bubbles Above Joyer */}
      <div className="relative z-20 mb-4">
        {/* Main Comment Bubble */}
        <div className="relative animate-float">
          <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl px-6 py-4 shadow-lg max-w-xs">
            <p className="text-sm font-semibold text-gray-700 text-center">
              {commentQuotes[currentQuote]}
            </p>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/80 backdrop-blur-sm border-r-2 border-b-2 border-gray-200 rotate-45"></div>
          </div>
        </div>

        {/* Floating Mini Bubbles */}
        <div className="absolute -top-8 -left-4 w-3 h-3 bg-blue-200/60 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -top-6 left-8 w-2 h-2 bg-purple-200/60 rounded-full animate-bounce opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -top-10 right-2 w-2.5 h-2.5 bg-pink-200/60 rounded-full animate-bounce opacity-70" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Main Joyer Container */}
      <div className="relative z-10">
        
        {/* Joyer Character Container - Enhanced with subtle glow */}
        <div className="relative w-40 h-40 rounded-full bg-white p-2 border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden">
            
            {/* Subtle rotating ring */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 animate-spin opacity-30" style={{ animationDuration: '8s' }}></div>
            
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

      {/* Enhanced Message Display */}
      <div className="text-center space-y-4 z-10 relative">
        <div className="text-2xl font-bold text-gray-800 animate-pulse">
          <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {messages[currentMessage]}
          </span>
        </div>
        
        <p className="text-base text-gray-600 font-medium">
          {message}{dots}
        </p>

        {/* Enhanced Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce shadow-md" />
          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce shadow-md" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full animate-bounce shadow-md" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Enhanced Loading Bar */}
        <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse shadow-sm" />
        </div>
        
        {/* Enhanced Status Text */}
        <div className="text-sm text-gray-500 font-medium animate-pulse">
          ✨ Joyer's working his magic... patience, young padawan! ✨
        </div>
      </div>
    </div>
  )
}