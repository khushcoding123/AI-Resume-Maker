#!/usr/bin/env python3
"""
ATS (Applicant Tracking System) Resume Scorer
Uses TF-IDF and keyword matching to score resume against job description
"""

import sys
import json
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import warnings
warnings.filterwarnings('ignore')

def extract_text_from_resume(resume_data):
    """Extract all text content from structured resume data"""
    text_parts = []
    
    # Personal info summary
    if resume_data.get('personalInfo', {}).get('summary'):
        text_parts.append(resume_data['personalInfo']['summary'])
    
    # Experiences
    if resume_data.get('experiences'):
        for exp in resume_data['experiences']:
            text_parts.append(exp.get('position', ''))
            text_parts.append(exp.get('company', ''))
            text_parts.append(' '.join(exp.get('bullets', [])))
    
    # Education
    if resume_data.get('education'):
        for edu in resume_data['education']:
            text_parts.append(edu.get('degree', ''))
            text_parts.append(edu.get('field', ''))
            text_parts.append(edu.get('institution', ''))
    
    # Projects
    if resume_data.get('projects'):
        for project in resume_data['projects']:
            text_parts.append(project.get('name', ''))
            text_parts.append(project.get('description', ''))
            text_parts.append(' '.join(project.get('technologies', [])))
            text_parts.append(' '.join(project.get('bullets', [])))
    
    # Skills
    if resume_data.get('skills'):
        for skill in resume_data['skills']:
            text_parts.append(skill.get('category', ''))
            text_parts.append(' '.join(skill.get('items', [])))
    
    # Certifications
    if resume_data.get('certifications'):
        text_parts.append(' '.join(resume_data['certifications']))
    
    return ' '.join(text_parts)

def extract_keywords(text, min_length=3):
    """Extract important keywords from text"""
    # Remove special characters and convert to lowercase
    text = re.sub(r'[^\w\s]', ' ', text.lower())
    words = text.split()
    
    # Filter out common stop words and short words
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'}
    
    keywords = [word for word in words if len(word) >= min_length and word not in stop_words]
    
    return keywords

def calculate_similarity(resume_text, job_description):
    """Calculate TF-IDF cosine similarity between resume and job description"""
    try:
        vectorizer = TfidfVectorizer(max_features=500, stop_words='english', ngram_range=(1, 2))
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        return similarity
    except Exception as e:
        print(f"Similarity calculation error: {e}", file=sys.stderr)
        return 0.5  # Default similarity

def find_matching_keywords(resume_keywords, job_keywords):
    """Find matching keywords between resume and job description"""
    resume_set = set(resume_keywords)
    job_set = set(job_keywords)
    
    matches = resume_set.intersection(job_set)
    missing = job_set - resume_set
    
    return list(matches), list(missing)

def generate_feedback(score, matches, missing):
    """Generate feedback based on score and keyword analysis"""
    feedback_lines = []
    
    if score >= 80:
        feedback_lines.append("Excellent match! Your resume strongly aligns with the job description.")
    elif score >= 60:
        feedback_lines.append("Good match. Your resume aligns well with the job description, but there's room for improvement.")
    elif score >= 40:
        feedback_lines.append("Moderate match. Consider tailoring your resume more closely to the job description.")
    else:
        feedback_lines.append("Low match. Your resume needs significant tailoring to match the job requirements.")
    
    if matches:
        feedback_lines.append(f"\n✅ Matching keywords found: {len(matches)}")
        feedback_lines.append(f"Top matches: {', '.join(list(matches)[:10])}")
    
    if missing:
        feedback_lines.append(f"\n⚠️ Missing keywords from job description: {len(missing)}")
        feedback_lines.append(f"Consider adding: {', '.join(list(missing)[:15])}")
    
    feedback_lines.append(f"\n💡 Tips:")
    if score < 80:
        feedback_lines.append("- Add relevant keywords from the job description naturally throughout your resume")
        feedback_lines.append("- Highlight achievements that match the job requirements")
        feedback_lines.append("- Use industry-specific terminology when appropriate")
    
    return '\n'.join(feedback_lines)

def score_resume(resume_data, job_description):
    """Main scoring function"""
    # Extract text from resume
    resume_text = extract_text_from_resume(resume_data)
    
    if not resume_text.strip():
        return {
            'score': 0,
            'feedback': 'Resume appears to be empty. Please add content.',
            'matches': [],
            'missing': [],
        }
    
    # Calculate similarity
    similarity = calculate_similarity(resume_text, job_description)
    score = int(similarity * 100)
    
    # Extract keywords
    resume_keywords = extract_keywords(resume_text)
    job_keywords = extract_keywords(job_description)
    
    # Find matches
    matches, missing = find_matching_keywords(resume_keywords, job_keywords)
    
    # Generate feedback
    feedback = generate_feedback(score, matches, missing)
    
    return {
        'score': score,
        'feedback': feedback,
        'matches': matches[:20],  # Limit to top 20
        'missing': missing[:20],  # Limit to top 20
    }

if __name__ == '__main__':
    try:
        # Read JSON from command line arguments
        if len(sys.argv) < 3:
            print(json.dumps({'error': 'Usage: ats_scorer.py <resume_json> <job_description>'}), file=sys.stderr)
            sys.exit(1)
        
        resume_json = sys.argv[1]
        job_description = sys.argv[2]
        
        # Parse resume data
        resume_data = json.loads(resume_json)
        
        # Score resume
        result = score_resume(resume_data, job_description)
        
        # Output JSON
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({'error': str(e), 'score': 0, 'feedback': f'Error scoring resume: {str(e)}'}), file=sys.stderr)
        sys.exit(1)
