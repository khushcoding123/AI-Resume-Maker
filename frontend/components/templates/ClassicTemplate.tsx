'use client'

import { ResumeData } from '@/store/resumeStore'

interface ClassicTemplateProps {
  data: ResumeData
}

export default function ClassicTemplate({ data }: ClassicTemplateProps) {
  const { personalInfo, experiences, education, projects, skills, certifications, languages } = data

  return (
    <div className="resume-template classic-template" style={{ fontFamily: 'Times New Roman, serif', color: '#000' }}>
      <style jsx>{`
        .classic-template {
          max-width: 8.5in;
          margin: 0 auto;
          padding: 50px;
          background: white;
        }
        .header {
          text-align: center;
          border-bottom: 1px solid #000;
          padding-bottom: 15px;
          margin-bottom: 25px;
        }
        .header h1 {
          font-size: 28px;
          font-weight: normal;
          margin: 0 0 10px 0;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .contact-info {
          font-size: 11px;
          color: #333;
          line-height: 1.8;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }
        .summary {
          font-size: 12px;
          line-height: 1.8;
          text-align: justify;
        }
        .experience-item, .education-item, .project-item {
          margin-bottom: 18px;
        }
        .item-header {
          margin-bottom: 6px;
        }
        .item-title {
          font-size: 14px;
          font-weight: bold;
        }
        .item-subtitle {
          font-size: 12px;
          font-style: italic;
          margin-top: 2px;
        }
        .item-date {
          font-size: 11px;
          margin-top: 3px;
        }
        .item-bullets {
          margin-top: 6px;
          padding-left: 25px;
        }
        .item-bullets li {
          font-size: 11px;
          line-height: 1.8;
          margin-bottom: 4px;
        }
        .skills-list {
          font-size: 12px;
          line-height: 2;
        }
        .skill-category {
          margin-bottom: 10px;
        }
        .skill-category-name {
          font-weight: bold;
          font-size: 12px;
        }
        .skill-items {
          font-size: 11px;
          margin-left: 15px;
        }
        .cert-lang-list {
          font-size: 11px;
          line-height: 2;
        }
      `}</style>

      <div className="header">
        <h1>{personalInfo.fullName || 'Your Name'}</h1>
        <div className="contact-info">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span> • {personalInfo.phone}</span>}
          {personalInfo.address && <span> • {personalInfo.address}</span>}
          {personalInfo.linkedin && <span> • {personalInfo.linkedin}</span>}
          {personalInfo.github && <span> • {personalInfo.github}</span>}
          {personalInfo.website && <span> • {personalInfo.website}</span>}
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
          <div className="section-title">Professional Experience</div>
          {experiences.map((exp, idx) => (
            <div key={idx} className="experience-item">
              <div className="item-header">
                <div className="item-title">{exp.position || 'Position'}</div>
                <div className="item-subtitle">{exp.company} {exp.location && `, ${exp.location}`}</div>
                <div className="item-date">
                  {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  {' - '}
                  {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '')}
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
                <div className="item-title">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                <div className="item-subtitle">{edu.institution} {edu.location && `, ${edu.location}`}</div>
                <div className="item-date">
                  {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  {' - '}
                  {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present'}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </div>
                {edu.honors.length > 0 && (
                  <div style={{ marginTop: '5px', fontSize: '11px' }}>
                    Honors: {edu.honors.join(', ')}
                  </div>
                )}
              </div>
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
                <div className="item-title">{project.name || 'Project Name'}</div>
                {project.url && (
                  <div className="item-subtitle" style={{ fontSize: '11px' }}>
                    {project.url}
                  </div>
                )}
                {project.description && (
                  <div style={{ marginTop: '3px', fontSize: '11px' }}>{project.description}</div>
                )}
                {project.technologies.length > 0 && (
                  <div style={{ marginTop: '3px', fontSize: '11px' }}>
                    Technologies: {project.technologies.join(', ')}
                  </div>
                )}
              </div>
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
          <div className="skills-list">
            {skills.map((skill, idx) => (
              <div key={idx} className="skill-category">
                {skill.category && <span className="skill-category-name">{skill.category}: </span>}
                <span className="skill-items">{skill.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(certifications.length > 0 || languages.length > 0) && (
        <div className="section">
          <div className="section-title">Additional Information</div>
          {certifications.length > 0 && (
            <div className="cert-lang-list" style={{ marginBottom: '8px' }}>
              <strong>Certifications:</strong> {certifications.join('; ')}
            </div>
          )}
          {languages.length > 0 && (
            <div className="cert-lang-list">
              <strong>Languages:</strong> {languages.join('; ')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
