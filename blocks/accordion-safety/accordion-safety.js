export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const summaryCol = cols[0];
    const detailsCol = cols[1];

    const container = document.createElement('div');
    container.className = 'safety-section';

    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'safety-summary';
    summaryDiv.append(...summaryCol.childNodes);

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'safety-details';
    detailsDiv.append(...detailsCol.childNodes);
    detailsDiv.classList.add('collapsed');

    const expandBtn = document.createElement('button');
    expandBtn.type = 'button';
    expandBtn.className = 'safety-toggle';
    expandBtn.innerHTML = '<span class="safety-toggle-text">Expand to learn more about these Safety Considerations</span><span class="safety-toggle-icon"></span>';

    expandBtn.addEventListener('click', () => {
      const isExpanded = !detailsDiv.classList.contains('collapsed');
      if (isExpanded) {
        detailsDiv.classList.add('collapsed');
        expandBtn.querySelector('.safety-toggle-text').textContent = 'Expand to learn more about these Safety Considerations';
        expandBtn.classList.remove('expanded');
      } else {
        detailsDiv.classList.remove('collapsed');
        expandBtn.querySelector('.safety-toggle-text').textContent = 'Collapse Safety Considerations';
        expandBtn.classList.add('expanded');
      }
    });

    container.append(summaryDiv, expandBtn, detailsDiv);
    row.replaceWith(container);
  });
}
