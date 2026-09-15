import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { useSite } from '../context/SiteContext.jsx';
import { sendContactMessage } from '../api/contact.js';
import brand from '../brand.js';

const MISSING = '404';

const WHATSAPP_GREETING = "Hi! I'd like to know more about Leafclutch's services.";

function digitsOnly(value) {
  return (value || '').replace(/\D/g, '');
}

// wa.me needs a country code ahead of the number. The CMS stores Nepali
// mobile numbers as 10 digits ("98XXXXXXXX"), so anything that short gets
// "977" prefixed; a number that's already longer is assumed to include one.
function buildWhatsAppLink(phone, message) {
  const digits = digitsOnly(phone);
  if (!digits) return null;
  const withCountryCode = digits.length <= 10 ? `977${digits}` : digits;
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${withCountryCode}${query}`;
}

// Prefer embedding the admin-provided map link itself rather than
// re-geocoding the plain address text. Two shapes of mapLink are handled
// differently:
//  - a Maps "Embed a map" src (host google.com, path /maps/embed, with a
//    `pb=` param) is Google's own generated embed for that exact listing —
//    it's the only route that renders the full place card (rating, review
//    count, name, directions button); passed through untouched.
//  - any other full google.com/maps link (a place page, a share link, a
//    @lat,lng view) gets `output=embed` appended, which frames that view
//    but only ever shows a bare pin, not the rating/review card.
// Short maps.app.goo.gl links redirect through a domain that can't be
// framed, so those (and a missing mapLink) fall back to an address search.
function buildMapEmbedSrc(mapLink, address, zoom = 18) {
  if (mapLink) {
    try {
      const url = new URL(mapLink);
      if (url.hostname.includes('google.')) {
        if (url.pathname.startsWith('/maps/embed')) return url.toString();
        url.searchParams.set('output', 'embed');
        return url.toString();
      }
    } catch {
      // not a valid absolute URL — fall through
    }
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=${zoom}&output=embed`;
}

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  interests: [],
};

