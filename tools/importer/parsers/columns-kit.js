export default function parse(element, { document }) {
  const cells = [['columns-kit']];
  const content = document.createElement('div');
  content.innerHTML = element.innerHTML;
  cells.push([content]);
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-kit', cells: [[content]] });
  element.replaceWith(block);
}
