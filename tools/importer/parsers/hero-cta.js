/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-cta
 * Base block: hero
 * Selector: .abbv-background-container.height-435
 * Source: https://www.rinvoq.com/
 * Description: Full-width background image (brushstroke art) with text overlay.
 *   Contains heading, description paragraph, email link, phone link.
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Generated: 2026-05-25
 */
export default function parse(element, { document }) {
  // Extract background image - on live page it's a CSS background-image, not an <img> tag
  let bgImage = element.querySelector('.abbv-background-container-display img, .abbv-background-container-image-swap-bg img');

  // Fallback: extract from CSS background-image if no <img> element found
  if (!bgImage) {
    const bgDiv = element.querySelector('.abbv-background-container-display, .abbv-background-container-image-swap-bg');
    if (bgDiv) {
      const computedStyle = window.getComputedStyle(bgDiv);
      const bgUrl = computedStyle.backgroundImage;
      const urlMatch = bgUrl && bgUrl.match(/url\(["']?(.*?)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        bgImage = document.createElement('img');
        bgImage.src = urlMatch[1];
        bgImage.alt = 'SPEAK Network background';
      }
    }
  }

  // Extract text content: heading, description, and contact links
  const heading = element.querySelector('.speak-network-title, p[class*="speak-network-title"]');
  const paragraphs = Array.from(element.querySelectorAll('.abbv-rich-text p:not(.speak-network-title)'));
  const emailLink = element.querySelector('a[href*="mailto"]');
  const phoneLink = element.querySelector('a[href*="tel"]');

  // Build cells array matching UE model: Row 1 = image, Row 2 = text (richtext)
  const cells = [];

  // Row 1: Image (field: image; imageAlt is collapsed into img alt attribute)
  if (bgImage) {
    const imageFragment = document.createDocumentFragment();
    imageFragment.appendChild(document.createComment(' field:image '));
    imageFragment.appendChild(bgImage.cloneNode ? bgImage.cloneNode(true) : bgImage);
    cells.push([imageFragment]);
  } else {
    // Empty row required by model even if no image found
    cells.push(['']);
  }

  // Row 2: Text content (field: text - richtext containing heading, description, links)
  const textFragment = document.createDocumentFragment();
  textFragment.appendChild(document.createComment(' field:text '));

  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    textFragment.appendChild(h2);
  }

  // Add description paragraphs and contact links
  paragraphs.forEach((p) => {
    const cloned = p.cloneNode(true);
    textFragment.appendChild(cloned);
  });

  // If contact links were not already included in paragraphs, add them separately
  if (emailLink && !textFragment.querySelector('a[href*="mailto"]')) {
    const emailP = document.createElement('p');
    emailP.appendChild(emailLink.cloneNode(true));
    textFragment.appendChild(emailP);
  }

  if (phoneLink && !textFragment.querySelector('a[href*="tel"]')) {
    const phoneP = document.createElement('p');
    phoneP.appendChild(phoneLink.cloneNode(true));
    textFragment.appendChild(phoneP);
  }

  cells.push([textFragment]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
