'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { FiMessageSquare, FiSend, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useResumeStore } from '@/store/resumeStore'
import { agentEditResume } from '@/utils/api'

type Message = {
  role: 'assistant' | 'user'
  content: string
}

export default function AIAgentChat() {
  const { resumeData, setResumeData } = useResumeStore()
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hi! Describe the changes you would like to make to your resume and I will update it for you.',
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (event?: FormEvent) => {
    event?.preventDefault()
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt || isLoading) {
      return
    }

    const userMessage: Message = { role: 'user', content: trimmedPrompt }
    setMessages((prev) => [...prev, userMessage])
    setPrompt('')
    setIsLoading(true)

    try {
      const response = await agentEditResume(resumeData, trimmedPrompt)
      setResumeData(response.resumeData)
      const assistantMessage: Message = {
        role: 'assistant',
        content:
          response.message ||
          'Your resume has been updated. Review the editor to confirm.',
      }
      setMessages((prev) => [...prev, assistantMessage])
      toast.success('Resume updated with AI Agent')
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I was unable to apply those changes. Please try again in a moment.',
        },
      ])
      toast.error('Failed to run AI Agent')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-white shadow-lg transition hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-200"
      >
        <FiMessageSquare />
        {isOpen ? 'Close AI Agent' : 'AI Agent'}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[480px] w-96 max-w-[calc(100%-2rem)] flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">AI Agent</p>
              <p className="text-xs text-gray-500">
                Give a prompt and I&apos;ll edit the resume for you.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <FiX />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-100 px-4 py-3">
            <form onSubmit={handleSend} className="space-y-2">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-inner focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="e.g. Emphasize my data science skills and add a bullet that highlights Python projects."
                disabled={isLoading}
              />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Agent will update the fields directly.</span>
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  <FiSend />
                  {isLoading ? 'Working...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

