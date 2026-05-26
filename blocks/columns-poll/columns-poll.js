export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-poll-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-poll-img-col');
        }
      }
    });
  });

  const contentCol = block.querySelector(':scope > div > div:not(.columns-poll-img-col)');
  if (!contentCol) return;

  const ul = contentCol.querySelector('ul');
  const h3 = contentCol.querySelector('h3');
  if (!ul) return;

  const items = [...ul.querySelectorAll('li')];
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'poll-options';

  items.forEach((li) => {
    const btn = document.createElement('button');
    btn.className = 'poll-option';
    btn.type = 'button';
    btn.textContent = li.textContent;
    btn.addEventListener('click', () => {
      optionsDiv.querySelectorAll('.poll-option').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      setTimeout(() => {
        const question = contentCol.querySelector('h2');
        if (question) question.style.display = 'none';
        optionsDiv.style.display = 'none';
        const response = contentCol.querySelector('.poll-response');
        if (response) response.classList.add('visible');
      }, 600);
    });
    optionsDiv.append(btn);
  });

  ul.replaceWith(optionsDiv);

  if (h3) {
    const responseDiv = document.createElement('div');
    responseDiv.className = 'poll-response';
    let sibling = h3;
    const toMove = [h3];
    while (sibling.nextElementSibling) {
      sibling = sibling.nextElementSibling;
      toMove.push(sibling);
    }
    toMove.forEach((el) => responseDiv.append(el));
    contentCol.append(responseDiv);
  }
}
