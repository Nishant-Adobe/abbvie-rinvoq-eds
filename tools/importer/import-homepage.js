/* eslint-disable */
/* global WebImporter */

import carouselHeroParser from './parsers/carousel-hero.js';
import cardsConditionParser from './parsers/cards-condition.js';
import columnsValueParser from './parsers/columns-value.js';
import heroCtaParser from './parsers/hero-cta.js';

import rinvoqCleanupTransformer from './transformers/rinvoq-cleanup.js';
import rinvoqSectionsTransformer from './transformers/rinvoq-sections.js';

const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-condition': cardsConditionParser,
  'columns-value': columnsValueParser,
  'hero-cta': heroCtaParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Rinvoq homepage with hero carousel, condition navigation, value proposition, and brand messaging',
  urls: ['https://www.rinvoq.com/'],
  blocks: [
    { name: 'carousel-hero', instances: ['.carousel.parbase'] },
    { name: 'cards-condition', instances: ['.homepage-cta-flex-box.conditions'] },
    { name: 'columns-value', instances: ['.cost-and-savings-link'] },
    { name: 'hero-cta', instances: ['.abbv-background-container.height-435'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero Carousel', selector: '.carousel.parbase', style: null, blocks: ['carousel-hero'], defaultContent: [] },
    { id: 'section-2', name: 'Condition Selector', selector: '.homepage-cta-flex-box.conditions', style: 'grey', blocks: ['cards-condition'], defaultContent: ['p'] },
    { id: 'section-3', name: 'Value Proposition', selector: '.cost-and-savings-link', style: null, blocks: ['columns-value'], defaultContent: [] },
    { id: 'section-4', name: 'SPEAK Network CTA', selector: '.abbv-background-container.height-435', style: null, blocks: ['hero-cta'], defaultContent: [] },
    { id: 'section-5', name: 'Eligibility Terms', selector: '#eligibilityTandC', style: null, blocks: [], defaultContent: ['p'] },
    { id: 'section-6', name: 'ISI', selector: '#abbv_use_statement', style: null, blocks: [], defaultContent: ['h3', 'p', 'ul'] },
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
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
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
