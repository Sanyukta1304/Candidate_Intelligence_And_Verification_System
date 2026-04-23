/**
 * Market Demand Tiers for Skills
 * Based on current market demand (as of 2024-2025)
 * Includes role-specific multipliers
 */

const DEMAND_TIERS = {
  TIER_1: {
    weight: 1.0,
    skills: [
      'React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker', 'Kubernetes',
      'PostgreSQL', 'GraphQL', 'Next.js', 'FastAPI', 'Go', 'Rust', 'TailwindCSS',
      'Prisma', 'Kafka', 'Redis', 'Terraform', 'CI/CD', 'REST', 'JavaScript',
      'Express', 'MongoDB', 'Vue.js', 'Angular', 'Spring Boot', 'Django',
      'Microservices', 'Cloud Computing', 'DevOps', 'Agile'
    ]
  },
  TIER_2: {
    weight: 0.85,
    skills: [
      'Vue', 'Angular', 'Django', 'Spring', 'MongoDB', 'MySQL', 'Firebase',
      'Flutter', 'Kotlin', 'Swift', 'GCP', 'Azure', 'Elasticsearch', 'RabbitMQ',
      'gRPC', 'WebSockets', 'Nginx', 'Linux', 'Git', 'GitHub', 'GitLab',
      'Kotlin', 'React Native', 'jQuery', 'Webpack', 'Jest', 'Mocha'
    ]
  },
  TIER_3: {
    weight: 0.7,
    skills: [
      'PHP', 'Laravel', 'Ruby', 'Rails', 'Scala', 'C#', 'Unity', 'WordPress',
      'SQLite', 'Sass', 'Bootstrap', 'Express', 'Flask', 'Svelte', 'Nuxt',
      'LESS', 'Jade', 'Pug', 'CoffeeScript', 'Perl', 'Objective-C'
    ]
  },
  TIER_4: {
    weight: 0.5,
    skills: [
      'JSP', 'Perl', 'ColdFusion', 'Flash', 'Silverlight', 'Visual Basic',
      'COBOL', 'Fortran', 'ActionScript', 'Delphi', 'PowerBuilder'
    ]
  }
};

const ROLE_MULTIPLIERS = {
  Frontend: {
    'React': 1.15, 'Next.js': 1.12, 'Vue': 1.1, 'Angular': 1.1, 'TailwindCSS': 1.1,
    'TypeScript': 1.08, 'JavaScript': 1.05, 'HTML': 0.95, 'CSS': 0.95,
    'Node.js': 0.9, 'Python': 0.85, 'Kubernetes': 0.8, 'Django': 0.8,
    'Backend': 0.7, 'Database': 0.7
  },
  Backend: {
    'Node.js': 1.15, 'Django': 1.12, 'Spring': 1.1, 'FastAPI': 1.1,
    'PostgreSQL': 1.08, 'Redis': 1.08, 'Python': 1.05, 'Express': 1.05,
    'React': 0.85, 'TailwindCSS': 0.8, 'Frontend': 0.7, 'CSS': 0.6
  },
  FullStack: {
    'TypeScript': 1.1, 'React': 1.08, 'Node.js': 1.08, 'PostgreSQL': 1.05,
    'Docker': 1.05, 'Python': 1.0, 'AWS': 1.0, 'MongoDB': 0.95
  },
  Data: {
    'Python': 1.2, 'SQL': 1.15, 'TensorFlow': 1.1, 'Spark': 1.1, 'dbt': 1.08,
    'Pandas': 1.08, 'NumPy': 1.05, 'React': 0.7, 'Node.js': 0.7, 'Docker': 0.9
  },
  DevOps: {
    'Kubernetes': 1.2, 'Terraform': 1.15, 'Docker': 1.12, 'AWS': 1.1,
    'CI/CD': 1.1, 'Linux': 1.08, 'Jenkins': 1.05, 'React': 0.6, 'Django': 0.7
  },
  Mobile: {
    'Swift': 1.2, 'Kotlin': 1.15, 'Flutter': 1.12, 'React Native': 1.1,
    'Firebase': 1.08, 'iOS': 1.05, 'Android': 1.05, 'Kubernetes': 0.7,
    'Django': 0.8, 'Backend': 0.8
  }
};

module.exports = {
  DEMAND_TIERS,
  ROLE_MULTIPLIERS
};
