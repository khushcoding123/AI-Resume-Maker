'use client'

import { useResumeStore } from '@/store/resumeStore'
import { FiTrash2, FiPlus } from 'react-icons/fi'
import { generateBulletPoint } from '@/utils/api'

export default function ExperienceSection() {
  const { resumeData, addExperience, updateExperience, removeExperience } =
    useResumeStore()

  const handleGenerateBullet = async (expId: string, bulletIndex: number) => {
    const exp = resumeData.experiences.find((e) => e.id === expId)
    if (!exp) return

    try {
      const bullets = await generateBulletPoint(
        exp.position,
        exp.company,
        exp.bullets[bulletIndex] || ''
      )
      if (bullets && bullets.length > 0) {
        const updatedBullets = [...exp.bullets]
        updatedBullets[bulletIndex] = bullets[0]
        updateExperience(expId, { bullets: updatedBullets })
      }
    } catch (error) {
      console.error('Failed to generate bullet point:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Work Experience</h3>
        <button
          onClick={addExperience}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <FiPlus /> Add Experience
        </button>
      </div>

      {resumeData.experiences.map((exp, idx) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-semibold text-lg">Experience #{idx + 1}</h4>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-red-600 hover:text-red-800"
            >
              <FiTrash2 />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Tech Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                disabled={exp.current}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-700">
                Currently working here
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Achievements & Responsibilities
            </label>
            {exp.bullets.map((bullet, bulletIdx) => (
              <div key={bulletIdx} className="flex gap-2 mb-2">
                <textarea
                  value={bullet}
                  onChange={(e) => {
                    const updatedBullets = [...exp.bullets]
                    updatedBullets[bulletIdx] = e.target.value
                    updateExperience(exp.id, { bullets: updatedBullets })
                  }}
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe your achievements and responsibilities..."
                />
                <button
                  onClick={() => handleGenerateBullet(exp.id, bulletIdx)}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  AI Generate
                </button>
                <button
                  onClick={() => {
                    const updatedBullets = exp.bullets.filter((_, i) => i !== bulletIdx)
                    updateExperience(exp.id, { bullets: updatedBullets })
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const updatedBullets = [...exp.bullets, '']
                updateExperience(exp.id, { bullets: updatedBullets })
              }}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 text-sm"
            >
              <FiPlus /> Add Bullet Point
            </button>
          </div>
        </div>
      ))}

      {resumeData.experiences.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No work experience added yet. Click "Add Experience" to get started.
        </p>
      )}
    </div>
  )
}
