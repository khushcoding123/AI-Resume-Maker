const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

async function generatePDF(resumeData) {
  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-software-rasterizer'
      ],
      timeout: 30000, // 30 second timeout for browser launch
    })

    const page = await browser.newPage()

    // Generate HTML for the resume based on template
    const html = generateResumeHTML(resumeData)

    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 // 30 second timeout for content loading
    })

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
    })

    return pdfBuffer
  } catch (error) {
    console.error('Error generating PDF:', error)
    // Provide more helpful error messages
    if (error.message?.includes('timeout')) {
      throw new Error('PDF generation timed out. The resume may be too large or the server is busy.')
    }
    if (error.message?.includes('Browser closed') || error.message?.includes('Target closed')) {
      throw new Error('Browser closed unexpectedly. Please try again.')
    }
    if (error.message?.includes('Navigation failed')) {
      throw new Error('Failed to render resume content. Please check your resume data.')
    }
    throw new Error(`PDF generation failed: ${error.message || 'Unknown error'}`)
  } finally {
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }
  }
}

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return ''
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return String(text).replace(/[&<>"']/g, (m) => map[m])
}

function generateResumeHTML(resumeData) {
  // This is a simplified HTML generator
  // In production, you might want to use the same React templates
  const { personalInfo, experiences, education, projects, skills, certifications, languages, template } = resumeData

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #1a1a1a;
        }
        .header {
          border-bottom: 3px solid #0ea5e9;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          font-size: 32px;
          font-weight: bold;
          margin: 0 0 10px 0;
        }
        .contact-info {
          font-size: 12px;
          color: #666;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #0ea5e9;
          border-bottom: 2px solid #0ea5e9;
          padding-bottom: 5px;
          margin-bottom: 15px;
          text-transform: uppercase;
        }
        .experience-item, .education-item, .project-item {
          margin-bottom: 20px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .item-title {
          font-size: 16px;
          font-weight: bold;
        }
        .item-subtitle {
          font-size: 14px;
          color: #666;
          font-style: italic;
        }
        .item-date {
          font-size: 12px;
          color: #888;
        }
        .item-bullets {
          margin-top: 8px;
          padding-left: 20px;
        }
        .item-bullets li {
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 5px;
        }
        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        .skill-category {
          margin-bottom: 15px;
        }
        .skill-category-name {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .skill-items {
          font-size: 13px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${escapeHtml(personalInfo.fullName || 'Your Name')}</h1>
        <div class="contact-info">
          ${personalInfo.email ? `📧 ${escapeHtml(personalInfo.email)}` : ''}
          ${personalInfo.phone ? ` 📱 ${escapeHtml(personalInfo.phone)}` : ''}
          ${personalInfo.address ? ` 📍 ${escapeHtml(personalInfo.address)}` : ''}
          ${personalInfo.linkedin ? ` 💼 ${escapeHtml(personalInfo.linkedin)}` : ''}
          ${personalInfo.github ? ` 🔗 ${escapeHtml(personalInfo.github)}` : ''}
        </div>
      </div>
  `

  if (personalInfo.summary) {
    html += `
      <div class="section">
        <div class="section-title">Professional Summary</div>
        <div>${escapeHtml(personalInfo.summary)}</div>
      </div>
    `
  }

  if (experiences.length > 0) {
    html += `<div class="section"><div class="section-title">Experience</div>`
    experiences.forEach((exp) => {
      html += `
        <div class="experience-item">
          <div class="item-header">
            <div>
              <div class="item-title">${escapeHtml(exp.position || 'Position')}</div>
              <div class="item-subtitle">${escapeHtml(exp.company)} ${exp.location ? ` • ${escapeHtml(exp.location)}` : ''}</div>
            </div>
            <div class="item-date">
              ${escapeHtml(exp.startDate || '')} - ${exp.current ? 'Present' : escapeHtml(exp.endDate || '')}
            </div>
          </div>
          ${exp.bullets.length > 0 ? '<ul class="item-bullets">' + exp.bullets.filter(b => b.trim()).map(b => `<li>${escapeHtml(b)}</li>`).join('') + '</ul>' : ''}
        </div>
      `
    })
    html += `</div>`
  }

  if (education.length > 0) {
    html += `<div class="section"><div class="section-title">Education</div>`
    education.forEach((edu) => {
      html += `
        <div class="education-item">
          <div class="item-header">
            <div>
              <div class="item-title">${escapeHtml(edu.degree)} ${edu.field ? `in ${escapeHtml(edu.field)}` : ''}</div>
              <div class="item-subtitle">${escapeHtml(edu.institution)} ${edu.location ? ` • ${escapeHtml(edu.location)}` : ''}</div>
            </div>
            <div class="item-date">
              ${escapeHtml(edu.startDate || '')} - ${edu.endDate ? escapeHtml(edu.endDate) : 'Present'}
              ${edu.gpa ? ` • GPA: ${escapeHtml(edu.gpa)}` : ''}
            </div>
          </div>
        </div>
      `
    })
    html += `</div>`
  }
  
  if (projects && projects.length > 0) {
    html += `<div class="section"><div class="section-title">Projects</div>`
    projects.forEach((project) => {
      html += `
        <div class="project-item">
          <div class="item-header">
            <div>
              <div class="item-title">${escapeHtml(project.name || 'Project Name')}</div>
              ${project.url ? `<div class="item-subtitle">${escapeHtml(project.url)}</div>` : ''}
            </div>
          </div>
          ${project.description ? `<div style="margin-top: 5px; font-size: 13px; color: #666;">${escapeHtml(project.description)}</div>` : ''}
          ${project.technologies && project.technologies.length > 0 ? `<div style="margin-top: 5px; font-size: 12px; color: #888;">Technologies: ${escapeHtml(project.technologies.join(', '))}</div>` : ''}
          ${project.bullets && project.bullets.length > 0 ? '<ul class="item-bullets">' + project.bullets.filter(b => b.trim()).map(b => `<li>${escapeHtml(b)}</li>`).join('') + '</ul>' : ''}
        </div>
      `
    })
    html += `</div>`
  }

  if (skills.length > 0) {
    html += `<div class="section"><div class="section-title">Skills</div><div class="skills-grid">`
    skills.forEach((skill) => {
      html += `
        <div class="skill-category">
          ${skill.category ? `<div class="skill-category-name">${escapeHtml(skill.category)}</div>` : ''}
          <div class="skill-items">${escapeHtml(skill.items.join(', '))}</div>
        </div>
      `
    })
    html += `</div></div>`
  }
  
  if (certifications && certifications.length > 0) {
    html += `<div class="section"><div class="section-title">Certifications</div>`
    html += `<div>${certifications.map(c => escapeHtml(c)).join(', ')}</div></div>`
  }
  
  if (languages && languages.length > 0) {
    html += `<div class="section"><div class="section-title">Languages</div>`
    html += `<div>${languages.map(l => escapeHtml(l)).join(', ')}</div></div>`
  }

  html += `
    </body>
    </html>
  `

  return html
}

module.exports = {
  generatePDF,
}
