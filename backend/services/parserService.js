const pdfParse = require('pdf-parse')
const mammoth = require('mammoth')
const { PythonShell } = require('python-shell')
const path = require('path')
const fs = require('fs')

async function parseResumeFile(filePath) {
  const fileExt = path.extname(filePath).toLowerCase()

  try {
    let text = ''

    if (fileExt === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath)
      const pdfData = await pdfParse(dataBuffer)
      text = pdfData.text
    } else if (fileExt === '.docx' || fileExt === '.doc') {
      const result = await mammoth.extractRawText({ path: filePath })
      text = result.value
    } else {
      throw new Error('Unsupported file format')
    }

    // Use Python NLP to parse the text
    return await parseResumeText(text)
  } catch (error) {
    console.error('Error parsing resume file:', error)
    throw error
  }
}

async function parseResumeText(text) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'json',
      pythonPath: process.env.PYTHON_PATH || 'python',
      scriptPath: path.join(__dirname, '../nlp'),
      args: [text],
    }

    PythonShell.run('resume_parser.py', options, (err, results) => {
      if (err) {
        console.error('Resume Parsing Error:', err)
        // Fallback to basic parsing
        const fallbackParsed = parseResumeTextFallback(text)
        resolve(fallbackParsed)
        return
      }

      if (results && results.length > 0) {
        resolve(results[0])
      } else {
        reject(new Error('No results from resume parser'))
      }
    })
  })
}

function parseResumeTextFallback(text) {
  // Basic fallback parsing without NLP
  const lines = text.split('\n').map((line) => line.trim()).filter((line) => line.length > 0)

  const personalInfo = {
    fullName: lines[0] || '',
    email: extractEmail(text),
    phone: extractPhone(text),
    address: '',
    linkedin: extractLinkedIn(text),
    github: extractGitHub(text),
    website: '',
    summary: '',
  }

  // Basic structure
  return {
    personalInfo,
    experiences: [],
    education: [],
    projects: [],
    skills: [],
    certifications: [],
    languages: [],
    template: 'modern',
  }
}

function extractEmail(text) {
  const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g
  const matches = text.match(emailRegex)
  return matches ? matches[0] : ''
}

function extractPhone(text) {
  const phoneRegex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}/g
  const matches = text.match(phoneRegex)
  return matches ? matches[0] : ''
}

function extractLinkedIn(text) {
  const linkedInRegex = /linkedin\.com\/in\/[\w-]+/gi
  const matches = text.match(linkedInRegex)
  return matches ? matches[0] : ''
}

function extractGitHub(text) {
  const githubRegex = /github\.com\/[\w-]+/gi
  const matches = text.match(githubRegex)
  return matches ? matches[0] : ''
}

module.exports = {
  parseResumeFile,
}
