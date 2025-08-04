import { motion } from 'framer-motion'
import { Rocket, Share2, CheckCircle } from 'lucide-react'

const PublishSection = ({ onPublish }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-16"
    >
      {/* Background decoration */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-rose-500/10 rounded-3xl blur-3xl"></div>
        
        <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-12 shadow-xl">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-r from-primary-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6"
          >
            <Rocket className="w-8 h-8 text-white" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Ready to Share Your Work?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Publish your portfolio and get a shareable link to send to clients, collaborators, or anyone you want to impress.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="flex items-center gap-3 text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm">Clean, professional layout</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm">Mobile-responsive design</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm">Instant shareable link</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button 
              onClick={onPublish}
              className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <Share2 className="w-5 h-5" />
              Publish My Portfolio
            </button>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-sm text-gray-500 mt-6"
          >
            Your messy work. Beautifully shown.
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}

export default PublishSection 