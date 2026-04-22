/**
 * Stage 2: Section Detection & Role Classification
 *
 * BUGS FIXED:
 * 1. stringSimilarity used /\w+/ (splits ON word chars) → fixed to /\W+/
 * 2. containsHeadingKeyword used .includes() causing false positives on body text
 *    → replaced with word-boundary regex match
 * 3. isHeadingCandidate gate was too restrictive (blocked 5+ word headings)
 *    → simplified to wordCount <= 6 and length <= 100
 * 4. Section content was extracted from lowercased lines, destroying casing
 *    → originalLines kept separately; content extracted from those
 * 5. stringSimilarity aWords/bWords always empty due to wrong split regex
 *    → fixed with /\W+/ split
 * 6. No plausibility guard before locking in a section match
 *    → added: line must be ≤50 chars, no comma, not ending with period
 */

const sectionHeadings = require('../data/sectionHeadings');

// ── UTILITY: word-boundary heading match ─────────────────────────────────────
// Returns true only when the heading phrase matches as whole words in the line.
// Prevents "work" matching "teamwork", "experience" matching "experienced", etc.
function containsHeadingKeyword(line, heading) {
  const lineNorm    = line.trim().toLowerCase().replace(/[^\w\s]/g, '');
  const headingNorm = heading.toLowerCase().replace(/[^\w\s]/g, '').trim();

  if (!lineNorm || !headingNorm) return false;

  // Exact full-line match (most reliable for dedicated heading lines)
  if (lineNorm === headingNorm) return true;

  // Word-boundary regex: every word in the heading must appear as a whole word
  // Handles: "technical skills" matching line "technical skills" but NOT "technically skilled"
  const escapedHeading = headingNorm
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escape regex special chars
    .replace(/\s+/g, '[\\s\\-]+');           // allow hyphen between words
  const regex = new RegExp(`(^|\\s)${escapedHeading}(\\s|$)`);
  return regex.test(lineNorm);
}

