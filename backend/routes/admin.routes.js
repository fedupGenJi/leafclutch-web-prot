const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const { signToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

// The admin table stores `email`, but the frontend's login form field is
// called `username` — accept either key so nothing has to change on either
// side.
router.post('/login', async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};
    const identifier = username || email;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const { rows } = await pool.query(
      'SELECT id, email, password_hash FROM admin WHERE email = $1',
      [identifier]
    );
    const admin = rows[0];

    // Same generic message whether the account doesn't exist or the
    // password is wrong — don't leak which one it was.
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ message: 'Incorrect username or password' });
    }

    const token = signToken({ id: admin.id, email: admin.email });
    res.json({ token, user: { id: admin.id, username: admin.email } });
  } catch (err) {
    next(err);
  }
});

router.get('/session', requireAuth, (req, res) => {
  res.json({ user: { id: req.admin.id, username: req.admin.email } });
});

router.post('/logout', requireAuth, (req, res) => {
  // JWTs are stateless — there is nothing to invalidate server-side. The
  // frontend clears its stored token; this just needs to return 2xx.
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// Hero content
// ---------------------------------------------------------------------------

router.get('/hero-content', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM hero_content WHERE id = 1');
    const row = rows[0] || {};
    res.json({
      desc: row.description || '',
      email: row.email_primary || '',
      emailSecondary: row.email_secondary || null,
      contactNumber: row.phone_primary || '',
      contactNumberSecondary: row.phone_secondary || null,
      address: row.address_display || '',
      mapLink: row.map_link || null,
    });
  } catch (err) {
    next(err);
  }
});

router.put('/hero-content', requireAuth, async (req, res, next) => {
  try {
    const {
      desc,
      email,
      emailSecondary,
      contactNumber,
      contactNumberSecondary,
      address,
      mapLink,
    } = req.body || {};

    const { rows } = await pool.query(
      `INSERT INTO hero_content
         (id, description, email_primary, email_secondary, phone_primary, phone_secondary, address_display, map_link, updated_at)
       VALUES (1, $1, $2, $3, $4, $5, $6, $7, now())
       ON CONFLICT (id) DO UPDATE SET
         description      = EXCLUDED.description,
         email_primary    = EXCLUDED.email_primary,
         email_secondary  = EXCLUDED.email_secondary,
         phone_primary     = EXCLUDED.phone_primary,
         phone_secondary   = EXCLUDED.phone_secondary,
         address_display   = EXCLUDED.address_display,
         map_link          = EXCLUDED.map_link,
         updated_at        = now()
       RETURNING *`,
      [desc, email, emailSecondary || null, contactNumber, contactNumberSecondary || null, address, mapLink || null]
    );

    const row = rows[0];
    res.json({
      desc: row.description || '',
      email: row.email_primary || '',
      emailSecondary: row.email_secondary || null,
      contactNumber: row.phone_primary || '',
      contactNumberSecondary: row.phone_secondary || null,
      address: row.address_display || '',
      mapLink: row.map_link || null,
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

router.get('/services', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, slug, name, description FROM services ORDER BY sort_order, id'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/services', requireAuth, async (req, res, next) => {
  try {
    const { name, description } = req.body || {};
    const slug = req.body?.slug ? slugify(req.body.slug) : slugify(name || '');

    if (!name || !slug) {
      return res.status(400).json({ message: 'name (and/or slug) is required' });
    }

    const { rows: maxRows } = await pool.query(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM services'
    );

    const { rows } = await pool.query(
      `INSERT INTO services (slug, name, description, sort_order, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, slug, name, description`,
      [slug, name, description || null, maxRows[0].next]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'A service with that slug already exists' });
    }
    next(err);
  }
});

// :id may be the numeric id or the slug — whichever the frontend has on hand.
function idOrSlugClause(id, paramIndex) {
  return /^\d+$/.test(id) ? `id = $${paramIndex}` : `slug = $${paramIndex}`;
}

router.put('/services/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body || {};
    const slug = req.body?.slug ? slugify(req.body.slug) : undefined;

    const { rows } = await pool.query(
      `UPDATE services SET name = $1, description = $2, slug = COALESCE($3, slug)
       WHERE ${idOrSlugClause(id, 4)}
       RETURNING id, slug, name, description`,
      [name, description || null, slug || null, /^\d+$/.test(id) ? Number(id) : id]
    );

    if (!rows.length) return res.status(404).json({ message: 'Service not found' });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'A service with that slug already exists' });
    }
    next(err);
  }
});

