'use client'

import { useResumeStore } from '@/store/resumeStore'
import { FiTrash2, FiPlus } from 'react-icons/fi'

export default function SkillSection() {
  const { resumeData, addSkill, updateSkill, removeSkill } = useResumeStore()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Skills</h3>
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <FiPlus /> Add Skill Category
        </button>
      </div>

      {resumeData.skills.map((skill, idx) => (
        <div key={skill.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-semibold text-lg">
              {skill.category || `Skill Category #${idx + 1}`}
            </h4>
            <button
              onClick={() => removeSkill(skill.id)}
              className="text-red-600 hover:text-red-800"
            >
              <FiTrash2 />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={skill.category}
                onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Programming Languages, Tools, Frameworks, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={skill.items.join(', ')}
                onChange={(e) => {
                  const items = e.target.value.split(',').map((item) => item.trim()).filter(Boolean)
                  updateSkill(skill.id, { items })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="JavaScript, Python, Java"
              />
            </div>
          </div>
        </div>
      ))}

      {resumeData.skills.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No skills added yet. Click "Add Skill Category" to get started.
        </p>
      )}
    </div>
  )
}
