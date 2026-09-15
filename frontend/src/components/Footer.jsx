import Icon from './Icon.jsx';
import { useSite } from '../context/SiteContext.jsx';
import { PATHS, hrefFor } from '../config/nav.js';
import { navigateOnClick } from '../utils/navigate.js';

const MISSING = '404';

const COMPANY_LINKS = [
  { label: 'Home', href: hrefFor(PATHS.home) },
  { label: 'About Us', href: hrefFor(PATHS.about) },
  { label: 'Services', href: hrefFor(PATHS.services) },
  { label: 'Our Products', href: hrefFor(PATHS.products) },
  { label: 'Contact', href: hrefFor(PATHS.contact) },
];

const RESOURCE_LINKS = [
  { label: 'Blogs & Insights', href: hrefFor(PATHS.blogs) },
  { label: 'FAQs', href: hrefFor(PATHS.faq) },
  { label: 'Privacy Policy', href: hrefFor(PATHS.privacy) },
  { label: 'Terms of Service', href: hrefFor(PATHS.terms) },
];

export default function Footer() {
  const { assets, heroContent, services } = useSite();
  const year = new Date().getFullYear();

  const serviceLinks = [
    { label: 'All Services', href: hrefFor(PATHS.services), key: 'all' },
    ...services.map((s) => ({
      label: s.name,
      href: hrefFor(`${PATHS.services}/${s.slug}`),
      key: s.slug || s.id,
    })),
  ];

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            {/* Footer logo goes home, unlike the navbar logo which scrolls up. */}
            <a href={hrefFor(PATHS.home)} className="footer-logo" aria-label="Leafclutch Technologies — home">
              <img src={assets.logoHorizontal} alt="Leafclutch Technologies" />
            </a>

            <p className="footer-desc">{heroContent.desc}</p>

            <ul className="footer-contact">
              <ContactRow
                icon="mail"
                value={heroContent.email}
                href={heroContent.email !== MISSING ? `mailto:${heroContent.email}` : null}
              />
              {heroContent.emailSecondary && (
                <ContactRow
                  icon="mail"
                  value={heroContent.emailSecondary}
                  href={`mailto:${heroContent.emailSecondary}`}
                />
              )}
              <ContactRow
                icon="phone"
                value={heroContent.contactNumber}
                href={heroContent.contactNumber !== MISSING ? `tel:${heroContent.contactNumber}` : null}
              />
              {heroContent.contactNumberSecondary && (
                <ContactRow
                  icon="phone"
                  value={heroContent.contactNumberSecondary}
                  href={`tel:${heroContent.contactNumberSecondary}`}
                />
              )}
              <ContactRow icon="mapPin" value={heroContent.address} href={heroContent.mapLink} />
            </ul>

            <SocialRow />
          </div>

          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Services" links={serviceLinks} />
          <FooterColumn title="Resources" links={RESOURCE_LINKS} />
        </div>

        <hr className="footer-rule" />

        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} Leafclutch Technologies. All rights reserved.
          </p>

          <nav className="footer-legal" aria-label="Legal">
            <a href={hrefFor(PATHS.privacy)}>Privacy Policy</a>
            <a href={hrefFor(PATHS.terms)}>Terms of Service</a>
            {/* Admin is real and live, unlike the placeholder-linked pages
                above — it always points at /admin and navigates client-side. */}
            <a href={PATHS.admin} className="footer-admin" onClick={navigateOnClick(PATHS.admin)}>
              Admin
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <nav className="footer-col" aria-label={title}>
      {/* Heading is a heading, not a link — only the rows beneath navigate. */}
      <h2 className="footer-col-title">{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.key || link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ContactRow({ icon, value, href }) {
  return (
    <li className="footer-contact-row">
      <Icon name={icon} size={18} />
      {href ? <a href={href}>{value}</a> : <span>{value}</span>}
    </li>
  );
}

function SocialRow() {
  const { socials } = useSite();

  // The backend already drops platforms without a url, so an empty list here
  // means there is nothing to show — render no row at all rather than a gap.
  if (!socials.length) return null;

  return (
    <ul className="footer-socials">
      {socials.map((social) => (
        <li key={social.platform}>
          <a
            href={social.link}
            className="footer-social"
            aria-label={social.label}
            target={social.link.startsWith('http') ? '_blank' : undefined}
            rel={social.link.startsWith('http') ? 'noreferrer noopener' : undefined}
          >
            <Icon name={social.icon} size={20} title={social.label} />
          </a>
        </li>
      ))}
    </ul>
  );
}
