/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

  // tools/importer/import-faq-page.js
  var import_faq_page_exports = {};
  __export(import_faq_page_exports, {
    default: () => import_faq_page_default
  });

  // tools/importer/parsers/accordion-faq.js
  function parse(element, { document }) {
    const blades = element.querySelectorAll(".abbv-accordion-blade");
    const cells = [];
    blades.forEach((blade) => {
      const questionEl = blade.querySelector(".abbv-accordion-blade-text");
      const answerEl = blade.querySelector(".abbv-accordion-content .abbv-rich-text");
      const summaryFrag = document.createDocumentFragment();
      summaryFrag.appendChild(document.createComment(" field:summary "));
      if (questionEl) {
        summaryFrag.appendChild(questionEl);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (answerEl) {
        textFrag.appendChild(answerEl);
      }
      cells.push([summaryFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-safety.js
  function parse2(element, { document }) {
    const iconImage = element.querySelector(".abbv-image-content-container-v2 img");
    const textContainer = element.querySelector(".abbv-stretched-card-body");
    const col1Content = [];
    if (iconImage) {
      col1Content.push(iconImage);
    }
    const col2Content = [];
    if (textContainer) {
      const children = Array.from(textContainer.children);
      for (const child of children) {
        col2Content.push(child);
      }
    } else {
      const heading = element.querySelector('h2, h3, [class*="font-20"]');
      if (heading) col2Content.push(heading);
      const paragraphs = Array.from(element.querySelectorAll(".abbv-image-text-content-container-v2 p"));
      col2Content.push(...paragraphs);
      const list = element.querySelector(".abbv-image-text-content-container-v2 ul");
      if (list) col2Content.push(list);
    }
    const cells = [
      [col1Content, col2Content]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-safety", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/rinvoq-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".abbv-modal"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".abbv-slimEyebrow",
        ".abbv-skip-to-main-content",
        ".abbv-back-to-top",
        "input.abbv-social-copy",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll(".newpar.new.section").forEach((el) => el.remove());
      element.querySelectorAll("span.abbv-tooltip-message.abbv-cloned").forEach((el) => el.remove());
    }
  }

  // tools/importer/transformers/rinvoq-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const sectionSelectors = [
        // Section 1: FAQ header area - first section, no <hr> needed before it
        null,
        // Section 2: First accordion - "About Eczema" (anchor #about-eczema)
        'a[id="about-eczema"]',
        // Section 3: Second accordion - "About RINVOQ" (anchor #about-rinvoq)
        'a[id="about-rinvoq"]',
        // Section 4: Safety callout (.image-text-v2.parbase at line 624)
        ".image-text-v2.parbase",
        // Section 5: Third accordion - "Taking RINVOQ" (anchor #taking-rinvoq)
        'a[id="taking-rinvoq"]',
        // Section 6: Fourth accordion - "Savings & Support" (anchor #savingsandsupport)
        'a[id="savingsandsupport"]',
        // Section 7: Suggested For You (.bottom-links-container at line 924)
        ".bottom-links-container",
        // Section 8: ISI section (#abbv_use_statement at line 958)
        "#abbv_use_statement"
      ];
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = sectionSelectors[i];
        if (!selector) continue;
        const sectionEl = element.querySelector(selector);
        if (!sectionEl) continue;
        let insertBefore = sectionEl;
        if (sectionEl.tagName === "A" && !sectionEl.href) {
          insertBefore = sectionEl.closest(".flexbox.parbase") || sectionEl.parentElement;
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

  // tools/importer/import-faq-page.js
  var parsers = {
    "accordion-faq": parse,
    "columns-safety": parse2
  };
  var PAGE_TEMPLATE = {
    name: "faq-page",
    description: "FAQ page with categorized accordion sections for atopic dermatitis product information",
    urls: ["https://www.rinvoq.com/atopic-dermatitis/about-rinvoq/faq"],
    blocks: [
      {
        name: "accordion-faq",
        instances: [".faqs-accordion"]
      },
      {
        name: "columns-safety",
        instances: [".abbv-select-safety-inf"]
      }
    ],
    sections: [
      { id: "section-1", name: "FAQ Title and Topic Navigation", selector: "main section:first-of-type .faq-header", style: null, blocks: [], defaultContent: ["h1", "p", ".faq-anchor-links a"] },
      { id: "section-2", name: "About Eczema FAQ", selector: ".accordion.parbase:nth-of-type(1)", style: null, blocks: ["accordion-faq"], defaultContent: [".abbv-accordion-module-name"] },
      { id: "section-3", name: "About RINVOQ FAQ", selector: ".accordion.parbase:nth-of-type(2)", style: null, blocks: ["accordion-faq"], defaultContent: [".abbv-accordion-module-name"] },
      { id: "section-4", name: "Important Safety Information Callout", selector: ".image-text-v2.parbase", style: "grey", blocks: ["columns-safety"], defaultContent: [] },
      { id: "section-5", name: "Taking RINVOQ FAQ", selector: ".accordion.parbase:nth-of-type(3)", style: null, blocks: ["accordion-faq"], defaultContent: [".abbv-accordion-module-name"] },
      { id: "section-6", name: "Savings and Support FAQ", selector: ".accordion.parbase:nth-of-type(4)", style: null, blocks: ["accordion-faq"], defaultContent: [".abbv-accordion-module-name"] },
      { id: "section-7", name: "Suggested For You", selector: ".suggested-for-you", style: null, blocks: [], defaultContent: ["p"] },
      { id: "section-8", name: "ISI", selector: "#abbv_use_statement", style: null, blocks: [], defaultContent: ["h3", "p", "ul"] }
    ]
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_faq_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_faq_page_exports);
})();
