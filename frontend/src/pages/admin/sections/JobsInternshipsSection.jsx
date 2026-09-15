import { useState } from 'react';
import CrudManager from '../../../components/admin/CrudManager.jsx';
import { jobsApi, internshipsApi } from '../../../api/admin.js';

const LISTING_FIELDS = [
  { key: 'name', label: 'Title', type: 'text', required: true, placeholder: 'Frontend Engineer' },
  {
    key: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    placeholder: 'frontend-engineer',
    hint: 'Used in the URL — lowercase, hyphenated, no spaces.',
  },
  { key: 'location', label: 'Location', type: 'text', placeholder: 'Kathmandu · Remote' },
  { key: 'apply_link', label: 'Apply link', type: 'url', placeholder: 'https://…' },
  { key: 'description', label: 'Description', type: 'textarea', span: 'full' },
];

const TABS = [
  { key: 'jobs', label: 'Jobs', api: jobsApi, noun: 'job', nounPlural: 'jobs' },
  { key: 'internships', label: 'Internships', api: internshipsApi, noun: 'internship', nounPlural: 'internships' },
];

export default function JobsInternshipsSection() {
  const [tab, setTab] = useState('jobs');
  const active = TABS.find((t) => t.key === tab);

  return (
    <div className="admin-section-tabbed">
      <header className="admin-section-header admin-section-header-tabbed">
        <div>
          <h1>Jobs &amp; Internships</h1>
          <p>Manage the openings shown on the Training &amp; Internship page.</p>
        </div>
      </header>

      <div className="admin-tabs" role="tablist" aria-label="Listing type">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={`admin-tab ${tab === t.key ? 'is-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Remounting on tab switch (via key) keeps each listing type's list,
          editor and confirmation state fully independent. */}
      <CrudManager
        key={active.key}
        noun={active.noun}
        nounPlural={active.nounPlural}
        description={
          active.key === 'jobs'
            ? 'Open roles shown to job seekers.'
            : 'Internship openings shown to students and recent grads.'
        }
        fields={LISTING_FIELDS}
        api={active.api}
        titleKey="name"
        subtitleKey="slug"
        subtitlePrefix="/"
        autoSlugFrom="name"
        renderMeta={(item) => (
          <p className="admin-list-desc">
            {[item.location, item.apply_link].filter(Boolean).join(' · ') || null}
            {item.description ? (
              <>
                {(item.location || item.apply_link) && <br />}
                {item.description}
              </>
            ) : null}
          </p>
        )}
      />
    </div>
  );
}