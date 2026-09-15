import LegalPage from './LegalPage.jsx';

const LAST_UPDATED = 'March 9, 2026';
const CONTACT_EMAIL = 'info@leafclutchtech.com.np';

const SECTIONS = [
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    body: (
      <>
        <h3>Personal Information</h3>
        <p>
          When you enroll in our programs, contact us, or interact with our website, we may
          collect:
        </p>
        <ul>
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>LinkedIn profile URL (optional)</li>
          <li>Current semester / educational status</li>
          <li>Course preferences</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <p>When you visit our website, we may automatically collect certain information, including:</p>
        <ul>
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device type and operating system</li>
          <li>Pages visited and time spent</li>
          <li>Referring website or source</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use-your-information',
    title: 'How We Use Your Information',
    body: (
      <>
        <p>We use the collected information to:</p>
        <ul>
          <li>Process your enrollment and training applications</li>
          <li>Communicate with you about programs, schedules, and updates</li>
          <li>Respond to your inquiries and provide customer support</li>
          <li>Send relevant educational content and announcements</li>
          <li>Improve our website, programs, and services</li>
          <li>Comply with legal obligations</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-share-your-information',
    title: 'How We Share Your Information',
    body: (
      <>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may
          share your information only in the following circumstances:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong> With trusted third-party services (e.g., email,
            hosting, analytics) that help us operate our website and programs, under strict
            confidentiality agreements.
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by law, court order, or
            governmental regulation.
          </li>
          <li>
            <strong>With Your Consent:</strong> When you explicitly agree to share your
            information for a specific purpose.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-security',
    title: 'Data Security',
    body: (
      <p>
        We implement appropriate technical and organizational security measures to protect your
        personal information against unauthorized access, alteration, disclosure, or destruction.
        However, no method of transmission over the Internet is 100% secure, and we cannot
        guarantee absolute security.
      </p>
    ),
  },
  {
    id: 'third-party-links',
    title: 'Third-Party Links',
    body: (
      <p>
        Our website may contain links to third-party websites (e.g., LinkedIn, WhatsApp, Udemy).
        We are not responsible for the privacy practices or content of these external sites. We
        encourage you to review their privacy policies before providing any personal information.
      </p>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies',
    body: (
      <p>
        Our website may use cookies and similar tracking technologies to enhance your browsing
        experience. You can control cookie preferences through your browser settings. Disabling
        cookies may affect certain features of the website.
      </p>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    body: (
      <>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal data</li>
          <li>Opt out of marketing communications at any time</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
  {
    id: 'childrens-privacy',
    title: "Children's Privacy",
    body: (
      <p>
        Our services are not directed to individuals under the age of 16. We do not knowingly
        collect personal information from children. If we learn that we have collected personal
        information from a child under 16, we will take steps to delete that information.
      </p>
    ),
  },
  {
    id: 'changes-to-this-policy',
    title: 'Changes to This Policy',
    body: (
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this
        page with an updated &ldquo;Last updated&rdquo; date. We encourage you to review this
        policy periodically.
      </p>
    ),
  },
  {
    id: 'contact-us',
    title: 'Contact Us',
    body: (
      <>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <ul className="legal-contact-list">
          <li>
            <span>Email</span>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </li>
          <li>
            <span>Website</span>
            <a href="https://leafclutchtech.com.np/" target="_blank" rel="noreferrer noopener">
              leafclutchtech.com.np
            </a>
          </li>
        </ul>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro={
        <>
          Leafclutch Technologies Pvt. Ltd. (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) is committed to protecting the privacy of our website visitors,
          students, and users. This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you visit our website{' '}
          <a href="https://leafclutchtech.com.np/" target="_blank" rel="noreferrer noopener">
            leafclutchtech.com.np
          </a>{' '}
          or enroll in our programs.
        </>
      }
      sections={SECTIONS}
      tocLabel="Privacy policy sections"
    />
  );
}