'use client'

import { useState } from 'react'
import PersonalInfoSection from './sections/PersonalInfoSection'
import ExperienceSection from './sections/ExperienceSection'
import EducationSection from './sections/EducationSection'
import ProjectSection from './sections/ProjectSection'
import SkillSection from './sections/SkillSection'
import AdditionalSection from './sections/AdditionalSection'

export default function ResumeEditor() {
  const [activeTab, setActiveTab] = useState('personal')

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'additional', label: 'Additional' },
  ]

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-h-[600px] overflow-y-auto">
        {activeTab === 'personal' && <PersonalInfoSection />}
        {activeTab === 'experience' && <ExperienceSection />}
        {activeTab === 'education' && <EducationSection />}
        {activeTab === 'projects' && <ProjectSection />}
        {activeTab === 'skills' && <SkillSection />}
        {activeTab === 'additional' && <AdditionalSection />}
      </div>
    </div>
  )
}
