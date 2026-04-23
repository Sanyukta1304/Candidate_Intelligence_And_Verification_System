/**
 * Stage 3: Skill Extraction via Alias Graph
 * Extracts skills using canonical skill map with word-boundary matching
 * Builds skill-section matrix and co-occurrence analysis
 */

const skillGraph = require('../data/skillGraph');

function stage3_skills(parseResult, sectionResult) {
  const text = parseResult.raw_text.toLowerCase();
  const sections = sectionResult.sections;

  // Extracted skills with metadata
  const skillsDetected = new Set();
  const skillSectionMatrix = {}; // skill -> {section -> count}
  const skillOccurrences = {}; // skill -> [{ section, line, context }]
  const coOccurrenceMap = {}; // skill1 -> { skill2 -> count }

  // Extract skills from text with word boundaries
  for (const [canonical, aliases] of Object.entries(skillGraph)) {
    const allVariations = [canonical.toLowerCase(), ...aliases];
    
    for (const variation of allVariations) {
      // Create word-boundary regex
      const pattern = new RegExp(`\\b${variation}\\b`, 'gi');
      
      if (pattern.test(text)) {
        skillsDetected.add(canonical);
        
        // Track in which sections this skill appears
        if (!skillSectionMatrix[canonical]) {
          skillSectionMatrix[canonical] = {};
        }

        // Check each section
        for (const [sectionName, sectionContent] of Object.entries(sections)) {
          if (!sectionContent) continue;
          
          const sectionText = sectionContent.toLowerCase();
          const sectionPattern = new RegExp(`\\b${variation}\\b`, 'gi');
          const matches = sectionText.match(sectionPattern);
          
          if (matches) {
            skillSectionMatrix[canonical][sectionName] = matches.length;
          }
        }

        if (!skillOccurrences[canonical]) {
          skillOccurrences[canonical] = [];
        }
      }
    }
  }

  // Build co-occurrence map (skills that appear together)
  const detectedArray = Array.from(skillsDetected);
  for (let i = 0; i < detectedArray.length; i++) {
    const skill1 = detectedArray[i];
    coOccurrenceMap[skill1] = {};
    
    for (let j = i + 1; j < detectedArray.length; j++) {
      const skill2 = detectedArray[j];
      
      // Count how many sections both appear in
      const skill1Sections = Object.keys(skillSectionMatrix[skill1] || {});
      const skill2Sections = Object.keys(skillSectionMatrix[skill2] || {});
      const commonSections = skill1Sections.filter(s => skill2Sections.includes(s));
      
      if (commonSections.length > 0) {
        coOccurrenceMap[skill1][skill2] = commonSections.length;
      }
    }
  }

  return {
    skills_detected: Array.from(skillsDetected).sort(),
    skill_section_matrix: skillSectionMatrix,
    co_occurrence_map: coOccurrenceMap,
    skills_count: skillsDetected.size
  };
}

module.exports = { stage3_skills };
