/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-hero
 * Base block: carousel
 * Selector: .carousel.parbase
 * Source: https://www.rinvoq.com/
 * Description: Rotating carousel with lifestyle photography backgrounds,
 *   decorative RINVOQ branding text overlay, and heading per slide.
 * UE Model: carousel-hero-item (container block)
 *   - media_image (reference) - Background Image
 *   - media_imageAlt (collapsed into img alt)
 *   - content_text (richtext) - Overlay text content
 * Generated: 2026-05-25
 */
export default function parse(element, { document }) {
  // Get non-cloned owl-items to avoid duplicate slides
  // Owl carousel clones slides for infinite scroll - exclude those
  const slides = Array.from(element.querySelectorAll('.owl-item:not(.cloned) .item'));

  // Deduplicate slides by id (owl carousel may have duplicates in non-cloned items)
  const seenIds = new Set();
  const uniqueSlides = slides.filter((slide) => {
    const id = slide.getAttribute('id');
    if (!id || seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });

  const cells = [];

  uniqueSlides.forEach((slide) => {
    // Row per slide: [media_image, content_text]

    // Column 1: Background image (field: media_image; media_imageAlt collapsed into alt attr)
    // On the live site, background images are applied via CSS background-image (not <img> tags)
    const bgContainer = slide.querySelector('.abbv-background-container-display, .abbv-background-container-image-swap-bg');
    let bgSrc = '';

    if (bgContainer) {
      // Strategy 1: Direct child img (static HTML scrape case)
      const directImg = bgContainer.querySelector(':scope > img');
      if (directImg) {
        bgSrc = directImg.getAttribute('src') || directImg.getAttribute('data-src') || '';
      }
      // Strategy 2: Inline style background-image
      if (!bgSrc) {
        const style = bgContainer.getAttribute('style') || '';
        const match = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
        if (match) bgSrc = match[1];
      }
      // Strategy 3: Computed style background-image (live page with CSS classes)
      if (!bgSrc && typeof window !== 'undefined') {
        const computed = window.getComputedStyle(bgContainer).backgroundImage;
        if (computed && computed !== 'none') {
          const match = computed.match(/url\(['"]?([^'")\s]+)['"]?\)/);
          if (match) bgSrc = match[1];
        }
      }
    }

    // Fallback: check parent .abbv-background-container for background-image
    if (!bgSrc) {
      const parentBg = slide.querySelector('.abbv-background-container');
      if (parentBg) {
        const style = parentBg.getAttribute('style') || '';
        const match = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
        if (match) bgSrc = match[1];
        if (!bgSrc && typeof window !== 'undefined') {
          const computed = window.getComputedStyle(parentBg).backgroundImage;
          if (computed && computed !== 'none') {
            const cMatch = computed.match(/url\(['"]?([^'")\s]+)['"]?\)/);
            if (cMatch) bgSrc = cMatch[1];
          }
        }
      }
    }

    const imageFragment = document.createDocumentFragment();
    imageFragment.appendChild(document.createComment(' field:media_image '));
    if (bgSrc) {
      const img = document.createElement('img');
      img.setAttribute('src', bgSrc);
      imageFragment.appendChild(img);
    }

    // Column 2: Text overlay content (field: content_text - richtext)
    const textFragment = document.createDocumentFragment();
    textFragment.appendChild(document.createComment(' field:content_text '));

    // Extract decorative brand image (RINVOQ "Relief" graphic)
    const brandImg = slide.querySelector('.abbv-image-content-container-v2 img, .abbv-image-text-v2 picture img');
    if (brandImg) {
      const picture = document.createElement('picture');
      const img = brandImg.cloneNode(true);
      picture.appendChild(img);
      textFragment.appendChild(picture);
    }

    // Extract brand text paragraphs (e.g. "RINVOQ", "with a ONCE-DAILY PILL")
    const brandTexts = Array.from(slide.querySelectorAll('.abbv-stretched-card-body p'));
    brandTexts.forEach((p) => {
      textFragment.appendChild(p.cloneNode(true));
    });

    // Extract heading (h1 with class homepage-hero-subtitle)
    const heading = slide.querySelector('h1, .homepage-hero-subtitle');
    if (heading) {
      const h1 = document.createElement('h1');
      h1.textContent = heading.textContent.trim();
      textFragment.appendChild(h1);
    }

    cells.push([imageFragment, textFragment]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
