import { ResumeData } from '@/store/resumeStore'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Helper function to check if a blob is a valid PDF
async function isValidPDF(blob: Blob): Promise<boolean> {
  try {
    const arrayBuffer = await blob.slice(0, 4).arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    // PDF files start with "%PDF"
    return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46
  } catch {
    return false
  }
}

export async function generatePDF(resumeData: ResumeData): Promise<void> {
  // Try backend first, but always fall back to client-side if it fails
  try {
    const response = await axios.post(
      `${API_BASE_URL}/pdf/generate`,
      { resumeData },
      {
        responseType: 'blob',
        timeout: 30000, // 30 second timeout
      }
    )

    // Check if response is actually a PDF (not an error JSON)
    const contentType = response.headers['content-type'] || ''
    if (contentType.includes('application/pdf') && response.status === 200) {
      // Verify we got a valid PDF blob
      if (response.data && response.data.size > 0) {
        // Double-check it's actually a PDF by checking the magic bytes
        const isValid = await isValidPDF(response.data)
        if (isValid) {
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
          return
        } else {
          console.warn('Backend returned invalid PDF (not a PDF file). Using client-side fallback.')
        }
      }
    } else {
      // Check if it's an error JSON response
      try {
        const text = await response.data.text()
        const errorData = JSON.parse(text)
        console.warn('Backend returned error:', errorData.error || errorData)
      } catch {
        console.warn('Backend returned non-PDF response')
      }
    }
    // If we get here, response wasn't a valid PDF
    throw new Error('Backend did not return a valid PDF')
  } catch (error: any) {
    // Log error but don't throw - we'll use client-side fallback
    if (error.response) {
      // Try to read error message if it's JSON
      if (error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text()
          const errorData = JSON.parse(errorText)
          console.warn('Backend PDF generation failed:', error.response.status, errorData.error || errorData)
        } catch {
          console.warn('Backend PDF generation failed:', error.response.status, error.response.statusText)
        }
      } else {
        console.warn('Backend PDF generation failed:', error.response.status, error.response.data?.error || error.response.statusText)
      }
    } else if (error.request) {
      console.warn('Backend server is not responding. Using client-side PDF generation.')
    } else {
      console.warn('PDF generation error:', error.message)
    }
  }
  
  // Always use client-side fallback if backend fails or is unavailable
  console.log('Generating PDF using client-side method...')
  return await generatePDFClientSide(resumeData)
}

