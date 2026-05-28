export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const configRow = rows[0];
  const cols = [...configRow.children];

  const layout = cols[0]?.textContent?.trim() || 'playlist-left';
  const playlistId = cols[0]?.querySelectorAll('p')[1]?.textContent?.trim() || '';

  const transcriptCol = cols[1];
  const transcriptLink = transcriptCol?.querySelector('a');

  block.innerHTML = '';
  block.classList.add(layout);

  const container = document.createElement('div');
  container.className = 'video-playlist-container';

  const placeholder = document.createElement('div');
  placeholder.className = 'video-playlist-placeholder';
  placeholder.innerHTML = `
    <div class="video-playlist-player">
      <div class="video-playlist-embed">
        <p>Video Player</p>
        <p class="video-playlist-id">Playlist: ${playlistId}</p>
      </div>
    </div>
    <div class="video-playlist-sidebar">
      <p class="video-playlist-sidebar-label">Video Playlist</p>
    </div>
  `;

  container.append(placeholder);

  if (transcriptLink) {
    const transcriptDiv = document.createElement('div');
    transcriptDiv.className = 'video-playlist-transcript';
    transcriptLink.className = 'video-playlist-transcript-link';
    transcriptDiv.append(transcriptLink);
    container.append(transcriptDiv);
  }

  block.append(container);
}
