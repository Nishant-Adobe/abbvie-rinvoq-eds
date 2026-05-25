/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: rinvoq cleanup
 * Removes non-authorable site chrome from rinvoq.com pages.
 * Covers both FAQ and Homepage templates.
 * All selectors validated against migration-work/cleaned.html
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner (found: <div id="onetrust-consent-sdk">)
    // Remove modal overlays that block parsing (found at lines 1334, 1348, 1578: <div class="abbv-modal ...">)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.abbv-modal',
    ]);

    // Remove owl carousel cloned slides that duplicate content (homepage line 217: <div class="owl-item cloned">)
    element.querySelectorAll('.owl-item.cloned').forEach((el) => el.remove());
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header (line 22: <header class="abbv-header-v2 ...">)
    // Remove footer (line 1212: <footer class="abbv-footer ...">)
    // Remove slim eyebrow promo bar (line 7: <div class="abbv-rich-text abbv-slimEyebrow ...">)
    // Remove skip-to-content link (line 24: <a ... class="abbv-skip-to-main-content sr-only">)
    // Remove back-to-top button (line 1327: <button class="abbv-back-to-top ...">)
    // Remove dimmer overlay (line 1324: <div class="abbv-dimmer">)
    // Remove owl carousel nav buttons (homepage line 561: <div class="owl-nav">)
    // Remove owl carousel dot indicators (homepage line 575: <div class="owl-dots">)
    // Remove carousel ghost element (homepage line 587: <div class="ghost">)
    // Remove social copy input (found: <input class="abbv-social-copy">)
    // Remove iframes, link elements, and noscript
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '.abbv-slimEyebrow',
      '.abbv-skip-to-main-content',
      '.abbv-back-to-top',
      '.abbv-dimmer',
      '.owl-nav',
      '.owl-dots',
      '.ghost',
      'input.abbv-social-copy',
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove empty .newpar and inherited par wrappers (lines 15, 203, 1319, 2128, 2429)
    element.querySelectorAll('.newpar.new.section').forEach((el) => el.remove());

    // Remove empty .par.iparys_inherited wrappers (lines 17, 205, 1321, 2130, 2431)
    element.querySelectorAll('.par.iparys_inherited').forEach((el) => {
      if (el.children.length === 0) el.remove();
    });

    // Remove tooltip cloned spans (FAQ page: <span class="abbv-tooltip-message ... abbv-cloned ...">)
    element.querySelectorAll('span.abbv-tooltip-message.abbv-cloned').forEach((el) => el.remove());
  }
}
