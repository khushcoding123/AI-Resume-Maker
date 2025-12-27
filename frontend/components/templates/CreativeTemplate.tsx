'use client'

import { ResumeData } from '@/store/resumeStore'

interface CreativeTemplateProps {
  data: ResumeData
}

export default function CreativeTemplate({ data }: CreativeTemplateProps) {
  const { personalInfo, experiences, education, projects, skills, certifications, languages } = data

  return (
    <div className="resume-template creative-template" style={{ fontFamily: 'Georgia, serif', color: '#2c3e50' }}>
      <style jsx>{`
        .creative-template {
          max-width: 8.5in;
          margin: 0 auto;
          padding: 35px;
          background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 10%);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 35px;
          margin: -35px -35px 35px -35px;
          border-radius: 0 0 20px 20px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header h1 {
          font-size: 36px;
          font-weight: bold;
          margin: 0 0 15px 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          font-size: 13px;
          opacity: 0.95;
        }
        .section {
          margin-bottom: 35px;
          padding: 20px;
          background: white;
          border-left: 4px solid #667eea;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 18px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 8px;
        }
        .summary {
          font-size: 14px;
          line-height: 1.8;
          color: #34495e;
          font-style: italic;
        }
        .experience-item, .education-item, .project-item {
          margin-bottom: 25px;
          padding-left: 15px;
          border-left: 3px solid #ecf0f1;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 10px;
        }
        .item-title {
          font-size: 17px;
          font-weight: bold;
          color: #2c3e50;
        }
        .item-subtitle {
          font-size: 14px;
          color: #7f8c8d;
          font-style: italic;
          margin-top: 3px;
        }
        .item-date {
          font-size: 12px;
          color: #95a5a6;
          background: #ecf0f1;
          padding: 4px 10px;
          border-radius: 12px;
          white-space: nowrap;
        }
        .item-bullets {
          margin-top: 10px;
          padding-left: 20px;
        }
        .item-bullets li {
          font-size: 13px;
          line-height: 1.8;
          margin-bottom: 6px;
          color: #34495e;
        }
        .item-bullets li::marker {
          color: #667eea;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .skill-category {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        .skill-category-name {
          font-weight: bold;
          font-size: 14px;
          color: #667eea;
          margin-bottom: 8px;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        .skill-items {
          font-size: 13px;
          color: #34495e;
          line-height: 1.8;
        }
        .cert-lang-list {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        .cert-lang-item {
          font-size: 13px;
          color: #34495e;
          background: #ecf0f1;
          padding: 6px 12px;
          border-radius: 15px;
        }
        .badge {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 3px 10px;
          border-radius: 10px;
          font-size: 11px;
          margin-left: 8px;
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
          <div className="summary">"{personalInfo.summary}"</div>
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
                  {edu.gpa && <span className="badge">GPA: {edu.gpa}</span>}
                </div>
              </div>
              {edu.honors.length > 0 && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#7f8c8d' }}>
                  🏆 {edu.honors.join(', ')}
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
                      🔗 <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>{project.url}</a>
                    </div>
                  )}
                </div>
              </div>
              {project.description && (
                <div style={{ marginTop: '5px', fontSize: '13px', color: '#34495e', fontStyle: 'italic' }}>{project.description}</div>
              )}
              {project.technologies.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="badge" style={{ marginRight: '5px' }}>{tech}</span>
                  ))}
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
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#667eea' }}>Certifications: </strong>
              <div className="cert-lang-list" style={{ marginTop: '8px' }}>
                {certifications.map((cert, idx) => (
                  <span key={idx} className="cert-lang-item">🎓 {cert}</span>
                ))}
              </div>
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <strong style={{ color: '#667eea' }}>Languages: </strong>
              <div className="cert-lang-list" style={{ marginTop: '8px' }}>
                {languages.map((lang, idx) => (
                  <span key={idx} className="cert-lang-item">🗣️ {lang}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