// Client-side PDF generation using html2canvas and jsPDF
async function generatePDFClientSide(resumeData: ResumeData): Promise<void> {
  try {
    console.log('Starting client-side PDF generation...')
    
    // Dynamically import libraries
    const [html2canvasModule, jsPDFModule] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ])
    
    const html2canvas = html2canvasModule.default
    const jsPDF = jsPDFModule.default
    
    console.log('Libraries loaded successfully')
    
    // Wait for any animations or transitions to complete
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Get the actual resume template element
    let previewElement: HTMLElement | null = document.querySelector('.resume-template') as HTMLElement
    
    if (!previewElement) {
      previewElement = document.querySelector('.resume-preview') as HTMLElement
    }
    
    if (!previewElement) {
      const templates = document.querySelectorAll('[class*="template"]')
      if (templates.length > 0) {
        previewElement = templates[0] as HTMLElement
      }
    }
    
    if (!previewElement) {
      throw new Error('Could not find resume preview element. Please make sure the preview is visible on the page.')
    }

    console.log('Found preview element:', previewElement.className)

    // Clone the element for PDF generation to avoid affecting the visible preview
    const clonedElement = previewElement.cloneNode(true) as HTMLElement
    
    // Create a hidden container for PDF generation with exact letter size
    const pdfContainer = document.createElement('div')
    pdfContainer.style.position = 'fixed'
    pdfContainer.style.left = '-10000px'
    pdfContainer.style.top = '0'
    pdfContainer.style.width = '816px' // 8.5 inches at 96 DPI
    pdfContainer.style.height = 'auto'
    pdfContainer.style.backgroundColor = '#ffffff'
    pdfContainer.style.overflow = 'visible'
    pdfContainer.style.padding = '0'
    pdfContainer.style.margin = '0'
    pdfContainer.style.zIndex = '-1000'
    
    // Style the cloned element for PDF - ensure it's exactly 8.5" wide
    clonedElement.style.width = '816px'
    clonedElement.style.maxWidth = '816px'
    clonedElement.style.minWidth = '816px'
    clonedElement.style.margin = '0 auto'
    clonedElement.style.padding = '48px' // 0.5 inch padding (48px at 96 DPI)
    clonedElement.style.boxSizing = 'border-box'
    clonedElement.style.backgroundColor = '#ffffff'
    clonedElement.style.transform = 'none'
    clonedElement.style.position = 'relative'
    clonedElement.style.left = 'auto'
    clonedElement.style.top = 'auto'
    clonedElement.style.display = 'block'
    
    pdfContainer.appendChild(clonedElement)
    document.body.appendChild(pdfContainer)
    
    // Wait for layout to settle
    await new Promise(resolve => setTimeout(resolve, 300))

    // Get dimensions - should be 816px wide
    const rect = clonedElement.getBoundingClientRect()
    const elementWidth = 816 // Fixed at 8.5 inches
    const elementHeight = Math.max(clonedElement.scrollHeight, rect.height)

    console.log('PDF element dimensions:', { elementWidth, elementHeight, rect: { width: rect.width, height: rect.height } })

    // Generate canvas with high quality settings
    console.log('Generating canvas...')
    const canvas = await html2canvas(clonedElement, {
      scale: 2, // Good balance of quality and file size
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: elementWidth,
      height: elementHeight,
      windowWidth: elementWidth,
      windowHeight: elementHeight,
      allowTaint: false,
      removeContainer: false,
      imageTimeout: 15000,
    })

    // Clean up
    document.body.removeChild(pdfContainer)

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error(`Failed to capture resume preview. Canvas dimensions: ${canvas?.width}x${canvas?.height}`)
    }

    console.log('Canvas generated:', { width: canvas.width, height: canvas.height })

    // Create PDF with proper dimensions (Letter size: 8.5" x 11")
    const imgData = canvas.toDataURL('image/png', 1.0) // Maximum quality
    
    // Validate image data
    if (!imgData || imgData.length < 100) {
      throw new Error(`Failed to generate image data. Data length: ${imgData?.length || 0}`)
    }
    
    console.log('Image data generated, creating PDF...')
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      compress: true
    })
    
    // Letter size in mm: 215.9mm x 279.4mm (8.5" x 11")
    const pdfWidth = 215.9
    const pdfHeight = 279.4
    const margin = 12.7 // 0.5 inch margins (standard for resumes)
    const contentWidth = pdfWidth - (margin * 2) // 190.5mm
    const contentHeight = pdfHeight - (margin * 2) // 254mm
    
    // Calculate image dimensions to fit letter size
    // Canvas is at 2x scale, so actual element size = canvas size / 2
    // Element is 816px wide (8.5 inches)
    // At 2x scale: canvas.width = 1632px
    // We want to fit this to contentWidth (190.5mm)
    
    // Convert: 816px at 96 DPI = 8.5 inches = 215.9mm
    // But we have 0.5" margins, so content width = 7.5" = 190.5mm
    // Scale factor: 190.5mm / 215.9mm = 0.882
    
    // Actually simpler: canvas.width / 2 = actual pixels
    // At 96 DPI: 1px = 0.264583mm
    // So: (canvas.width / 2) * 0.264583 = width in mm
    // We want to scale to contentWidth
    
    const pixelsPerMM = 96 / 25.4 // pixels per mm
    const actualWidthMM = (canvas.width / 2) / pixelsPerMM
    const actualHeightMM = (canvas.height / 2) / pixelsPerMM
    
    // Scale to fit content width while maintaining aspect ratio
    const scaleToFit = contentWidth / actualWidthMM
    const imgWidth = contentWidth
    const imgHeight = actualHeightMM * scaleToFit
    
    console.log('PDF dimensions:', { 
      pdfWidth, 
      pdfHeight, 
      contentWidth, 
      contentHeight, 
      imgWidth, 
      imgHeight,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    })
    
    let heightLeft = imgHeight
    let yPosition = margin

    // Add first page
    pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= contentHeight

    // Add additional pages if needed
    while (heightLeft > 0) {
      yPosition = margin - (imgHeight - heightLeft)
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= contentHeight
    }

    // Download PDF
    const fileName = `${resumeData.personalInfo.fullName || 'resume'}-resume.pdf`.replace(/[^a-z0-9]/gi, '_')
    console.log('Saving PDF:', fileName)
    pdf.save(fileName)
    console.log('PDF saved successfully')
  } catch (error: any) {
    console.error('Client-side PDF generation failed:', error)
    console.error('Error stack:', error.stack)
    const errorMessage = error.message || 'Unknown error occurred'
    throw new Error(`PDF generation failed: ${errorMessage}`)
  }
}
