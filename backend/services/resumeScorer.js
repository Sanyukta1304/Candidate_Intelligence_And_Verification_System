const actionVerbs = [
  "built","designed","developed","implemented",
  "optimized","led","created","automated","reduced"
];

const scoreResume = (text) => {
  if (!text) return { total: 0 };

  text = text.toLowerCase();

  const has_contact = text.includes("email") || text.includes("phone");
  const has_experience = text.includes("experience");
  const has_education = text.includes("education");
  const has_skills = text.includes("skills");
  const has_projects = text.includes("projects");
  const has_summary = text.includes("summary");

  let section_score = [
    has_contact,
    has_experience,
    has_education,
    has_skills,
    has_projects,
    has_summary
  ].filter(Boolean).length * 5;

  const words = text.split(/\s+/);
  const total_word_count = words.length;

  const action_verb_count = words.filter(w => actionVerbs.includes(w)).length;
  const density_ratio = action_verb_count / total_word_count;

  const keyword_score = Math.min(density_ratio * 100, 35);

  const is_parseable = true;
  const word_count = total_word_count;
  const length_score = (word_count >= 300 && word_count <= 1000) ? 30 : 10;
  const format_score = length_score;

  const total_ats_score = Math.round(section_score + keyword_score + format_score);

  return {
    sections: {
      has_contact,
      has_experience,
      has_education,
      has_skills,
      has_projects,
      has_summary,
      section_score
    },
    keywords: {
      action_verb_count,
      total_word_count,
      density_ratio,
      keyword_score
    },
    format: {
      is_parseable,
      word_count,
      length_score,
      format_score
    },
    total_ats_score
  };
};

module.exports = { scoreResume };