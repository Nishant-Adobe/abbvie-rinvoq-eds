/* eslint-disable */
/* global WebImporter */
import rinvoqCleanupTransformer from './transformers/rinvoq-cleanup.js';
import rinvoqSectionsTransformer from './transformers/rinvoq-sections.js';
const transformers = [rinvoqCleanupTransformer, rinvoqSectionsTransformer];
function executeTransformers(hookName, element, payload) {
  transformers.forEach((fn) => { try { fn(hookName, element, payload); } catch (e) {} });
}
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    executeTransformers('beforeTransform', main, payload);
    executeTransformers('afterTransform', main, payload);
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    const path = WebImporter.FileUtils.sanitizePath(new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''));
    return [{ element: main, path, report: { title: document.title, template: 'dermatologist-page' } }];
  },
};
