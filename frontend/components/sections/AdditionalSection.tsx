'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { FiTrash2, FiPlus } from 'react-icons/fi'

export default function AdditionalSection() {
  const {
    resumeData,
    addCertification,
    removeCertification,
    addLanguage,
    removeLanguage,
  } = useResumeStore()

  const [newCert, setNewCert] = useState('')
  const [newLang, setNewLang] = useState('')

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Additional Information</h3>

      {/* Certifications */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-lg mb-4">Certifications</h4>
        <div className="space-y-2">
          {resumeData.certifications.map((cert, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg">{cert}</span>
              <button
                onClick={() => removeCertification(idx)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newCert}
              onChange={(e) => setNewCert(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newCert.trim()) {
                  addCertification(newCert.trim())
                  setNewCert('')
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter certification name..."
            />
            <button
              onClick={() => {
                if (newCert.trim()) {
                  addCertification(newCert.trim())
                  setNewCert('')
                }
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <FiPlus /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-lg mb-4">Languages</h4>
        <div className="space-y-2">
          {resumeData.languages.map((lang, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg">{lang}</span>
              <button
                onClick={() => removeLanguage(idx)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newLang}
              onChange={(e) => setNewLang(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newLang.trim()) {
                  addLanguage(newLang.trim())
                  setNewLang('')
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter language and proficiency (e.g., Spanish - Fluent)"
            />
            <button
              onClick={() => {
                if (newLang.trim()) {
                  addLanguage(newLang.trim())
                  setNewLang('')
                }
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <FiPlus /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
