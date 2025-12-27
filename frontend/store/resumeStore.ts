import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  address: string
  linkedin: string
  github: string
  website: string
  summary: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  gpa: string
  honors: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url: string
  bullets: string[]
}

export interface Skill {
  id: string
  category: string
  items: string[]
}

export interface ResumeData {
  personalInfo: PersonalInfo
  experiences: Experience[]
  education: Education[]
  projects: Project[]
  skills: Skill[]
  certifications: string[]
  languages: string[]
  template: 'modern' | 'classic' | 'creative'
}

interface ResumeStore {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
  setPersonalInfo: (info: Partial<PersonalInfo>) => void
  addExperience: () => void
  updateExperience: (id: string, data: Partial<Experience>) => void
  removeExperience: (id: string) => void
  addEducation: () => void
  updateEducation: (id: string, data: Partial<Education>) => void
  removeEducation: (id: string) => void
  addProject: () => void
  updateProject: (id: string, data: Partial<Project>) => void
  removeProject: (id: string) => void
  addSkill: () => void
  updateSkill: (id: string, data: Partial<Skill>) => void
  removeSkill: (id: string) => void
  setTemplate: (template: 'modern' | 'classic' | 'creative') => void
  addCertification: (cert: string) => void
  removeCertification: (index: number) => void
  addLanguage: (lang: string) => void
  removeLanguage: (index: number) => void
  resetResume: () => void
}

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    website: '',
    summary: '',
  },
  experiences: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  languages: [],
  template: 'modern',
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: initialResumeData,
      setResumeData: (data) =>
        set(() => ({
          resumeData: { ...data },
        })),
      
      setPersonalInfo: (info) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            personalInfo: { ...state.resumeData.personalInfo, ...info },
          },
        })),
      
      addExperience: () =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experiences: [
              ...state.resumeData.experiences,
              {
                id: Date.now().toString(),
                company: '',
                position: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                bullets: [''],
              },
            ],
          },
        })),
      
      updateExperience: (id, data) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experiences: state.resumeData.experiences.map((exp) =>
              exp.id === id ? { ...exp, ...data } : exp
            ),
          },
        })),
      
      removeExperience: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experiences: state.resumeData.experiences.filter(
              (exp) => exp.id !== id
            ),
          },
        })),
      
      addEducation: () =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: [
              ...state.resumeData.education,
              {
                id: Date.now().toString(),
                institution: '',
                degree: '',
                field: '',
                location: '',
                startDate: '',
                endDate: '',
                gpa: '',
                honors: [],
              },
            ],
          },
        })),
      
      updateEducation: (id, data) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.map((edu) =>
              edu.id === id ? { ...edu, ...data } : edu
            ),
          },
        })),
      
      removeEducation: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.filter(
              (edu) => edu.id !== id
            ),
          },
        })),
      
      addProject: () =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: [
              ...state.resumeData.projects,
              {
                id: Date.now().toString(),
                name: '',
                description: '',
                technologies: [],
                url: '',
                bullets: [''],
              },
            ],
          },
        })),
      
      updateProject: (id, data) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.map((proj) =>
              proj.id === id ? { ...proj, ...data } : proj
            ),
          },
        })),
      
      removeProject: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.filter(
              (proj) => proj.id !== id
            ),
          },
        })),
      
      addSkill: () =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: [
              ...state.resumeData.skills,
              {
                id: Date.now().toString(),
                category: '',
                items: [],
              },
            ],
          },
        })),
      
      updateSkill: (id, data) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.map((skill) =>
              skill.id === id ? { ...skill, ...data } : skill
            ),
          },
        })),
      
      removeSkill: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.filter(
              (skill) => skill.id !== id
            ),
          },
        })),
      
      setTemplate: (template) =>
        set((state) => ({
          resumeData: { ...state.resumeData, template },
        })),
      
      addCertification: (cert) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            certifications: [...state.resumeData.certifications, cert],
          },
        })),
      
      removeCertification: (index) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            certifications: state.resumeData.certifications.filter(
              (_, i) => i !== index
            ),
          },
        })),
      
      addLanguage: (lang) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            languages: [...state.resumeData.languages, lang],
          },
        })),
      
      removeLanguage: (index) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            languages: state.resumeData.languages.filter(
              (_, i) => i !== index
            ),
          },
        })),
      
      resetResume: () => {
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('resume-storage')
        }
        // Reset to initial state
        set({
          resumeData: { ...initialResumeData },
        })
      },
    }),
    {
      name: 'resume-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
