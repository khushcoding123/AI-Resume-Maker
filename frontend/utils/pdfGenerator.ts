import { ResumeData } from '@/store/resumeStore'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export async function generatePDF(resumeData: ResumeData): Promise<void> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/pdf/generate`,
      { resumeData },
      {
        responseType: 'blob',
        timeout: 30000, // 30 second timeout
      }
    )

    // Create blob URL and trigger download
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const fileName = `${resumeData.personalInfo.fullName || 'resume'}-resume.pdf`.replace(/[^a-z0-9]/gi, '_')
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error: any) {
    console.error('Error generating PDF:', error)
    
    // If backend PDF fails, try client-side fallback
    const shouldFallback = 
      error.response?.status === 500 || 
      error.response?.status === 503 ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT' ||
      error.message?.includes('timeout') ||
      error.message?.includes('Network Error')
    
    if (shouldFallback) {
      console.log('Backend PDF generation failed, trying client-side fallback...')
      try {
        return await generatePDFClientSide(resumeData)
      } catch (fallbackError) {
        console.error('Client-side fallback also failed:', fallbackError)
        throw new Error('PDF generation failed on both server and client. Please check that the backend server is running and Puppeteer is installed.')
      }
    }
    
    // Re-throw with more context
    const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred'
    throw new Error(`PDF generation failed: ${errorMessage}`)
  }
}

// Client-side PDF generation fallback using html2canvas and jsPDF
async function generatePDFClientSide(resumeData: ResumeData): Promise<void> {
  try {
    const html2canvas = (await import('html2canvas')).default
    const jsPDF = (await import('jspdf')).default
    
    // Get the preview element
    const previewElement = document.querySelector('.resume-preview')
    if (!previewElement) {
      throw new Error('Preview element not found')
    }

    // Generate canvas from HTML
    const canvas = await html2canvas(previewElement as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
    })

    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'letter')
    
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Download PDF
    const fileName = `${resumeData.personalInfo.fullName || 'resume'}-resume.pdf`.replace(/[^a-z0-9]/gi, '_')
    pdf.save(fileName)
  } catch (error) {
    console.error('Client-side PDF generation failed:', error)
    throw new Error('PDF generation failed. Please check browser console for details.')
  }
}
