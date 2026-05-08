const resultsEl = document.getElementById('results');
const qEl = document.getElementById('q');
const topicsEl = document.getElementById('topics');
const searchBtn = document.getElementById('search');
const resetBtn = document.getElementById('reset');

async function fetchGuests() {
  const q = encodeURIComponent(qEl.value.trim());
  const topics = encodeURIComponent(topicsEl.value.trim());
  const params = [];
  if (q) params.push(`q=${q}`);
  if (topics) params.push(`topics=${topics}`);
  const res = await fetch('/api/guests' + (params.length ? ('?' + params.join('&')) : ''));
  return res.json();
}

function render(list) {
  if (!list.length) {
    resultsEl.innerHTML = '<p class="empty">No guests found.</p>';
    return;
  }
  resultsEl.innerHTML = list.map(g=>`<div class="card"><h3>${g.name}</h3><p>${g.bio}</p><p class="meta">Topics: ${g.topics.join(', ')}</p><p class="meta">Contact: ${g.contact}</p></div>`).join('\n');
}

searchBtn.addEventListener('click', async ()=>{
  resultsEl.innerText = 'Searching...';
  const list = await fetchGuests();
  render(list);
});

resetBtn.addEventListener('click', async ()=>{
  qEl.value = '';
  topicsEl.value = '';
  resultsEl.innerText = 'Loading guests…';
  const list = await fetch('/api/guests').then(r=>r.json());
  render(list);
});

// initial load
fetch('/api/guests').then(r=>r.json()).then(render).catch(()=>{resultsEl.innerText='Failed to load guests.'});
