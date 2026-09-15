import LegalPage from './LegalPage.jsx';

const LAST_UPDATED = 'March 9, 2026';
const CONTACT_EMAIL = 'info@leafclutchtech.com.np';

const PROGRAMS = [
  'AI & Machine Learning',
  'Full Stack Web Development',
  'Cybersecurity Fundamentals',
  'UI/UX Design Mastery',
  'Graphic Designing Professional',
  'Data Science & Analytics',
];

const SECTIONS = [
  {
    id: 'services',
    title: 'Services',
    body: (
      <>
        <p>
          Leafclutch Technologies provides IT training, internship programs, and software
          development services. Our training programs include but are not limited to:
        </p>
        <ul>
          {PROGRAMS.map((program) => (
            <li key={program}>{program}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'eligibility',
    title: 'Eligibility',
    body: (
      <p>
        Our programs are open to individuals aged 16 and above. By enrolling, you confirm that
        you meet the minimum age requirement and that the information you provide is accurate
        and complete.
      </p>
    ),
  },
  {
    id: 'enrollment-payment',
    title: 'Enrollment & Payment',
    body: (
      <ul>
        <li>Enrollment is confirmed only after the application has been reviewed and accepted by our team.</li>
        <li>Program fees are as listed on our website at the time of enrollment. Prices are subject to change without prior notice for future batches.</li>
        <li>Payment must be made in full before the program begins, unless an installment plan has been agreed upon in writing.</li>
        <li>All fees are in Nepali Rupees (NPR) unless stated otherwise.</li>
      </ul>
    ),
  },
  {
    id: 'refund-policy',
    title: 'Refund Policy',
    body: (
      <ul>
        <li>
          <strong>Before program start:</strong> A full refund will be provided if cancellation
          is requested at least 7 days before the program start date.
        </li>
        <li>
          <strong>Within first week:</strong> A 50% refund may be provided if requested within
          the first 7 days of the program.
        </li>
        <li>
          <strong>After first week:</strong> No refunds will be issued after the first week of
          the program.
        </li>
      </ul>
    ),
  },
  {
    id: 'student-responsibilities',
    title: 'Student Responsibilities',
    body: (
      <>
        <p>As a participant in our programs, you agree to:</p>
        <ul>
          <li>Attend sessions regularly and complete assigned tasks on time</li>
          <li>Treat instructors, mentors, and fellow participants with respect</li>
          <li>Not share, redistribute, or sell course materials without written permission</li>
          <li>Not engage in plagiarism, cheating, or academic dishonesty</li>
          <li>Follow all rules and guidelines communicated by program coordinators</li>
        </ul>
      </>
    ),
  },
  {
    id: 'certificates',
    title: 'Certificates',
    body: (
      <>
        <p>Certificates of completion are awarded upon successful completion of the program, subject to:</p>
        <ul>
          <li>Minimum attendance requirement (80%)</li>
          <li>Completion of all required assignments and projects</li>
          <li>Passing any assessments or evaluations as applicable</li>
        </ul>
        <p>
          Certificates are issued by Leafclutch Technologies Pvt. Ltd. and are not equivalent to
          formal academic degrees or diplomas.
        </p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    body: (
      <p>
        All content on our website, including text, graphics, logos, images, course materials,
        and software, is the property of Leafclutch Technologies Pvt. Ltd. and is protected by
        intellectual property laws. You may not reproduce, distribute, modify, or create
        derivative works from our content without express written permission.
      </p>
    ),
  },
  {
    id: 'website-use',
    title: 'Website Use',
    body: (
      <>
        <p>When using our website, you agree not to:</p>
        <ul>
          <li>Use the website for any unlawful or unauthorized purpose</li>
          <li>Attempt to gain unauthorized access to any part of the website or its systems</li>
          <li>Upload or transmit any malicious code, viruses, or harmful content</li>
          <li>Interfere with or disrupt the website&rsquo;s functionality</li>
          <li>Scrape, crawl, or collect data from the website without permission</li>
        </ul>
      </>
    ),
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    body: (
      <p>
        To the maximum extent permitted by law, Leafclutch Technologies Pvt. Ltd. shall not be
        liable for any indirect, incidental, special, consequential, or punitive damages arising
        from your use of our website or participation in our programs. Our total liability shall
        not exceed the amount you paid for the specific program or service in question.
      </p>
    ),
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer',
    body: (
      <p>
        Our training programs are designed to provide practical skills and knowledge. However,
        we do not guarantee employment, internship placement, or specific career outcomes upon
        completion of any program. Career success depends on individual effort, market
        conditions, and other factors beyond our control.
      </p>
    ),
  },
  {
    id: 'termination',
    title: 'Termination',
    body: (
      <p>
        We reserve the right to terminate or suspend your access to our programs or website at
        any time, without prior notice, if you violate these Terms of Service or engage in
        conduct that is harmful to other participants, our instructors, or our organization.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    body: (
      <p>
        These Terms of Service shall be governed by and construed in accordance with the laws of
        Nepal. Any disputes arising from these terms shall be subject to the exclusive
        jurisdiction of the courts in Rupandehi, Nepal.
      </p>
    ),
  },
  {
    id: 'changes-to-these-terms',
    title: 'Changes to These Terms',
    body: (
      <p>
        We may update these Terms of Service from time to time. Any changes will be posted on
        this page with an updated &ldquo;Last updated&rdquo; date. Continued use of our services
        after changes constitutes acceptance of the revised terms.
      </p>
    ),
  },
  {
    id: 'contact-us',
    title: 'Contact Us',
    body: (
      <>
        <p>If you have any questions about these Terms of Service, please contact us:</p>
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

export default function TermsOfService() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      intro={
        <>
          Welcome to Leafclutch Technologies Pvt. Ltd. (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;). By accessing or using our website{' '}
          <a href="https://leafclutchtech.com.np/" target="_blank" rel="noreferrer noopener">
            leafclutchtech.com.np
          </a>{' '}
          and enrolling in our training and internship programs, you agree to be bound by these
          Terms of Service. If you do not agree to these terms, please do not use our services.
        </>
      }
      sections={SECTIONS}
      tocLabel="Terms of Service sections"
    />
  );
}