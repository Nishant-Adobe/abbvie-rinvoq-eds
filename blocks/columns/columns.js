function detectVariant(block) {
  const text = block.textContent || '';
  const section = block.closest('.section');
  const sectionClass = section ? section.className : '';
  const imgs = [...block.querySelectorAll('img')];
  const altTexts = imgs.map((img) => (img.alt || '').toLowerCase()).join(' ');

  if (text.includes('NEXT PAGE') || text.includes('SUGGESTED FOR YOU')) return 'columns-nav';
  if (altTexts.includes('poll') || text.includes('Quick Poll')) return 'columns-poll';
  if (sectionClass.includes('yellow') && (text.includes('“') || text.includes('”'))) return 'columns-tout';
  if (text.includes('Meet RINVOQ patients') || text.includes('Watch their stories')) return 'columns-stories';
  if (text.includes('Select Important Safety') || text.includes('serious side effects')) return 'columns-safety';
  if (text.includes('$0 a month') || text.includes('About RINVOQ')) return 'columns-value';
  if (text.includes('Itch Relief') || text.includes('Skin Clearance') || text.includes('Long-term')) return 'columns-efficacy';
  if (altTexts.includes('checkmark') || altTexts.includes('check') || altTexts.includes('proven results')) return 'columns-kit';

  return null;
}

export default async function decorate(block) {
  const variant = detectVariant(block);

  if (variant) {
    block.classList.add(variant);
    block.closest('.section')?.classList.add(`${variant}-container`);
    block.parentElement?.classList.add(`${variant}-wrapper`);

    // Try loading variant JS for decoration logic
    try {
      const mod = await import(`/blocks/${variant}/${variant}.js`);
      if (mod.default) mod.default(block);
    } catch (e) {
      // no variant JS — CSS handles styling via classes added above
    }
  } else {
    const cols = [...(block.firstElementChild?.children || [])];
    block.classList.add(`columns-${cols.length}-cols`);
  }
}
