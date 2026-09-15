import Icon from '../components/Icon.jsx';
import ServiceIcon from '../components/ServiceIcon.jsx';
import services from '../data/services.js';
import { useSite } from '../context/SiteContext.jsx';
import { PATHS } from '../config/nav.js';
import { navigateOnClick } from '../utils/navigate.js';
import { buildWhatsAppLink } from '../utils/whatsapp.js';

const MISSING = '404';
const WHATSAPP_GREETING = "Hi! I'd like to know more about your services.";

export default function Services() {
  const { heroContent } = useSite();
  const hasPhone = heroContent.contactNumber && heroContent.contactNumber !== MISSING;

  return (
    <main className="services-page">
      {/* -------------------------------------------------------------- Hero */}
      <section className="services-hero">
        <div className="shell services-hero-inner">
          <span className="services-eyebrow">What We Do</span>
          <h1>Services Built to Move Your Business Forward</h1>
          <p>
            From your first line of code to the infrastructure that keeps you running, here is
            everything we build, ship, and support for our clients.
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------------- Services */}
      <section className="services-section services-section--tight">
        <div className="shell services-grid">
          {services.map((service) => {
            const detailPath = `${PATHS.services}/${service.slug}`;
            return (
              <a
                key={service.slug}
                href={detailPath}
                onClick={navigateOnClick(detailPath)}
                className="service-card"
              >
                <span className="service-card-icon">
                  <ServiceIcon name={service.icon} size={26} />
                </span>
                <h3>{service.name}</h3>
                <p>{service.shortDescription}</p>
                <span className="service-card-link">
                  View Details
                  <Icon name="arrowUpRight" size={15} />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------ CTA */}
      {hasPhone && (
        <section className="contact-cta">
          <div className="shell contact-cta-inner">
            <div className="contact-cta-copy">
              <span className="services-eyebrow services-eyebrow--light">Ready to Start?</span>
              <h2>
                Ready to Build <em>Something Great?</em>
              </h2>
            </div>

            <a
              className="contact-cta-button"
              href={buildWhatsAppLink(heroContent.contactNumber, WHATSAPP_GREETING)}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Icon name="whatsapp" size={20} />
              Chat on WhatsApp
            </a>
          </div>
        </section>
      )}
    </main>
  );
}
