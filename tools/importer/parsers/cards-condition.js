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

    const href = link.getAttribute('href') || '';

    // Extract structured text from spans inside the link
    const spans = link.querySelectorAll('span');
    let category = '';
    let conditionName = '';
    let subtitle = '';

    if (spans.length >= 2) {
      category = spans[0]?.textContent?.trim() || '';
      conditionName = spans[1]?.textContent?.trim() || '';
      if (spans.length >= 3) {
        subtitle = spans[2]?.textContent?.trim() || '';
      }
    } else {
      // Fallback: use full link text
      conditionName = link.textContent.trim();
    }

    // Build the text cell with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    // Create link with structured content using <br> for line breaks
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', href);

    if (category) {
      const catSpan = document.createElement('span');
      catSpan.className = 'cards-condition-category';
      catSpan.textContent = category;
      a.appendChild(catSpan);
      a.appendChild(document.createElement('br'));
    }

    const nameSpan = document.createElement('span');
    nameSpan.className = 'cards-condition-name';
    nameSpan.textContent = conditionName;
    a.appendChild(nameSpan);

    if (subtitle) {
      a.appendChild(document.createElement('br'));
      const subSpan = document.createElement('span');
      subSpan.className = 'cards-condition-subtitle';
      subSpan.textContent = subtitle;
      a.appendChild(subSpan);
    }

    p.appendChild(a);
    textFrag.appendChild(p);

    // Each row = [image, text] per container card model
    cells.push([[], textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-condition', cells });
  element.replaceWith(block);
}
