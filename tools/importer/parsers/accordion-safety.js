export default function parse(element, { document }) {
  const cells = [['accordion-safety']];
  const content = document.createElement('div');
  content.innerHTML = element.innerHTML;
  cells.push([content]);
  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-safety', cells: [[content]] });
  element.replaceWith(block);
}
