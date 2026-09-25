const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-category]');
const count = document.querySelector('[data-count]');

function applyFilter(category) {
  if (!['all', 'data', 'robotics'].includes(category)) category = 'all';
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  let visible = 0;
  cards.forEach(card => {
    card.hidden = category !== 'all' && card.dataset.category !== category;
    if (!card.hidden) visible++;
  });
  if (count) count.textContent = `${visible} ${count.dataset.unit}`;
}

filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  applyFilter(category);
  const url = new URL(location.href);
  if (category === 'all') url.searchParams.delete('category');
  else url.searchParams.set('category', category);
  history.replaceState(null, '', url);
  // Keep the selected category when switching language.
  const switchLink = document.querySelector('.language a');
  if (switchLink) {
    const alternate = new URL(switchLink.href);
    if (category === 'all') alternate.searchParams.delete('category');
    else alternate.searchParams.set('category', category);
    switchLink.href = alternate.href;
  }
}));
if (filters.length) {
  const category = new URL(location.href).searchParams.get('category') || 'all';
  applyFilter(category);
  const switchLink = document.querySelector('.language a');
  if (switchLink && ['data', 'robotics'].includes(category)) {
    const alternate = new URL(switchLink.href);
    alternate.searchParams.set('category', category);
    switchLink.href = alternate.href;
  }
}

document.querySelectorAll('.media-gallery figure').forEach(figure => {
  const video = figure.querySelector('video');
  if (!video) return;
  let requestedTime = null;
  const seek = () => {
    if (requestedTime === null) return;
    video.currentTime = Math.min(requestedTime, video.duration);
    requestedTime = null;
  };
  video.addEventListener('loadedmetadata', seek);
  figure.querySelectorAll('[data-video-time]').forEach(link => {
    link.addEventListener('click', event => {
      const time = Number(link.dataset.videoTime);
      if (!Number.isFinite(time) || time < 0) return;
      event.preventDefault();
      requestedTime = time;
      if (video.readyState >= 1) seek();
      // Calling play from the click also starts loading a preload="none" video.
      // If playback is blocked, native controls remain available at the requested time.
      video.play().catch(() => {});
    });
  });
});
