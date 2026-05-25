/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-stories
 * Base block: columns
 * Selector: .abbv-flex-container.pt-35
 * Source: https://www.rinvoq.com/atopic-dermatitis
 * Description: Patient stories section with 2 columns. Left column has heading
 *   "Meet RINVOQ patients like Maddy", description, CTA "Watch their stories",
 *   and share invitation text with email/phone links. Right column has patient image.
 * UE Model: columns (2), rows (1) - standard columns component with 2 columns
 * Generated: 2026-05-25
 */
export default function parse(element, { document }) {
  // The element is .abbv-flex-container.pt-35
  // It has 2 .abbv-flex-item children: left (text content) and right (image)

  const flexItems = Array.from(element.querySelectorAll(':scope > .abbv-flex-item'));
  const leftItem = flexItems[0];
  const rightItem = flexItems[1];

  // Left column: heading, description, CTA, share text
  const leftContent = [];

  if (leftItem) {
    // H2 heading
    const heading = leftItem.querySelector('h2, .abbv-title h2');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      leftContent.push(h2);
    }

    // Description paragraph (first .abbv-rich-text p)
    const richTexts = leftItem.querySelectorAll('.abbv-rich-text');
    if (richTexts.length > 0) {
      const firstP = richTexts[0].querySelector('p');
      if (firstP) {
        const p = document.createElement('p');
        p.textContent = firstP.textContent.trim();
        leftContent.push(p);
      }
    }

    // Primary CTA link
    const cta = leftItem.querySelector('a.abbv-button-primary, a[class*="button-primary"]');
    if (cta) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.getAttribute('href') || '';
      a.textContent = cta.textContent.trim();
      p.appendChild(a);
      leftContent.push(p);
    }

    // Share text (last .abbv-rich-text with email/phone links)
    if (richTexts.length > 1) {
      const shareRichText = richTexts[richTexts.length - 1];
      const shareP = shareRichText.querySelector('p');
      if (shareP) {
        leftContent.push(shareP.cloneNode(true));
      }
    }
  }

  // Right column: patient image
  const rightContent = [];

  if (rightItem) {
    const img = rightItem.querySelector('img');
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.getAttribute('src') || '';
      imgEl.alt = img.getAttribute('alt') || 'Patient photo';
      rightContent.push(imgEl);
    }
  }

  // Build cells: 1 row with 2 columns
  const cells = [
    [leftContent, rightContent],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-stories', cells });
  element.replaceWith(block);
}
