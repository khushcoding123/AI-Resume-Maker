import axios from 'axios'
import { ResumeData } from '@/store/resumeStore'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function generateBulletPoint(
  position: string,
  company: string,
  context: string = ''
): Promise<string[]> {
  try {
    const response = await api.post('/llm/generate-bullet', {
      position,
      company,
      context,
    })
    return response.data.bullets || []
  } catch (error) {
    console.error('Error generating bullet point:', error)
    throw error
  }
}

export async function generateSummary(resumeData: ResumeData): Promise<string> {
  try {
    const response = await api.post('/llm/generate-summary', {
      resumeData,
    })
    return response.data.summary || ''
  } catch (error) {
    console.error('Error generating summary:', error)
    throw error
  }
}

export async function tailorResume(
  resumeData: ResumeData,
  jobDescription: string
): Promise<ResumeData> {
  try {
    const response = await api.post('/llm/tailor-resume', {
      resumeData,
      jobDescription,
    })
    return response.data.tailoredResume
  } catch (error) {
    console.error('Error tailoring resume:', error)
    throw error
  }
}

export async function scoreATS(
  resumeData: ResumeData,
  jobDescription: string
): Promise<{ score: number; feedback: string }> {
  try {
    const response = await api.post('/ats/score', {
      resumeData,
      jobDescription,
    })
    return {
      score: response.data.score || 0,
      feedback: response.data.feedback || '',
    }
  } catch (error) {
    console.error('Error scoring ATS:', error)
    throw error
  }
}

export async function parseResume(file: File): Promise<ResumeData> {
  try {
    const formData = new FormData()
    formData.append('resume', file)

    const response = await api.post('/parser/parse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.parsedResume
  } catch (error) {
    console.error('Error parsing resume:', error)
    throw error
  }
}

export async function agentEditResume(
  resumeData: ResumeData,
  instructions: string
): Promise<{ resumeData: ResumeData; message: string }> {
  try {
    const response = await api.post('/llm/agent-edit', {
      resumeData,
      instructions,
    })
    return {
      resumeData: response.data.resumeData || resumeData,
      message:
        response.data.message ||
        'I applied your instructions. Please review the updated resume.',
    }
  } catch (error) {
    console.error('Error editing resume with agent:', error)
    throw error
  }
}