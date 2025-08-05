import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, FileText, Image, Github, Figma, Link2, Cloud, CloudOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import portfolioService from '../services/portfolioService'

const PortfolioViewer = ({ portfolioId, onClose }) => {
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        if (portfolioService.isConfigured()) {
          // Try to load from Supabase first
          const result = await portfolioService.getPortfolio(portfolioId)
          
          if (result.success) {
            setPortfolioData({
              id: result.portfolio.id,
              title: result.portfolio.title,
              subtitle: result.portfolio.description,
              projects: result.portfolio.items,
              createdAt: new Date(result.portfolio.created_at).toLocaleDateString(),
              isOnline: !result.offline
            })
            return
          }
        }
        
        // Fallback to localStorage
        const storedProjects = localStorage.getItem('portflow-projects')
        const projects = storedProjects ? JSON.parse(storedProjects) : []
        
        if (projects.length > 0) {
          setPortfolioData({
            id: portfolioId,
            title: 'Creative Portfolio',
            subtitle: 'A collection of professional work',
            projects: projects,
            createdAt: new Date().toLocaleDateString(),
            isOnline: false
          })
        } else {
          setPortfolioData({
            id: portfolioId,
            title: 'Portfolio Not Found',
            projects: [],
            createdAt: new Date().toLocaleDateString(),
            isOnline: false
          })
        }
      } catch (error) {
        console.error('Error loading portfolio:', error)
        setPortfolioData({
          id: portfolioId,
          title: 'Portfolio Error',
          projects: [],
          createdAt: new Date().toLocaleDateString(),
          error: error.message,
          isOnline: false
        })
      } finally {
        setLoading(false)
      }
    }

    loadPortfolio()
  }, [portfolioId])

  const getIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5" />
      case 'pdf':
        return <FileText className="w-5 h-5" />
      case 'github':
        return <Github className="w-5 h-5" />
      case 'figma':
        return <Figma className="w-5 h-5" />
      case 'link':
        return <Link2 className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'image':
        return 'bg-green-100 text-green-700'
      case 'pdf':
        return 'bg-red-100 text-red-700'
      case 'github':
        return 'bg-gray-100 text-gray-700'
      case 'figma':
        return 'bg-purple-100 text-purple-700'
      case 'link':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getPreviewContent = (project) => {
    if (project.preview) {
      return (
        <img 
          src={project.preview} 
          alt={project.title}
          className="w-full h-64 object-cover rounded-2xl"
        />
      )
    }

    return (
      <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${getTypeColor(project.type)}`}>
            {getIcon(project.type)}
          </div>
          <p className="text-gray-600 font-medium capitalize">{project.type}</p>
          <p className="text-sm text-gray-500">Preview</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (!portfolioData || portfolioData.projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Not Found</h2>
          <p className="text-gray-600 mb-8">
            This portfolio may have been removed or the link is invalid.
          </p>
          {onClose && (
            <button onClick={onClose} className="btn-primary">
              Back to Builder
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Builder
            </button>
          )}
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {portfolioData.title}
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              {portfolioData.subtitle}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>Created {portfolioData.createdAt}</span>
              <span>•</span>
              <span>{portfolioData.projects.length} projects</span>
              {portfolioData.isOnline !== undefined && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    {portfolioData.isOnline ? (
                      <>
                        <Cloud className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Cloud Hosted</span>
                      </>
                    ) : (
                      <>
                        <CloudOff className="w-4 h-4 text-orange-500" />
                        <span className="text-orange-600">Local Preview</span>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioData.projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Project Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${getTypeColor(project.type)}`}>
                  {getIcon(project.type)}
                </div>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(project.type)}`}>
                  {project.type}
                </span>
              </div>

              {/* Preview */}
              <div className="mb-6">
                {getPreviewContent(project)}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {project.description}
                </p>

                {project.notes && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-500 text-xs italic leading-relaxed">
                      {project.notes}
                    </p>
                  </div>
                )}

                {/* Action */}
                {project.url && (
                  <div className="pt-4">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors duration-200"
                    >
                      View Project
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 pt-8 border-t border-gray-200"
        >
          <p className="text-gray-500 text-sm">
            Created with{' '}
            <a 
              href="https://portflow.app" 
              className="text-primary-500 hover:text-primary-600 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portflow
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default PortfolioViewer