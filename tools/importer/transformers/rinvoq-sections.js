/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: rinvoq sections
 * Inserts section breaks (<hr>) and section-metadata blocks based on template sections.
 * Runs in afterTransform only. Handles both FAQ and Homepage templates.
 *
 * Uses payload.template.sections selectors to find section boundaries.
 * Template selectors validated against migration-work/cleaned.html:
 *
 * FAQ page selectors:
 *   - section-1: "main section:first-of-type .faq-header" -> fallback to first content
 *   - section-2: ".accordion.parbase:nth-of-type(1)"
 *   - section-3: ".accordion.parbase:nth-of-type(2)"
 *   - section-4: ".image-text-v2.parbase" (style: grey)
 *   - section-5: ".accordion.parbase:nth-of-type(3)"
 *   - section-6: ".accordion.parbase:nth-of-type(4)"
 *   - section-7: ".suggested-for-you" -> fallback to ".bottom-links-container"
 *   - section-8: "#abbv_use_statement"
 *
 * Homepage selectors (validated against cleaned.html):
 *   - section-1: ".carousel.parbase" (line 213)
 *   - section-2: ".homepage-cta-flex-box.conditions" (line 606, style: grey)
 *   - section-3: ".psa-two-col-section" (line 812)
 *   - section-4: ".abbv-background-container.height-435" (line 903)
 *   - section-5: "#eligibilityTandC" (line 940, anchor element)
 *   - section-6: "#abbv_use_statement" (line 951)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Selector override map keyed by template name.
 * Each entry is an array of selectors (one per section, null for first section).
 * Fallback: uses section.selector from page-templates.json directly.
 */
const SELECTOR_OVERRIDES = {
  'faq-page': [
    // Section 1: FAQ header area - first section, no <hr> needed before it
    null,
    // Section 2: First accordion - "About Eczema" (anchor #about-eczema)
    'a[id="about-eczema"]',
    // Section 3: Second accordion - "About RINVOQ" (anchor #about-rinvoq)
    'a[id="about-rinvoq"]',
    // Section 4: Safety callout (.image-text-v2.parbase)
    '.image-text-v2.parbase',
    // Section 5: Third accordion - "Taking RINVOQ" (anchor #taking-rinvoq)
    'a[id="taking-rinvoq"]',
    // Section 6: Fourth accordion - "Savings & Support" (anchor #savingsandsupport)
    'a[id="savingsandsupport"]',
    // Section 7: Suggested For You (.bottom-links-container)
    '.bottom-links-container',
    // Section 8: ISI section (#abbv_use_statement)
    '#abbv_use_statement',
  ],
  'homepage': [
    // Section 1: Hero Carousel - first section, no <hr> needed before it
    null,
    // Section 2: Condition Selector (grey background container, line 596)
    '.abv-custom-bgcolor-light-grey',
    // Section 3: Value Proposition (two-col yellow/white section, line 812)
    '.psa-two-col-section',
    // Section 4: SPEAK Network CTA (dark brushstroke background, line 903)
    '.abbv-background-container.height-435',
    // Section 5: Eligibility Terms (anchor element, line 940)
    'a#eligibilityTandC',
    // Section 6: ISI section (line 951)
    '.abbv-inline-use-isi',
  ],
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const templateName = payload.template && payload.template.name;
    const overrides = SELECTOR_OVERRIDES[templateName];

    // Process sections in reverse order to avoid index shifting
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];

      // Get selector: use override if available, otherwise use template selector
      const selector = overrides ? overrides[i] : (i === 0 ? null : section.selector);
      if (!selector) continue; // Skip first section (no <hr> before it)

      const sectionEl = element.querySelector(selector);
      if (!sectionEl) continue;

      // Find the appropriate insertion point
      // For anchor elements, go up to the containing block-level parent
      let insertBefore = sectionEl;
      if (sectionEl.tagName === 'A' && !sectionEl.getAttribute('href')) {
        // Anchor bookmark - go up to the containing div
        insertBefore = sectionEl.closest('.rich-text') || sectionEl.closest('.flexbox.parbase') || sectionEl.parentElement;
      }

      // For elements deeply nested, find a reasonable ancestor that is a sibling of other sections
      // Walk up to find a container.parbase or direct child of section/main
      let ancestor = insertBefore;
      while (ancestor.parentElement && ancestor.parentElement !== element) {
        const parent = ancestor.parentElement;
        // Stop at container-level boundaries that represent distinct page regions
        if (parent.classList.contains('abbv-container') ||
            parent.tagName === 'SECTION' ||
            parent === element) {
          break;
        }
        ancestor = parent;
      }
      // Only use ancestor if it is a direct child of a section-level parent
      if (ancestor.parentElement && (
        ancestor.parentElement.tagName === 'SECTION' ||
        ancestor.parentElement === element ||
        ancestor.parentElement.classList.contains('abbv-content-container')
      )) {
        insertBefore = ancestor;
      }

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Insert section-metadata after the section content (before next section's <hr>)
        if (insertBefore.nextSibling) {
          insertBefore.parentElement.insertBefore(sectionMetadata, insertBefore.nextSibling);
        } else {
          insertBefore.parentElement.appendChild(sectionMetadata);
        }
      }

      // Insert <hr> before this section (creates section break)
      if (i > 0) {
        const hr = document.createElement('hr');
        insertBefore.parentElement.insertBefore(hr, insertBefore);
      }
    }
  }
}
