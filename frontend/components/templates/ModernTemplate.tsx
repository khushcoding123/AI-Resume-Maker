'use client'

import { ResumeData } from '@/store/resumeStore'

interface ModernTemplateProps {
  data: ResumeData
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
  const { personalInfo, experiences, education, projects, skills, certifications, languages } = data

  return (
    <div className="resume-template modern-template" style={{ fontFamily: 'Arial, sans-serif', color: '#1a1a1a' }}>
      <style jsx>{`
        .modern-template {
          max-width: 8.5in;
          margin: 0 auto;
          padding: 40px;
          background: white;
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
          color: #1a1a1a;
        }
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
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
        .summary {
          font-size: 14px;
          line-height: 1.6;
          color: #333;
        }
        .experience-item, .education-item, .project-item {
          margin-bottom: 20px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 8px;
        }
        .item-title {
          font-size: 16px;
          font-weight: bold;
          color: #1a1a1a;
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
          color: #444;
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
          color: #1a1a1a;
        }
        .skill-items {
          font-size: 13px;
          color: #666;
        }
        .cert-lang-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .cert-lang-item {
          font-size: 13px;
          color: #444;
        }
      `}</style>

      <div className="header">
        <h1>{personalInfo.fullName || 'Your Name'}</h1>
        <div className="contact-info">
          {personalInfo.email && <span>📧 {personalInfo.email}</span>}
          {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
          {personalInfo.address && <span>📍 {personalInfo.address}</span>}
          {personalInfo.linkedin && <span>💼 {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>🔗 {personalInfo.github}</span>}
          {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="section">
          <div className="section-title">Professional Summary</div>
          <div className="summary">{personalInfo.summary}</div>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="section">
          <div className="section-title">Experience</div>
          {experiences.map((exp, idx) => (
            <div key={idx} className="experience-item">
              <div className="item-header">
                <div>
                  <div className="item-title">{exp.position || 'Position'}</div>
                  <div className="item-subtitle">{exp.company} {exp.location && ` • ${exp.location}`}</div>
                </div>
                <div className="item-date">
                  {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  {' - '}
                  {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                </div>
              </div>
              {exp.bullets.length > 0 && (
                <ul className="item-bullets">
                  {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="section">
          <div className="section-title">Education</div>
          {education.map((edu, idx) => (
            <div key={idx} className="education-item">
              <div className="item-header">
                <div>
                  <div className="item-title">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                  <div className="item-subtitle">{edu.institution} {edu.location && ` • ${edu.location}`}</div>
                </div>
                <div className="item-date">
                  {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  {' - '}
                  {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                </div>
              </div>
              {(edu.gpa || (edu.honors && edu.honors.length > 0)) && (
                <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  {edu.honors && edu.honors.length > 0 && (
                    <span style={{ marginLeft: '15px' }}>
                      Honors: {edu.honors.join(', ')}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="section">
          <div className="section-title">Projects</div>
          {projects.map((project, idx) => (
            <div key={idx} className="project-item">
              <div className="item-header">
                <div>
                  <div className="item-title">{project.name || 'Project Name'}</div>
                  {project.url && (
                    <div className="item-subtitle" style={{ fontSize: '12px' }}>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">{project.url}</a>
                    </div>
                  )}
                </div>
              </div>
              {project.description && (
                <div style={{ marginTop: '5px', fontSize: '13px', color: '#666' }}>{project.description}</div>
              )}
              {project.technologies.length > 0 && (
                <div style={{ marginTop: '5px', fontSize: '12px', color: '#888' }}>
                  Technologies: {project.technologies.join(', ')}
                </div>
              )}
              {project.bullets.length > 0 && (
                <ul className="item-bullets">
                  {project.bullets.filter(b => b.trim()).map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="section">
          <div className="section-title">Skills</div>
          <div className="skills-grid">
            {skills.map((skill, idx) => (
              <div key={idx} className="skill-category">
                {skill.category && <div className="skill-category-name">{skill.category}</div>}
                <div className="skill-items">{skill.items.join(', ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(certifications.length > 0 || languages.length > 0) && (
        <div className="section">
          <div className="section-title">Additional Information</div>
          {certifications.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <strong>Certifications: </strong>
              <span className="cert-lang-list">
                {certifications.map((cert, idx) => (
                  <span key={idx} className="cert-lang-item">{cert}{idx < certifications.length - 1 ? ', ' : ''}</span>
                ))}
              </span>
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <strong>Languages: </strong>
              <span className="cert-lang-list">
                {languages.map((lang, idx) => (
                  <span key={idx} className="cert-lang-item">{lang}{idx < languages.length - 1 ? ', ' : ''}</span>
                ))}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
