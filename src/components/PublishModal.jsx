import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Copy, ExternalLink, Share2, Twitter, Linkedin } from 'lucide-react'

const PublishModal = ({ isOpen, onClose, projects }) => {
  const [copied, setCopied] = useState(false)
  const [portfolioUrl, setPortfolioUrl] = useState('')

  useEffect(() => {
    if (isOpen) {
      // Generate a fake portfolio URL
      const randomId = Math.random().toString(36).substr(2, 9)
      setPortfolioUrl(`https://portflow.app/portfolio/${randomId}`)
    }
  }, [isOpen])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const shareToSocial = (platform) => {
    const text = "Check out my portfolio created with Portflow!"
    const url = portfolioUrl
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      default:
        break
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 15, stiffness: 300 }}
              className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-8 h-8 text-green-600" />
            </motion.div>

            {/* Content */}
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  🎉 Portfolio Published!
                </h3>
                <p className="text-gray-600">
                  Your portfolio with {projects.length} project{projects.length !== 1 ? 's' : ''} is now live and ready to share.
                </p>
              </div>

              {/* Share URL */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 text-left">
                  Share this link:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={portfolioUrl}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`p-3 rounded-2xl transition-all duration-200 ${
                      copied 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                    title="Copy link"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-green-600"
                  >
                    ✅ Link copied to clipboard!
                  </motion.p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <button 
                    onClick={() => window.open(portfolioUrl, '_blank')}
                    className="flex-1 btn-primary inline-flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Portfolio
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className="flex-1 btn-secondary inline-flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Link
                  </button>
                </div>

                {/* Social sharing */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-3">Share on social media:</p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => shareToSocial('twitter')}
                      className="p-3 bg-sky-100 text-sky-600 rounded-2xl hover:bg-sky-200 transition-colors duration-200"
                      title="Share on Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => shareToSocial('linkedin')}
                      className="p-3 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition-colors duration-200"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default PublishModal 