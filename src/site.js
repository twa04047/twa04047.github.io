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
