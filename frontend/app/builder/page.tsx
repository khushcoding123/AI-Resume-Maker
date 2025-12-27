'use client'

import ResumeEditor from '@/components/ResumeEditor'
import LivePreview from '@/components/LivePreview'
import Header from '@/components/Header'
import AIAgentChat from '@/components/AIAgentChat'

export default function BuilderPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">Resume Editor</h2>
            <ResumeEditor />
          </div>
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">Live Preview</h2>
            <LivePreview />
          </div>
        </div>
      </div>
      <AIAgentChat />
    </main>
  )
}

