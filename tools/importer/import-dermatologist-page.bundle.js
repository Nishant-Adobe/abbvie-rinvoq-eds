/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-dermatologist-page.js
  var import_dermatologist_page_exports = {};
  __export(import_dermatologist_page_exports, {
    default: () => import_dermatologist_page_default
  });

  // tools/importer/transformers/rinvoq-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".abbv-modal"
      ]);
      element.querySelectorAll(".owl-item.cloned").forEach((el) => el.remove());
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".abbv-slimEyebrow",
        ".abbv-skip-to-main-content",
        ".abbv-back-to-top",
        ".abbv-dimmer",
        ".owl-nav",
        ".owl-dots",
        ".ghost",
        "input.abbv-social-copy",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll(".newpar.new.section").forEach((el) => el.remove());
      element.querySelectorAll(".par.iparys_inherited").forEach((el) => {
        if (el.children.length === 0) el.remove();
      });
      element.querySelectorAll("span.abbv-tooltip-message.abbv-cloned").forEach((el) => el.remove());
    }
  }

  // tools/importer/transformers/rinvoq-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var SELECTOR_OVERRIDES = {
    "faq-page": [
      // Section 1: FAQ header area - first section, no <hr> needed before it
      null,
      // Section 2: First accordion - "About Eczema" (anchor #about-eczema)
      'a[id="about-eczema"]',
      // Section 3: Second accordion - "About RINVOQ" (anchor #about-rinvoq)
      'a[id="about-rinvoq"]',
      // Section 4: Safety callout (.image-text-v2.parbase)
      ".image-text-v2.parbase",
      // Section 5: Third accordion - "Taking RINVOQ" (anchor #taking-rinvoq)
      'a[id="taking-rinvoq"]',
      // Section 6: Fourth accordion - "Savings & Support" (anchor #savingsandsupport)
      'a[id="savingsandsupport"]',
      // Section 7: Suggested For You (.bottom-links-container)
      ".bottom-links-container",
      // Section 8: ISI section (#abbv_use_statement)
      "#abbv_use_statement"
    ],
    "homepage": [
      // Section 1: Hero Carousel - first section, no <hr> needed before it
      null,
      // Section 2: Condition Selector (grey background container, line 596)
      ".abv-custom-bgcolor-light-grey",
      // Section 3: Value Proposition (two-col yellow/white section, line 812)
      ".psa-two-col-section",
      // Section 4: SPEAK Network CTA (dark brushstroke background, line 903)
      ".abbv-background-container.height-435",
      // Section 5: Eligibility Terms (anchor element, line 940)
      "a#eligibilityTandC",
      // Section 6: ISI section (line 951)
      ".abbv-inline-use-isi"
    ]
  };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const templateName = payload.template && payload.template.name;
      const overrides = SELECTOR_OVERRIDES[templateName];
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = overrides ? overrides[i] : i === 0 ? null : section.selector;
        if (!selector) continue;
        const sectionEl = element.querySelector(selector);
        if (!sectionEl) continue;
        let insertBefore = sectionEl;
        if (sectionEl.tagName === "A" && !sectionEl.getAttribute("href")) {
          insertBefore = sectionEl.closest(".rich-text") || sectionEl.closest(".flexbox.parbase") || sectionEl.parentElement;
        }
        let ancestor = insertBefore;
        while (ancestor.parentElement && ancestor.parentElement !== element) {
          const parent = ancestor.parentElement;
          if (parent.classList.contains("abbv-container") || parent.tagName === "SECTION" || parent === element) {
            break;
          }
          ancestor = parent;
        }
        if (ancestor.parentElement && (ancestor.parentElement.tagName === "SECTION" || ancestor.parentElement === element || ancestor.parentElement.classList.contains("abbv-content-container"))) {
          insertBefore = ancestor;
        }
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (insertBefore.nextSibling) {
            insertBefore.parentElement.insertBefore(sectionMetadata, insertBefore.nextSibling);
          } else {
            insertBefore.parentElement.appendChild(sectionMetadata);
          }
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          insertBefore.parentElement.insertBefore(hr, insertBefore);
        }
      }
    }
  }

  // tools/importer/import-dermatologist-page.js
  var transformers = [transform, transform2];
  function executeTransformers(hookName, element, payload) {
    transformers.forEach((fn) => {
      try {
        fn(hookName, element, payload);
      } catch (e) {
      }
    });
  }
  var import_dermatologist_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, ""));
      return [{ element: main, path, report: { title: document.title, template: "dermatologist-page" } }];
    }
  };
  return __toCommonJS(import_dermatologist_page_exports);
})();
