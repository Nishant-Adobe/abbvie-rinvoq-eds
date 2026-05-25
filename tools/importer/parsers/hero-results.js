export default function parse(element, { document }) {
  const cells = [['hero-results']];
  const content = document.createElement('div');
  content.innerHTML = element.innerHTML;
  cells.push([content]);
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-results', cells: [[content]] });
  element.replaceWith(block);
}
