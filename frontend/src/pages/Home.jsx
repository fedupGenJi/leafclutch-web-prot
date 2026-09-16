import { useState } from 'react';
import { motion } from 'motion/react';
import Icon from '../components/Icon.jsx';
import ServiceIcon from '../components/ServiceIcon.jsx';
import AnimatedCounter from '../components/AnimatedCounter.jsx';
import brand from '../brand.js';
import home from '../data/home.js';
import about from '../data/about.js';
import services from '../data/services.js';
import { PATHS } from '../config/nav.js';
import { navigateOnClick } from '../utils/navigate.js';

const { hero, offerings, impact, whyChooseUs } = home;

// Picked once per mount so the pair doesn't shuffle on every re-render/scroll —
// a visitor should see the same two services for the length of their visit.
function pickRandomServices(list, count = 2) {
  const pool = [...list];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export default function Home() {
  const [featuredServices] = useState(() => pickRandomServices(services, 2));

  return (
    <main className="home-page">
      {/* -------------------------------------------------------------- Hero */}
      <section className="home-hero">
        <div className="shell home-hero-shell">
          <div className="home-hero-grid">
            <div className="home-hero-content">
              <motion.span
                className="home-eyebrow"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {hero.eyebrow}
              </motion.span>

              <div className="home-headline-frame">
                <span className="home-headline-glow" aria-hidden="true" />
                <motion.h1
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {hero.headline}
                </motion.h1>
              </div>

              <motion.div
                className="home-hero-brand"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.22 }}
              >
                <span className="home-hero-company">{brand.siteName}</span>
                <p className="home-hero-desc">{hero.description}</p>
              </motion.div>

              <motion.div
                className="home-hero-actions"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32 }}
              >
                <a
                  className="home-cta-primary"
                  href={hero.primaryCta.path}
                  onClick={navigateOnClick(hero.primaryCta.path)}
                >
                  {hero.primaryCta.label}
                  <Icon name="arrowUpRight" size={16} />
                </a>
                <a
                  className="home-cta-secondary"
                  href={hero.secondaryCta.path}
                  onClick={navigateOnClick(hero.secondaryCta.path)}
                >
                  {hero.secondaryCta.label}
                </a>
              </motion.div>
            </div>

            <div className="home-hero-visual" aria-hidden="true">
              <img src={hero.visual} alt="" />
            </div>
          </div>

          <div className="home-scroll-cue">
            <span>{hero.scrollHint}</span>
            <span className="home-scroll-mouse">
              <span className="home-scroll-dot" />
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- What We Offer */}
      <section className="home-section">
        <div className="shell">
          <div className="home-section-head">
            <span className="home-eyebrow">{offerings.eyebrow}</span>
            <h2>{offerings.title}</h2>
            <p>{offerings.description}</p>
          </div>

          <div className="home-services-grid">
            {featuredServices.map((service) => {
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

          <div className="home-services-cta">
            <a
              className="home-cta-secondary"
              href={offerings.cta.path}
              onClick={navigateOnClick(offerings.cta.path)}
            >
              {offerings.cta.label}
              <Icon name="arrowUpRight" size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Impact */}
      <section className="home-impact-section">
        <div className="shell">
          <div className="home-section-head home-section-head--light">
            <span className="home-eyebrow home-eyebrow--light">{impact.eyebrow}</span>
            <h2>{impact.title}</h2>
            <p>{impact.description}</p>
          </div>

          <div className="home-impact-grid">
            {about.stats.map((stat) => (
              <div className="home-impact-stat" key={stat.label}>
                <span className="home-impact-value">
                  <AnimatedCounter value={stat.value} />
                  <span>{stat.suffix}</span>
                </span>
                <span className="home-impact-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Why Choose Us */}
      <section className="home-section">
        <div className="shell">
          <div className="home-why-head">
            <span className="home-eyebrow">{whyChooseUs.eyebrow}</span>
            <h2>{whyChooseUs.title}</h2>
            <p>{whyChooseUs.description}</p>
          </div>

          <div className="home-why-grid">
            {whyChooseUs.cards.map((card, index) => (
              <div className={`home-why-card home-why-card--${index}`} key={card.title}>
                <span className="home-why-icon">
                  <Icon name={card.icon} size={22} />
                </span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
