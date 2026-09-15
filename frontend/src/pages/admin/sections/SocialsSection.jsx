import CrudManager from '../../../components/admin/CrudManager.jsx';
import { socialsApi } from '../../../api/admin.js';
import Icon from '../../../components/Icon.jsx';

// Icons from the shared set that actually make sense as a social platform
// badge — the utility icons (mail, settings, trash, …) are left out.
const SOCIAL_ICON_KEYS = ['facebook', 'x', 'linkedin', 'instagram', 'youtube', 'tiktok', 'discord'];

const FIELDS = [
  {
    key: 'platform',
    label: 'Platform key',
    type: 'text',
    required: true,
    placeholder: 'instagram',
    hint: 'Unique internal key for this platform (must be unique).',
  },
  { key: 'label', label: 'Display label', type: 'text', placeholder: 'Instagram' },
  { key: 'icon_key', label: 'Icon', type: 'select', required: true, options: SOCIAL_ICON_KEYS },
  { key: 'url', label: 'Profile URL', type: 'url', placeholder: 'https://instagram.com/yourbrand', span: 'full' },
];

export default function SocialsSection() {
  return (
    <CrudManager
      noun="social link"
      nounPlural="socials"
      description="Manage the social platforms linked in the site footer."
      fields={FIELDS}
      api={socialsApi}
      titleKey="label"
      titleFallbackKey="platform"
      renderMeta={(item) => (
        <p className="admin-list-desc admin-list-desc-row">
          <Icon name={item.icon_key} size={14} />
          {item.url || 'No URL set'}
        </p>
      )}
    />
  );
}