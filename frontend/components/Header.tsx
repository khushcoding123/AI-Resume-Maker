'use client'

import { useResumeStore } from '@/store/resumeStore'
import { FiDownload, FiFileText, FiRefreshCw } from 'react-icons/fi'
import { generatePDF } from '@/utils/pdfGenerator'
import toast from 'react-hot-toast'

export default function Header() {
  const { resumeData, setTemplate, resetResume } = useResumeStore()

  const handleExportPDF = async () => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf' })
      await generatePDF(resumeData)
      toast.success('PDF generated successfully!', { id: 'pdf' })
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred'
      console.error('PDF generation error:', error)
      toast.error(`Failed to generate PDF: ${errorMessage}`, { id: 'pdf', duration: 5000 })
    }
  }

  return (
    <header className="bg-white shadow-md py-4 mb-8">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary-600">AI Resume Maker</h1>
        
        <div className="flex gap-4 items-center">
          <select
            value={resumeData.template}
            onChange={(e) => setTemplate(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="creative">Creative</option>
          </select>
          
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 transition-colors"
          >
            <FiDownload /> Export PDF
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('⚠️ Are you sure you want to clear ALL fields? This will delete all your resume data and cannot be undone.')) {
                resetResume()
                toast.success('All fields cleared successfully!', { 
                  duration: 3000,
                  icon: '✅'
                })
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 flex items-center gap-2 transition-colors font-medium"
            title="Clear all resume fields"
          >
            <FiRefreshCw /> Clear All
          </button>
        </div>
      </div>
    </header>
  )
}
