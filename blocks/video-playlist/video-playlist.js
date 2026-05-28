export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const thumbRow = rows[0];
  const videoRow = rows[1];

  const thumbItems = [...thumbRow.children];
  const videoCol = videoRow.children[0];

  block.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'vp-container';

  const thumbGrid = document.createElement('div');
  thumbGrid.className = 'vp-thumb-grid';

  thumbItems.forEach((item, i) => {
    const thumb = document.createElement('div');
    thumb.className = `vp-thumb${i === 0 ? ' vp-thumb-active' : ''}`;
    const img = item.querySelector('img');
    const title = item.querySelector('p');
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || '';
      imgEl.loading = 'lazy';
      thumb.append(imgEl);
    }
    const playIcon = document.createElement('span');
    playIcon.className = 'vp-play-icon';
    thumb.append(playIcon);
    if (title) {
      const label = document.createElement('span');
      label.className = 'vp-thumb-label';
      label.textContent = title.textContent;
      thumb.append(label);
    }
    thumbGrid.append(thumb);
  });

  container.append(thumbGrid);

  const playerArea = document.createElement('div');
  playerArea.className = 'vp-player-area';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'vp-content';

  const videoDiv = document.createElement('div');
  videoDiv.className = 'vp-video';

  if (videoCol) {
    const poster = videoCol.querySelector('img');
    const h3 = videoCol.querySelector('h3');
    const desc = videoCol.querySelector('p');
    const transcript = videoCol.querySelector('a');

    if (poster) {
      const posterImg = document.createElement('img');
      posterImg.src = poster.src;
      posterImg.alt = poster.alt || '';
      posterImg.className = 'vp-poster';
      const playBtn = document.createElement('div');
      playBtn.className = 'vp-play-btn';
      videoDiv.append(posterImg, playBtn);
    }

    if (h3) {
      const titleEl = document.createElement('h3');
      titleEl.textContent = h3.textContent;
      contentDiv.append(titleEl);
    }
    if (desc) {
      const descEl = document.createElement('p');
      descEl.textContent = desc.textContent;
      contentDiv.append(descEl);
    }
    if (transcript) {
      const linkEl = document.createElement('a');
      linkEl.href = transcript.href;
      linkEl.textContent = transcript.textContent;
      linkEl.className = 'vp-transcript';
      contentDiv.append(linkEl);
    }
  }

  playerArea.append(contentDiv, videoDiv);
  container.append(playerArea);
  block.append(container);
}
