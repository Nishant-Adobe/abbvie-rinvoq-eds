/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-efficacy
 * Base block: columns
 * Selector: .helps-deliver-sectionx
 * Source: https://www.rinvoq.com/atopic-dermatitis
 * Description: Three columns showing Fast Itch Relief, Rapid Skin Clearance,
 *   and Long-term Results. Each column has an H2 heading and a bullet list.
 *   The section also contains an H1 heading, intro paragraph, and CTA above/below
 *   the columns but those are default content outside the block table.
 * UE Model: columns (3), rows (1) - standard columns component with 3 columns
 * Generated: 2026-05-25
 */
export default function parse(element, { document }) {
  // The element is .helps-deliver-sectionx which contains:
  // - An H1 heading and intro paragraph (above columns - default content)
  // - A flex container with 3 .abbv-flex-item children (the 3 columns)
  // - A CTA link below (default content)

  // Find the flex container with the 3 column items
  const flexContainer = element.querySelector('.abbv-flex-container');
  const flexItems = flexContainer
    ? Array.from(flexContainer.querySelectorAll(':scope > .abbv-flex-item'))
    : [];

  // Build content for each column
  const col1Content = [];
  const col2Content = [];
  const col3Content = [];

  const columns = [col1Content, col2Content, col3Content];

  flexItems.forEach((item, index) => {
    if (index >= 3) return;
    const col = columns[index];

    // Extract H2 heading
    const heading = item.querySelector('h2');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim().replace(/\n\s*/g, ' ');
      col.push(h2);
    }

    // Extract bullet list
    const ul = item.querySelector('ul');
    if (ul) {
      col.push(ul.cloneNode(true));
    }

    // Extract footnote paragraph if present (e.g., Long-term Results footnote)
    const footnote = item.querySelector('.abbv-rich-text.pl-5 p, .abbv-rich-text.pl-lg-15 p');
    if (footnote) {
      const p = document.createElement('p');
      p.textContent = footnote.textContent.trim();
      col.push(p);
    }
  });

  // Build cells: 1 row with 3 columns
  const cells = [
    [col1Content, col2Content, col3Content],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-efficacy', cells });
  element.replaceWith(block);
}
