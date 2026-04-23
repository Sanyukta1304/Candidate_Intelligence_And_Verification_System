/**
 * Action Verbs Tiered by Impact
 * Used to detect quality of language in bullet points
 */

module.exports = {
  TIER_A: {
    bonus: 0.20,
    verbs: [
      'architected', 'engineered', 'designed', 'spearheaded', 'pioneered',
      'founded', 'established', 'launched', 'scaled', 'led', 'drove', 'delivered',
      'transformed', 'revolutionized', 'optimized', 'accelerated', 'surpassed',
      'exceeded', 'won', 'awarded', 'recognized', 'increased', 'improved',
      'enhanced', 'strengthened', 'advanced', 'exceeded', 'outperformed'
    ]
  },
  TIER_B: {
    bonus: 0.10,
    verbs: [
      'built', 'developed', 'implemented', 'created', 'deployed', 'integrated',
      'optimised', 'refactored', 'migrated', 'automated', 'improved', 'reduced',
      'increased', 'enabled', 'shipped', 'maintained', 'managed', 'designed',
      'engineered', 'constructed', 'implemented', 'established', 'initiated',
      'executed', 'coordinated', 'facilitated', 'administered', 'orchestrated',
      'consolidated', 'streamlined', 'standardized', 'systematized'
    ]
  },
  TIER_C: {
    penalty: -0.10,
    verbs: [
      'used', 'worked with', 'worked on', 'familiar with', 'exposure to',
      'knowledge of', 'understanding of', 'experience with', 'aware of',
      'participated', 'assisted', 'helped', 'supported', 'contributed',
      'involved in', 'part of', 'collaborated', 'communicated', 'discussed'
    ]
  }
};
