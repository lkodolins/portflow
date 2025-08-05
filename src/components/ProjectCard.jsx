import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Image, Github, Figma, Link2, ExternalLink, Edit3, Trash2, Save, X } from 'lucide-react'
import EditableText from './EditableText'

const ProjectCard = ({ project, onUpdate, onRemove, index }) => {
  const [isEditing, setIsEditing] = useState(false)
  
  // Analysis method indicator
  const getAnalysisIndicator = (method) => {
    switch (method) {
      case 'backend-ai':
        return { icon: '🧠', text: 'AI Analysis', color: 'text-green-600' }
      case 'frontend-legacy':
        return { icon: '⚡', text: 'Legacy AI', color: 'text-blue-600' }
      case 'pattern-recognition':
        return { icon: '🔍', text: 'Pattern Recognition', color: 'text-orange-600' }
      default:
        return { icon: '📄', text: 'Basic Analysis', color: 'text-gray-600' }
    }
  }
  
  const analysisInfo = getAnalysisIndicator(project.analysisMethod)

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

  const getPreviewContent = () => {
    if (project.preview) {
      return (
        <img 
          src={project.preview} 
          alt={project.title}
          className="w-full h-48 object-cover rounded-2xl"
        />
      )
    }

    return (
      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${getTypeColor(project.type)}`}>
            {getIcon(project.type)}
          </div>
          <p className="text-gray-600 font-medium capitalize">{project.type}</p>
          <p className="text-sm text-gray-500">Preview</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card p-6 group hover:shadow-lg transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${getTypeColor(project.type)}`}>
            {getIcon(project.type)}
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(project.type)}`}>
              {project.type}
            </span>
            {project.analysisMethod && (
              <span 
                className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${analysisInfo.color}`}
                title={`Analyzed using: ${analysisInfo.text}`}
              >
                {analysisInfo.icon}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            title="Edit project"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onRemove(project.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Remove project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="mb-4">
        {getPreviewContent()}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <EditableText
          value={project.title}
          onSave={(value) => onUpdate(project.id, { title: value })}
          isEditing={isEditing}
          className="text-lg font-semibold text-gray-900"
          placeholder="Project title..."
        />

        <EditableText
          value={project.description}
          onSave={(value) => onUpdate(project.id, { description: value })}
          isEditing={isEditing}
          className="text-gray-600 text-sm leading-relaxed"
          placeholder="Project description..."
          multiline
        />

        {project.notes && (
          <div className="pt-2 border-t border-gray-100">
            <EditableText
              value={project.notes}
              onSave={(value) => onUpdate(project.id, { notes: value })}
              isEditing={isEditing}
              className="text-gray-500 text-xs italic leading-relaxed"
              placeholder="Additional notes..."
              multiline
            />
          </div>
        )}

        {/* Action */}
        {project.url && (
          <div className="pt-2">
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
  )
}

export default ProjectCard 