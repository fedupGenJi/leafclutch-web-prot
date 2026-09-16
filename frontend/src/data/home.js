// Static content for the Home page.
// Kept separate from the page component so copy can be updated without
// touching layout code — mirrors the pattern used by about.js / services.js.

import brand from '../brand.js';

const home = {
  // ------------------------------------------------------------------- Hero
  hero: {
    eyebrow: brand.motto,
    headline: 'We Build Digital Products That Businesses Actually Grow With',
    description:
      `${brand.siteName} is a software engineering studio that partners with ` +
      "businesses to design, build, and ship products that last — from web and " +
      "mobile apps to custom, AI-driven systems tailored to how you work.",
    primaryCta: { label: 'Start a Project', path: '/contact' },
    secondaryCta: { label: 'Explore Services', path: '/services' },
    scrollHint: 'Scroll to Explore',
    // Dropped in later — file lives at /public/first.svg once exported from design.
    visual: '/first.svg',
  },

  // ------------------------------------------------------------- What We Offer
  offerings: {
    eyebrow: 'WHAT WE OFFER',
    title: 'Services Built Around Your Goals',
    description:
      'A snapshot of how we help businesses design, build, and scale — see the ' +
      'full list to find the right fit for your project.',
    cta: { label: 'View All Services', path: '/services' },
  },

  // ------------------------------------------------------------------ Impact
  impact: {
    eyebrow: 'OUR IMPACT',
    title: 'Numbers That Speak for Themselves',
    description: 'Years of shipping real products for real businesses, measured.',
  },

  // ------------------------------------------------------------- Why Choose Us
  // No equivalent section exists in data/about.js, so it lives here instead.
  whyChooseUs: {
    eyebrow: `WHY ${brand.siteName.toUpperCase()}`,
    title: `Why Businesses Choose ${brand.siteName}`,
    description: 'We are not just another agency. We are a long-term partner invested in your growth.',
    cards: [
      {
        icon: 'lightbulb',
        title: 'Creative Expertise',
        description:
          'Our team blends creativity with smart planning to develop designs and digital products that really get noticed.',
      },
      {
        icon: 'shield',
        title: 'Solutions Made for You',
        description:
          "We don't reuse the same template for everyone. Every project is built for your brand, your goals, and your audience.",
      },
      {
        icon: 'list',
        title: 'Everything You Need in One Place',
        description:
          "We do it all — design, development, marketing, and content — so operations flow seamlessly under one roof.",
      },
      {
        icon: 'check',
        title: 'Always on Time',
        description:
          'We value your time. Expect timely deliveries without compromising on quality.',
      },
      {
        icon: 'heart',
        title: "Support That's There for You",
        description:
          'Our relationship does not end at delivery. We offer continued support and improvements whenever you need them.',
      },
    ],
  },
};

export default home;
