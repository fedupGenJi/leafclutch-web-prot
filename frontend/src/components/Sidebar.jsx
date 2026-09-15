const NAV_ITEMS = [
  { label: 'Dashboard', enabled: false },
  { label: 'Content', enabled: false },
  { label: 'Media', enabled: false },
  { label: 'Brand', enabled: true },
  { label: 'Users', enabled: false },
];

export default function Sidebar({ brand }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={brand.logo} alt="" className="sidebar-logo" />
        <span className="sidebar-name">{brand.siteName}</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.label}
            className={`sidebar-link ${item.enabled ? 'is-active' : 'is-disabled'}`}
          >
            {item.label}
            {!item.enabled && <span className="sidebar-tag">soon</span>}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">Admin workspace</div>
    </aside>
  );
}
