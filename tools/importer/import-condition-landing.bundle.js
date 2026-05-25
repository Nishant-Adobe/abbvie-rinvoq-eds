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

  // tools/importer/import-condition-landing.js
  var import_condition_landing_exports = {};
  __export(import_condition_landing_exports, {
    default: () => import_condition_landing_default
  });

  // tools/importer/parsers/hero-condition.js
  function parse(element, { document }) {
    const video = element.querySelector("video");
    const videoImg = video ? video.querySelector("img") : null;
    const bgDisplayImg = element.querySelector(".abbv-background-container-display img");
    const heroImage = videoImg || bgDisplayImg;
    const videoSrc = video ? video.getAttribute("src") : null;
    const ctaLink = element.querySelector('a.abbv-button-primary, a[class*="button-primary"]');
    const cells = [];
    const imageFragment = document.createDocumentFragment();
    imageFragment.appendChild(document.createComment(" field:image "));
    if (heroImage) {
      const img = document.createElement("img");
      img.src = heroImage.getAttribute("src") || "";
      img.alt = heroImage.getAttribute("alt") || "Hero background";
      imageFragment.appendChild(img);
    } else if (videoSrc) {
      const img = document.createElement("img");
      img.src = videoSrc;
      img.alt = "Hero video background";
      imageFragment.appendChild(img);
    }
    cells.push([imageFragment]);
    const textFragment = document.createDocumentFragment();
    textFragment.appendChild(document.createComment(" field:text "));
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.getAttribute("href") || "";
      a.textContent = ctaLink.textContent.trim();
      p.appendChild(a);
      textFragment.appendChild(p);
    }
    cells.push([textFragment]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-condition", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-efficacy.js
  function parse2(element, { document }) {
    const flexContainer = element.querySelector(".abbv-flex-container");
    const flexItems = flexContainer ? Array.from(flexContainer.querySelectorAll(":scope > .abbv-flex-item")) : [];
    const col1Content = [];
    const col2Content = [];
    const col3Content = [];
    const columns = [col1Content, col2Content, col3Content];
    flexItems.forEach((item, index) => {
      if (index >= 3) return;
      const col = columns[index];
      const heading = item.querySelector("h2");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim().replace(/\n\s*/g, " ");
        col.push(h2);
      }
      const ul = item.querySelector("ul");
      if (ul) {
        col.push(ul.cloneNode(true));
      }
      const footnote = item.querySelector(".abbv-rich-text.pl-5 p, .abbv-rich-text.pl-lg-15 p");
      if (footnote) {
        const p = document.createElement("p");
        p.textContent = footnote.textContent.trim();
        col.push(p);
      }
    });
    const cells = [
      [col1Content, col2Content, col3Content]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-efficacy", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-poll.js
  function parse3(element, { document }) {
    const leftContent = [];
    const pollImage = element.querySelector(".multistep-qPoll-image, .multistep-qPoll-image-container img");
    if (pollImage) {
      const img = document.createElement("img");
      img.src = pollImage.getAttribute("src") || "";
      img.alt = pollImage.getAttribute("alt") || "Quick Poll";
      leftContent.push(img);
    }
    const rightContent = [];
    const questionP = element.querySelector(".multistep-qPoll-question p");
    if (questionP) {
      const h2 = document.createElement("h2");
      h2.textContent = questionP.textContent.trim();
      rightContent.push(h2);
    }
    const options = Array.from(element.querySelectorAll(".multistep-qPoll-option"));
    if (options.length > 0) {
      const ul = document.createElement("ul");
      options.forEach((opt) => {
        const li = document.createElement("li");
        li.textContent = opt.textContent.trim();
        ul.appendChild(li);
      });
      rightContent.push(ul);
    }
    const firstResult = element.querySelector(".multistep-qPoll-results");
    if (firstResult) {
      const resultH2 = firstResult.querySelector("h2");
      if (resultH2) {
        const h3 = document.createElement("h3");
        h3.textContent = resultH2.textContent.trim();
        rightContent.push(h3);
      }
      const resultP = firstResult.querySelector("p:not(:has(a))");
      if (resultP) {
        const p = document.createElement("p");
        p.textContent = resultP.textContent.trim();
        rightContent.push(p);
      }
      const resultCta = firstResult.querySelector("a");
      if (resultCta) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = resultCta.getAttribute("href") || "";
        a.textContent = resultCta.textContent.trim();
        p.appendChild(a);
        rightContent.push(p);
      }
    }
    const cells = [
      [leftContent, rightContent]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-poll", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stories.js
  function parse4(element, { document }) {
    const flexItems = Array.from(element.querySelectorAll(":scope > .abbv-flex-item"));
    const leftItem = flexItems[0];
    const rightItem = flexItems[1];
    const leftContent = [];
    if (leftItem) {
      const heading = leftItem.querySelector("h2, .abbv-title h2");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim();
        leftContent.push(h2);
      }
      const richTexts = leftItem.querySelectorAll(".abbv-rich-text");
      if (richTexts.length > 0) {
        const firstP = richTexts[0].querySelector("p");
        if (firstP) {
          const p = document.createElement("p");
          p.textContent = firstP.textContent.trim();
          leftContent.push(p);
        }
      }
      const cta = leftItem.querySelector('a.abbv-button-primary, a[class*="button-primary"]');
      if (cta) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = cta.getAttribute("href") || "";
        a.textContent = cta.textContent.trim();
        p.appendChild(a);
        leftContent.push(p);
      }
      if (richTexts.length > 1) {
        const shareRichText = richTexts[richTexts.length - 1];
        const shareP = shareRichText.querySelector("p");
        if (shareP) {
          leftContent.push(shareP.cloneNode(true));
        }
      }
    }
    const rightContent = [];
    if (rightItem) {
      const img = rightItem.querySelector("img");
      if (img) {
        const imgEl = document.createElement("img");
        imgEl.src = img.getAttribute("src") || "";
        imgEl.alt = img.getAttribute("alt") || "Patient photo";
        rightContent.push(imgEl);
      }
    }
    const cells = [
      [leftContent, rightContent]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-stories", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-tout.js
  function parse5(element, { document }) {
    const flexContainer = element.querySelector(".abbv-flex-container.background-yellow, .abbv-flex-container");
    const flexItems = flexContainer ? Array.from(flexContainer.querySelectorAll(":scope > .abbv-flex-item")) : [];
    let textItem = null;
    let imageItem = null;
    flexItems.forEach((item) => {
      if (item.classList.contains("flex-lg-order-1")) {
        textItem = item;
      } else if (item.classList.contains("flex-lg-order-2")) {
        imageItem = item;
      }
    });
    if (!textItem && !imageItem && flexItems.length >= 2) {
      imageItem = flexItems[0];
      textItem = flexItems[1];
    }
    const leftContent = [];
    if (textItem) {
      const brushImg = textItem.querySelector(".abbv-image-content-container-v2 img, .abbv-image-scale img");
      if (brushImg) {
        const img = document.createElement("img");
        img.src = brushImg.getAttribute("src") || "";
        img.alt = brushImg.getAttribute("alt") || "";
        leftContent.push(img);
      }
      const paragraphs = textItem.querySelectorAll(".abbv-stretched-card-body p, .abbv-image-text-content-v2 p");
      paragraphs.forEach((p) => {
        const newP = document.createElement("p");
        newP.textContent = p.textContent.trim();
        leftContent.push(newP);
      });
      const cta = textItem.querySelector('a.abbv-button-primary, a[class*="button-primary"]');
      if (cta) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = cta.getAttribute("href") || "";
        a.textContent = cta.textContent.trim();
        p.appendChild(a);
        leftContent.push(p);
      }
    }
    const rightContent = [];
    if (imageItem) {
      const img = imageItem.querySelector("img");
      if (img) {
        const imgEl = document.createElement("img");
        imgEl.src = img.getAttribute("src") || "";
        imgEl.alt = img.getAttribute("alt") || "";
        rightContent.push(imgEl);
      }
    }
    const cells = [
      [leftContent, rightContent]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-tout", cells });
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

  // tools/importer/import-condition-landing.js
  var parsers = {
    "hero-condition": parse,
    "columns-efficacy": parse2,
    "columns-poll": parse3,
    "columns-stories": parse4,
    "columns-tout": parse5
  };
  var PAGE_TEMPLATE = {
    name: "condition-landing",
    description: "Condition landing page for atopic dermatitis",
    urls: ["https://www.rinvoq.com/atopic-dermatitis"],
    blocks: [
      { name: "hero-condition", instances: [".abbv-background-container.desktop-header"] },
      { name: "columns-efficacy", instances: [".helps-deliver-sectionx"] },
      { name: "columns-poll", instances: [".target-rcmd-quickpoll"] },
      { name: "columns-stories", instances: [".abbv-flex-container.pt-35"] },
      { name: "columns-tout", instances: [".target-rcmd-enhancementout"] }
    ],
    sections: [
      { id: "section-1", name: "Hero", selector: ".abbv-background-container.desktop-header", style: null, blocks: ["hero-condition"], defaultContent: [] },
      { id: "section-2", name: "Indication", selector: ".indication-statement", style: null, blocks: [], defaultContent: ["p"] },
      { id: "section-3", name: "Efficacy", selector: ".helps-deliver-sectionx", style: null, blocks: ["columns-efficacy"], defaultContent: ["h1", "p", "a"] },
      { id: "section-4", name: "Safety Callout", selector: ".select-isi", style: null, blocks: [], defaultContent: ["p", "ul", "a"] },
      { id: "section-5", name: "Quick Poll", selector: ".target-rcmd-quickpoll", style: "grey", blocks: ["columns-poll"], defaultContent: [] },
      { id: "section-6", name: "Patient Stories", selector: ".abbv-flex-container.pt-35", style: null, blocks: ["columns-stories"], defaultContent: [] },
      { id: "section-7", name: "Quiz Tout", selector: ".target-rcmd-enhancementout", style: "gold", blocks: ["columns-tout"], defaultContent: [] },
      { id: "section-8", name: "ISI", selector: "#abbv_use_statement", style: null, blocks: [], defaultContent: ["h3", "p", "ul"] }
    ]
  };
  var transformers = [transform, transform2];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    return pageBlocks;
  }
  var import_condition_landing_default = {
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
            console.error(e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, ""));
      return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
    }
  };
  return __toCommonJS(import_condition_landing_exports);
})();
