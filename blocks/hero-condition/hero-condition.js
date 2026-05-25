export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const row = rows[0];
  const cols = [...row.children];
  const videoCol = cols[0];
  const ctaCol = cols[1];

  const link = videoCol?.querySelector('a');
  const img = videoCol?.querySelector('img');

  if (link && img) {
    const videoSrc = link.getAttribute('href');
    const posterSrc = img.getAttribute('src');

    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'auto');
    video.poster = posterSrc;
    video.className = 'hero-condition-video';

    const source = document.createElement('source');
    source.src = videoSrc;
    source.type = 'video/mp4';
    video.append(source);

    block.prepend(video);
  }

  if (ctaCol) {
    const ctaLink = ctaCol.querySelector('a');
    if (ctaLink) {
      ctaLink.className = 'hero-condition-cta';
      const wrapper = document.createElement('div');
      wrapper.className = 'hero-condition-cta-wrapper';
      wrapper.append(ctaLink);
      block.append(wrapper);
    }
  }

  row.remove();
}
