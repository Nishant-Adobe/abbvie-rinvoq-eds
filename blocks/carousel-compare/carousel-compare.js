function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function initSliderInteraction(container, beforeLayer, handle) {
  let isDragging = false;
  const startPos = 66;

  const setPosition = (percent) => {
    const clamped = Math.max(0, Math.min(100, percent));
    beforeLayer.style.width = `${clamped}%`;
    handle.style.left = `${clamped}%`;
  };

  const getPercent = (e) => {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - rect.left) / rect.width) * 100;
  };

  const onMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition(getPercent(e));
  };

  const onEnd = () => {
    isDragging = false;
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
  };

  const onStart = (e) => {
    isDragging = true;
    e.preventDefault();
    setPosition(getPercent(e));
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  };

  handle.addEventListener('mousedown', onStart);
  handle.addEventListener('touchstart', onStart, { passive: false });
  container.addEventListener('mousedown', onStart);
  container.addEventListener('touchstart', onStart, { passive: false });

  requestAnimationFrame(() => setPosition(startPos));
}

function buildSlider(slide, isActive) {
  const wrapper = document.createElement('div');
  wrapper.className = `compare-slide${isActive ? ' active' : ''}`;

  const sliderContainer = document.createElement('div');
  sliderContainer.className = 'compare-slider';

  const afterLayer = document.createElement('div');
  afterLayer.className = 'compare-after';
  if (slide.afterImg) afterLayer.append(slide.afterImg.cloneNode(true));

  const afterOverlay = document.createElement('div');
  afterOverlay.className = 'compare-overlay compare-overlay-after';
  afterOverlay.innerHTML = '<span class="compare-label">AFTER</span>';
  afterLayer.append(afterOverlay);

  const beforeLayer = document.createElement('div');
  beforeLayer.className = 'compare-before';
  if (slide.beforeImg) beforeLayer.append(slide.beforeImg.cloneNode(true));

  const beforeOverlay = document.createElement('div');
  beforeOverlay.className = 'compare-overlay compare-overlay-before';
  beforeOverlay.innerHTML = '<span class="compare-label">BEFORE</span>';
  beforeLayer.append(beforeOverlay);

  const handle = document.createElement('div');
  handle.className = 'compare-handle';
  handle.innerHTML = '<span class="compare-handle-icon"></span>';

  sliderContainer.append(afterLayer, beforeLayer, handle);

  const textOverlay = document.createElement('div');
  textOverlay.className = 'compare-text';
  textOverlay.innerHTML = `<p class="compare-description">${slide.description}</p><p class="compare-disclaimer">${slide.disclaimer}</p>`;

  wrapper.append(sliderContainer, textOverlay);

  initSliderInteraction(sliderContainer, beforeLayer, handle);

  return wrapper;
}

function buildGroupPanel(slideData, groupName) {
  const panel = document.createElement('div');
  panel.className = `compare-panel compare-panel-${groupName}`;

  const sliderArea = document.createElement('div');
  sliderArea.className = 'compare-slider-area';

  slideData.forEach((slide, idx) => {
    const slideEl = buildSlider(slide, idx === 0);
    sliderArea.append(slideEl);
  });

  const thumbGrid = document.createElement('div');
  thumbGrid.className = 'compare-thumbnails';

  slideData.forEach((slide, idx) => {
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = `compare-thumb${idx === 0 ? ' active' : ''}`;
    thumb.setAttribute('aria-label', `${slide.bodyPart} ${slide.clearance}% clearance`);

    if (slide.thumbImg) {
      thumb.append(slide.thumbImg.cloneNode(true));
    }
    const label = document.createElement('span');
    label.className = 'compare-thumb-label';
    label.innerHTML = `<strong>${capitalize(slide.bodyPart)}</strong><br>${slide.clearance}% clearance`;
    thumb.append(label);

    thumb.addEventListener('click', () => {
      const allSlides = sliderArea.querySelectorAll('.compare-slide');
      allSlides.forEach((s) => s.classList.remove('active'));
      allSlides[idx].classList.add('active');

      thumbGrid.querySelectorAll('.compare-thumb').forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
    });

    thumbGrid.append(thumb);
  });

  panel.append(sliderArea, thumbGrid);
  return panel;
}

export default function decorate(block) {
  const rows = [...block.children];
  const slides = [];

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 4) return;

    const metaCol = cols[0];
    const afterCol = cols[1];
    const beforeCol = cols[2];
    const thumbCol = cols[3];

    const paragraphs = metaCol.querySelectorAll('p');
    const group = paragraphs[0]?.textContent.trim().toLowerCase() || 'adults';
    const bodyPart = paragraphs[1]?.textContent.trim().toLowerCase() || '';
    const clearance = paragraphs[2]?.textContent.trim() || '';
    const description = paragraphs[3]?.textContent.trim() || '';
    const disclaimer = paragraphs[4]?.textContent.trim() || '';

    const afterImg = afterCol.querySelector('picture');
    const beforeImg = beforeCol.querySelector('picture');
    const thumbImg = thumbCol.querySelector('picture');

    slides.push({
      group,
      bodyPart,
      clearance,
      description,
      disclaimer,
      afterImg,
      beforeImg,
      thumbImg,
    });
  });

  block.textContent = '';

  const adultsSlides = slides.filter((s) => s.group === 'adults');
  const adolescentsSlides = slides.filter((s) => s.group === 'adolescents');

  const container = document.createElement('div');
  container.className = 'compare-container';

  const adultsPanel = buildGroupPanel(adultsSlides, 'adults');
  const adolescentsPanel = buildGroupPanel(adolescentsSlides, 'adolescents');
  adolescentsPanel.classList.add('hidden');

  const toggleBar = document.createElement('div');
  toggleBar.className = 'compare-toggle';
  const adultBtn = document.createElement('button');
  adultBtn.type = 'button';
  adultBtn.className = 'compare-toggle-btn active';
  adultBtn.textContent = 'View Adult Results';
  const adolescentBtn = document.createElement('button');
  adolescentBtn.type = 'button';
  adolescentBtn.className = 'compare-toggle-btn';
  adolescentBtn.textContent = 'View Adolescent (12-17) Results';
  toggleBar.append(adultBtn, adolescentBtn);

  container.append(adultsPanel, adolescentsPanel, toggleBar);
  block.append(container);

  adultBtn.addEventListener('click', () => {
    adultBtn.classList.add('active');
    adolescentBtn.classList.remove('active');
    adultsPanel.classList.remove('hidden');
    adolescentsPanel.classList.add('hidden');
  });

  adolescentBtn.addEventListener('click', () => {
    adolescentBtn.classList.add('active');
    adultBtn.classList.remove('active');
    adolescentsPanel.classList.remove('hidden');
    adultsPanel.classList.add('hidden');
  });
}
