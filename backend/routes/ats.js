const express = require('express')
const router = express.Router()
const { scoreResume } = require('../services/atsService')

router.post('/score', async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body

    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: 'Resume data and job description are required' })
    }

    const result = await scoreResume(resumeData, jobDescription)

    res.json(result)
  } catch (error) {
    console.error('Error scoring ATS:', error)
    res.status(500).json({ error: 'Failed to score resume' })
  }
})

module.exports = router
