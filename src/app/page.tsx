import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Edit3, /* Replace, */ Sparkles, Zap, Shield, Play, CheckCircle, Palette } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Joy Ex</span>
            </div>
            <Link href="/login">
              <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background animation elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30"></div>
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-300 rounded-full animate-float opacity-20"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-purple-300 rounded-full animate-bubble-float opacity-15" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-pink-300 rounded-full animate-float-slow opacity-25" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 right-1/3 w-2 h-2 bg-cyan-300 rounded-full animate-pulse opacity-20" style={{ animationDelay: '0.5s' }}></div>
        
        <div className="max-w-4xl mx-auto text-center animate-fade-in relative z-10">
          {/* AI-Powered Title in Purple Frame */}
          <div className="relative mb-8 inline-block">
            {/* Purple gradient frame with tech bubbles */}
            <div className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden group animate-glow">
              {/* Animated background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-violet-500/30 to-fuchsia-500/20 animate-pulse"></div>
              
              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 animate-shimmer opacity-30"></div>
              
              {/* Tech bubbles inside the frame */}
              <div className="absolute top-3 right-6 w-2.5 h-2.5 bg-white/40 rounded-full animate-bounce opacity-70"></div>
              <div className="absolute bottom-4 left-8 w-2 h-2 bg-white/50 rounded-full animate-pulse opacity-60" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-6 left-12 w-1.5 h-1.5 bg-white/60 rounded-full animate-float opacity-50" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-4 right-12 w-1 h-1 bg-white/70 rounded-full animate-bubble-float opacity-40" style={{ animationDelay: '1.5s' }}></div>
              
              {/* Main title */}
              <h1 className="relative text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-2xl tracking-tight">
                AI-Powered Image Editing
              </h1>
              
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-sm"></div>
              
              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/30 rounded-tl-lg"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/30 rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/30 rounded-bl-lg"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/30 rounded-br-lg"></div>
            </div>
          </div>
          
          {/* Subtitle */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Made Simple
          </h2>
          
          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Transform your images with cutting-edge AI technology. Replace backgrounds, edit multiple images, 
            and create stunning visuals with just a few clicks. Professional results, simplified workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/app">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 min-w-[200px]"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Creating
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 px-8 py-4 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 min-w-[200px]"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Two Powerful Modes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect editing approach for your creative needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Multi-image Edit Mode */}
            <Card className="p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-scale-in relative overflow-hidden group bg-gradient-to-br from-pink-50/70 to-purple-50/70">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              {/* Floating tech bubbles with custom animations */}
              <div className="absolute top-6 right-6 w-2 h-2 bg-blue-400 rounded-full animate-bubble-float opacity-50"></div>
              <div className="absolute top-12 right-12 w-3 h-3 bg-cyan-400 rounded-full animate-float opacity-40" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute bottom-8 left-8 w-2.5 h-2.5 bg-teal-300 rounded-full animate-float-slow opacity-60" style={{ animationDelay: '0.8s' }}></div>
              <div className="absolute top-4 left-16 w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse opacity-30" style={{ animationDelay: '1.2s' }}></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mr-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <Edit3 className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">Multi-image Edit</h3>
                    <p className="text-muted-foreground">Mode A</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Upload multiple images and edit them simultaneously with AI-powered transformations. Perfect for batch processing and consistent styling across your image collection.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Batch image processing</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Natural language prompts</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Drag & drop reordering</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Competitor Style Replace Mode */}
            <Card className="p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-scale-in relative overflow-hidden group bg-gradient-to-br from-pink-50/70 to-purple-50/70" style={{ animationDelay: '0.1s' }}>
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              {/* Floating tech bubbles with custom animations */}
              <div className="absolute top-4 right-8 w-3 h-3 bg-purple-400 rounded-full animate-bubble-float opacity-50"></div>
              <div className="absolute top-16 right-4 w-2 h-2 bg-pink-400 rounded-full animate-float opacity-40" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-violet-300 rounded-full animate-float-slow opacity-60" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-8 left-12 w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-pulse opacity-30" style={{ animationDelay: '1.5s' }}></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <Palette className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">Style Replace</h3>
                    <p className="text-muted-foreground">Mode B</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Analyze competitor images and apply their visual style to your content. Revolutionary technology for maintaining brand consistency while adapting successful design patterns.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Competitor style analysis</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Brand consistency tools</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Advanced AI matching</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Joy Ex?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of image editing with our advanced AI technology
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Process multiple images in seconds with our optimized AI pipeline
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your images are processed securely and never stored permanently
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Professional Quality</h3>
              <p className="text-muted-foreground">
                Get studio-quality results with advanced AI algorithms
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Your Images?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of creators who are already using Joy Ex to create stunning visuals with AI
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform duration-300">
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Joy Ex</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Joy Ex. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
