import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, ChevronUp, ChevronDown, Zap, Cloud, CloudOff, Brain, FileText, Cpu } from 'lucide-react'
import aiAnalysisService from '../services/aiAnalysisService'

const VersionFooter = ({ analysisStats = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // App version and build info
  const appVersion = "2.1.0" // Phase 2 AI Analysis Engine
  const buildDate = new Date().toISOString().split('T')[0]
  const isProduction = !import.meta.env.DEV
  const environment = isProduction ? 'Production' : 'Development'
  
  // Analysis capabilities
  const capabilities = aiAnalysisService.getCapabilities()
  const hasOpenAI = !!(import.meta.env.VITE_OPENAI_API_KEY)
  const hasSupabase = !!(import.meta.env.VITE_SUPABASE_URL)
  const backendAvailable = aiAnalysisService.isAIAnalysisAvailable()
  
  // Analysis method stats
  const totalAnalyses = Object.values(analysisStats).reduce((sum, count) => sum + count, 0)
  
  const getMethodColor = (method) => {
    switch (method) {
      case 'backend-ai': return 'text-green-600'
      case 'frontend-legacy': return 'text-blue-600'
      case 'pattern-recognition': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }
  
  const getMethodIcon = (method) => {
    switch (method) {
      case 'backend-ai': return <Brain className="w-3 h-3" />
      case 'frontend-legacy': return <Zap className="w-3 h-3" />
      case 'pattern-recognition': return <FileText className="w-3 h-3" />
      default: return <Cpu className="w-3 h-3" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        {/* Compact Version Display */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Portflow v{appVersion}
            </span>
            <div className="flex items-center gap-1">
              {backendAvailable ? (
                <Cloud className="w-3 h-3 text-green-500" />
              ) : (
                <CloudOff className="w-3 h-3 text-orange-500" />
              )}
              <span className="text-xs text-gray-500">
                {backendAvailable ? 'AI' : 'Pattern'}
              </span>
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-100"
            >
              <div className="p-4 space-y-4 text-xs">
                {/* System Info */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    System Status
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-gray-600">
                    <div>Environment: <span className="font-medium">{environment}</span></div>
                    <div>Build: <span className="font-medium">{buildDate}</span></div>
                    <div className="flex items-center gap-1">
                      OpenAI: 
                      <span className={`font-medium ${hasOpenAI ? 'text-green-600' : 'text-red-600'}`}>
                        {hasOpenAI ? 'Connected' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      Supabase: 
                      <span className={`font-medium ${hasSupabase ? 'text-green-600' : 'text-red-600'}`}>
                        {hasSupabase ? 'Connected' : 'Missing'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Capabilities */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    AI Capabilities
                  </h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex items-center gap-1">
                      {capabilities.features.pdfTextExtraction ? '✅' : '❌'} PDF Text Extraction
                    </div>
                    <div className="flex items-center gap-1">
                      {capabilities.features.gpt4Vision ? '✅' : '❌'} GPT-4 Vision Analysis
                    </div>
                    <div className="flex items-center gap-1">
                      {capabilities.features.linkMetadata ? '✅' : '❌'} Link Metadata Extraction
                    </div>
                    <div className="flex items-center gap-1">
                      {capabilities.features.fallbackAnalysis ? '✅' : '❌'} Pattern Recognition Fallback
                    </div>
                  </div>
                </div>

                {/* Analysis Stats */}
                {totalAnalyses > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Session Analysis ({totalAnalyses} total)
                    </h4>
                    <div className="space-y-1">
                      {Object.entries(analysisStats).map(([method, count]) => (
                        <div key={method} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            {getMethodIcon(method)}
                            <span className={`capitalize ${getMethodColor(method)}`}>
                              {method.replace('-', ' ')}
                            </span>
                          </div>
                          <span className="font-medium text-gray-700">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Debug Info */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="text-gray-500 text-xs space-y-1">
                    <div>Backend Available: {backendAvailable ? 'Yes' : 'No'}</div>
                    <div>Hostname: {window.location.hostname}</div>
                    <div>Port: {window.location.port || '80/443'}</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open('https://github.com/lkodolins/portflow', '_blank')}
                      className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center transition-colors"
                    >
                      GitHub
                    </button>
                    <button
                      onClick={() => window.open('/api/analyze-file', '_blank')}
                      className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center transition-colors"
                    >
                      API Test
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default VersionFooter