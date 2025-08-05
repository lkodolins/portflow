import { motion } from 'framer-motion'
import { FileText, Image, Link2, Brain } from 'lucide-react'

const LoadingIndicator = ({ type, stage, progress }) => {
  const getIcon = () => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6" />
      case 'image':
        return <Image className="w-6 h-6" />
      case 'url':
        return <Link2 className="w-6 h-6" />
      default:
        return <Brain className="w-6 h-6" />
    }
  }

  const getStageText = () => {
    switch (stage) {
      case 'extracting':
        if (type === 'pdf') return 'Extracting text from PDF...'
        if (type === 'image') return 'Running OCR on image...'
        if (type === 'url') return 'Fetching webpage content...'
        return 'Processing file...'
      case 'analyzing':
        return 'Analyzing content with AI...'
      case 'generating':
        return 'Generating description...'
      default:
        return 'Processing...'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center shadow-2xl">
        {/* Animated Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-r from-primary-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white"
        >
          {getIcon()}
        </motion.div>

        {/* Stage Text */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {getStageText()}
        </h3>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-primary-500 to-rose-500 h-2 rounded-full"
            />
          </div>
        )}

        {/* Dots Animation */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-primary-500 rounded-full"
            />
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-4">
          This may take a few moments...
        </p>
      </div>
    </motion.div>
  )
}

export default LoadingIndicator