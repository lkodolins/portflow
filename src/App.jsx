import { useState } from 'react'
import { motion } from 'framer-motion'
import HeroSection from './components/HeroSection'
import UploadSection from './components/UploadSection'
import PortfolioPreview from './components/PortfolioPreview'
import PublishSection from './components/PublishSection'
import PublishModal from './components/PublishModal'

function App() {
  const [projects, setProjects] = useState([])
  const [showPublishModal, setShowPublishModal] = useState(false)

  const addProject = (project) => {
    setProjects(prev => [...prev, { ...project, id: Date.now() }])
  }

  const updateProject = (id, updates) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...updates } : project
    ))
  }

  const removeProject = (id) => {
    setProjects(prev => prev.filter(project => project.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          <UploadSection onAddProject={addProject} />
        </motion.div>

        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <PortfolioPreview 
              projects={projects}
              onUpdateProject={updateProject}
              onRemoveProject={removeProject}
            />
          </motion.div>
        )}

        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <PublishSection onPublish={() => setShowPublishModal(true)} />
          </motion.div>
        )}
      </div>

      <PublishModal 
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        projects={projects}
      />
    </div>
  )
}

export default App 