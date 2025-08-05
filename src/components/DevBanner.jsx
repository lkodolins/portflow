import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X, Settings, Zap } from 'lucide-react'

const DevBanner = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  
  // Only show in development/preview
  const isDev = import.meta.env.DEV || window.location.hostname === 'localhost'
  
  if (!isDev || !isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  Development Mode - Advanced AI Features Limited
                </p>
                <p className="text-xs opacity-90">
                  Backend AI analysis requires Vercel deployment. Using smart pattern recognition.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-lg text-xs hover:bg-white/30 transition-colors"
              >
                <Settings className="w-3 h-3" />
                Details
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-white/20 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 pt-3 border-t border-white/20 text-xs space-y-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Active Features:
                    </h4>
                    <ul className="space-y-1 opacity-90">
                      <li>• Smart filename pattern recognition</li>
                      <li>• URL platform detection (GitHub, Figma, etc.)</li>
                      <li>• Intelligent file type analysis</li>
                      <li>• Professional fallback descriptions</li>
                      <li>• Complete UI/UX functionality</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Available in Production:</h4>
                    <ul className="space-y-1 opacity-90">
                      <li>• Real PDF text extraction (2 pages)</li>
                      <li>• GPT-4 Vision for image analysis</li>
                      <li>• Advanced link content extraction</li>
                      <li>• Context-aware AI descriptions</li>
                      <li>• Enhanced portfolio optimization</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-white/10 rounded text-center">
                  <p className="font-medium">
                    Deploy to Vercel with OPENAI_API_KEY to unlock full AI capabilities
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DevBanner