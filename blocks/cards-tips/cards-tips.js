export default function decorate(block) {
  const cards = [...block.children];

  cards.forEach((card) => {
    card.classList.add('tip-card');
    const cols = [...card.children];

    if (cols[0]) cols[0].classList.add('tip-number');
    if (cols[1]) cols[1].classList.add('tip-icon');
    if (cols[2]) cols[2].classList.add('tip-content');
  });
}
