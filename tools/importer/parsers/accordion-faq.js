/* eslint-disable */
/* global WebImporter */

/**
 * Parser: accordion-faq
 * Base block: accordion
 * Source: https://www.rinvoq.com/atopic-dermatitis/about-rinvoq/faq
 * Selector: .faqs-accordion
 * Generated: 2026-05-23
 *
 * UE Model: accordion-faq-item (container block)
 *   - summary (text/string): Question title
 *   - text (richtext/string): Answer rich text content
 *
 * Source structure:
 *   .abbv-accordion-container > .abbv-accordion-blade (repeating)
 *     .abbv-accordion-blade-text (question)
 *     .abbv-accordion-content > .rich-text > .abbv-rich-text (answer body)
 */
export default function parse(element, { document }) {
  // Find all accordion blades (each blade = one FAQ item)
  const blades = element.querySelectorAll('.abbv-accordion-blade');

  const cells = [];

  blades.forEach((blade) => {
    // Extract the question title text
    const questionEl = blade.querySelector('.abbv-accordion-blade-text');

    // Extract the answer rich text content
    const answerEl = blade.querySelector('.abbv-accordion-content .abbv-rich-text');

    // Build the summary cell with field hint
    const summaryFrag = document.createDocumentFragment();
    summaryFrag.appendChild(document.createComment(' field:summary '));
    if (questionEl) {
      summaryFrag.appendChild(questionEl);
    }

    // Build the text cell with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (answerEl) {
      textFrag.appendChild(answerEl);
    }

    // Each row = [summary, text] (2 columns per container item)
    cells.push([summaryFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
