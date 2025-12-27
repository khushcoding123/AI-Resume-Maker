const { PythonShell } = require('python-shell')
const path = require('path')

async function scoreResume(resumeData, jobDescription) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'json',
      pythonPath: process.env.PYTHON_PATH || 'python',
      scriptPath: path.join(__dirname, '../nlp'),
      args: [
        JSON.stringify(resumeData),
        jobDescription,
      ],
    }

    PythonShell.run('ats_scorer.py', options, (err, results) => {
      if (err) {
        console.error('ATS Scoring Error:', err)
        // Fallback scoring
        const fallbackScore = calculateFallbackScore(resumeData, jobDescription)
        resolve({
          score: fallbackScore,
          feedback: 'Used fallback scoring method. Python ATS scorer unavailable.',
        })
        return
      }

      if (results && results.length > 0) {
        const result = results[0]
        resolve({
          score: result.score || 0,
          feedback: result.feedback || '',
          matches: result.matches || [],
          missing: result.missing || [],
        })
      } else {
        reject(new Error('No results from ATS scorer'))
      }
    })
  })
}

function calculateFallbackScore(resumeData, jobDescription) {
  // Simple keyword matching fallback
  const jobKeywords = jobDescription.toLowerCase().match(/\b\w{4,}\b/g) || []
  const resumeText = extractResumeText(resumeData).toLowerCase()

  let matches = 0
  jobKeywords.forEach((keyword) => {
    if (resumeText.includes(keyword)) {
      matches++
    }
  })

  const score = Math.min(100, Math.round((matches / jobKeywords.length) * 100))
  return score || 50 // Minimum 50% fallback score
}

function extractResumeText(resumeData) {
  let text = ''
  
  if (resumeData.personalInfo?.summary) {
    text += resumeData.personalInfo.summary + ' '
  }

  if (resumeData.experiences) {
    resumeData.experiences.forEach((exp) => {
      text += exp.position + ' ' + exp.company + ' '
      exp.bullets?.forEach((bullet) => {
        text += bullet + ' '
      })
    })
  }

  if (resumeData.skills) {
    resumeData.skills.forEach((skill) => {
      text += skill.items.join(' ') + ' '
    })
  }

  return text
}

module.exports = {
  scoreResume,
}
