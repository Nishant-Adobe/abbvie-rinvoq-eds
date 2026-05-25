/* eslint-disable */
/* global WebImporter */

import heroConditionParser from './parsers/hero-condition.js';
import columnsEfficacyParser from './parsers/columns-efficacy.js';
import columnsPollParser from './parsers/columns-poll.js';
import columnsStoriesParser from './parsers/columns-stories.js';
import columnsToutParser from './parsers/columns-tout.js';

import rinvoqCleanupTransformer from './transformers/rinvoq-cleanup.js';
import rinvoqSectionsTransformer from './transformers/rinvoq-sections.js';

const parsers = {
  'hero-condition': heroConditionParser,
  'columns-efficacy': columnsEfficacyParser,
  'columns-poll': columnsPollParser,
  'columns-stories': columnsStoriesParser,
  'columns-tout': columnsToutParser,
};

const PAGE_TEMPLATE = {
  name: 'condition-landing',
  description: 'Condition landing page for atopic dermatitis',
  urls: ['https://www.rinvoq.com/atopic-dermatitis'],
  blocks: [
    { name: 'hero-condition', instances: ['.abbv-background-container.desktop-header'] },
    { name: 'columns-efficacy', instances: ['.helps-deliver-sectionx'] },
    { name: 'columns-poll', instances: ['.target-rcmd-quickpoll'] },
    { name: 'columns-stories', instances: ['.abbv-flex-container.pt-35'] },
    { name: 'columns-tout', instances: ['.target-rcmd-enhancementout'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero', selector: '.abbv-background-container.desktop-header', style: null, blocks: ['hero-condition'], defaultContent: [] },
    { id: 'section-2', name: 'Indication', selector: '.indication-statement', style: null, blocks: [], defaultContent: ['p'] },
    { id: 'section-3', name: 'Efficacy', selector: '.helps-deliver-sectionx', style: null, blocks: ['columns-efficacy'], defaultContent: ['h1', 'p', 'a'] },
    { id: 'section-4', name: 'Safety Callout', selector: '.select-isi', style: null, blocks: [], defaultContent: ['p', 'ul', 'a'] },
    { id: 'section-5', name: 'Quick Poll', selector: '.target-rcmd-quickpoll', style: 'grey', blocks: ['columns-poll'], defaultContent: [] },
    { id: 'section-6', name: 'Patient Stories', selector: '.abbv-flex-container.pt-35', style: null, blocks: ['columns-stories'], defaultContent: [] },
    { id: 'section-7', name: 'Quiz Tout', selector: '.target-rcmd-enhancementout', style: 'gold', blocks: ['columns-tout'], defaultContent: [] },
    { id: 'section-8', name: 'ISI', selector: '#abbv_use_statement', style: null, blocks: [], defaultContent: ['h3', 'p', 'ul'] },
  ],
};

const transformers = [rinvoqCleanupTransformer, rinvoqSectionsTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => { try { fn(hookName, element, enhancedPayload); } catch (e) { console.error(e); } });
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

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    executeTransformers('beforeTransform', main, payload);
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) { try { parser(block.element, { document, url, params }); } catch (e) { console.error(e); } }
    });
    executeTransformers('afterTransform', main, payload);
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    const path = WebImporter.FileUtils.sanitizePath(new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''));
    return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
  },
};
