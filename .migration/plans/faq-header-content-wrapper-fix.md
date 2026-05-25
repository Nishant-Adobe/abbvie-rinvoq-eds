# Critique: `div.default-content-wrapper` (FAQ Header Section)

## Element Analyzed

**Selector:** `main > div.section.accordion-faq-container:nth-of-type(1) > div.default-content-wrapper:nth-of-type(1)`

## Current State (Migrated)

The content HTML contains:
```html
<p><a href="#">___</a></p>          ← GARBAGE: spurious empty link
<h1 id="faqs">FAQs</h1>
<p>Topics covered on this page:</p>
<p><a href="#about-eczema">About Eczema</a></p>     ← Renders as BUTTON
<p><a href="#about-rinvoq">About RINVOQ</a></p>    ← Renders as BUTTON
<p><a href="#taking-rinvoq">Taking RINVOQ</a></p>  ← Renders as BUTTON
<p><a href="#savingsandsupport">Savings & Support</a></p> ← Renders as BUTTON
<p>About Eczema</p>                 ← Category heading (needs bold/20px)
```

EDS auto-decorates standalone `<a>` links inside `<p>` as `.button-container > a.button` (pill-shaped maroon buttons).

## Issues Found

| # | Severity | Issue | Original | Migrated |
|---|----------|-------|----------|----------|
| 1 | **HIGH** | Spurious garbage link `<p><a href="#">___</a></p>` at top | Does not exist | Present — shows a blank button |
| 2 | **HIGH** | Jump links render as pill buttons | Inline maroon text links with ❤ icon, horizontal row | Stacked maroon pill buttons with white text |
| 3 | **MEDIUM** | Jump links are stacked vertically | Horizontal inline row | Each in its own `<p>` = vertical stack |
| 4 | **LOW** | Category heading "About Eczema" isn't bold 20px | Bold 20px Neue Haas Grotesk | Regular paragraph (CSS fix exists but targeting may fail) |

## Root Cause

1. **Garbage link:** The import transformer didn't clean a skip-link/overlay element from the source
2. **Button auto-decoration:** In EDS, any `<a>` that is the sole child of a `<p>` gets wrapped in `.button-container` and styled as a button. The links need to be in a `<ul><li>` structure OR multiple links in a single `<p>` to avoid this
3. **Vertical stacking:** Each link is in its own `<p>` tag instead of all sharing one container

## CSS Fix Status

A CSS override exists in `styles.css` (lines 265-288) targeting `.accordion-faq-container > .default-content-wrapper .button-container a.button` to reset the button styling back to inline text links. **However**, this only works if the code is deployed to GitHub — currently not pushed.

## Required Fixes

### Fix 1: Content HTML (Transformer/Re-import)
Remove the garbage `<p><a href="#">___</a></p>` from the content and restructure jump links as a `<ul>` list:

```html
<!-- BEFORE (broken) -->
<p><a href="#">___</a></p>
<h1 id="faqs">FAQs</h1>
<p>Topics covered on this page:</p>
<p><a href="#about-eczema">About Eczema</a></p>
<p><a href="#about-rinvoq">About RINVOQ</a></p>
...

<!-- AFTER (correct) -->
<h1 id="faqs">FAQs</h1>
<p>Topics covered on this page:</p>
<ul>
  <li><a href="#about-eczema">About Eczema</a></li>
  <li><a href="#about-rinvoq">About RINVOQ</a></li>
  <li><a href="#taking-rinvoq">Taking RINVOQ</a></li>
  <li><a href="#savingsandsupport">Savings & Support</a></li>
</ul>
```

### Fix 2: CSS (Already Applied)
Style the jump links as inline horizontal links matching original:
- Color: maroon (`var(--color-link)`)
- No background, no border, no padding
- Display inline with horizontal spacing
- Already in `styles.css` lines 265-288

### Fix 3: Push Code to GitHub
All fixes are committed locally but not pushed. The `rinvoq-faq` branch must be pushed to GitHub for the code to serve on the AEM preview.

## Checklist

- [ ] Fix content HTML: remove `<p><a href="#">___</a></p>` garbage link
- [ ] Fix content HTML: restructure jump links from individual `<p><a>` to `<ul><li><a>` list
- [ ] Verify CSS override renders links as inline horizontal text (after push)
- [ ] Push `migrate/rinvoq-faq` branch to GitHub remote as `rinvoq-faq`
- [ ] Verify on AEM preview that jump links render correctly

## Execution Note

Implementation requires **Execute mode**. The content file at `content/atopic-dermatitis/about-rinvoq/faq.plain.html` needs editing, and the branch needs to be pushed to remote.
