import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'

const HeroSection = () => {
  return (
    <div className="text-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium text-gray-700">Portflow</span>
        </div>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
      >
        Turn your scattered work into a{' '}
        <span className="bg-gradient-to-r from-primary-500 to-rose-500 bg-clip-text text-transparent">
          clean portfolio
        </span>{' '}
        — instantly.
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
      >
        Upload your files, paste links, and get a scrollable page you can share with clients.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-center justify-center gap-4"
      >
        <button 
          onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="btn-primary inline-flex items-center gap-2"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </button>
        <button className="btn-secondary">
          See Example
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-rose-500/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl p-1 shadow-2xl">
            <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-rose-500 rounded-2xl mx-auto mb-4 opacity-50"></div>
                <p className="text-gray-500 font-medium">Portfolio Preview</p>
                <p className="text-sm text-gray-400">Upload your first project to see the magic</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default HeroSection 