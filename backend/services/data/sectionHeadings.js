/**
 * Section Heading Synonyms Map
 * Maps canonical section names to their common aliases
 * This is used for robust section detection in resumes
 * EXPANDED: more aggressive matching for different resume formats
 * Fixed: removed duplicate sections and syntax errors
 */

module.exports = {
  SUMMARY: [
    'summary', 'profile', 'objective', 'about me', 'professional summary',
    'career objective', 'about', 'overview', 'professional overview',
    'executive summary', 'professional profile', 'career profile',
    'professional statement', 'personal statement', 'introduction',
    'professional introduction', 'career summary', 'who i am',
    'summary statement', 'executive profile', 'professional objective',
    'introductory', 'intro', 'profile summary', 'career highlights',
    'professional highlights', 'highlights', 'personal summary',
    'professional biography', 'biography'
  ],
  EXPERIENCE: [
    'experience', 'work experience', 'employment', 'employment history',
    'professional experience', 'work history', 'career history', 'internships',
    'internship experience', 'experience section', 'professional background',
    'career experience', 'relevant experience', 'work background',
    'previous experience', 'past experience', 'work', 'job', 'roles', 
    'positions', 'professional roles', 'job history', 'career highlights',
    'professional experience section', 'employment background', 'positions held',
    'exp', 'work exp', 'professional', 'career'
  ],
  EDUCATION: [
    'education', 'academic background', 'qualifications', 'academic qualifications',
    'educational background', 'academics', 'degrees', 'education section',
    'academic history', 'schooling', 'university', 'training', 'colleges',
    'educational history', 'school', 'degree', 'qualifications section',
    'coursework', 'educational qualification', 'academic', 'formal education',
    'higher education', 'degree information', 'academic credentials', 'institution',
    'ed', 'degrees earned', 'certifications and education', 'educational details',
    'college education', 'university education', 'academic training', 'degree earned',
    'degrees and certifications', 'educational achievements', 'qualifications and degree',
    'bachelor', 'master', 'diploma', 'graduation'  // ✅ Added: common education terms
  ],
  SKILLS: [
    'skills', 'technical skills', 'core competencies', 'technologies', 'tech stack',
    'tools', 'programming languages', 'tools and technologies', 'skills and technologies',
    'key skills', 'technical competencies', 'professional skills', 'core skills',
    'relevant skills', 'skill set', 'technical proficiencies', 'expertise',
    'skills set', 'abilities', 'competencies', 'technical abilities', 'language skills',
    'technical expertise', 'software skills', 'programming skills', 'technical stack',
    'technical knowledge', 'skill', 'technical', 'technical toolkit', 'technology stack',
    'expertise areas', 'areas of expertise', 'professional expertise', 'domain expertise',
    'specialized skills', 'key competencies', 'tech skills', 'programming', 'languages',
    'technical languages', 'backend', 'frontend', 'databases', 'frameworks'  // ✅ Added: common technical terms
  ],
  PROJECTS: [
    'projects', 'personal projects', 'portfolio', 'side projects', 'open source',
    'open-source contributions', 'project work', 'academic projects', 'projects section',
    'featured projects', 'selected projects', 'project portfolio', 'github projects',
    'github', 'open source projects', 'projects developed', 'key projects',
    'notable projects', 'project highlights', 'portfolio projects', 'demo projects',
    'web projects', 'apps', 'applications', 'project experience',
    'projects completed', 'significant projects', 'major projects',
    'projects and portfolio', 'implementation', 'implementations'
  ],
  CERTIFICATIONS: [
    'certifications', 'certificates', 'courses', 'online courses', 'professional certifications',
    'licenses', 'certifications section', 'credentials', 'professional development',
    'training certifications', 'certification', 'industry certifications', 'license',
    'accreditations', 'certifications and licenses', 'professional certifications',
    'certifications and awards', 'cert', 'certs', 'professional certs',
    'training', 'course', 'coursework', 'professional development', 'training received',
    'certifications earned', 'credentials earned', 'professional licenses',
    'certifications and credentials', 'professional qualifications', 'licensed',
    'certifications and trainings', 'training and certifications'
  ],
  AWARDS: [
    'awards', 'achievements', 'honors', 'honours', 'recognition', 'accomplishments',
    'awards section', 'achievements section', 'honors and awards', 'awards and recognition',
    'achievements and awards', 'recognition and awards', 'awards and achievements',
    'award', 'achievement', 'honor', 'honour', 'accomplishment', 'distinction',
    'recognition received', 'awards received'
  ],
  LANGUAGES: [
    'languages', 'language skills', 'spoken languages', 'language proficiency',
    'multilingual', 'languages section', 'language competencies', 'languages proficiency',
    'language', 'language fluency', 'multilingual skills', 'language abilities'
  ]
};
