/* eslint-disable */
/* global WebImporter */

import accordionFaqParser from './parsers/accordion-faq.js';
import columnsSafetyParser from './parsers/columns-safety.js';

import rinvoqCleanupTransformer from './transformers/rinvoq-cleanup.js';
import rinvoqSectionsTransformer from './transformers/rinvoq-sections.js';

const parsers = {
  'accordion-faq': accordionFaqParser,
  'columns-safety': columnsSafetyParser,
};

const PAGE_TEMPLATE = {
  name: 'faq-page',
  description: 'FAQ page with categorized accordion sections for atopic dermatitis product information',
  urls: ['https://www.rinvoq.com/atopic-dermatitis/about-rinvoq/faq'],
  blocks: [
    {
      name: 'accordion-faq',
      instances: ['.faqs-accordion'],
    },
    {
      name: 'columns-safety',
      instances: ['.abbv-select-safety-inf'],
    },
  ],
  sections: [
    { id: 'section-1', name: 'FAQ Title and Topic Navigation', selector: 'main section:first-of-type .faq-header', style: null, blocks: [], defaultContent: ['h1', 'p', '.faq-anchor-links a'] },
    { id: 'section-2', name: 'About Eczema FAQ', selector: '.accordion.parbase:nth-of-type(1)', style: null, blocks: ['accordion-faq'], defaultContent: ['.abbv-accordion-module-name'] },
    { id: 'section-3', name: 'About RINVOQ FAQ', selector: '.accordion.parbase:nth-of-type(2)', style: null, blocks: ['accordion-faq'], defaultContent: ['.abbv-accordion-module-name'] },
    { id: 'section-4', name: 'Important Safety Information Callout', selector: '.image-text-v2.parbase', style: 'grey', blocks: ['columns-safety'], defaultContent: [] },
    { id: 'section-5', name: 'Taking RINVOQ FAQ', selector: '.accordion.parbase:nth-of-type(3)', style: null, blocks: ['accordion-faq'], defaultContent: ['.abbv-accordion-module-name'] },
    { id: 'section-6', name: 'Savings and Support FAQ', selector: '.accordion.parbase:nth-of-type(4)', style: null, blocks: ['accordion-faq'], defaultContent: ['.abbv-accordion-module-name'] },
    { id: 'section-7', name: 'Suggested For You', selector: '.suggested-for-you', style: null, blocks: [], defaultContent: ['p'] },
    { id: 'section-8', name: 'ISI', selector: '#abbv_use_statement', style: null, blocks: [], defaultContent: ['h3', 'p', 'ul'] },
  ],
};

const transformers = [
  rinvoqCleanupTransformer,
  rinvoqSectionsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
          section: blockDef.section || null,
        });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
