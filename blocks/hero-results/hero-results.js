export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const col = row.querySelector(':scope > div');
  if (!col) return;

  const links = col.querySelectorAll('a');
  const videos = [];

  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.endsWith('.mp4')) {
      const picture = link.querySelector('picture');
      const img = picture?.querySelector('img');
      videos.push({
        src: href,
        poster: img?.getAttribute('src') || '',
        alt: img?.getAttribute('alt') || '',
      });
    }
  });

  if (videos.length === 0) return;

  block.textContent = '';

  const videoContainer = document.createElement('div');
  videoContainer.className = 'hero-results-video-container';

  videos.forEach((videoData, idx) => {
    const wrapper = document.createElement('div');
    let sizeClass = 'desktop';
    if (idx === 1) sizeClass = 'tablet';
    if (idx === 2) sizeClass = 'mobile';
    wrapper.className = `hero-results-video hero-results-video-${sizeClass}`;

    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'auto');
    video.setAttribute('poster', videoData.poster);
    video.muted = true;

    const source = document.createElement('source');
    source.setAttribute('src', videoData.src);
    source.setAttribute('type', 'video/mp4');
    video.append(source);

    wrapper.append(video);
    videoContainer.append(wrapper);
  });

  block.append(videoContainer);
}
