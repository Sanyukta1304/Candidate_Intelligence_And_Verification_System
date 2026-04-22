/**
 * Stage 1: Parse & Normalise
 * Extracts text from PDF/DOCX and applies 9-step normalisation pipeline
 *
 * FIX: Replaced textract (requires OS-level pdftotext binary) with
 *      pdf-parse (pure Node.js, no system dependencies).
 *      Run: npm install pdf-parse mammoth
 */

const pdfParse = require('pdf-parse');
const mammoth  = require('mammoth');
const fs       = require('fs').promises;

async function stage1_parse(filePath) {
  try {
    let rawText = '';

    const ext    = filePath.toLowerCase();
    const isDocx = ext.endsWith('.docx');
    const isPdf  = ext.endsWith('.pdf');

    console.log('\n[Stage 1] ===========================================');
    console.log('[Stage 1] PARSING RESUME FILE');
    console.log('[Stage 1] File:', filePath);
    console.log('[Stage 1] Type:', isDocx ? 'DOCX' : 'PDF');

    const buffer = await fs.readFile(filePath);

    if (isDocx) {
      // ── DOCX ──────────────────────────────────────────────────────────
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value || '';
      console.log('[Stage 1] ✓ DOCX parsed successfully');
    } else {
      // ── PDF ───────────────────────────────────────────────────────────
      // pdf-parse is pure JS — no pdftotext / Poppler dependency needed
      const result = await pdfParse(buffer);
      rawText = result.text || '';
      console.log('[Stage 1] ✓ PDF parsed successfully');
      console.log('[Stage 1] Pages detected:', result.numpages);
    }

    if (!rawText || rawText.trim().length < 20) {
      throw new Error('Parsed text is empty or too short — file may be image-only or corrupted');
    }

    console.log('[Stage 1] Raw text length:', rawText.length, 'chars');

    // ── 9-STEP NORMALISATION PIPELINE ────────────────────────────────────

    let normalised = rawText;

    // Step 1: Replace common ligatures that break skill matching
    normalised = normalised
      .replace(/ﬁ/g, 'fi')
      .replace(/ﬂ/g, 'fl')
      .replace(/ﬀ/g, 'ff')
      .replace(/ﬃ/g, 'ffi')
      .replace(/ﬄ/g, 'ffl');
    console.log('[Stage 1] Step 1: Ligatures replaced');

    // Step 2: Unicode NFC normalisation (not NFKD — NFKD decomposes chars
    //         like é into e + combining accent, which breaks regex matching)
    normalised = normalised.normalize('NFC');
    console.log('[Stage 1] Step 2: Unicode NFC normalised');

    // Step 3: Replace tabs with single space
    normalised = normalised.replace(/\t+/g, ' ');
    console.log('[Stage 1] Step 3: Tabs normalised');

    // Step 4: Collapse multiple spaces per line (preserve line breaks)
    normalised = normalised
      .split('\n')
      .map(line => line.replace(/ {2,}/g, ' ').trim())
      .join('\n');
    console.log('[Stage 1] Step 4: Multiple spaces collapsed');

    // Step 5: Normalise all line endings to \n
    normalised = normalised.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    console.log('[Stage 1] Step 5: Line endings normalised');

    // Step 6: Remove standalone page-number lines
    //         A page-number line = trimmed content matches /^\d{1,3}$/ only
    normalised = normalised
      .split('\n')
      .filter(line => !/^\s*\d{1,3}\s*$/.test(line))
      .join('\n');
    console.log('[Stage 1] Step 6: Page numbers removed');

    // Step 7: Remove lines that are too short AND contain no letters
    //         Keep lines ≥ 2 chars that have at least one letter character
    const before7 = normalised.split('\n').length;
    normalised = normalised
      .split('\n')
      .filter(line => {
        const t = line.trim();
        return t.length >= 2 && /[a-zA-Z]/.test(t);
      })
      .join('\n');
    const after7 = normalised.split('\n').length;
    console.log(`[Stage 1] Step 7: Removed ${before7 - after7} non-text lines`);

    // Step 8: Collapse more than 2 consecutive blank lines into exactly 1
    normalised = normalised.replace(/\n{3,}/g, '\n\n');
    console.log('[Stage 1] Step 8: Excess blank lines collapsed');

    // Step 9: Final trim
    normalised = normalised.trim();
    console.log('[Stage 1] Step 9: Final trim complete');

    // ── METRICS ──────────────────────────────────────────────────────────
    const wordCount = normalised.split(/\s+/).filter(w => w.length > 0).length;
    const charCount = normalised.length;
    const lineCount = normalised.split('\n').length;

    console.log('\n[Stage 1] FINAL METRICS:');
    console.log('[Stage 1] Lines    :', lineCount);
    console.log('[Stage 1] Words    :', wordCount);
    console.log('[Stage 1] Characters:', charCount);
    console.log('[Stage 1] ==============================================\n');

    return {
      raw_text:      normalised,
      word_count:    wordCount,
      char_count:    charCount,
      line_count:    lineCount,
      parse_success: true,
      parse_error:   null,
    };

  } catch (error) {
    console.error('[Stage 1] ✗ FATAL parsing error:', error.message);
    return {
      raw_text:      '',
      word_count:    0,
      char_count:    0,
      line_count:    0,
      parse_success: false,
      parse_error:   error.message,
    };
  }
}

module.exports = { stage1_parse };