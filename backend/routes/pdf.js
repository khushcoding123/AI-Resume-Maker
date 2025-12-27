const express = require('express')
const router = express.Router()
const { generatePDF } = require('../services/pdfService')

router.post('/generate', async (req, res) => {
  try {
    const { resumeData } = req.body

    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' })
    }

    console.log('PDF generation request received')
    console.log('Resume template:', resumeData.template || 'not specified')
    
    const pdfBuffer = await generatePDF(resumeData)
    
    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes')

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf')
    res.send(pdfBuffer)
  } catch (error) {
    console.error('Error generating PDF:', error)
    const errorMessage = error.message || 'Failed to generate PDF'
    res.status(500).json({ error: errorMessage })
  }
})

module.exports = router
