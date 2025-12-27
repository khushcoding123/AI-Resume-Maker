const express = require('express')
const router = express.Router()
const { parseResumeFile } = require('../services/parserService')
const path = require('path')
const fs = require('fs')

router.post('/parse', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const filePath = req.file.path
    const parsedResume = await parseResumeFile(filePath)

    // Clean up uploaded file
    fs.unlinkSync(filePath)

    res.json({ parsedResume })
  } catch (error) {
    console.error('Error parsing resume:', error)
    
    // Clean up file on error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError)
      }
    }

    res.status(500).json({ error: 'Failed to parse resume' })
  }
})

module.exports = router
