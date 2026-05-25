export default function decorate(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0];
    if (!label) return;
    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    summary.append(...label.childNodes);
    const body = row.children[1] || row.children[0];
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'accordion-faq-item-body';
    if (body && body !== label) {
      bodyDiv.append(...body.childNodes);
    }
    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, bodyDiv);
    row.replaceWith(details);
  });
}