router.delete('/services/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query(
      `DELETE FROM services WHERE ${idOrSlugClause(id, 1)}`,
      [/^\d+$/.test(id) ? Number(id) : id]
    );
    if (!rowCount) return res.status(404).json({ message: 'Service not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Jobs & Internships
// ---------------------------------------------------------------------------
// The frontend now calls these as two separate CRUD resources (jobsApi and
// internshipsApi, each hitting its own basePath) rather than one merged list
// with a `type` field. Since `jobs` and `internships` are two tables with an
// identical shape, both routers are built from the same factory.

function toApiJobRow(row) {
  return {
    id: row.id,
    title: row.name,
    location: row.location || '',
    description: row.description || '',
    applyLink: row.apply_link || '',
  };
}

function createJobsCrudRouter(table) {
  const jobsRouter = express.Router();

  jobsRouter.get('/', requireAuth, async (req, res, next) => {
    try {
      const { rows } = await pool.query(`SELECT * FROM ${table} ORDER BY sort_order, id`);
      res.json(rows.map(toApiJobRow));
    } catch (err) {
      next(err);
    }
  });

  jobsRouter.post('/', requireAuth, async (req, res, next) => {
    try {
      const { title, location, description, applyLink } = req.body || {};
      if (!title) return res.status(400).json({ message: 'title is required' });

      const slug = slugify(title);
      const { rows: maxRows } = await pool.query(
        `SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM ${table}`
      );

      const { rows } = await pool.query(
        `INSERT INTO ${table} (slug, name, description, location, apply_link, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, true)
         RETURNING *`,
        [slug, title, description || null, location || null, applyLink || null, maxRows[0].next]
      );
      res.status(201).json(toApiJobRow(rows[0]));
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ message: 'An entry with that title already exists' });
      }
      next(err);
    }
  });

  jobsRouter.put('/:id', requireAuth, async (req, res, next) => {
    try {
      const { title, location, description, applyLink } = req.body || {};

      const { rows } = await pool.query(
        `UPDATE ${table}
         SET name = $1, description = $2, location = $3, apply_link = $4
         WHERE id = $5
         RETURNING *`,
        [title, description || null, location || null, applyLink || null, req.params.id]
      );

      if (!rows.length) return res.status(404).json({ message: 'Entry not found' });
      res.json(toApiJobRow(rows[0]));
    } catch (err) {
      next(err);
    }
  });

  jobsRouter.delete('/:id', requireAuth, async (req, res, next) => {
    try {
      const { rowCount } = await pool.query(`DELETE FROM ${table} WHERE id = $1`, [req.params.id]);
      if (!rowCount) return res.status(404).json({ message: 'Entry not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return jobsRouter;
}

router.use('/jobs', createJobsCrudRouter('jobs'));
router.use('/internships', createJobsCrudRouter('internships'));

// ---------------------------------------------------------------------------
// Socials
// ---------------------------------------------------------------------------
// `platform` is the unique key (e.g. "facebook"), same role `slug` plays for
// services. The admin UI (CrudManager.jsx / SocialsSection.jsx) reads and
// writes the schema's own column names directly — icon_key, sort_order,
// is_active — so these routes speak those names as-is rather than remapping
// to camelCase. Keeping the wire format identical to the DB columns is what
// lets CrudManager stay generic across services/jobs/socials.

function idOrPlatformClause(id, paramIndex) {
  return /^\d+$/.test(id) ? `id = $${paramIndex}` : `platform = $${paramIndex}`;
}

router.get('/socials', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM socials ORDER BY sort_order, id');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/socials', requireAuth, async (req, res, next) => {
  try {
    const { label, icon_key, url, is_active } = req.body || {};
    const platform = req.body?.platform ? slugify(req.body.platform) : null;

    if (!platform || !icon_key) {
      return res.status(400).json({ message: 'platform and icon_key are required' });
    }

    const { rows: maxRows } = await pool.query(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM socials'
    );

    const { rows } = await pool.query(
      `INSERT INTO socials (platform, label, icon_key, url, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [platform, label || null, icon_key, url || null, maxRows[0].next, is_active !== false]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'A social entry for that platform already exists' });
    }
    next(err);
  }
});

router.put('/socials/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { label, icon_key, url, is_active } = req.body || {};
    const platform = req.body?.platform ? slugify(req.body.platform) : undefined;

    const { rows } = await pool.query(
      `UPDATE socials
       SET platform  = COALESCE($1, platform),
           label     = $2,
           icon_key  = COALESCE($3, icon_key),
           url       = $4,
           is_active = COALESCE($5, is_active)
       WHERE ${idOrPlatformClause(id, 6)}
       RETURNING *`,
      [
        platform || null,
        label || null,
        icon_key || null,
        url || null,
        typeof is_active === 'boolean' ? is_active : null,
        /^\d+$/.test(id) ? Number(id) : id,
      ]
    );

    if (!rows.length) return res.status(404).json({ message: 'Social entry not found' });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'A social entry for that platform already exists' });
    }
    next(err);
  }
});

router.delete('/socials/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query(
      `DELETE FROM socials WHERE ${idOrPlatformClause(id, 1)}`,
      [/^\d+$/.test(id) ? Number(id) : id]
    );
    if (!rowCount) return res.status(404).json({ message: 'Social entry not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Password
// ---------------------------------------------------------------------------

router.put('/password', requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    const { rows } = await pool.query('SELECT password_hash FROM admin WHERE id = $1', [req.admin.id]);
    const admin = rows[0];

    if (!admin || !(await bcrypt.compare(currentPassword, admin.password_hash))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const nextHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admin SET password_hash = $1 WHERE id = $2', [nextHash, req.admin.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;