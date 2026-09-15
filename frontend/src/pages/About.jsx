import Icon from '../components/Icon.jsx';
import about from '../data/about.js';

const { whoWeAre, stats, mission, vision, values, commitment } = about;

export default function About() {
  return (
    <main className="about-page">
      {/* ------------------------------------------------------- Who We Are */}
      <section className="about-section about-hero">
        <div className="shell about-hero-inner">
          <span className="about-eyebrow">{whoWeAre.eyebrow}</span>
          <h1>Who We Are</h1>
          <p className="about-oneliner">{whoWeAre.oneLiner}</p>
          <p className="about-description">{whoWeAre.description}</p>
        </div>
      </section>

      {/* ------------------------------------------------------------ Stats */}
      <section className="about-stats-section">
        <div className="shell about-stats-grid">
          {stats.map((stat) => (
            <div className="about-stat" key={stat.label}>
              <span className="about-stat-value">
                {stat.value}
                <span>{stat.suffix}</span>
              </span>
              <span className="about-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------- Mission & Vision */}
      <section className="about-section">
        <div className="shell">
          <div className="about-section-head">
            <span className="about-eyebrow">OUR PURPOSE</span>
            <h2>Mission &amp; Vision</h2>
          </div>

          <div className="about-mv-grid">
            <div className="about-mv-card">
              <span className="about-mv-icon">
                <Icon name="arrowUpRight" size={22} />
              </span>
              <h3>{mission.title}</h3>
              <p>{mission.description}</p>
            </div>

            <div className="about-mv-card">
              <span className="about-mv-icon">
                <Icon name="eye" size={22} />
              </span>
              <h3>{vision.title}</h3>
              <p>{vision.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Values */}
      <section className="about-section about-section--tight">
        <div className="shell">
          <div className="about-section-head">
            <span className="about-eyebrow">OUR VALUES</span>
            <h2>What Drives Us Forward</h2>
          </div>

          <div className="about-values-grid">
            {values.map((value) => (
              <div className="about-value-card" key={value.title}>
                <span className="about-value-icon">
                  <Icon name={value.icon} size={22} />
                </span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Commitment */}
      <section className="about-commitment-section">
        <div className="shell about-commitment-inner">
          <span className="about-eyebrow about-eyebrow--light">{commitment.eyebrow}</span>
          <h2>{commitment.title}</h2>
          <p>{commitment.description}</p>
        </div>
      </section>
    </main>
  );
}
