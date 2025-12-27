const Anthropic = require('@anthropic-ai/sdk')
require('dotenv').config()

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

async function generateBullet(position, company, context, promptTemplate) {
  try {
    const prompt = promptTemplate
      .replace('{{position}}', position)
      .replace('{{company}}', company)
      .replace('{{context}}', context || 'No additional context provided.')

    const completion = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      temperature: 0.7,
      system: 'You are a professional resume writer. Generate impactful bullet points that highlight achievements using action verbs and quantifiable results.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const response = completion.content[0].text
    // Extract bullet points (they might be separated by newlines or formatted as a list)
    const bullets = response
      .split('\n')
      .map((line) => line.replace(/^[-•*]\s*/, '').trim())
      .filter((line) => line.length > 0)
      .slice(0, 3) // Limit to 3 bullets

    return bullets.length > 0 ? bullets : [response.trim()]
  } catch (error) {
    console.error('OpenAI API Error:', error)
    // Fallback to basic bullet generation
    return [
      `Performed ${position} duties at ${company}`,
      `Collaborated with team members to achieve goals`,
      context || 'Contributed to team success',
    ]
  }
}

async function generateSummary(resumeData, promptTemplate) {
  try {
    const resumeText = formatResumeForPrompt(resumeData)
    const prompt = promptTemplate.replace('{{resumeData}}', resumeText)

    const completion = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      temperature: 0.7,
      system: 'You are a professional resume writer. Create compelling professional summaries that highlight key qualifications and achievements.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    return completion.content[0].text.trim()
  } catch (error) {
    console.error('OpenAI API Error:', error)
    // Fallback summary
    const position = resumeData.experiences?.[0]?.position || 'Professional'
    const skills = resumeData.skills
      .flatMap((s) => s.items)
      .slice(0, 5)
      .join(', ')
    return `Experienced ${position} with expertise in ${skills}. Proven track record of delivering results and collaborating effectively with teams.`
  }
}

async function tailorResume(resumeData, jobDescription, promptTemplate) {
  try {
    const resumeText = formatResumeForPrompt(resumeData)
    const prompt = promptTemplate
      .replace('{{resumeData}}', resumeText)
      .replace('{{jobDescription}}', jobDescription)

    const completion = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.7,
      system: 'You are a professional resume writer specializing in tailoring resumes to match job descriptions. Return the tailored resume in JSON format matching the original structure.',
      messages: [
        {
          role: 'user',
          content: `Please return the response in valid JSON format. ${prompt}`,
        },
      ],
    })

    const response = completion.content[0].text.trim()
    
    // Try to parse JSON response (Claude might add text around the JSON)
    try {
      // Try to extract JSON from the response in case there's extra text
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      const jsonResponse = jsonMatch ? jsonMatch[0] : response
      const tailoredResume = JSON.parse(jsonResponse)
      return tailoredResume
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError)
      console.error('Response was:', response)
      return resumeData
    }
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return resumeData // Return original on error
  }
}

