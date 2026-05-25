/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-condition
 * Base block: hero
 * Selector: .abbv-background-container.desktop-header
 * Source: https://www.rinvoq.com/atopic-dermatitis
 * Description: Hero with video/image background, overlay text with CTA link.
 *   The desktop-header background container has a video with poster image and
 *   a primary CTA "See RINVOQ results". The parser extracts the video poster
 *   image and CTA into a 2-row hero block (image, text).
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Generated: 2026-05-25
 */
export default function parse(element, { document }) {
  // The element is .abbv-background-container.desktop-header
  // It contains a video with poster/fallback image and a CTA link

  // Extract video poster image (inside <video> there's an <img> fallback)
  const video = element.querySelector('video');
  const videoImg = video ? video.querySelector('img') : null;
  const bgDisplayImg = element.querySelector('.abbv-background-container-display img');
  const heroImage = videoImg || bgDisplayImg;

  // Extract the video source URL for reference
  const videoSrc = video ? video.getAttribute('src') : null;

  // Extract primary CTA link
  const ctaLink = element.querySelector('a.abbv-button-primary, a[class*="button-primary"]');

  // Build cells array matching UE model: Row 1 = image, Row 2 = text (richtext)
  const cells = [];

  // Row 1: Image (field: image; imageAlt is collapsed into img alt attribute)
  const imageFragment = document.createDocumentFragment();
  imageFragment.appendChild(document.createComment(' field:image '));

  if (heroImage) {
    const img = document.createElement('img');
    img.src = heroImage.getAttribute('src') || '';
    img.alt = heroImage.getAttribute('alt') || 'Hero background';
    imageFragment.appendChild(img);
  } else if (videoSrc) {
    // Use video source as a reference
    const img = document.createElement('img');
    img.src = videoSrc;
    img.alt = 'Hero video background';
    imageFragment.appendChild(img);
  }

  cells.push([imageFragment]);

  // Row 2: Text content (field: text - richtext with CTA)
  const textFragment = document.createDocumentFragment();
  textFragment.appendChild(document.createComment(' field:text '));

  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.getAttribute('href') || '';
    a.textContent = ctaLink.textContent.trim();
    p.appendChild(a);
    textFragment.appendChild(p);
  }

  cells.push([textFragment]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-condition', cells });
  element.replaceWith(block);
}
