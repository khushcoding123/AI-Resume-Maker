#!/usr/bin/env python3
"""
Resume Parser using NLP (spaCy NER, BERT classifier, TF-IDF)
Parses resume text and extracts structured information
"""

import sys
import json
import re
import spacy
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from sklearn.feature_extraction.text import TfidfVectorizer
import warnings
warnings.filterwarnings('ignore')

# Load spaCy model (try to load en_core_web_sm, fallback to blank model)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Warning: en_core_web_sm not found. Install with: python -m spacy download en_core_web_sm", file=sys.stderr)
    nlp = spacy.blank("en")

# Try to load BERT classifier (with fallback)
try:
    classifier = pipeline("text-classification", 
                         model="distilbert-base-uncased",
                         tokenizer="distilbert-base-uncased")
except Exception as e:
    print(f"Warning: BERT classifier not available: {e}", file=sys.stderr)
    classifier = None

def extract_entities(text):
    """Extract named entities using spaCy NER"""
    doc = nlp(text)
    
    entities = {
        'PERSON': [],
        'ORG': [],
        'GPE': [],  # Locations
        'EMAIL': [],
        'PHONE': [],
        'URL': [],
    }
    
    for ent in doc.ents:
        if ent.label_ in entities:
            entities[ent.label_].append(ent.text)
    
    # Extract email using regex
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    entities['EMAIL'] = list(set(emails))
    
    # Extract phone using regex
    phone_pattern = r'[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}'
    phones = re.findall(phone_pattern, text)
    entities['PHONE'] = list(set(phones))
    
    # Extract URLs
    url_pattern = r'https?://(?:[-\w.])+(?:[:\d]+)?(?:/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:\w)*)?)?'
    urls = re.findall(url_pattern, text)
    entities['URL'] = list(set(urls))
    
    # Extract LinkedIn and GitHub
    linkedin_pattern = r'linkedin\.com/in/[\w-]+'
    github_pattern = r'github\.com/[\w-]+'
    linkedin = re.findall(linkedin_pattern, text, re.IGNORECASE)
    github = re.findall(github_pattern, text, re.IGNORECASE)
    
    return entities, linkedin, github

def classify_section(text_snippet):
    """Classify text snippet into resume section using BERT"""
    if classifier is None:
        # Fallback to keyword-based classification
        return classify_section_keywords(text_snippet)
    
    sections = ['experience', 'education', 'skills', 'projects', 'summary', 'other']
    
    try:
        result = classifier(text_snippet[:512])  # Limit to 512 tokens
        return result[0]['label'] if result else 'other'
    except Exception as e:
        print(f"Classification error: {e}", file=sys.stderr)
        return classify_section_keywords(text_snippet)

def classify_section_keywords(text):
    """Fallback keyword-based section classification"""
    text_lower = text.lower()
    
    experience_keywords = ['experience', 'worked', 'employed', 'job', 'position', 'company']
    education_keywords = ['education', 'university', 'degree', 'bachelor', 'master', 'phd', 'gpa']
    skills_keywords = ['skills', 'proficient', 'expert', 'knowledge', 'programming']
    project_keywords = ['project', 'developed', 'built', 'created', 'github']
    summary_keywords = ['summary', 'profile', 'objective', 'professional']
    
    if any(kw in text_lower for kw in experience_keywords):
        return 'experience'
    elif any(kw in text_lower for kw in education_keywords):
        return 'education'
    elif any(kw in text_lower for kw in skills_keywords):
        return 'skills'
    elif any(kw in text_lower for kw in project_keywords):
        return 'projects'
    elif any(kw in text_lower for kw in summary_keywords):
        return 'summary'
    else:
        return 'other'

def extract_keywords(text, top_n=20):
    """Extract keywords using TF-IDF"""
    try:
        vectorizer = TfidfVectorizer(max_features=top_n, stop_words='english')
        X = vectorizer.fit_transform([text])
        
        feature_names = vectorizer.get_feature_names_out()
        scores = X.toarray()[0]
        
        keywords_with_scores = list(zip(feature_names, scores))
        keywords_with_scores.sort(key=lambda x: x[1], reverse=True)
        
        return [kw for kw, score in keywords_with_scores[:top_n]]
    except Exception as e:
        print(f"TF-IDF error: {e}", file=sys.stderr)
        return []

def parse_resume(text):
    """Main parsing function"""
    # Extract entities
    entities, linkedin, github = extract_entities(text)
    
    # Parse personal info
    personal_info = {
        'fullName': entities['PERSON'][0] if entities['PERSON'] else '',
        'email': entities['EMAIL'][0] if entities['EMAIL'] else '',
        'phone': entities['PHONE'][0] if entities['PHONE'] else '',
        'address': ', '.join(entities['GPE'][:2]) if entities['GPE'] else '',
        'linkedin': linkedin[0] if linkedin else '',
        'github': github[0] if github else '',
        'website': entities['URL'][0] if entities['URL'] else '',
        'summary': '',
    }
    
    # Split text into sections (simple line-based splitting)
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Try to identify sections
    sections = {
        'experience': [],
        'education': [],
        'skills': [],
        'projects': [],
        'summary': [],
    }
    
    current_section = None
    current_text = []
    
    for line in lines:
        section_type = classify_section(line)
        
        if section_type != 'other':
            if current_section and current_text:
                sections[current_section].append('\n'.join(current_text))
            current_section = section_type
            current_text = [line]
        else:
            if current_section:
                current_text.append(line)
            else:
                # If no section identified yet, check if it looks like summary
                if len(line) > 100 and not any(char.isdigit() for char in line[:50]):
                    sections['summary'].append(line)
    
    if current_section and current_text:
        sections[current_section].append('\n'.join(current_text))
    
    # Extract keywords
    keywords = extract_keywords(text)
    
    # Build structured resume
    parsed_resume = {
        'personalInfo': personal_info,
        'experiences': [],
        'education': [],
        'projects': [],
        'skills': [],
        'certifications': [],
        'languages': [],
        'template': 'modern',
    }
    
    # Extract summary
    if sections['summary']:
        parsed_resume['personalInfo']['summary'] = sections['summary'][0][:500]
    
    # Basic structure - in production, you'd want more sophisticated parsing
    # This is a simplified version that provides a starting point
    
    return parsed_resume

if __name__ == '__main__':
    try:
        # Read text from stdin
        resume_text = sys.stdin.read()
        
        # Parse resume
        parsed_resume = parse_resume(resume_text)
        
        # Output JSON
        print(json.dumps(parsed_resume))
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)
