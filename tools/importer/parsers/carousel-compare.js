export default function parse(element, { document }) {
  const cells = [['carousel-compare']];
  const content = document.createElement('div');
  content.innerHTML = element.innerHTML;
  cells.push([content]);
  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-compare', cells: [[content]] });
  element.replaceWith(block);
}
