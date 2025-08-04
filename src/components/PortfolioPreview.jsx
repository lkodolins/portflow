import { motion } from 'framer-motion'
import { Eye, Grid3X3, List } from 'lucide-react'
import { useState } from 'react'
import ProjectCard from './ProjectCard'

const PortfolioPreview = ({ projects, onUpdateProject, onRemoveProject }) => {
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Eye className="w-8 h-8 text-primary-500" />
            Portfolio Preview
          </h2>
          <p className="text-lg text-gray-600">
            {projects.length} project{projects.length !== 1 ? 's' : ''} ready to share
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-1 flex">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              title="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <motion.div
        layout
        className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }`}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={viewMode === 'list' ? 'max-w-2xl' : ''}
          >
            <ProjectCard
              project={project}
              onUpdate={onUpdateProject}
              onRemove={onRemoveProject}
              index={index}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Portfolio Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-primary-50 to-rose-50 rounded-3xl p-6 border border-primary-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {projects.filter(p => p.type === 'image').length}
            </div>
            <div className="text-sm text-gray-600">Images</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {projects.filter(p => ['github', 'figma', 'link'].includes(p.type)).length}
            </div>
            <div className="text-sm text-gray-600">Links</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PortfolioPreview 