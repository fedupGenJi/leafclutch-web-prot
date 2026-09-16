// Static content for the Services pages (all-services grid + single-service
// detail page). Kept separate from the page components — same pattern as
// data/about.js — so copy, ordering, or a whole new service can be added
// here without touching any layout code.
//
// `icon` keys map to the SVGs in components/ServiceIcon.jsx.

const services = [
  {
    slug: 'web-development',
    name: 'Web Development',
    icon: 'webDev',
    shortDescription:
      'Fast, responsive websites and web applications built to convert visitors and scale with your business.',
    heroDescription:
      'We design and build custom websites and web applications — from marketing sites ' +
      'to full-blown SaaS platforms — using modern frameworks, clean architecture, and a ' +
      'strong focus on performance, accessibility, and SEO from day one.',
    whyChooseUs: [
      'Senior engineers who write maintainable, well-documented code',
      'Mobile-first, accessible builds that work on every device',
      'SEO and performance baked in, not bolted on afterward',
      'Transparent timelines with regular progress check-ins',
    ],
    keyBenefits: [
      'Faster load times that keep visitors on your site',
      'A codebase your future team can actually extend',
      'Higher search rankings from technically sound SEO',
      'A design system that scales as your product grows',
    ],
    techStack: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
  },
  {
    slug: 'mobile-app-development',
    name: 'Mobile App Development',
    icon: 'mobileApp',
    shortDescription:
      'Native-feel iOS and Android apps built from a single codebase, shipped to both stores.',
    heroDescription:
      'From the first wireframe to your App Store and Play Store listings, we build mobile ' +
      'apps that feel fast and native while sharing one codebase across platforms — so you ' +
      'reach every user without doubling your development budget.',
    whyChooseUs: [
      'Cross-platform builds that still feel truly native',
      'Offline-first architecture for unreliable connections',
      'Full store submission and release management handled for you',
      'Post-launch monitoring so issues get caught before users complain',
    ],
    keyBenefits: [
      'One codebase, two app stores — lower build and maintenance cost',
      'Push notifications and deep linking configured out of the box',
      'Smooth animations and native-feeling navigation',
      'Analytics wired in from launch day',
    ],
    techStack: ['React Native', 'Expo', 'Swift', 'Kotlin', 'Firebase', 'GraphQL'],
  },
  {
    slug: 'ui-ux-design',
    name: 'UI/UX Design',
    icon: 'uiUx',
    shortDescription:
      'Research-driven interface design that makes your product intuitive and enjoyable to use.',
    heroDescription:
      'Good design is invisible — it just works. We research how your users actually behave, ' +
      'then design wireframes, prototypes, and polished interfaces that reduce friction and make ' +
      'your product feel effortless.',
    whyChooseUs: [
      'User research and testing, not just visual guesswork',
      'Interactive prototypes you can click through before a line of code is written',
      'A reusable design system, not a one-off set of screens',
      'Designers who work hand-in-hand with our own engineers',
    ],
    keyBenefits: [
      'Higher conversion and sign-up rates from clearer flows',
      'Fewer support tickets from confused users',
      'A consistent look and feel across every screen',
      'Faster future development thanks to a documented design system',
    ],
    techStack: ['Figma', 'Framer', 'Adobe Illustrator', 'Storybook', 'Maze'],
  },
  {
    slug: 'custom-software-development',
    name: 'Custom Software Development',
    icon: 'customSoftware',
    shortDescription:
      'Bespoke internal tools and platforms built around how your business actually operates.',
    heroDescription:
      'Off-the-shelf software forces you to work around its limits. We build custom platforms, ' +
      "internal tools, and integrations shaped around your team's real workflows — so the software " +
      'fits the business, not the other way around.',
    whyChooseUs: [
      'Discovery workshops to map your real workflow before we design anything',
      'Modular architecture built to grow with new requirements',
      'Integrations with the tools you already rely on',
      'Long-term support plans, not just a one-time handoff',
    ],
    keyBenefits: [
      'Software that matches your process instead of forcing a workaround',
      'Fewer manual, error-prone spreadsheet workflows',
      'A single source of truth across teams',
      'Room to extend the system as your business changes',
    ],
    techStack: ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'REST & GraphQL APIs'],
  },
  {
    slug: 'ai-machine-learning',
    name: 'AI & Machine Learning',
    icon: 'aiMl',
    shortDescription:
      'Practical AI features and automation — from chat assistants to predictive models.',
    heroDescription:
      'We build AI-powered features that solve real business problems: intelligent chat ' +
      'assistants, document processing, recommendation engines, and predictive models — ' +
      'designed responsibly, tested thoroughly, and integrated cleanly into your existing product.',
    whyChooseUs: [
      'We start from your business problem, not the latest model release',
      'Responsible-AI practices around data privacy and bias testing',
      'Clear evaluation metrics so you know the model is actually working',
      'Support for both cloud AI APIs and self-hosted models',
    ],
    keyBenefits: [
      'Automation of repetitive, manual work',
      'Faster, more personalized customer experiences',
      'Data-driven decisions from predictive insights',
      'AI features that augment your team rather than replace judgment',
    ],
    techStack: ['Python', 'PyTorch', 'LangChain', 'OpenAI & Claude APIs', 'Vector Databases'],
  },
  {
    slug: 'cloud-devops',
    name: 'Cloud & DevOps',
    icon: 'cloudDevops',
    shortDescription:
      'Reliable cloud infrastructure and CI/CD pipelines so your team can ship without fear.',
    heroDescription:
      'We design cloud infrastructure and deployment pipelines that keep your product online ' +
      'and your team shipping fast — automated testing, one-click deployments, and monitoring ' +
      'that catches problems before your customers do.',
    whyChooseUs: [
      'Infrastructure-as-code, so environments are reproducible and documented',
      'Automated CI/CD pipelines from commit to production',
      'Cost-optimized cloud architecture, not over-provisioned defaults',
      '24/7 monitoring and alerting on the systems that matter',
    ],
    keyBenefits: [
      'Fewer failed deployments and late-night fire drills',
      'Lower cloud bills from right-sized infrastructure',
      'Faster feature releases with automated testing gates',
      'Confidence that the system scales under real traffic',
    ],
    techStack: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
  },
  {
    slug: 'cybersecurity',
    name: 'Cybersecurity Consulting',
    icon: 'cybersecurity',
    shortDescription:
      'Security audits, hardening, and ongoing monitoring to keep your product and data safe.',
    heroDescription:
      'We audit your applications and infrastructure for vulnerabilities, harden them against ' +
      'common attack vectors, and put monitoring in place — so security is a standing practice, ' +
      'not a one-time checkbox before launch.',
    whyChooseUs: [
      'Practical audits focused on your actual attack surface',
      'Clear, prioritized reports — not a 100-page PDF nobody reads',
      'Hands-on remediation support, not just a list of findings',
      'Ongoing monitoring options after the initial audit',
    ],
    keyBenefits: [
      'Fewer exploitable vulnerabilities in production',
      'Compliance-ready documentation for audits and clients',
      'Faster detection and response if something does go wrong',
      'Peace of mind for you and your customers',
    ],
    techStack: ['OWASP ZAP', 'Burp Suite', 'AWS Security Hub', 'SSO / OAuth2', 'SIEM Tooling'],
  },
  {
    slug: 'digital-marketing-seo',
    name: 'Digital Marketing & SEO',
    icon: 'digitalMarketing',
    shortDescription:
      'Search-optimized content and campaigns that bring the right visitors to your site.',
    heroDescription:
      'Building a great product is only half the job — people need to find it. We handle ' +
      'technical and content SEO, campaign strategy, and performance tracking so your ' +
      'marketing spend and organic traffic actually convert into customers.',
    whyChooseUs: [
      'Technical SEO audits that fix what is actually holding rankings back',
      'Content strategy built around real search intent, not keyword stuffing',
      'Transparent reporting tied to business outcomes, not vanity metrics',
      'Campaigns managed by people who also understand the product being sold',
    ],
    keyBenefits: [
      'Higher organic search visibility over time',
      'Better-qualified traffic that is more likely to convert',
      'Clear reporting on what is working and what is not',
      'A content and campaign calendar you can plan around',
    ],
    techStack: ['Google Analytics', 'Search Console', 'SEMrush', 'Meta & Google Ads', 'HubSpot'],
  },
  {
    slug: 'devops-solutions',
    name: 'DevOps Solutions',
    icon: 'cloudDevops',
    shortDescription: 'CI/CD pipelines, cloud infrastructure and release automation.',
    heroDescription:
      'We build the pipelines and infrastructure that let your team ship confidently: automated ' +
      'testing gates, one-click deployments, and cloud environments that are reproducible instead ' +
      'of hand-configured and fragile.',
    whyChooseUs: [
      'Infrastructure-as-code, so every environment is reproducible and documented',
      'Automated CI/CD pipelines from commit to production',
      'Cost-optimized cloud architecture, not over-provisioned defaults',
      '24/7 monitoring and alerting on the systems that matter',
    ],
    keyBenefits: [
      'Fewer failed deployments and late-night fire drills',
      'Lower cloud bills from right-sized infrastructure',
      'Faster feature releases with automated testing gates',
      'Confidence that the system scales under real traffic',
    ],
    techStack: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
  },
  {
    slug: 'data-science-ai',
    name: 'Data Science & AI',
    icon: 'aiMl',
    shortDescription: 'Analytics, machine learning models and AI-assisted workflows.',
    heroDescription:
      'We turn raw data into decisions: analytics pipelines, machine learning models, and AI-assisted ' +
      'workflows built around the questions your business actually needs answered — and tested until ' +
      'you can trust the numbers.',
    whyChooseUs: [
      'We start from the business question, not the latest model release',
      'Clean data pipelines before any model gets trained',
      'Clear evaluation metrics so you know a model is actually working',
      'Responsible-AI practices around data privacy and bias testing',
    ],
    keyBenefits: [
      'Data-driven decisions from predictive insights',
      'Automation of repetitive, manual analysis work',
      'Dashboards and reports your team will actually use',
      'AI features that augment your team rather than replace judgment',
    ],
    techStack: ['Python', 'PyTorch', 'Pandas', 'LangChain', 'Vector Databases'],
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    icon: 'digitalMarketing',
    shortDescription: 'SEO, campaigns and content that reach the right audience.',
    heroDescription:
      'Building a great product is only half the job — people need to find it. We handle technical ' +
      'and content SEO, campaign strategy, and performance tracking so your marketing spend and ' +
      'organic traffic actually convert into customers.',
    whyChooseUs: [
      'Technical SEO audits that fix what is actually holding rankings back',
      'Content strategy built around real search intent, not keyword stuffing',
      'Transparent reporting tied to business outcomes, not vanity metrics',
      'Campaigns managed by people who also understand the product being sold',
    ],
    keyBenefits: [
      'Higher organic search visibility over time',
      'Better-qualified traffic that is more likely to convert',
      'Clear reporting on what is working and what is not',
      'A content and campaign calendar you can plan around',
    ],
    techStack: ['Google Analytics', 'Search Console', 'SEMrush', 'Meta & Google Ads', 'HubSpot'],
  },
  {
    slug: 'software-development',
    name: 'Software Development',
    icon: 'customSoftware',
    shortDescription: 'Custom internal tools and line-of-business software.',
    heroDescription:
      'Off-the-shelf software forces you to work around its limits. We build custom internal tools, ' +
      'line-of-business platforms, and integrations shaped around your team\'s real workflows — so ' +
      'the software fits the business, not the other way around.',
    whyChooseUs: [
      'Discovery workshops to map your real workflow before we design anything',
      'Modular architecture built to grow with new requirements',
      'Integrations with the tools you already rely on',
      'Long-term support plans, not just a one-time handoff',
    ],
    keyBenefits: [
      'Software that matches your process instead of forcing a workaround',
      'Fewer manual, error-prone spreadsheet workflows',
      'A single source of truth across teams',
      'Room to extend the system as your business changes',
    ],
    techStack: ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'REST & GraphQL APIs'],
  },
];

export function getServiceBySlug(slug) {
  return services.find((service) => service.slug === slug) || null;
}

export default services;