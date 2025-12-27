'use client'

import { useResumeStore } from '@/store/resumeStore'
import ModernTemplate from './templates/ModernTemplate'
import ClassicTemplate from './templates/ClassicTemplate'
import CreativeTemplate from './templates/CreativeTemplate'

export default function LivePreview() {
  const { resumeData } = useResumeStore()

  const renderTemplate = () => {
    switch (resumeData.template) {
      case 'modern':
        return <ModernTemplate data={resumeData} />
      case 'classic':
        return <ClassicTemplate data={resumeData} />
      case 'creative':
        return <CreativeTemplate data={resumeData} />
      default:
        return <ModernTemplate data={resumeData} />
    }
  }

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-8 overflow-y-auto max-h-[800px]">
        <div className="resume-preview">{renderTemplate()}</div>
      </div>
    </div>
  )
}
