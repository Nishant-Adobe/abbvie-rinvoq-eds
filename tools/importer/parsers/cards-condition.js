/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-condition
 * Base block: cards
 * Source: https://www.rinvoq.com/
 * Selector: .homepage-cta-flex-box.conditions
 * Generated: 2026-05-25
 *
 * UE Model: card (container block)
 *   - image (reference/string): Card image (empty for condition cards)
 *   - text (richtext/string): Card text content
 *
 * Source structure:
 *   .abbv-flex-container.homepage-cta-flex-box.conditions
 *     > .abbv-flex-item (repeating, visible ones contain condition links)
 *       > .rich-text > .abbv-rich-text > p > a.homepage-indication-selector-cta
 *         > span (severity label, e.g. "Moderate to Severe" or "Active")
 *         > span (condition name, e.g. "Eczema", "Rheumatoid Arthritis")
 *         > span? (optional parenthetical clarification)
 */
export default function parse(element, { document }) {
  // Find all visible flex items that contain condition links
  // Exclude items with d-none class (hidden items like pJIA)
  const flexItems = element.querySelectorAll('.abbv-flex-item:not(.d-none)');

  const cells = [];

  flexItems.forEach((item) => {
    // Each visible flex item should contain a condition link
    const link = item.querySelector('a.homepage-indication-selector-cta');
    if (!link) return; // Skip empty spacer flex items

    // Clone the link to preserve its content and href
    const linkClone = link.cloneNode(true);

    // Build the image cell (empty for condition cards, but required by model)
    // Leave empty - no field hint for empty cells per hinting rules

    // Build the text cell with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    // Wrap the link content in a paragraph to preserve block structure
    const p = document.createElement('p');
    p.appendChild(linkClone);
    textFrag.appendChild(p);

    // Each row = [image, text] per container card model
    cells.push([[], textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-condition', cells });
  element.replaceWith(block);
}
