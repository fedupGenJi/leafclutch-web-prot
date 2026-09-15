// Single source of truth for brand values.
// Previously these were fetched from the admin brand API; now they are static,
// so the site has no backend dependency and nothing to load before first paint.

export const brand = {
  siteName: 'LeafClutch',
  legalSuffix: 'Technologies Pvt. Ltd.',
  motto: 'Empowering Innovations & Innovators',
  logo: '/brandIcon.png',
  colors: {
    primary: '#002060',
    secondary: '#10E090',
    accent: '#10E090',
    background: '#F6F7F4',
    surface: '#FFFFFF',
    text: '#0B1220',
  },
};

export default brand;
