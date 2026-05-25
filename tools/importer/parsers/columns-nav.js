export default function parse(element, { document }) {
  const cells = [['columns-nav']];
  const content = document.createElement('div');
  content.innerHTML = element.innerHTML;
  cells.push([content]);
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-nav', cells: [[content]] });
  element.replaceWith(block);
}