async function agentEditResume(resumeData, instructions) {
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514'
  
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set in environment variables')
      return {
        resumeData,
        message:
          'AI Agent is not configured. Please set ANTHROPIC_API_KEY in your backend/.env file.',
      }
    }

    console.log(`Using model: ${model}`)
    console.log(`Processing instructions: ${instructions.substring(0, 100)}...`)

    const completion = await anthropic.messages.create({
      model: model,
      max_tokens: 4000,
      temperature: 0.4,
      system: `You are a meticulous resume editor AI assistant. Your task is to analyze user instructions and update the resume data accordingly.

CRITICAL: You MUST respond with ONLY valid JSON in this exact format:
{
  "resumeData": { ... the complete updated resume object ... },
  "message": "A brief summary of what was changed"
}

Do NOT include any text before or after the JSON. Do NOT use markdown code blocks. Return ONLY the raw JSON object.`,
      messages: [
        {
          role: 'user',
          content: `Current resume data:\n${JSON.stringify(
            resumeData,
            null,
            2
          )}\n\nUser instructions:\n${instructions}\n\nAnalyze the user's instructions and update the resume accordingly. Return ONLY a valid JSON object with this exact structure:\n{\n  "resumeData": { ... updated resume ... },\n  "message": "Summary of changes"\n}\n\nDo not include any explanatory text, only the JSON object.`,
        },
      ],
    })

    if (!completion || !completion.content || !completion.content[0]) {
      console.error('Invalid response structure from Anthropic API')
      return {
        resumeData,
        message:
          'Received an invalid response from the AI service. Please try again.',
      }
    }

    const response = completion.content[0].text.trim()
    console.log('Received response from API (first 500 chars):', response.substring(0, 500))
    console.log('Received response from API (last 200 chars):', response.substring(Math.max(0, response.length - 200)))

    try {
      // Try to extract JSON from the response in case there's extra text
      // Look for JSON that starts with { and contains "resumeData"
      let jsonResponse = response
      
      // Remove markdown code blocks if present
      jsonResponse = jsonResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '')
      
      // Try to find the JSON object
      const jsonMatch = jsonResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonResponse = jsonMatch[0]
      }
      
      const parsed = JSON.parse(jsonResponse)
      
      // Check if the response has resumeData field
      if (!parsed.resumeData) {
        // Check if the parsed object IS the resume data (missing wrapper)
        if (parsed.personalInfo || parsed.experiences || parsed.education || parsed.skills) {
          console.log('Response appears to be resume data directly, wrapping it')
          return {
            resumeData: parsed,
            message: parsed.message || 'I applied your instructions to the resume. Please verify the results.',
          }
        }
        
        console.error('Response missing resumeData field')
        console.error('Parsed object keys:', Object.keys(parsed))
        console.error('Full parsed response:', JSON.stringify(parsed, null, 2))
        return {
          resumeData,
          message:
            'The AI response was missing the resume data. Please try again with more specific instructions.',
        }
      }

      return {
        resumeData: parsed.resumeData,
        message:
          parsed.message ||
          'I applied your instructions to the resume. Please verify the results.',
      }
    } catch (parseError) {
      console.error('Failed to parse agent response as JSON:', parseError)
      console.error('Full response length:', response.length)
      console.error('Full response:', response)
      console.error('Parse error details:', parseError.message, parseError.stack)
      
      // Try to provide more helpful error message
      let errorMsg = `I received a response but couldn't parse it correctly. `
      if (response.includes('resumeData')) {
        errorMsg += 'The response seems to contain resume data but the JSON format is invalid. '
      }
      errorMsg += `Error: ${parseError.message}`
      
      return {
        resumeData,
        message: errorMsg,
      }
    }
  } catch (error) {
    console.error('Anthropic API Error Details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      error: error.error,
      model: model, // Log which model was used
    })
    
    let errorMessage = 'Agent was unavailable. Your resume was not changed. Please try again later.'
    
    if (error.status === 401) {
      errorMessage = 'Authentication failed. Please check your ANTHROPIC_API_KEY in backend/.env'
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please wait a moment and try again.'
    } else if (error.status === 400) {
      errorMessage = `Invalid request: ${error.message || 'Please check your input and try again.'}`
    } else if (error.status === 404) {
      errorMessage = `Model not found: ${model}. Please check your ANTHROPIC_MODEL in backend/.env. Valid models include: claude-sonnet-4-20250514, claude-opus-4-1-20250805, claude-3-5-haiku-20241022`
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`
    }
    
    return {
      resumeData,
      message: errorMessage,
    }
  }
}

function formatResumeForPrompt(resumeData) {
  let text = `Name: ${resumeData.personalInfo?.fullName || 'N/A'}\n`
  text += `Email: ${resumeData.personalInfo?.email || 'N/A'}\n\n`

  if (resumeData.experiences && resumeData.experiences.length > 0) {
    text += 'Experience:\n'
    resumeData.experiences.forEach((exp) => {
      text += `- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})\n`
      exp.bullets?.forEach((bullet) => {
        text += `  * ${bullet}\n`
      })
    })
  }

  if (resumeData.education && resumeData.education.length > 0) {
    text += '\nEducation:\n'
    resumeData.education.forEach((edu) => {
      text += `- ${edu.degree} in ${edu.field} from ${edu.institution}\n`
    })
  }

  if (resumeData.skills && resumeData.skills.length > 0) {
    text += '\nSkills:\n'
    resumeData.skills.forEach((skill) => {
      text += `- ${skill.category}: ${skill.items.join(', ')}\n`
    })
  }

  return text
}

module.exports = {
  generateBullet,
  generateSummary,
  tailorResume,
  agentEditResume,
}
