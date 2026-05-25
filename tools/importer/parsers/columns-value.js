/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-value
 * Base block: columns
 * Source: https://www.rinvoq.com/
 * Selector: .cost-and-savings-link
 * Description: 2-column value proposition layout. Left column = RINVOQ Complete
 *   savings (logo image, heading "You could pay $0", description paragraph,
 *   primary CTA, footnote, ISI link). Right column = About RINVOQ (icon image,
 *   heading, descriptive paragraphs, product image).
 * Note: The selector targets a nav link; the parser locates the actual content
 *   container (.psa-two-col-section.two-cols) via document traversal.
 * Generated: 2026-05-25
 */
export default function parse(element, { document }) {
  // The selector .cost-and-savings-link targets a nav anchor, not the block
  // container. Locate the actual two-column section via document.
  const sectionContainer = document.querySelector('.psa-two-col-section.two-cols')
    || document.querySelector('.abbv-flex-container.max-width-xl-1140.m-auto.flex-column.flex-lg-row');

  if (!sectionContainer) {
    // Cannot find the block content; replace element with empty block
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-value', cells: [[[], []]] });
    element.replaceWith(block);
    return;
  }

  // Find the flex container with two columns
  const flexContainer = sectionContainer.querySelector('.abbv-flex-container.max-width-xl-1140')
    || sectionContainer;
  const flexItems = Array.from(flexContainer.querySelectorAll(':scope > .abbv-flex-item'));

  // === LEFT COLUMN: Savings content (yellow background) ===
  const leftCol = flexItems[0];
  const leftContent = [];

  if (leftCol) {
    // Logo image (RINVOQ Complete logo - in picture element or img)
    const logoPicture = leftCol.querySelector('.abbv-image-content-container-v2 picture');
    const logoImg = leftCol.querySelector('.abbv-image-content-container-v2 img');
    if (logoPicture) {
      leftContent.push(logoPicture);
    } else if (logoImg) {
      leftContent.push(logoImg);
    }

    // Heading (e.g., "You could pay $0 a month for RINVOQ")
    const heading = leftCol.querySelector('h2, h1, h3');
    if (heading) leftContent.push(heading);

    // Description paragraph
    const richTextParas = leftCol.querySelectorAll('.abbv-rich-text.paragraph p, .abbv-rich-text-common.paragraph p');
    if (richTextParas.length > 0) {
      leftContent.push(...Array.from(richTextParas));
    }

    // Primary CTA link
    const primaryCta = leftCol.querySelector('a.abbv-button-primary, a[class*="button-primary"]');
    if (primaryCta) leftContent.push(primaryCta);

    // Footnote text
    const footnoteParas = leftCol.querySelectorAll('.psa-footnote p');
    if (footnoteParas.length > 0) {
      leftContent.push(...Array.from(footnoteParas));
    }

    // ISI link (secondary/plain link)
    const isiLink = leftCol.querySelector('a.abbv-button-plain, a[class*="button-plain"]');
    if (isiLink) leftContent.push(isiLink);
  }

  // === RIGHT COLUMN: About RINVOQ content ===
  const rightCol = flexItems[1];
  const rightContent = [];

  if (rightCol) {
    // Icon image (lightbulb - first image in right column)
    const allImages = Array.from(rightCol.querySelectorAll('.abbv-image-content-container-v2 img'));
    if (allImages.length > 0) {
      rightContent.push(allImages[0]);
    }

    // Heading (e.g., "About RINVOQ")
    const heading = rightCol.querySelector('h2, h1, h3');
    if (heading) rightContent.push(heading);

    // Descriptive paragraphs
    const richTextParas = rightCol.querySelectorAll('.abbv-rich-text-common p');
    if (richTextParas.length > 0) {
      rightContent.push(...Array.from(richTextParas));
    }

    // Product image (RINVOQ bottle - last image if multiple exist)
    if (allImages.length > 1) {
      rightContent.push(allImages[allImages.length - 1]);
    }
  }

  // Build cells: 1 row with 2 columns (left | right)
  const cells = [
    [leftContent, rightContent],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-value', cells });
  element.replaceWith(block);
}
