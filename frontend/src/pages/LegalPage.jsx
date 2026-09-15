import { useEffect, useState } from 'react';

// Shared shell for legal pages (hero + tracking table of contents + numbered
// sections). Both Privacy Policy and Terms of Service are long, static,
// section-based documents, so the layout and scroll-tracking behavior live
// here once instead of being duplicated per page.
export default function LegalPage({
  eyebrow,
  title,
  lastUpdated,
  intro,
  sections,
  tocLabel,
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  // Highlights whichever section heading is currently nearest the top of the
  // viewport, so the table of contents tracks scroll position on desktop.
  useEffect(() => {
    const headings = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!headings.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="shell legal-hero-inner">
          {eyebrow && <span className="legal-eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {lastUpdated && <p className="legal-updated">Last updated: {lastUpdated}</p>}
          {intro && <p className="legal-intro">{intro}</p>}
        </div>
      </section>

      <div className="shell legal-body">
        <nav className="legal-toc" aria-label={tocLabel}>
          <p className="legal-toc-title">On this page</p>
          <ol>
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={activeId === section.id ? 'is-current' : ''}
                >
                  <span className="legal-toc-index">{String(index + 1).padStart(2, '0')}</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="legal-content">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="legal-section">
              <h2>
                <span className="legal-section-number">{index + 1}</span>
                {section.title}
              </h2>
              {section.body}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}