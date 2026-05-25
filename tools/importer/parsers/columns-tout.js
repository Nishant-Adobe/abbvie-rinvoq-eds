/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-tout
 * Base block: columns
 * Selector: .target-rcmd-enhancementout
 * Source: https://www.rinvoq.com/atopic-dermatitis
 * Description: Quiz tout with 2 columns on yellow background. Left column
 *   (visual order 1) has brush heading image "Take This Quiz", text paragraphs
 *   ("Take charge of your eczema appointment"), and CTA "Answer a few questions".
 *   Right column (visual order 2) has decorative patient image.
 *   Note: DOM order differs from visual order due to flex-lg-order classes.
 * UE Model: columns (2), rows (1) - standard columns component with 2 columns
 * Generated: 2026-05-25
 */
export default function parse(element, { document }) {
  // The element is .target-rcmd-enhancementout
  // Contains .abbv-flex-container.background-yellow with 2 flex items
  // Item with flex-lg-order-1 = left column (text content)
  // Item with flex-lg-order-2 = right column (decorative image)

  const flexContainer = element.querySelector('.abbv-flex-container.background-yellow, .abbv-flex-container');
  const flexItems = flexContainer
    ? Array.from(flexContainer.querySelectorAll(':scope > .abbv-flex-item'))
    : [];

  // Identify columns by flex order classes
  let textItem = null;
  let imageItem = null;

  flexItems.forEach((item) => {
    if (item.classList.contains('flex-lg-order-1')) {
      textItem = item;
    } else if (item.classList.contains('flex-lg-order-2')) {
      imageItem = item;
    }
  });

  // Fallback: if no order classes, use DOM order (second item is text, first is image)
  if (!textItem && !imageItem && flexItems.length >= 2) {
    imageItem = flexItems[0];
    textItem = flexItems[1];
  }

  // Left column (visual order 1): brush heading image, text, CTA
  const leftContent = [];

  if (textItem) {
    // Brush heading image (e.g., "Take This Quiz")
    const brushImg = textItem.querySelector('.abbv-image-content-container-v2 img, .abbv-image-scale img');
    if (brushImg) {
      const img = document.createElement('img');
      img.src = brushImg.getAttribute('src') || '';
      img.alt = brushImg.getAttribute('alt') || '';
      leftContent.push(img);
    }

    // Text paragraphs from the image-text content area
    const paragraphs = textItem.querySelectorAll('.abbv-stretched-card-body p, .abbv-image-text-content-v2 p');
    paragraphs.forEach((p) => {
      const newP = document.createElement('p');
      newP.textContent = p.textContent.trim();
      leftContent.push(newP);
    });

    // CTA link
    const cta = textItem.querySelector('a.abbv-button-primary, a[class*="button-primary"]');
    if (cta) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.getAttribute('href') || '';
      a.textContent = cta.textContent.trim();
      p.appendChild(a);
      leftContent.push(p);
    }
  }

  // Right column (visual order 2): decorative patient image
  const rightContent = [];

  if (imageItem) {
    const img = imageItem.querySelector('img');
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.getAttribute('src') || '';
      imgEl.alt = img.getAttribute('alt') || '';
      rightContent.push(imgEl);
    }
  }

  // Build cells: 1 row with 2 columns (left text | right image)
  const cells = [
    [leftContent, rightContent],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-tout', cells });
  element.replaceWith(block);
}
