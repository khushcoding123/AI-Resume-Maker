const express = require('express')
const router = express.Router()
const {
  generateBullet,
  generateSummary,
  tailorResume,
  agentEditResume,
} = require('../services/llmService')
const fs = require('fs')
const path = require('path')

// Load prompts
const loadPrompt = (filename) => {
  const promptPath = path.join(__dirname, '../../prompts', filename)
  if (!fs.existsSync(promptPath)) {
    console.warn(`Prompt file not found: ${promptPath}`)
    return '' // Return empty string if prompt file doesn't exist
  }
  return fs.readFileSync(promptPath, 'utf-8')
}

router.post('/generate-bullet', async (req, res) => {
  try {
    const { position, company, context } = req.body

    if (!position || !company) {
      return res.status(400).json({ error: 'Position and company are required' })
    }

    const prompt = loadPrompt('bullet-point.txt')
    const bullets = await generateBullet(position, company, context, prompt)

    res.json({ bullets })
  } catch (error) {
    console.error('Error generating bullet point:', error)
    res.status(500).json({ error: 'Failed to generate bullet point' })
  }
})

router.post('/generate-summary', async (req, res) => {
  try {
    const { resumeData } = req.body

    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' })
    }

    const prompt = loadPrompt('summary.txt')
    const summary = await generateSummary(resumeData, prompt)

    res.json({ summary })
  } catch (error) {
    console.error('Error generating summary:', error)
    res.status(500).json({ error: 'Failed to generate summary' })
  }
})

router.post('/tailor-resume', async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body

    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: 'Resume data and job description are required' })
    }

    const prompt = loadPrompt('tailor-resume.txt')
    const tailoredResume = await tailorResume(resumeData, jobDescription, prompt)

    res.json({ tailoredResume })
  } catch (error) {
    console.error('Error tailoring resume:', error)
    res.status(500).json({ error: 'Failed to tailor resume' })
  }
})

router.post('/agent-edit', async (req, res) => {
  try {
    const { resumeData, instructions } = req.body

    if (!resumeData || !instructions) {
      return res
        .status(400)
        .json({ error: 'Resume data and instructions are required' })
    }

    const result = await agentEditResume(resumeData, instructions)
    res.json(result)
  } catch (error) {
    console.error('Error editing resume via agent:', error)
    res.status(500).json({ error: 'Failed to process agent instructions' })
  }
})

module.exports = router
