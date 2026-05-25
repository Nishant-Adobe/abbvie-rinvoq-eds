/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-safety
 * Base block: columns
 * Source: https://www.rinvoq.com/atopic-dermatitis/about-rinvoq/faq
 * Selector: .abbv-select-safety-inf
 * Description: 2-column safety information callout with icon image (left) and
 *   rich text content including heading, paragraphs, list, and link (right).
 * Generated: 2026-05-23
 */
export default function parse(element, { document }) {
  // Column 1: Extract the warning/info icon image
  const iconImage = element.querySelector('.abbv-image-content-container-v2 img');

  // Column 2: Extract the text content container
  const textContainer = element.querySelector('.abbv-stretched-card-body');

  // Build column 1 cell - icon image
  const col1Content = [];
  if (iconImage) {
    col1Content.push(iconImage);
  }

  // Build column 2 cell - all text content (h2, p, ul, a)
  const col2Content = [];
  if (textContainer) {
    // Gather all direct children of the stretched-card-body in order
    const children = Array.from(textContainer.children);
    for (const child of children) {
      col2Content.push(child);
    }
  } else {
    // Fallback: try to find content elements directly
    const heading = element.querySelector('h2, h3, [class*="font-20"]');
    if (heading) col2Content.push(heading);

    const paragraphs = Array.from(element.querySelectorAll('.abbv-image-text-content-container-v2 p'));
    col2Content.push(...paragraphs);

    const list = element.querySelector('.abbv-image-text-content-container-v2 ul');
    if (list) col2Content.push(list);
  }

  // Build cells: 1 row with 2 columns
  const cells = [
    [col1Content, col2Content],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-safety', cells });
  element.replaceWith(block);
}
