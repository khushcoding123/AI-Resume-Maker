'use client'

import { useResumeStore } from '@/store/resumeStore'
import { FiTrash2, FiPlus } from 'react-icons/fi'

export default function ProjectSection() {
  const { resumeData, addProject, updateProject, removeProject } =
    useResumeStore()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Projects</h3>
        <button
          onClick={addProject}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <FiPlus /> Add Project
        </button>
      </div>

      {resumeData.projects.map((project, idx) => (
        <div key={project.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-semibold text-lg">Project #{idx + 1}</h4>
            <button
              onClick={() => removeProject(project.id)}
              className="text-red-600 hover:text-red-800"
            >
              <FiTrash2 />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="E-commerce Platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Brief description of the project..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project URL
              </label>
              <input
                type="url"
                value={project.url}
                onChange={(e) => updateProject(project.id, { url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://project-url.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={project.technologies.join(', ')}
                onChange={(e) => {
                  const techs = e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                  updateProject(project.id, { technologies: techs })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Points
              </label>
              {project.bullets.map((bullet, bulletIdx) => (
                <div key={bulletIdx} className="flex gap-2 mb-2">
                  <textarea
                    value={bullet}
                    onChange={(e) => {
                      const updatedBullets = [...project.bullets]
                      updatedBullets[bulletIdx] = e.target.value
                      updateProject(project.id, { bullets: updatedBullets })
                    }}
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe key features or achievements..."
                  />
                  <button
                    onClick={() => {
                      const updatedBullets = project.bullets.filter((_, i) => i !== bulletIdx)
                      updateProject(project.id, { bullets: updatedBullets })
                    }}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const updatedBullets = [...project.bullets, '']
                  updateProject(project.id, { bullets: updatedBullets })
                }}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 text-sm"
              >
                <FiPlus /> Add Bullet Point
              </button>
            </div>
          </div>
        </div>
      ))}

      {resumeData.projects.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No projects added yet. Click "Add Project" to get started.
        </p>
      )}
    </div>
  )
}
