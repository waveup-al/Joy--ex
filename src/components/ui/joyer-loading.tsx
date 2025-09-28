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
  }, [])

  return (
    <div className={cn("relative flex flex-col items-center justify-center p-12 space-y-8 min-h-[400px] overflow-hidden", className)}>
      {/* Animated Rainbow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 via-blue-400 via-green-400 via-yellow-400 to-red-400 animate-color-shift opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500 via-purple-500 via-pink-500 to-orange-500 animate-pulse opacity-15" />
      
      {/* Floating Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 animate-float-slow blur-sm" />
      <div className="absolute top-20 right-16 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-25 animate-bubble-float blur-sm" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full opacity-20 animate-float blur-sm" />
      <div className="absolute bottom-16 right-12 w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-35 animate-pulse blur-sm" />
      
      {/* Main Joyer Container */}
      <div className="relative z-10">
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 via-green-500 via-yellow-500 to-red-500 animate-glow opacity-40 blur-2xl scale-150" />
        
        {/* Rotating Border Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 via-green-500 via-yellow-500 to-red-500 p-1 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm" />
        </div>
        
        {/* Joyer Character Container */}
        <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 via-blue-400 to-violet-400 p-2 animate-glow">
          <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center relative overflow-hidden border-2 border-white/30">
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            
            {/* Real Joyer Image */}
            <div className="relative w-28 h-28 animate-float z-10">
              <Image
                src="/joyer.png"
                alt="Joyer"
                fill
                className="object-contain rounded-full drop-shadow-2xl"
                priority
              />
            </div>

            {/* Dancing Sparkles around Joyer */}
            <div className="absolute top-3 left-3 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-90" />
            <div className="absolute top-6 right-4 w-2 h-2 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-4 left-5 w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-3 right-3 w-3 h-3 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-8 left-8 w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            
            {/* Corner Magic Effects */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-3 border-t-3 border-white/70 rounded-tl-xl animate-pulse" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-r-3 border-t-3 border-white/70 rounded-tr-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-3 border-b-3 border-white/70 rounded-bl-xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-3 border-b-3 border-white/70 rounded-bl-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>

        {/* Orbiting Elements */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-80" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
          <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-70" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full opacity-60" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '7s', animationDirection: 'reverse' }}>
          <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 w-3.5 h-3.5 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-75" />
        </div>
      </div>

      {/* Enhanced Animated Message */}
      <div className="text-center space-y-4 z-10 relative">
        <div className="relative">
          {/* Message Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 blur-lg opacity-30 rounded-2xl" />
          
          <div className="relative text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 via-blue-600 to-violet-600 animate-color-shift px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/20">
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

        {/* Enhanced Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce shadow-lg" />
          <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }} />
          <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.6s' }} />
        </div>

        {/* Enhanced Loading Bar */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/30 shadow-lg">
          <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-full animate-shimmer shadow-inner" />
        </div>
        
        {/* Fun Status Text */}
        <div className="text-sm text-muted-foreground/80 font-medium animate-pulse">
          ✨ Đang tạo ra những điều kỳ diệu... ✨
        </div>
      </div>
    </div>
  )
}