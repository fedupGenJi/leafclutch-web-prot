const { pool } = require('./index');

// Placeholder destination until the real routes exist.
const TODO_LINK = '/404';

const HERO = {
  description:
    'Empowering innovation through cutting-edge technology solutions, training, and digital transformation services.',
  email: 'info@leafclutchtech.com.np',
  phone_primary: '+977-9766715768',
  phone_secondary: null,
  address_display: 'Siddharthanagar, Rupandehi',
  map_link: TODO_LINK,
};

// icon_key must match a key in the frontend icon set (components/Icon.jsx).
// url is nullable on purpose: the footer only renders an icon when a link
// exists, so clearing a url here hides that platform without deleting the row.
const SOCIALS = [
  { platform: 'facebook',  label: 'Facebook',  icon_key: 'facebook',  url: TODO_LINK, sort_order: 1 },
  { platform: 'x',         label: 'X',         icon_key: 'x',         url: TODO_LINK, sort_order: 2 },
  { platform: 'linkedin',  label: 'LinkedIn',  icon_key: 'linkedin',  url: TODO_LINK, sort_order: 3 },
  { platform: 'instagram', label: 'Instagram', icon_key: 'instagram', url: TODO_LINK, sort_order: 4 },
  { platform: 'youtube',   label: 'YouTube',   icon_key: 'youtube',   url: TODO_LINK, sort_order: 5 },
  { platform: 'tiktok',    label: 'TikTok',    icon_key: 'tiktok',    url: TODO_LINK, sort_order: 6 },
  { platform: 'discord',   label: 'Discord',   icon_key: 'discord',   url: TODO_LINK, sort_order: 7 },
];

const SERVICES = [
  ['web-development',        'Web Development',        'Marketing sites, web apps and platforms built for speed and maintainability.'],
  ['mobile-app-development', 'Mobile App Development', 'Native and cross-platform apps for Android and iOS.'],
  ['devops-solutions',       'DevOps Solutions',       'CI/CD pipelines, cloud infrastructure and release automation.'],
  ['cybersecurity',          'Cybersecurity',          'Security audits, hardening and monitoring for your stack.'],
  ['data-science-ai',        'Data Science & AI',      'Analytics, machine learning models and AI-assisted workflows.'],
  ['digital-marketing',      'Digital Marketing',      'SEO, campaigns and content that reach the right audience.'],
  ['software-development',   'Software Development',   'Custom internal tools and line-of-business software.'],
];

const JOBS = [
  ['frontend-engineer', 'Frontend Engineer', 'Build and maintain customer-facing interfaces in React.'],
  ['backend-engineer',  'Backend Engineer',  'Design APIs and data models for client platforms.'],
];

const INTERNSHIPS = [
  ['web-development-internship', 'Web Development Internship', 'Three-month mentored programme covering modern web fundamentals.'],
  ['data-science-internship',    'Data Science Internship',    'Hands-on introduction to data pipelines and applied modelling.'],
];

async function isEmpty(client, table) {
  const { rows } = await client.query(`SELECT COUNT(*) AS n FROM ${table}`);
  return Number(rows[0].n) === 0;
}

/**
 * Seeds only tables that are empty, so restarting the server never overwrites
 * content an admin has edited. Runs on a single checked-out client so the
 * per-table inserts below can each be wrapped in their own transaction.
 */
async function seed() {
  const client = await pool.connect();
  const filled = [];

  try {
    if (await isEmpty(client, 'hero_content')) {
      await client.query(
        `INSERT INTO hero_content
           (id, description, email, phone_primary, phone_secondary, address_display, map_link, updated_at)
         VALUES (1, $1, $2, $3, $4, $5, $6, $7)`,
        [
          HERO.description,
          HERO.email,
          HERO.phone_primary,
          HERO.phone_secondary,
          HERO.address_display,
          HERO.map_link,
          new Date().toISOString(),
        ]
      );
      filled.push('hero_content');
    }

    if (await isEmpty(client, 'socials')) {
      try {
        await client.query('BEGIN');
        for (const s of SOCIALS) {
          await client.query(
            `INSERT INTO socials (platform, label, icon_key, url, sort_order, is_active)
             VALUES ($1, $2, $3, $4, $5, true)`,
            [s.platform, s.label, s.icon_key, s.url, s.sort_order]
          );
        }
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
      filled.push('socials');
    }

    const listTables = [
      ['services', SERVICES],
      ['jobs', JOBS],
      ['internships', INTERNSHIPS],
    ];

    for (const [table, rows] of listTables) {
      if (!(await isEmpty(client, table))) continue;
      try {
        await client.query('BEGIN');
        for (let i = 0; i < rows.length; i += 1) {
          const [slug, name, description] = rows[i];
          await client.query(
            `INSERT INTO ${table} (slug, name, description, sort_order, is_active)
             VALUES ($1, $2, $3, $4, true)`,
            [slug, name, description, i + 1]
          );
        }
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
      filled.push(table);
    }
  } finally {
    client.release();
  }

  return filled;
}

module.exports = { seed };
