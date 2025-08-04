import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, Link2, FileText, Image, Github, Figma, Video } from 'lucide-react'

const UploadSection = ({ onAddProject }) => {
  const [linkInput, setLinkInput] = useState('')

  // Mock AI function to generate project data
  const generateProjectData = (file, type = 'file') => {
    const mockTitles = [
      'E-commerce Dashboard',
      'Mobile App Redesign',
      'Brand Identity System',
      'Portfolio Website',
      'SaaS Landing Page',
      'iOS App Interface',
      'Web Application',
      'Design System',
      'Marketing Campaign',
      'User Research Study'
    ]

    const mockDescriptions = [
      'A comprehensive design solution featuring modern UI patterns, responsive layouts, and seamless user experience. This project showcases advanced design thinking and technical implementation.',
      'An innovative approach to user interface design with focus on accessibility, performance, and visual appeal. Includes detailed user journey mapping and interaction design.',
      'Strategic brand development with cohesive visual identity, typography system, and color palette. Features complete brand guidelines and application examples.',
      'Full-stack development project with modern frameworks, clean architecture, and optimized performance. Includes responsive design and cross-browser compatibility.',
      'Creative problem-solving through design and development, featuring cutting-edge technologies and best practices in user experience design.'
    ]

    const title = mockTitles[Math.floor(Math.random() * mockTitles.length)]
    const description = mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)]
    
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
      preview: type === 'file' && file.type?.startsWith('image/') ? URL.createObjectURL(file) : null
    }
  }

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const projectData = generateProjectData(file)
      onAddProject(projectData)
    })
  }

  const handleLinkSubmit = (e) => {
    e.preventDefault()
    if (linkInput.trim()) {
      const projectData = generateProjectData(linkInput, 'link')
      onAddProject(projectData)
      setLinkInput('')
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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
    </div>
  )
}

export default UploadSection 