import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, Link2, FileText, Image, Github, Figma, Video } from 'lucide-react'
import openaiService from '../services/openai'
import contentExtractor from '../services/contentExtractor'
import portfolioService from '../services/portfolioService'
import LoadingIndicator from './LoadingIndicator'

const UploadSection = ({ onAddProject }) => {
  const [linkInput, setLinkInput] = useState('')
  const [notesInput, setNotesInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStage, setProcessingStage] = useState('')
  const [processingType, setProcessingType] = useState('')
  const [processingProgress, setProcessingProgress] = useState(0)

  // Enhanced AI function to generate project data with content extraction
  const generateProjectData = async (file, type = 'file', additionalNotes = '') => {
    let projectInfo = {
      notes: additionalNotes
    }

    if (type === 'file') {
      projectInfo.file = file
      projectInfo.fileName = file.name
      projectInfo.fileType = file.type
    } else {
      projectInfo.url = file
    }

    // Generate AI-powered title and description with content extraction
    const aiResult = await openaiService.generateProjectDescription(projectInfo)
    const { title, description } = aiResult
    
    let projectType, icon
    if (type === 'link') {
      if (file.includes('github')) {
        projectType = 'github'
        icon = 'github'
      } else if (file.includes('figma')) {
        projectType = 'figma'
        icon = 'figma'
      } else {
        projectType = 'link'
        icon = 'link'
      }
    } else {
      const fileType = file.type || ''
      if (fileType.startsWith('image/')) {
        projectType = 'image'
        icon = 'image'
      } else if (fileType.includes('pdf')) {
        projectType = 'pdf'
        icon = 'pdf'
      } else {
        projectType = 'file'
        icon = 'file'
      }
    }

    return {
      title,
      description,
      type: projectType,
      icon,
      file: type === 'file' ? file : null,
      url: type === 'link' ? file : null,
      preview: type === 'file' && file.type?.startsWith('image/') ? URL.createObjectURL(file) : null,
      notes: additionalNotes || ''
    }
  }

  // Enhanced version with progress tracking
  const generateProjectDataWithProgress = async (file, type = 'file', additionalNotes = '') => {
    let projectInfo = {
      notes: additionalNotes
    }

    if (type === 'file') {
      projectInfo.file = file
      projectInfo.fileName = file.name
      projectInfo.fileType = file.type
    } else {
      projectInfo.url = file
    }

    // Update progress during content extraction
    setProcessingProgress(25)
    
    // Extract content with progress updates
    let extractedContent = null
    if (type === 'file') {
      const fileType = file.type || ''
      if (fileType.includes('pdf')) {
        setProcessingStage('extracting')
        extractedContent = await contentExtractor.extractPDFText(file)
      } else if (fileType.startsWith('image/')) {
        setProcessingStage('extracting')
        extractedContent = await contentExtractor.extractImageText(file)
      }
    } else if (type === 'link') {
      setProcessingStage('extracting')
      extractedContent = await contentExtractor.extractURLContent(file)
    }
    
    setProcessingProgress(60)
    setProcessingStage('analyzing')
    
    // Generate AI-powered title and description
    const aiResult = await openaiService.generateProjectDescription(projectInfo)
    const { title, description } = aiResult
    
    setProcessingProgress(90)
    setProcessingStage('generating')
    
    let projectType, icon
    if (type === 'link') {
      if (file.includes('github')) {
        projectType = 'github'
        icon = 'github'
      } else if (file.includes('figma')) {
        projectType = 'figma'
        icon = 'figma'
      } else {
        projectType = 'link'
        icon = 'link'
      }
    } else {
      const fileType = file.type || ''
      if (fileType.startsWith('image/')) {
        projectType = 'image'
        icon = 'image'
      } else if (fileType.includes('pdf')) {
        projectType = 'pdf'
        icon = 'pdf'
      } else {
        projectType = 'file'
        icon = 'file'
      }
    }
    
    setProcessingProgress(100)

    return {
      title,
      description,
      type: projectType,
      icon,
      file: type === 'file' ? file : null,
      url: type === 'link' ? file : null,
      preview: type === 'file' && file.type?.startsWith('image/') ? URL.createObjectURL(file) : null,
      notes: additionalNotes || '',
      extractedContent: extractedContent || null
    }
  }

  const onDrop = async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      setIsProcessing(true)
      setProcessingType(contentExtractor.detectProjectType(file, null))
      setProcessingStage('extracting')
      setProcessingProgress(0)
      
      try {
        const projectData = await generateProjectDataWithProgress(file, 'file', notesInput)
        onAddProject(projectData)
      } catch (error) {
        console.error('Error processing file:', error)
        // Still add the project with fallback data
        const fallbackData = await generateProjectData(file, 'file', notesInput)
        onAddProject(fallbackData)
      } finally {
        setIsProcessing(false)
        setProcessingProgress(0)
      }
    }
    setNotesInput('')
  }

  const handleLinkSubmit = async (e) => {
    e.preventDefault()
    if (linkInput.trim()) {
      setIsProcessing(true)
      setProcessingType('url')
      setProcessingStage('extracting')
      setProcessingProgress(0)
      
      try {
        const projectData = await generateProjectDataWithProgress(linkInput, 'link', notesInput)
        onAddProject(projectData)
      } catch (error) {
        console.error('Error processing URL:', error)
        // Still add the project with fallback data
        const fallbackData = await generateProjectData(linkInput, 'link', notesInput)
        onAddProject(fallbackData)
      } finally {
        setIsProcessing(false)
        setProcessingProgress(0)
        setLinkInput('')
        setNotesInput('')
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip'],
      'text/*': ['.txt', '.md']
    }
  })

  return (
    <div id="upload-section" className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Your Work
        </h2>
        <p className="text-lg text-gray-600">
          Drag & drop files or paste links to get started
        </p>
      </div>

      {/* Additional Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-500" />
          Additional Notes
        </h3>
        <textarea
          value={notesInput}
          onChange={(e) => setNotesInput(e.target.value)}
          placeholder="Add context, project requirements, or any details that help describe your work..."
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={3}
        />
        <p className="text-sm text-gray-500 mt-2">
          These notes will help generate better project descriptions and provide context for your work.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* File Upload Zone */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary-500" />
            Upload Files
          </h3>
          
          <div 
            {...getRootProps()} 
            className={`upload-zone ${isDragActive ? 'dragover' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6 text-primary-500" />
              </div>
              
              {isDragActive ? (
                <p className="text-primary-600 font-medium">Drop files here...</p>
              ) : (
                <div>
                  <p className="text-gray-700 font-medium">
                    Drop files here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Images, PDFs, ZIP files supported
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-1">
                  <Image className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Images</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">PDFs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Upload className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">ZIP files</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Link Input */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary-500" />
            Add Links
          </h3>
          
          <form onSubmit={handleLinkSubmit} className="space-y-4">
            <div>
              <input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="Paste GitHub, Figma, Loom, or any link..."
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={!linkInput.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Link
            </button>
            
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1">
                <Github className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">GitHub</span>
              </div>
              <div className="flex items-center gap-1">
                <Figma className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Figma</span>
              </div>
              <div className="flex items-center gap-1">
                <Video className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Loom</span>
              </div>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Processing Modal */}
      <AnimatePresence>
        {isProcessing && (
          <LoadingIndicator 
            type={processingType}
            stage={processingStage}
            progress={processingProgress}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default UploadSection 