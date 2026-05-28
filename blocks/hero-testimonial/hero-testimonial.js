export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cols = [...row.children];
  if (cols.length < 2) return;

  const imageCol = cols[0];
  const contentCol = cols[1];

  const picture = imageCol.querySelector('picture');
  if (picture) {
    const bgWrapper = document.createElement('div');
    bgWrapper.className = 'hero-testimonial-bg';
    bgWrapper.append(picture);
    block.prepend(bgWrapper);
  }

  const overlay = document.createElement('div');
  overlay.className = 'hero-testimonial-overlay';
  overlay.append(...contentCol.childNodes);

  block.textContent = '';
  if (picture) {
    const bgWrapper = document.createElement('div');
    bgWrapper.className = 'hero-testimonial-bg';
    bgWrapper.append(picture);
    block.append(bgWrapper);
  }
  block.append(overlay);

  row.remove();
}
