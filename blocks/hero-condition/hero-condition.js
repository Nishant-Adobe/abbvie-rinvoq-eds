export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const imageRow = rows[0];
  const textRow = rows[1];

  const img = imageRow.querySelector('img');
  const posterSrc = img?.getAttribute('src');

  const links = textRow.querySelectorAll('a');
  let videoSrc = null;
  let ctaLink = null;

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.endsWith('.mp4')) {
      videoSrc = href;
    } else if (href) {
      ctaLink = link;
    }
  });

  if (videoSrc && posterSrc) {
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

  if (ctaLink) {
    ctaLink.className = 'hero-condition-cta';
    const wrapper = document.createElement('div');
    wrapper.className = 'hero-condition-cta-wrapper';
    wrapper.append(ctaLink);
    block.append(wrapper);
  }

  rows.forEach((row) => row.remove());
}
