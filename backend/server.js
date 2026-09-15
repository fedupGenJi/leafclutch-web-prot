const path = require('path');
const express = require('express');
const cors = require('cors');

const { pool, ensureTables } = require('./db');
const { seed } = require('./db/seed');
const contentRoutes = require('./routes/content.routes');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Brand assets live here and are served to the pages. The only images the
// frontend keeps locally are the intro animation logo and the browser tab
// icon — everything else on a page comes from this directory.
app.use(
  '/assets',
  express.static(path.join(__dirname, 'assets'), {
    maxAge: '1h',
    fallthrough: true,
  })
);

app.use('/api', contentRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT current_database() AS db');
    res.json({ ok: true, db: rows[0].db });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Database unreachable' });
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

async function start() {
  const report = await ensureTables();

  if (report.created.length) {
    console.log(`Created missing tables: ${report.created.join(', ')}`);
  }
  if (report.existing.length) {
    console.log(`Found existing tables: ${report.existing.join(', ')}`);
  }

  const seeded = await seed();
  if (seeded.length) {
    console.log(`Seeded empty tables: ${seeded.join(', ')}`);
  }

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
