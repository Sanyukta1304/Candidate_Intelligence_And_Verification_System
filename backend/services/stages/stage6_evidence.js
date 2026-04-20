/**
 * Stage 6: Evidence & Impact Scoring
 * Scores experience/project bullets for metrics, problem-solving, and filler presence
 */

const fillerPhrases = require('../data/fillerPhrases');

function stage6_evidence(parseResult, sectionResult) {
  const sections = sectionResult.sections;
  const experienceText = sections.EXPERIENCE || '';
  const projectText = sections.PROJECTS || '';

  let evidenceScore = 0;
  let bulletScores = [];
  let experienceEvidence = 0;
  let projectEvidence = 0;

  // Metric detection patterns
  const metricPatterns = [
    /(\d+%)/g, // Percentages
    /([1-9]\d*(?:x|×))/g, // Multipliers
    /(\$\d+[KM]?)/g, // Currency
    /(\d+\s*(?:users|customers|transactions|requests|downloads|installations))/gi,
    /(increased|improved|reduced|accelerated|grew|scaled)\s+(?:by\s+)?(\d+%|\d+x|[\w\s]+)/gi
  ];

  // Problem-solving keywords
  const problemSolving = ['problem', 'challenge', 'issue', 'bug', 'fix', 'solution', 'optimized', 'improved', 'reduced latency'];

  // Score experience section
  if (experienceText) {
    const experienceBullets = experienceText.split('\n').filter(b => b.trim().length > 0);
    for (const bullet of experienceBullets) {
      let bulletScore = 10; // Base score

      // Check for metrics
      let metricsFound = 0;
      for (const pattern of metricPatterns) {
        metricsFound += (bullet.match(pattern) || []).length;
      }
      bulletScore += Math.min(metricsFound * 15, 50);

      // Check for problem-solving
      if (problemSolving.some(ps => bullet.toLowerCase().includes(ps))) {
        bulletScore += 20;
      }

      // Penalize filler phrases
      let fillerCount = 0;
      for (const filler of fillerPhrases) {
        if (bullet.toLowerCase().includes(filler)) {
          fillerCount++;
        }
      }
      bulletScore -= fillerCount * 5;

      bulletScores.push(Math.max(0, bulletScore));
      experienceEvidence += bulletScore;
    }
  }

  // Score project section
  if (projectText) {
    const projectBullets = projectText.split('\n').filter(b => b.trim().length > 0);
    for (const bullet of projectBullets) {
      let bulletScore = 10;

      // Check for metrics
      let metricsFound = 0;
      for (const pattern of metricPatterns) {
        metricsFound += (bullet.match(pattern) || []).length;
      }
      bulletScore += Math.min(metricsFound * 15, 50);

      // Check for technical depth
      if (/api|database|framework|architecture|design pattern/i.test(bullet)) {
        bulletScore += 15;
      }

      // Penalize filler
      let fillerCount = 0;
      for (const filler of fillerPhrases) {
        if (bullet.toLowerCase().includes(filler)) {
          fillerCount++;
        }
      }
      bulletScore -= fillerCount * 5;

      bulletScores.push(Math.max(0, bulletScore));
      projectEvidence += bulletScore;
    }
  }

  // Normalize evidence scores
  evidenceScore = Math.min(
    100,
    (experienceEvidence + projectEvidence) / Math.max(bulletScores.length, 1)
  );

  return {
    evidence_score: Math.round(evidenceScore),
    bullet_scores: bulletScores,
    experience_evidence: experienceEvidence,
    project_evidence: projectEvidence,
    total_bullets: bulletScores.length,
    metrics_found: bulletScores.filter(s => s > 25).length
  };
}

module.exports = { stage6_evidence };
