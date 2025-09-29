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
    "AI đang làm phép thuật ✨",
    "Sắp xong rồi... 🚀",
    "Tạo ra điều kỳ diệu! 🌟",
    "Joyer đang suy nghĩ... 🤔",
    "Nghệ thuật đang được sinh ra! 🎭"
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
    <div className={cn("relative flex flex-col items-center justify-center p-12 space-y-8 min-h-[400px] overflow-hidden", className)}>
      {/* Subtle Background Elements - Transparent with minimal opacity */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-10 animate-float-slow blur-sm" />
      <div className="absolute top-20 right-16 w-16 h-16 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-8 animate-bubble-float blur-sm" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-green-200 to-yellow-200 rounded-full opacity-6 animate-float blur-sm" />
      <div className="absolute bottom-16 right-12 w-12 h-12 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-10 animate-pulse blur-sm" />
      
      {/* Main Joyer Container */}
      <div className="relative z-10">
        {/* Subtle Outer Glow Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-300 via-purple-300 via-pink-300 to-violet-300 animate-glow opacity-15 blur-2xl scale-150" />
        
        {/* Rotating Border Ring - More subtle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 via-pink-400 to-violet-400 p-1 animate-spin opacity-30" style={{ animationDuration: '3s' }}>
          <div className="w-full h-full rounded-full bg-white/40 backdrop-blur-sm" />
        </div>
        
        {/* Joyer Character Container - Transparent background */}
        <div className="relative w-40 h-40 rounded-full bg-white/20 backdrop-blur-lg p-2 border-2 border-white/30 shadow-lg">
          <div className="w-full h-full rounded-full bg-transparent flex items-center justify-center relative overflow-hidden">
            
            {/* Subtle Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            
            {/* Real Joyer Image - Transparent background */}
            <div className="relative w-28 h-28 animate-float z-10">
              <Image
                src="/joyer.png"
                alt="Joyer"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                style={{ background: 'transparent' }}
              />
            </div>

            {/* Dancing Sparkles around Joyer - More subtle colors */}
            <div className="absolute top-3 left-3 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-60" />
            <div className="absolute top-6 right-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-4 left-5 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-50" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-3 right-3 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-8 left-8 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce opacity-50" style={{ animationDelay: '0.3s' }} />
            
            {/* Corner Magic Effects - More subtle */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-3 border-t-3 border-gray-400/50 rounded-tl-xl animate-pulse" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-r-3 border-t-3 border-gray-400/50 rounded-tr-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-3 border-b-3 border-gray-400/50 rounded-bl-xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-3 border-b-3 border-gray-400/50 rounded-bl-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>

        {/* Orbiting Elements - More subtle */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-40" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
          <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-35" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full opacity-30" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '7s', animationDirection: 'reverse' }}>
          <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 w-3.5 h-3.5 bg-gradient-to-r from-violet-400 to-blue-400 rounded-full opacity-35" />
        </div>
      </div>

      {/* Enhanced Animated Message */}
      <div className="text-center space-y-4 z-10 relative">
        <div className="relative">
          {/* Message Background Glow - More subtle */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-400 via-blue-400 to-purple-400 blur-lg opacity-10 rounded-2xl" />
          
          <div className="relative text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-blue-600 via-purple-600 to-violet-600 animate-color-shift px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/20">
            <span className="inline-block">
              {messages[currentMessage].split('').map((char, index) => (
                <span
                  key={index}
                  className="inline-block animate-wave"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationDuration: '2s'
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          </div>
        </div>
        
        <p className="text-base text-muted-foreground font-medium">
          {message}{dots}
        </p>

        {/* Enhanced Loading Dots - More subtle colors */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce shadow-lg" />
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }} />
          <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.6s' }} />
        </div>

        {/* Enhanced Loading Bar - More subtle */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/30 shadow-lg">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-violet-500 rounded-full animate-shimmer shadow-inner" />
        </div>
        
        {/* Fun Status Text */}
        <div className="text-sm text-muted-foreground/80 font-medium animate-pulse">
          ✨ Đang tạo ra những điều kỳ diệu... ✨
        </div>
      </div>
    </div>
  )
}