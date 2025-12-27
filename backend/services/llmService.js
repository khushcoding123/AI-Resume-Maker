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
      model: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
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
      model: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
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
      model: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
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

    const model = process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229'
    console.log(`Using model: ${model}`)
    console.log(`Processing instructions: ${instructions.substring(0, 100)}...`)

    const completion = await anthropic.messages.create({
      model: model,
      max_tokens: 4000,
      temperature: 0.4,
      system: `You are a meticulous resume editor AI assistant. Your primary role is to intelligently interpret user instructions and apply them to the relevant sections of the resume document.

KEY RESPONSIBILITIES:
1. Analyze the user's instructions/prompt carefully to identify:
   - Which sections of the resume need to be updated (personal info, experiences, education, skills, summary, etc.)
   - What specific information should be filled in or modified
   - The intent behind the user's request

2. Map user instructions to relevant resume sections:
   - Personal information (name, email, phone, address, summary)
   - Work experiences (positions, companies, dates, bullet points)
   - Education (degrees, institutions, fields, dates)
   - Skills (categories and items)
   - Any other resume sections

3. Apply changes intelligently:
   - Fill in missing information when the user provides it
   - Update existing information when the user requests modifications
   - Add new entries when appropriate (e.g., new work experience, education, skills)
   - Preserve all existing data that is not mentioned in the instructions
   - Maintain professional formatting and structure

4. Preserve document integrity:
   - Keep the original JSON schema structure intact
   - Only modify the specific parts mentioned in the user's instructions
   - Ensure all data types and formats remain consistent

OUTPUT FORMAT:
Respond with valid JSON only, using the shape: { "resumeData": ResumeData, "message": string }
- resumeData: The updated resume JSON with all changes applied
- message: A clear summary of what edits were made, which sections were updated, and how the user's instructions were interpreted

Remember: Your goal is to be helpful and precise - use the user's prompt to fill in or update the relevant parts of the document while maintaining the overall structure and quality of the resume.`,
      messages: [
        {
          role: 'user',
          content: `Current resume data:\n${JSON.stringify(
            resumeData,
            null,
            2
          )}\n\nUser instructions:\n${instructions}\n\nPlease analyze the user's instructions, identify which parts of the resume need to be filled or updated, and apply the changes accordingly. Respond with a valid JSON object containing the updated resume and a message summarizing the edits.`,
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
    console.log('Received response from API (first 200 chars):', response.substring(0, 200))

    try {
      // Try to extract JSON from the response in case there's extra text
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      const jsonResponse = jsonMatch ? jsonMatch[0] : response
      const parsed = JSON.parse(jsonResponse)
      
      if (!parsed.resumeData) {
        console.error('Response missing resumeData field')
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
      console.error('Full response was:', response)
      return {
        resumeData,
        message:
          `I received a response but couldn't parse it correctly. The AI may have returned text instead of JSON. Error: ${parseError.message}`,
      }
    }
  } catch (error) {
    console.error('Anthropic API Error Details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      error: error.error,
    })
    
    let errorMessage = 'Agent was unavailable. Your resume was not changed. Please try again later.'
    
    if (error.status === 401) {
      errorMessage = 'Authentication failed. Please check your ANTHROPIC_API_KEY in backend/.env'
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please wait a moment and try again.'
    } else if (error.status === 400) {
      errorMessage = `Invalid request: ${error.message || 'Please check your input and try again.'}`
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
