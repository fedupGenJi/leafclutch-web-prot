import Icon from '../components/Icon.jsx';
import ServiceIcon from '../components/ServiceIcon.jsx';
import { getServiceBySlug } from '../data/services.js';
import { useSite } from '../context/SiteContext.jsx';
import { PATHS } from '../config/nav.js';
import { navigateOnClick } from '../utils/navigate.js';
import { buildWhatsAppLink } from '../utils/whatsapp.js';

const MISSING = '404';

export default function ServiceDetail({ slug }) {
  const { heroContent } = useSite();
  const service = getServiceBySlug(slug);
  const hasPhone = heroContent.contactNumber && heroContent.contactNumber !== MISSING;

  if (!service) {
    return (
      <main className="service-detail-page">
        <div className="shell service-detail-empty">
          <span className="services-eyebrow">Not Found</span>
          <h1>We couldn&rsquo;t find that service</h1>
          <p>It may have moved or no longer exists. Take a look at everything we offer instead.</p>
          <a
            className="service-back-link"
            href={PATHS.services}
            onClick={navigateOnClick(PATHS.services)}
          >
            <Icon name="arrowUpRight" size={15} />
            Back to All Services
          </a>
        </div>
      </main>
    );
  }

  const whatsappMessage = `Hi! I'd like to know more about your ${service.name} service.`;

  return (
    <main className="service-detail-page">
      {/* -------------------------------------------------------------- Hero */}
      <section className="service-detail-hero">
        <div className="shell service-detail-hero-inner">
          <a
            className="service-back-link"
            href={PATHS.services}
            onClick={navigateOnClick(PATHS.services)}
          >
            <Icon name="arrowUpRight" size={14} />
            All Services
          </a>

          <div className="service-detail-heading">
            <span className="service-detail-icon">
              <ServiceIcon name={service.icon} size={30} />
            </span>
            <h1>{service.name}</h1>
          </div>

          <p>{service.heroDescription}</p>
        </div>
      </section>

      {/* ----------------------------------------------------------- Why Us */}
      <section className="services-section services-section--tight">
        <div className="shell">
          <div className="service-section-head">
            <span className="services-eyebrow">Why Choose Us</span>
            <h2>What Sets Our {service.name} Apart</h2>
          </div>

          <div className="service-why-grid">
            {service.whyChooseUs.map((reason) => (
              <div className="service-why-item" key={reason}>
                <span className="service-why-icon">
                  <Icon name="check" size={14} />
                </span>
                <p>{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Key Benefits */}
      <section className="services-section services-section--tight">
        <div className="shell">
          <div className="service-section-head">
            <span className="services-eyebrow">Key Benefits</span>
            <h2>What You Get</h2>
          </div>

          <div className="service-benefits-grid">
            {service.keyBenefits.map((benefit, index) => (
              <div className="service-benefit-card" key={benefit}>
                <span className="service-benefit-index">{String(index + 1).padStart(2, '0')}</span>
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Tech Stack */}
      <section className="services-section services-section--tight">
        <div className="shell">
          <div className="service-section-head">
            <span className="services-eyebrow">Our Tech Stack</span>
            <h2>Tools We Build With</h2>
          </div>

          <ul className="service-tech-list">
            {service.techStack.map((tech) => (
              <li className="service-tech-chip" key={tech}>
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------------ CTA */}
      {hasPhone && (
        <section className="contact-cta">
          <div className="shell contact-cta-inner">
            <div className="contact-cta-copy">
              <span className="services-eyebrow services-eyebrow--light">Ready to Build?</span>
              <h2>
                Let&rsquo;s Build Your <em>{service.name}</em>
              </h2>
            </div>

            <a
              className="contact-cta-button"
              href={buildWhatsAppLink(heroContent.contactNumber, whatsappMessage)}
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
