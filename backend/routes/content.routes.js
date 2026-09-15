const express = require('express');
const { pool } = require('../db');
const { orMissing, linkOrNull } = require('../utils/fallback');

const router = express.Router();

const ASSETS = {
  logoHorizontal: '/assets/logo-hor.png',
  logoVertical: '/assets/logo-ver.png',
  icon: '/assets/icon.png',
};

async function getHero() {
  const { rows } = await pool.query('SELECT * FROM hero_content WHERE id = 1');
  const row = rows[0];

  // No row at all is the same situation as a row full of blanks.
  if (!row) {
    return {
      desc: orMissing(null),
      email: orMissing(null),
      emailSecondary: orMissing(null),
      contactNumber: orMissing(null),
      contactNumberSecondary: null,
      address: orMissing(null),
      mapLink: null,
    };
  }

  return {
    desc: orMissing(row.description),
    email: orMissing(row.email_primary),
    emailSecondary: orMissing(row.email_secondary),
    contactNumber: orMissing(row.phone_primary),
    // Secondary number is genuinely optional — null hides it rather than
    // printing '404' next to a real number.
    contactNumberSecondary: linkOrNull(row.phone_secondary),
    address: orMissing(row.address_display),
    mapLink: linkOrNull(row.map_link),
  };
}

async function getSocials() {
  const { rows } = await pool.query(
    'SELECT * FROM socials WHERE is_active = true ORDER BY sort_order, id'
  );
  return rows
    .map((row) => ({
      platform: row.platform,
      label: orMissing(row.label),
      icon: row.icon_key,
      link: linkOrNull(row.url),
    }))
    // An icon is only meaningful if it goes somewhere, so rows without a url
    // are dropped here and never reach the footer.
    .filter((s) => s.link !== null);
}

async function listFrom(table) {
  const { rows } = await pool.query(
    `SELECT * FROM ${table} WHERE is_active = true ORDER BY sort_order, id`
  );
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: orMissing(row.name),
    desc: orMissing(row.description),
  }));
}

// One call for everything the navbar and footer need, so a page load doesn't
// fan out into four separate requests before the chrome can render.
router.get('/site', async (req, res, next) => {
  try {
    const [heroContent, socials, services] = await Promise.all([
      getHero(),
      getSocials(),
      listFrom('services'),
    ]);
    res.json({ assets: ASSETS, heroContent, socials, services });
  } catch (err) {
    next(err);
  }
});

router.get('/hero', async (req, res, next) => {
  try {
    const [heroContent, socials] = await Promise.all([getHero(), getSocials()]);
    res.json({ heroContent, socials });
  } catch (err) {
    next(err);
  }
});

router.get('/services', async (req, res, next) => {
  try {
    res.json(await listFrom('services'));
  } catch (err) {
    next(err);
  }
});

router.get('/jobs', async (req, res, next) => {
  try {
    res.json(await listFrom('jobs'));
  } catch (err) {
    next(err);
  }
});

router.get('/internships', async (req, res, next) => {
  try {
    res.json(await listFrom('internships'));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
