/**
 * Stage 1: Parse & Normalise
 * Extracts text from PDF/DOCX and applies 9-step normalisation pipeline
 */

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;

async function stage1_parse(filePath) {
  try {
    let rawText = '';
    
    // Detect file type by extension
    const isDocx = filePath.toLowerCase().endsWith('.docx');
    
    if (isDocx) {
      // Handle DOCX
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    } else {
      // Handle PDF (default)
      const buffer = await fs.readFile(filePath);
      const data = await pdfParse(buffer);
      rawText = data.text;
    }

    // 9-step normalisation pipeline
    let normalised = rawText;

    // Step 1: Replace ligatures (ﬁ → fi, ﬂ → fl)
    normalised = normalised.replace(/ﬁ/g, 'fi').replace(/ﬂ/g, 'fl');

    // Step 2: Handle Unicode normalization
    normalised = normalised.normalize('NFKD');

    // Step 3: Replace multiple tabs with single space
    normalised = normalised.replace(/\t+/g, ' ');

    // Step 4: Replace multiple spaces with single space
    normalised = normalised.replace(/ +/g, ' ');

    // Step 5: Normalize line endings to \n
    normalised = normalised.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Step 6: Remove page numbers (common patterns)
    normalised = normalised.replace(/\n\s*\d+\s*\n/g, '\n');

    // Step 7: Remove short lines (< 3 chars)
    normalised = normalised
      .split('\n')
      .filter(line => line.trim().length > 2)
      .join('\n');

    // Step 8: Remove excessive blank lines (keep max 1)
    normalised = normalised.replace(/\n\n+/g, '\n\n');

    // Step 9: Trim whitespace
    normalised = normalised.trim();

    // Calculate metrics
    const wordCount = normalised.split(/\s+/).filter(w => w.length > 0).length;
    const charCount = normalised.length;
    const lineCount = normalised.split('\n').length;

    return {
      raw_text: normalised,
      word_count: wordCount,
      char_count: charCount,
      line_count: lineCount,
      parse_success: true,
      parse_error: null
    };
  } catch (error) {
    return {
      raw_text: '',
      word_count: 0,
      char_count: 0,
      line_count: 0,
      parse_success: false,
      parse_error: error.message
    };
  }
}

module.exports = { stage1_parse };
