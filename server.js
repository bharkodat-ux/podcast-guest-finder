const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/guests', (req, res) => {
  const q = req.query.q ? req.query.q.toLowerCase() : null;
  const topics = req.query.topics ? req.query.topics.toLowerCase().split(',') : null;
  const dataPath = path.join(__dirname, 'data', 'guests.json');
  fs.readFile(dataPath, 'utf8', (err, raw) => {
    if (err) return res.status(500).json({ error: 'failed to read data' });
    let list = JSON.parse(raw);
    if (q) {
      list = list.filter(g => [g.name, g.bio, ...(g.topics||[])].join(' ').toLowerCase().includes(q));
    }
    if (topics) {
      list = list.filter(g => (g.topics||[]).some(t => topics.includes(t.toLowerCase())));
    }
    res.json(list);
  });
});

app.listen(PORT, () => console.log(`podcast-guest-finder running on http://localhost:${PORT}`));
