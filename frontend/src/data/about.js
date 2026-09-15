// Static content for the About Us page.
// Kept separate from the page component so copy/numbers can be updated
// without touching layout code — mirrors the pattern used by brand.js.

const about = {
  // ---------------------------------------------------------------- Who We Are
  whoWeAre: {
    eyebrow: 'WHO WE ARE',
    oneLiner: 'Designers, developers, and dreamers building digital products that last.',
    description:
      "LeafClutch Technologies is a software engineering studio that partners with " +
      "businesses to design, build, and ship digital products — from web and mobile " +
      "apps to custom AI-driven systems. We work as an extension of our clients' " +
      "teams, combining thoughtful engineering with a genuine curiosity about the " +
      "problems we're solving, so every product we ship is built to be used, not " +
      "just launched.",
  },

  // -------------------------------------------------------------------- Stats
  stats: [
    { label: 'Years of Experience', value: 5, suffix: '+' },
    { label: 'Team Members', value: 20, suffix: '+' },
    { label: 'Projects Delivered', value: 80, suffix: '+' },
    { label: 'Countries Served', value: 6, suffix: '+' },
  ],

  // ---------------------------------------------------------- Mission & Vision
  mission: {
    title: 'Our Mission',
    description:
      'To help businesses of every size compete at an international level by ' +
      'building world-class digital solutions — from branding and web development ' +
      'to custom software and AI-powered products.',
  },
  vision: {
    title: 'Our Vision',
    description:
      "To become our clients' most trusted long-term technology partner — building " +
      'the digital infrastructure that helps the next generation of businesses grow.',
  },

  // ------------------------------------------------------------- Our Values
  // icon keys map to the SVG paths defined in src/components/Icon.jsx
  values: [
    {
      icon: 'heart',
      title: 'Client-First Engineering',
      description:
        'We prioritize understanding your unique challenges and crafting solutions ' +
        'that truly address your needs.',
    },
    {
      icon: 'lightbulb',
      title: 'Innovation with Purpose',
      description:
        'We embrace cutting-edge technologies while ensuring they serve practical ' +
        'business objectives.',
    },
    {
      icon: 'shield',
      title: 'Quality Excellence',
      description:
        'Every line of code, every solution we deliver meets the highest standards ' +
        'of quality and reliability.',
    },
    {
      icon: 'users',
      title: 'Collaborative Partnership',
      description:
        'We work alongside your team, fostering transparency and open communication ' +
        'throughout every project.',
    },
  ],

  // ------------------------------------------------------------- Commitment
  commitment: {
    eyebrow: 'OUR COMMITMENT',
    title: 'Responsible AI Development',
    description:
      'We believe in developing AI solutions that are transparent, fair, and ' +
      'beneficial to all stakeholders. Our approach prioritizes ethical ' +
      "considerations, data privacy, and accountability at every stage of " +
      "development. We're committed to building AI that augments human " +
      'capabilities rather than replacing human judgment.',
  },
};

export default about;