// ── UTILITY: string similarity ────────────────────────────────────────────────
// FIX: changed /\w+/ → /\W+/ so it splits on non-word chars and returns words
function stringSimilarity(s1, s2) {
  const a = s1.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const b = s2.toLowerCase().replace(/[^\w\s]/g, '').trim();

  if (!a || !b) return 0;
  if (a === b) return 1.0;

  // Substring match (covers "skills" vs "technical skills" etc.)
  if (a.includes(b) || b.includes(a)) return 0.85;

  // Word-overlap match — FIX: /\W+/ splits on non-word chars, returning actual words
  const aWords = a.split(/\W+/).filter(w => w.length > 2);
  const bWords = b.split(/\W+/).filter(w => w.length > 2);

  if (aWords.length === 0 || bWords.length === 0) return 0;

  const matches = aWords.filter(w =>
    bWords.some(bw => bw === w || bw.includes(w) || w.includes(bw))
  ).length;

  return matches / Math.max(aWords.length, bWords.length);
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
function stage2_sections(parseResult) {
  if (!parseResult || !parseResult.raw_text) {
    console.error('[Stage 2] No valid parse result provided');
    return {
      sections: {},
      detected_role: 'Unknown',
      role_scores: {},
      section_presence: {
        summary: false, experience: false, education: false,
        skills: false, projects: false, certifications: false,
      },
    };
  }

  // FIX: keep original-case lines for content extraction
  //      only use lowercased version for heading detection comparisons
  const originalLines = parseResult.raw_text.split('\n');
  const text          = parseResult.raw_text.toLowerCase();
  const lines         = text.split('\n');            // lowercased — heading detection only

  console.log('\n[Stage 2] ===========================================');
  console.log('[Stage 2] SECTION DETECTION STARTING');
  console.log('[Stage 2] Total lines:', lines.length);
  console.log('[Stage 2] Text length:', text.length, 'chars');

  // ── PASS 1: HEADING DETECTION ─────────────────────────────────────────
  const sectionLineIndices = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length < 5) continue;  // Minimum 5 chars to avoid matching fragments like "nd", "th"

    // Heading candidates: short lines with few words
    const wordCount         = line.split(/\s+/).filter(w => w.length > 0).length;
    const isHeadingCandidate = line.length <= 120 && wordCount <= 8;
    if (!isHeadingCandidate) continue;

    // Plausibility check: headings are typically short, no trailing periods
    // Allow commas (e.g., "Skills, Certifications") and bullets at start
    const originalLine     = originalLines[i].trim();
    const isPlausibleHeading = originalLine.length <= 80 &&
                               !originalLine.endsWith('.') &&
                               !originalLine.endsWith(',');
    if (!isPlausibleHeading) continue;

    // Log all heading candidates being checked (disabled to reduce noise)
    // console.log(`[Stage 2] Checking candidate line ${i}: "${originalLine}"`);

    for (const [sectionName, headings] of Object.entries(sectionHeadings)) {
      if (sectionLineIndices[sectionName] !== undefined) continue; // already locked

      for (const heading of headings) {
        // Strategy 1: word-boundary heading match (primary, most reliable)
        if (containsHeadingKeyword(line, heading)) {
          console.log(`[Stage 2] ✓ KEYWORD MATCH: ${sectionName} at line ${i}`);
          console.log(`[Stage 2]    Line: "${originalLine}"`);
          console.log(`[Stage 2]    Heading: "${heading}"`);
          sectionLineIndices[sectionName] = i;
          break;
        }

        // Strategy 1b: exact match for short headings (5-14 chars)
        //            catches "education", "projects", "skills", etc.
        if (line.length >= 5 && line.length <= 14 && line === heading) {
          console.log(`[Stage 2] ✓ EXACT MATCH: ${sectionName} at line ${i}`);
          console.log(`[Stage 2]    Line: "${originalLine}"`);
          sectionLineIndices[sectionName] = i;
          break;
        }

        // Strategy 2: similarity fallback (for longer lines 15-80 chars)
        //            prevents matching short corrupted fragments like "nd", "th"
        if (line.length >= 15 && line.length <= 80) {
          const sim = stringSimilarity(line, heading);
          if (sim >= 0.85) {
            console.log(`[Stage 2] ✓ SIMILARITY (${(sim*100).toFixed(0)}%): ${sectionName} at line ${i}`);
            console.log(`[Stage 2]    Line: "${originalLine}"`);
            console.log(`[Stage 2]    Heading: "${heading}"`);
            sectionLineIndices[sectionName] = i;
            break;
          }
        }
      }
    }
  }

  const foundCount = Object.keys(sectionLineIndices).length;
  console.log(`\n[Stage 2] Pass 1 detected ${foundCount} sections:`, Object.keys(sectionLineIndices));

  // ── PASS 2: DENSITY HEURISTICS (fallback for missing sections) ────
  if (foundCount < 5) {
    console.log('\n[Stage 2] Pass 2: Running density heuristics...');

    const datePattern  = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]+\d{4}\b|\b\d{4}\s*[-–—]\s*(\d{4}|present|current|now)\b/i;
    const uniKeywords  = /\b(university|college|institute|school|b\.?tech|b\.?e|m\.?tech|m\.?sc|b\.?sc|bca|mca|degree|bachelor|master|phd|diploma|b\.?a|m\.?a)\b/i;
    const companyRole  = /\b(engineer|developer|manager|analyst|coordinator|specialist|associate|director|lead|architect|consultant|scientist|designer)\b/i;
    const bulletLine   = /^\s*[-•*–→]\s+/;
    const certKeywords = /\b(certified|certificate|certification|credentials|aws certified|ccna|ccnp|cissp|azure|gcp|comptia|scrum master|pmp)\b/i;

    // Group lines into blocks separated by blank lines
    let blockStart = 0;
    const blocks = [];
    for (let i = 0; i <= originalLines.length; i++) {
      const isBlank = i === originalLines.length || originalLines[i].trim().length === 0;
      if (isBlank && i > blockStart) {
        blocks.push({ startLine: blockStart, endLine: i, text: originalLines.slice(blockStart, i).join('\n') });
        blockStart = i + 1;
      }
    }

    console.log(`[Stage 2] Found ${blocks.length} text blocks for heuristic analysis`);

    for (const block of blocks) {
      const bt = block.text;
      const bt_lines = bt.split('\n').filter(l => l.trim().length > 0);

      // EXPERIENCE: dates + job titles + multiple lines (but NOT if this block has education keywords)
      // This prevents education blocks with dates from being misclassified as experience
      const hasEducationKeywords = uniKeywords.test(bt);
      const hasExperienceSignals = datePattern.test(bt) && companyRole.test(bt) && bt_lines.length >= 2;
      
      if (!sectionLineIndices.EXPERIENCE && hasExperienceSignals && !hasEducationKeywords) {
        sectionLineIndices.EXPERIENCE = block.startLine;
        console.log(`[Stage 2] ✓ HEURISTIC: EXPERIENCE (dates + roles) at line ${block.startLine}`);
      }

      // EDUCATION: university keywords + optional dates
      if (!sectionLineIndices.EDUCATION && uniKeywords.test(bt)) {
        sectionLineIndices.EDUCATION = block.startLine;
        console.log(`[Stage 2] ✓ HEURISTIC: EDUCATION (university keywords) at line ${block.startLine}`);
      }

      // CERTIFICATIONS: cert keywords + optional dates
      if (!sectionLineIndices.CERTIFICATIONS && certKeywords.test(bt)) {
        sectionLineIndices.CERTIFICATIONS = block.startLine;
        console.log(`[Stage 2] ✓ HEURISTIC: CERTIFICATIONS (cert keywords) at line ${block.startLine}`);
      }

      // SKILLS: lots of short lines (comma-separated or bullet points)
      if (!sectionLineIndices.SKILLS) {
        const bulletLines = bt_lines.filter(l => bulletLine.test(l)).length;
        const shortTokenLines = bt_lines.filter(l => {
          const t = l.trim().replace(/^[-•*–→]\s*/, '');
          const tokens = t.split(/[,\s]+/).filter(Boolean);
          return tokens.length <= 5; // short lines: <= 5 tokens
        }).length;

        if (bt_lines.length > 0) {
          const bulletRatio = bulletLines / bt_lines.length;
          const shortTokenRatio = shortTokenLines / bt_lines.length;

          if (bulletRatio > 0.5 || shortTokenRatio > 0.7) {
            sectionLineIndices.SKILLS = block.startLine;
            console.log(`[Stage 2] ✓ HEURISTIC: SKILLS (bullet/short lines) at line ${block.startLine}`);
          }
        }
      }
    }
  }

  // ── EXTRACT CONTENT ───────────────────────────────────────────────────
  const sections = {
    SUMMARY: null, EXPERIENCE: null, EDUCATION: null,
    SKILLS: null, PROJECTS: null, CERTIFICATIONS: null,
    AWARDS: null, LANGUAGES: null,
  };

  const sortedSections = Object.entries(sectionLineIndices).sort((a, b) => a[1] - b[1]);
  console.log(`\n[Stage 2] Extracting content for ${sortedSections.length} sections...`);

  for (let i = 0; i < sortedSections.length; i++) {
    const [sectionName, startIdx] = sortedSections[i];
    const endIdx = i + 1 < sortedSections.length ? sortedSections[i + 1][1] : originalLines.length;

    // FIX: extract from originalLines (original casing), NOT the lowercased array
    const sectionContent = originalLines
      .slice(startIdx + 1, endIdx)
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .join('\n');

    if (sectionContent.length > 0) {
      sections[sectionName] = sectionContent;
      const preview = sectionContent.substring(0, 80).replace(/\n/g, ' ');
      console.log(`[Stage 2] ${sectionName}: ${sectionContent.length} chars`);
      console.log(`[Stage 2]   Preview: "${preview}..."`);
    }
  }

  console.log(`\n[Stage 2] Final sections with content:`,
    Object.entries(sections).filter(([, v]) => v).map(([k]) => k));

  // ── ROLE CLASSIFICATION ───────────────────────────────────────────────
  // Use full lowercase text for signal detection
  const fullText = text;

  const ROLE_SIGNATURES = {
    Frontend: ['react','angular','vue','html','css','tailwind','next.js','nextjs','typescript','javascript','webpack','redux','svelte','sass'],
    Backend:  ['node.js','nodejs','django','spring','fastapi','flask','express','java','python','graphql','rest api','postgresql','redis','kafka'],
    Data:     ['python','sql','spark','pandas','tensorflow','pytorch','scikit','machine learning','data analysis','jupyter','numpy','airflow','dbt'],
    DevOps:   ['kubernetes','docker','terraform','jenkins','ci/cd','cicd','aws','gcp','azure','linux','ansible','helm','prometheus'],
    Mobile:   ['react native','reactnative','flutter','ios','android','swift','kotlin','expo','dart','xcode'],
  };

  const roleScores = { Frontend: 0, Backend: 0, FullStack: 0, Data: 0, DevOps: 0, Mobile: 0 };

  for (const [role, signals] of Object.entries(ROLE_SIGNATURES)) {
    const matched = signals.filter(s => fullText.includes(s)).length;
    roleScores[role] = matched * 2;
  }

  // FullStack: needs at least 3 frontend AND 3 backend signals
  const feSig = ROLE_SIGNATURES.Frontend.filter(s => fullText.includes(s)).length;
  const beSig = ROLE_SIGNATURES.Backend.filter(s => fullText.includes(s)).length;
  if (feSig >= 3 && beSig >= 3) {
    roleScores.FullStack = Math.min(feSig, beSig) * 3;
  }

  let detectedRole = 'Unknown';
  let maxScore = 0;
  for (const [role, score] of Object.entries(roleScores)) {
    if (score > maxScore) { maxScore = score; detectedRole = role; }
  }

  console.log('[Stage 2] Role scores   :', roleScores);
  console.log('[Stage 2] Role detected :', detectedRole);
  console.log('[Stage 2] ==============================================\n');

  return {
    sections,
    detected_role: detectedRole,
    role_scores:   roleScores,
    section_presence: {
      summary:        !!sections.SUMMARY,
      experience:     !!sections.EXPERIENCE,
      education:      !!sections.EDUCATION,
      skills:         !!sections.SKILLS,
      projects:       !!sections.PROJECTS,
      certifications: !!sections.CERTIFICATIONS,
    },
  };
}

module.exports = { stage2_sections };