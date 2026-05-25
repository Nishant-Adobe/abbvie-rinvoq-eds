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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".owl-item:not(.cloned) .item"));
    const seenIds = /* @__PURE__ */ new Set();
    const uniqueSlides = slides.filter((slide) => {
      const id = slide.getAttribute("id");
      if (!id || seenIds.has(id)) return false;
      seenIds.add(id);
      return true;
    });
    const cells = [];
    uniqueSlides.forEach((slide) => {
      const bgContainer = slide.querySelector(".abbv-background-container-display, .abbv-background-container-image-swap-bg");
      let bgSrc = "";
      if (bgContainer) {
        const directImg = bgContainer.querySelector(":scope > img");
        if (directImg) {
          bgSrc = directImg.getAttribute("src") || directImg.getAttribute("data-src") || "";
        }
        if (!bgSrc) {
          const style = bgContainer.getAttribute("style") || "";
          const match = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
          if (match) bgSrc = match[1];
        }
        if (!bgSrc && typeof window !== "undefined") {
          const computed = window.getComputedStyle(bgContainer).backgroundImage;
          if (computed && computed !== "none") {
            const match = computed.match(/url\(['"]?([^'")\s]+)['"]?\)/);
            if (match) bgSrc = match[1];
          }
        }
      }
      if (!bgSrc) {
        const parentBg = slide.querySelector(".abbv-background-container");
        if (parentBg) {
          const style = parentBg.getAttribute("style") || "";
          const match = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
          if (match) bgSrc = match[1];
          if (!bgSrc && typeof window !== "undefined") {
            const computed = window.getComputedStyle(parentBg).backgroundImage;
            if (computed && computed !== "none") {
              const cMatch = computed.match(/url\(['"]?([^'")\s]+)['"]?\)/);
              if (cMatch) bgSrc = cMatch[1];
            }
          }
        }
      }
      const imageFragment = document.createDocumentFragment();
      imageFragment.appendChild(document.createComment(" field:media_image "));
      if (bgSrc) {
        const img = document.createElement("img");
        img.setAttribute("src", bgSrc);
        imageFragment.appendChild(img);
      }
      const textFragment = document.createDocumentFragment();
      textFragment.appendChild(document.createComment(" field:content_text "));
      const brandImg = slide.querySelector(".abbv-image-content-container-v2 img, .abbv-image-text-v2 picture img");
      if (brandImg) {
        const picture = document.createElement("picture");
        const img = brandImg.cloneNode(true);
        picture.appendChild(img);
        textFragment.appendChild(picture);
      }
      const brandTexts = Array.from(slide.querySelectorAll(".abbv-stretched-card-body p"));
      brandTexts.forEach((p) => {
        textFragment.appendChild(p.cloneNode(true));
      });
      const heading = slide.querySelector("h1, .homepage-hero-subtitle");
      if (heading) {
        const h1 = document.createElement("h1");
        h1.textContent = heading.textContent.trim();
        textFragment.appendChild(h1);
      }
      cells.push([imageFragment, textFragment]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-condition.js
  function parse2(element, { document }) {
    const flexItems = element.querySelectorAll(".abbv-flex-item:not(.d-none)");
    const cells = [];
    flexItems.forEach((item) => {
      const link = item.querySelector("a.homepage-indication-selector-cta");
      if (!link) return;
      const linkClone = link.cloneNode(true);
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const p = document.createElement("p");
      p.appendChild(linkClone);
      textFrag.appendChild(p);
      cells.push([[], textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-condition", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-value.js
  function parse3(element, { document }) {
    const sectionContainer = document.querySelector(".psa-two-col-section.two-cols") || document.querySelector(".abbv-flex-container.max-width-xl-1140.m-auto.flex-column.flex-lg-row");
    if (!sectionContainer) {
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns-value", cells: [[[], []]] });
      element.replaceWith(block2);
      return;
    }
    const flexContainer = sectionContainer.querySelector(".abbv-flex-container.max-width-xl-1140") || sectionContainer;
    const flexItems = Array.from(flexContainer.querySelectorAll(":scope > .abbv-flex-item"));
    const leftCol = flexItems[0];
    const leftContent = [];
    if (leftCol) {
      const logoPicture = leftCol.querySelector(".abbv-image-content-container-v2 picture");
      const logoImg = leftCol.querySelector(".abbv-image-content-container-v2 img");
      if (logoPicture) {
        leftContent.push(logoPicture);
      } else if (logoImg) {
        leftContent.push(logoImg);
      }
      const heading = leftCol.querySelector("h2, h1, h3");
      if (heading) leftContent.push(heading);
      const richTextParas = leftCol.querySelectorAll(".abbv-rich-text.paragraph p, .abbv-rich-text-common.paragraph p");
      if (richTextParas.length > 0) {
        leftContent.push(...Array.from(richTextParas));
      }
      const primaryCta = leftCol.querySelector('a.abbv-button-primary, a[class*="button-primary"]');
      if (primaryCta) leftContent.push(primaryCta);
      const footnoteParas = leftCol.querySelectorAll(".psa-footnote p");
      if (footnoteParas.length > 0) {
        leftContent.push(...Array.from(footnoteParas));
      }
      const isiLink = leftCol.querySelector('a.abbv-button-plain, a[class*="button-plain"]');
      if (isiLink) leftContent.push(isiLink);
    }
    const rightCol = flexItems[1];
    const rightContent = [];
    if (rightCol) {
      const allImages = Array.from(rightCol.querySelectorAll(".abbv-image-content-container-v2 img"));
      if (allImages.length > 0) {
        rightContent.push(allImages[0]);
      }
      const heading = rightCol.querySelector("h2, h1, h3");
      if (heading) rightContent.push(heading);
      const richTextParas = rightCol.querySelectorAll(".abbv-rich-text-common p");
      if (richTextParas.length > 0) {
        rightContent.push(...Array.from(richTextParas));
      }
      if (allImages.length > 1) {
        rightContent.push(allImages[allImages.length - 1]);
      }
    }
    const cells = [
      [leftContent, rightContent]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-value", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse4(element, { document }) {
    let bgImage = element.querySelector(".abbv-background-container-display img, .abbv-background-container-image-swap-bg img");
    if (!bgImage) {
      const bgDiv = element.querySelector(".abbv-background-container-display, .abbv-background-container-image-swap-bg");
      if (bgDiv) {
        const computedStyle = window.getComputedStyle(bgDiv);
        const bgUrl = computedStyle.backgroundImage;
        const urlMatch = bgUrl && bgUrl.match(/url\(["']?(.*?)["']?\)/);
        if (urlMatch && urlMatch[1]) {
          bgImage = document.createElement("img");
          bgImage.src = urlMatch[1];
          bgImage.alt = "SPEAK Network background";
        }
      }
    }
    const heading = element.querySelector('.speak-network-title, p[class*="speak-network-title"]');
    const paragraphs = Array.from(element.querySelectorAll(".abbv-rich-text p:not(.speak-network-title)"));
    const emailLink = element.querySelector('a[href*="mailto"]');
    const phoneLink = element.querySelector('a[href*="tel"]');
    const cells = [];
    if (bgImage) {
      const imageFragment = document.createDocumentFragment();
      imageFragment.appendChild(document.createComment(" field:image "));
      imageFragment.appendChild(bgImage.cloneNode ? bgImage.cloneNode(true) : bgImage);
      cells.push([imageFragment]);
    } else {
      cells.push([""]);
    }
    const textFragment = document.createDocumentFragment();
    textFragment.appendChild(document.createComment(" field:text "));
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      textFragment.appendChild(h2);
    }
    paragraphs.forEach((p) => {
      const cloned = p.cloneNode(true);
      textFragment.appendChild(cloned);
    });
    if (emailLink && !textFragment.querySelector('a[href*="mailto"]')) {
      const emailP = document.createElement("p");
      emailP.appendChild(emailLink.cloneNode(true));
      textFragment.appendChild(emailP);
    }
    if (phoneLink && !textFragment.querySelector('a[href*="tel"]')) {
      const phoneP = document.createElement("p");
      phoneP.appendChild(phoneLink.cloneNode(true));
      textFragment.appendChild(phoneP);
    }
    cells.push([textFragment]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-cta", cells });
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

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "cards-condition": parse2,
    "columns-value": parse3,
    "hero-cta": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Rinvoq homepage with hero carousel, condition navigation, value proposition, and brand messaging",
    urls: ["https://www.rinvoq.com/"],
    blocks: [
      { name: "carousel-hero", instances: [".carousel.parbase"] },
      { name: "cards-condition", instances: [".homepage-cta-flex-box.conditions"] },
      { name: "columns-value", instances: [".cost-and-savings-link"] },
      { name: "hero-cta", instances: [".abbv-background-container.height-435"] }
    ],
    sections: [
      { id: "section-1", name: "Hero Carousel", selector: ".carousel.parbase", style: null, blocks: ["carousel-hero"], defaultContent: [] },
      { id: "section-2", name: "Condition Selector", selector: ".homepage-cta-flex-box.conditions", style: "grey", blocks: ["cards-condition"], defaultContent: ["p"] },
      { id: "section-3", name: "Value Proposition", selector: ".cost-and-savings-link", style: null, blocks: ["columns-value"], defaultContent: [] },
      { id: "section-4", name: "SPEAK Network CTA", selector: ".abbv-background-container.height-435", style: null, blocks: ["hero-cta"], defaultContent: [] },
      { id: "section-5", name: "Eligibility Terms", selector: "#eligibilityTandC", style: null, blocks: [], defaultContent: ["p"] },
      { id: "section-6", name: "ISI", selector: "#abbv_use_statement", style: null, blocks: [], defaultContent: ["h3", "p", "ul"] }
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
  var import_homepage_default = {
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
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
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
  return __toCommonJS(import_homepage_exports);
})();