export default function Contact() {
  const { heroContent, socials, services } = useSite();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  // idle | sending | sent | failed — drives the submit button and the note
  // beneath it while the backend request for handleSubmit is in flight.
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const hasAddress = heroContent.address && heroContent.address !== MISSING;
  const hasEmail = heroContent.email && heroContent.email !== MISSING;
  const hasPhone = heroContent.contactNumber && heroContent.contactNumber !== MISSING;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleInterest(name) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(name)
        ? prev.interests.filter((i) => i !== name)
        : [...prev.interests, name],
    }));
  }

  function validate() {
    const next = {};
    if (!form.firstName.trim()) next.firstName = 'Required';
    if (!form.lastName.trim()) next.lastName = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email';
    if (!form.phone.trim()) next.phone = 'Required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // Submitting the form now hands off to the backend, which is responsible
  // for emailing the team with these details — the WhatsApp deep link
  // further down the page is still there as a separate, direct channel, but
  // the form itself no longer builds one.
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('sending');
    setStatusMessage('');

    try {
      await sendContactMessage({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        interests: form.interests,
      });

      setStatus('sent');
      setStatusMessage("Thanks — we've got your message and will be in touch shortly.");
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      setStatus('failed');
      setStatusMessage(err.message || 'Something went wrong sending your message. Please try again.');
    }
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="shell contact-hero-grid">
          <div className="contact-intro">
            <span className="contact-eyebrow">Get in Touch</span>
            <h1>Let&rsquo;s Talk About Your Project</h1>
            <p className="contact-lede">
              Whether you have a project in mind, a question about our training programs, or
              you&rsquo;d just like to say hello — our team is always happy to hear from you.
            </p>

            {(hasAddress || hasEmail || hasPhone) && (
              <ul className="contact-info-list">
                {hasAddress && (
                  <li className="contact-info-card">
                    <span className="contact-info-icon">
                      <Icon name="mapPin" size={20} />
                    </span>
                    <div>
                      <p className="contact-info-label">Our Office</p>
                      <p className="contact-info-value">{heroContent.address}</p>
                    </div>
                  </li>
                )}

                {hasEmail && (
                  <li className="contact-info-card">
                    <span className="contact-info-icon">
                      <Icon name="mail" size={20} />
                    </span>
                    <div>
                      <p className="contact-info-label">Email Us</p>
                      <p className="contact-info-value">
                        <a href={`mailto:${heroContent.email}`}>{heroContent.email}</a>
                      </p>
                      {heroContent.emailSecondary && (
                        <p className="contact-info-value">
                          <a href={`mailto:${heroContent.emailSecondary}`}>
                            {heroContent.emailSecondary}
                          </a>
                        </p>
                      )}
                    </div>
                  </li>
                )}

                {hasPhone && (
                  <li className="contact-info-card">
                    <span className="contact-info-icon">
                      <Icon name="phone" size={20} />
                    </span>
                    <div>
                      <p className="contact-info-label">Call Us</p>
                      <p className="contact-info-value">
                        <a href={`tel:${heroContent.contactNumber}`}>{heroContent.contactNumber}</a>
                      </p>
                      {heroContent.contactNumberSecondary && (
                        <p className="contact-info-value">
                          <a href={`tel:${heroContent.contactNumberSecondary}`}>
                            {heroContent.contactNumberSecondary}
                          </a>
                        </p>
                      )}
                    </div>
                  </li>
                )}
              </ul>
            )}

            {socials.length > 0 && (
              <div className="contact-socials">
                <p className="contact-info-label">Follow Us</p>
                <ul>
                  {socials.map((social) => (
                    <li key={social.platform}>
                      <a
                        href={social.link}
                        className="contact-social"
                        aria-label={social.label}
                        target={social.link.startsWith('http') ? '_blank' : undefined}
                        rel={social.link.startsWith('http') ? 'noreferrer noopener' : undefined}
                      >
                        <Icon name={social.icon} size={18} title={social.label} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <h2>Send Us a Message</h2>
            <p className="contact-form-sub">
              Fill in the form and we&rsquo;ll get back to you shortly.
            </p>

            <div className="contact-form-row">
              <Field label="First Name" required error={errors.firstName}>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  placeholder="Your first name"
                  autoComplete="given-name"
                />
              </Field>
              <Field label="Last Name" required error={errors.lastName}>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  placeholder="Your last name"
                  autoComplete="family-name"
                />
              </Field>
            </div>

            <Field label="Email Address" required error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Phone Number" required error={errors.phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+977 98XXXXXXXX"
                autoComplete="tel"
              />
            </Field>

            <Field label="Your Message">
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                placeholder="Tell us about your project or ask us anything..."
              />
            </Field>

            {services.length > 0 && (
              <div className="contact-interests">
                <p className="contact-info-label">Interested in (optional)</p>
                <div className="contact-chip-row">
                  {services.map((service) => {
                    const selected = form.interests.includes(service.name);
                    return (
                      <button
                        type="button"
                        key={service.slug || service.id}
                        className={`contact-chip ${selected ? 'is-selected' : ''}`}
                        aria-pressed={selected}
                        onClick={() => toggleInterest(service.name)}
                      >
                        {service.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button type="submit" className="contact-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Message'}
              <Icon name="mail" size={18} />
            </button>
            {statusMessage ? (
              <p className={`contact-form-note ${status === 'failed' ? 'contact-form-note--error' : ''}`}>
                {statusMessage}
              </p>
            ) : (
              <p className="contact-form-note">
                Fill in the form above and we&rsquo;ll email you back shortly.
              </p>
            )}
          </form>
        </div>
      </section>

      {hasAddress && (
        <section className="contact-map-section">
          <div className="shell contact-map-heading">
            <span className="contact-eyebrow">Find Us</span>
            <h2>Come Say Hello</h2>
          </div>

          <div className="shell contact-map-frame">
            <div className="contact-map-card">
              <p className="contact-map-card-title">
                {brand.siteName} {brand.legalSuffix}
              </p>
              <p className="contact-map-card-address">{heroContent.address}</p>
              {heroContent.mapLink && (
                <a
                  className="contact-map-card-link"
                  href={heroContent.mapLink}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Open in Google Maps
                  <Icon name="arrowUpRight" size={16} />
                </a>
              )}
            </div>

            <iframe
              className="contact-map-iframe"
              title="Our office location"
              src={buildMapEmbedSrc(heroContent.mapLink, heroContent.address)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      )}

      {hasPhone && (
        <section className="contact-cta">
          <div className="shell contact-cta-inner">
            <div className="contact-cta-copy">
              <span className="contact-eyebrow contact-eyebrow--light">Ready to Start?</span>
              <h2>
                Let&rsquo;s Build Something <em>Extraordinary</em>
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

function Field({ label, required, error, children }) {
  return (
    <label className="contact-field">
      <span className="contact-field-label">
        {label}
        {required && <span className="contact-required">*</span>}
      </span>
      {children}
      {error && <span className="contact-field-error">{error}</span>}
    </label>
  );
}
