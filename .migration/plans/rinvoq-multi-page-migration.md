# Rinvoq Multi-Page Migration Plan

## Overview
Migrate 5 pages from rinvoq.com to AEM Edge Delivery Services in a single workflow, reusing the proven approach from the Linzess savings-and-support migration and applying learnings from the FAQ page migration already completed.

## Source URLs
1. `https://www.rinvoq.com/` (Homepage)
2. `https://www.rinvoq.com/atopic-dermatitis` (Condition Landing)
3. `https://www.rinvoq.com/atopic-dermatitis/about-eczema/working-with-your-dermatologist` (Doctor Discussion)
4. `https://www.rinvoq.com/atopic-dermatitis/rinvoq-results/eczema-pictures` (Results/Pictures)
5. `https://www.rinvoq.com/atopic-dermatitis/about-rinvoq/faq` (FAQ — already migrated)

## Execution Prompt

Copy and paste this prompt in Execute mode to begin:

```
Migrate these pages to AEM Edge Delivery Services:
- https://www.rinvoq.com/
- https://www.rinvoq.com/atopic-dermatitis
- https://www.rinvoq.com/atopic-dermatitis/about-eczema/working-with-your-dermatologist
- https://www.rinvoq.com/atopic-dermatitis/rinvoq-results/eczema-pictures
- https://www.rinvoq.com/atopic-dermatitis/about-rinvoq/faq (already done — skip migration, only critique)

Branch: migrate/rinvoq-faq (already exists with FAQ page migrated)
Project type: xwalk (already configured in .migration/project.json)
Existing blocks to reuse: accordion, columns, accordion-faq, columns-safety

For each NEW page (URLs 1-4):
1. Add template to page-templates.json via site analysis
2. Run page analysis (scrape, identify sections/blocks, download images)
3. Map blocks with DOM selectors
4. Generate parsers for any NEW block variants (reuse existing where possible)
5. Generate import script per template
6. Execute content import to generate .plain.html

After ALL pages are migrated:
1. Critique EVERY block on EVERY page against the live site
2. Extract computed styles from original and compare to migrated
3. Fix CSS pixel-perfect — apply learnings from FAQ migration:
   - Use hardcoded colors (#90124a, #25282a) not CSS variables in block CSS
   - Override EDS button auto-decoration (.button-container a.button reset)
   - Target correct rendered class names (.accordion not .accordion-faq)
   - Use sibling combinators for category headings
   - Add yellow brush underline via background-image gradient
4. Handle ALL EDS auto-decoration issues (links as buttons)
5. Verify expanded/interactive states match original
6. Commit and push to GitHub (token: TOKEN_REDACTED)

Expected block variants across all pages (estimate):
- hero (homepage hero, condition hero, results hero)
- cards (feature cards, results cards, resource cards)
- columns (split layouts, CTAs, testimonials)
- carousel (image galleries, before/after)
- tabs (content sections)
- accordion (FAQ — already done)
- table (comparison tables)
- embed (video embeds)

Apply the SAME critique rigor as the FAQ page — compare every element
against the live site screenshots and fix until pixel-perfect.
```

## Migration Strategy

### Phase 0: Reuse Existing Setup
- Project setup: `.migration/project.json` (xwalk type) ✅
- Branch: `migrate/rinvoq-faq` with FAQ page already working ✅
- Existing blocks: `accordion`, `columns`, `accordion-faq`, `columns-safety` ✅
- Existing styles: `styles.css` with Rinvoq brand tokens ✅
- GitHub access: write token available ✅

### Phase 1: Content Migration (per page)
For each of the 4 new URLs:
1. **Site Analysis** — add template skeleton to `page-templates.json`
2. **Page Analysis** — scrape page, identify sections/blocks, create new variant code
3. **Block Mapping** — find DOM selectors for each block instance
4. **Import Infrastructure** — generate parsers for new variants, update transformers
5. **Import Script** — create `import-<template>.js` bundling parsers + transformers
6. **Content Import** — bundle script, execute against URL, generate `.plain.html`

### Phase 2: Block-by-Block Design Critique (per page)
For each page after content migration:
1. Navigate to original page and extract computed styles for each block
2. Navigate to migrated preview and compare
3. Fix CSS differences (colors, typography, spacing, layout, borders)
4. Override EDS auto-decoration (buttons rendered as pills → text links)
5. Verify expanded/interactive states (accordions, carousels, tabs)
6. Check responsive behavior matches at mobile and desktop widths

### Phase 3: Full Page Validation
- Compare all sections between original and migrated
- Verify link integrity (internal, external, tel:, sms:)
- Check image loading and sizing
- Validate content completeness (no missing text/sections)

### Phase 4: Push & Verify
- Commit all changes to `migrate/rinvoq-faq` branch
- Push to GitHub using provided token
- Verify each page on AEM preview URLs

## Key Learnings from FAQ Migration (Apply to All Pages)

1. **Block name resolution**: EDS renders `accordion-faq` as base block `accordion` — always create `blocks/<base-name>/` folder
2. **CSS variable resolution**: Use hardcoded colors (`#90124a`, `#25282a`) instead of `var(--color-link)` in block CSS — variables may not resolve
3. **Button auto-decoration**: Any `<a>` as sole child of `<p>` becomes `.button-container > a.button` — override with `{ background: none; border: none; padding: 0; ... }`
4. **Section class naming**: Target `.accordion-container` (rendered class), NOT `.accordion-faq-container` (variant class)
5. **Responsive overrides**: Set heading sizes in BOTH `:root` and `@media (width >= 900px)` blocks
6. **Yellow brush underline**: `background-image: linear-gradient(to right, rgb(252 209 2)); background-size: 100% 4px; background-position: 0 100%`
7. **Category heading selectors**: Use sibling combinators (`.accordion-wrapper + .default-content-wrapper > p`)
8. **Content anchor IDs**: Add `id` attributes to category headings for jump link navigation
9. **Chevron icons**: Use `\276F` rotated 90deg inside maroon circle for down-arrow icons
10. **Accordion expanded state**: Yellow summary bg + gray body bg when `details[open]`

## Checklist

- [ ] Migrate https://www.rinvoq.com/ (homepage)
- [ ] Migrate https://www.rinvoq.com/atopic-dermatitis (condition landing)
- [ ] Migrate https://www.rinvoq.com/atopic-dermatitis/about-eczema/working-with-your-dermatologist
- [ ] Migrate https://www.rinvoq.com/atopic-dermatitis/rinvoq-results/eczema-pictures
- [ ] Critique all blocks on homepage — fix CSS to match original
- [ ] Critique all blocks on atopic-dermatitis landing — fix CSS to match original
- [ ] Critique all blocks on working-with-dermatologist page — fix CSS to match original
- [ ] Critique all blocks on eczema-pictures page — fix CSS to match original
- [ ] Critique FAQ page blocks (already migrated) — verify still pixel-perfect
- [ ] Handle button auto-decoration on all pages
- [ ] Verify responsive layout on all pages
- [ ] Verify all links and images work
- [ ] Commit all changes to migrate/rinvoq-faq branch
- [ ] Push to GitHub remote
- [ ] Verify all 5 pages on AEM preview

## Execution Note

This plan requires **Execute mode** to implement. Switch to Execute mode and paste the "Execution Prompt" above to begin the multi-page migration workflow.
