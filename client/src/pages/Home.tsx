import { ArrowUpRight, CalendarDays, ChevronRight, FileText, Languages, Menu, ScrollText, Sparkles, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import type { Lang, SiteContent, TimelineEntry } from "../content";
import { content, siteMeta } from "../content.generated";

function PhotoBlock({ portrait, label, note }: { portrait: string; label: string; note: string }) {
  if (portrait) {
    return (
      <div className="photo-frame">
        <img src={portrait} alt={label} />
      </div>
    );
  }
  return (
    <div className="photo-placeholder">
      <div className="photo-placeholder-frame">
        <span className="pp-bookplate" aria-hidden="true">
          {label.slice(0, 1)}
        </span>
        <strong>{label}</strong>
        <span>
          {note.split("\n").map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

function MailCta({ t, email }: { t: SiteContent["connect"]; email: string }) {
  return (
    <div className="contact-form">
      <div className="contact-form-actions">
        <a className="scholar-button scholar-button-lime" href={`mailto:${email}`}>
          {t.buttonLabel}
          <ArrowUpRight size={16} />
        </a>
      </div>
      <p className="contact-form-note">
        {t.emailLabel}：<a className="scholar-text-link" href={`mailto:${email}`}>{email}</a>
      </p>
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Lang>(siteMeta.defaultLanguage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineEntry | null>(null);
  const [location, setLocation] = useLocation();
  const t = content[language] as SiteContent;
  const isZh = language === "zh";
  const page = location === "/" ? "home" : location.replace("/", "") || "home";
  const go = (path: string) => {
    setMenuOpen(false);
    setLocation(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    document.documentElement.lang = isZh ? "zh-Hant" : "en";
  }, [isZh]);

  const paths = siteMeta.routes;

  return (
    <div className="scholar-shell">
      <div className="scholar-noise" />
      <header className="scholar-header">
        <button className="scholar-brand" onClick={() => go("/")}>
          <span className="scholar-brand-mark">王</span>
          <span>
            <strong>WANG XIAOMIN</strong>
            <small>{t.chrome.brandSub}</small>
          </span>
        </button>
        <nav className={menuOpen ? "scholar-nav is-open" : "scholar-nav"}>
          {t.chrome.nav.map((label, index) => (
            <button
              key={label}
              className={paths[index].slice(1) === page || (index === 0 && page === "home") ? "is-current" : ""}
              onClick={() => go(paths[index])}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="scholar-actions">
          <button className="scholar-language" onClick={() => setLanguage(isZh ? "en" : "zh")}>
            <Languages size={15} />
            {isZh ? "EN" : "中文"}
          </button>
          <button className="scholar-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={t.chrome.openMenu}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>
      <main>
        {page === "home" && (
          <>
            <section className="scholar-hero">
              <div className="scholar-hero-copy">
                <div className="scholar-eyebrow">
                  <span className="pulse-dot" />
                  {t.hero.eyebrow}
                </div>
                <h1>
                  {t.hero.title}
                  <br />
                  <em>{t.hero.titleEm}</em>
                </h1>
                <div className="scholar-intro" dangerouslySetInnerHTML={{ __html: t.hero.bodyHtml }} />
                <div className="scholar-hero-actions">
                  <button className="scholar-button scholar-button-dark" onClick={() => go(t.hero.explorePath)}>
                    {t.hero.exploreLabel}
                    <ArrowUpRight size={16} />
                  </button>
                  <button className="scholar-text-link" onClick={() => go(t.hero.meetPath)}>
                    {t.hero.meetLabel}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <PhotoBlock portrait={t.hero.portrait} label={t.hero.photoLabel} note={t.hero.photoNote} />
            </section>
            <section className="scholar-section scholar-section-paper">
              <div className="scholar-section-tag">{t.home.tag}</div>
              <div className="scholar-split">
                <div>
                  <h2>{t.home.title}</h2>
                  <div className="scholar-lede" dangerouslySetInnerHTML={{ __html: t.home.bodyHtml }} />
                </div>
                <div className="home-picks">
                  <article className="pick-col">
                    <div className="pick-tag">{t.expertise.tag}</div>
                    <h3>{t.expertise.title}</h3>
                    <ul>
                      {t.expertise.capabilities.slice(0, 3).map((cap) => (
                        <li key={cap.title}>
                          <strong>{cap.title}</strong>
                          <span>{cap.detail}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="pick-more" onClick={() => go("/expertise")} aria-label={t.expertise.title}>
                      <ArrowUpRight size={15} />
                    </button>
                  </article>
                  <article className="pick-col">
                    <div className="pick-tag">{t.publications.tag}</div>
                    <h3>{t.publications.title}</h3>
                    <ul>
                      {t.publications.publications.slice(0, 3).map((pub) => (
                        <li key={pub.title}>
                          <strong>{pub.title}</strong>
                          <span>{pub.detail}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="pick-more" onClick={() => go("/publications")} aria-label={t.publications.title}>
                      <ArrowUpRight size={15} />
                    </button>
                  </article>
                  <article className="pick-col">
                    <div className="pick-tag">{t.teaching.tag}</div>
                    <h3>{t.teaching.title}</h3>
                    <ul>
                      {t.teaching.cards.slice(0, 3).map((card) => (
                        <li key={card.title}>
                          <strong>{card.title}</strong>
                          <span>{card.detail}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="pick-more" onClick={() => go("/teaching")} aria-label={t.teaching.title}>
                      <ArrowUpRight size={15} />
                    </button>
                  </article>
                </div>
              </div>
              <div className="home-link-list">
                  {t.home.links.map((link, index) => (
                    <button key={link.label} onClick={() => go(link.path)}>
                      <span>0{index + 1}</span>
                      <strong>{link.label}</strong>
                      <ArrowUpRight size={16} />
                    </button>
                  ))}
                </div>
            </section>
          </>
        )}
        {page === "biography" && (
          <PageShell tag={t.biography.tag} title={t.biography.title}>
            <div className="scholar-split">
              <div>
                <div className="scholar-lede" dangerouslySetInnerHTML={{ __html: t.biography.bodyHtml }} />
                <div className="scholar-quote">
                  <ScrollText size={23} />
                  <p>“{t.biography.quote}”</p>
                  <span>{t.biography.quoteBy}</span>
                </div>
              </div>
              <PhotoBlock portrait={t.biography.portrait} label={t.biography.photoLabel} note={t.biography.photoNote} />
            </div>
            <h3 className="subsection-title">{t.biography.timelineTitle}</h3>
            <div className="scholar-timeline">
              {t.biography.timeline.map((entry) => (
                <button
                  className="timeline-row"
                  key={entry.year}
                  type="button"
                  onClick={() => setSelectedTimeline(entry)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedTimeline(entry);
                    }
                  }}
                  aria-label={`${entry.title} — ${entry.year}`}
                >
                  <span className="timeline-year">{entry.year}</span>
                  <span className="timeline-copy">
                    <strong>{entry.title}</strong>
                    <small>{entry.detail}</small>
                  </span>
                  <ChevronRight size={17} />
                </button>
              ))}
            </div>
          </PageShell>
        )}
        {page === "expertise" && (
          <PageShell tag={t.expertise.tag} title={t.expertise.title} dark>
            <div className="scholar-lede" dangerouslySetInnerHTML={{ __html: t.expertise.bodyHtml }} />
            <div className="capability-list page-list">
              {t.expertise.capabilities.map((cap, index) => (
                <article className="capability-row" key={cap.title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{cap.title}</h3>
                    <p>{cap.detail}</p>
                  </div>
                  <ArrowUpRight size={17} />
                </article>
              ))}
            </div>
          </PageShell>
        )}
        {page === "publications" && (
          <PageShell tag={t.publications.tag} title={t.publications.title} accent>
            <div className="scholar-lede" dangerouslySetInnerHTML={{ __html: t.publications.bodyHtml }} />
            <div className="publication-grid">
              {t.publications.publications.map((pub, index) => (
                <article className={`publication-card publication-card-${index + 1}`} key={pub.title}>
                  <span>{pub.type}</span>
                  <h3>{pub.title}</h3>
                  <p>{pub.detail}</p>
                  <ArrowUpRight size={18} />
                </article>
              ))}
            </div>
            <h3 className="subsection-title">{t.publications.achievementTitle}</h3>
            <div className="achievement-list page-achievements">
              {t.publications.achievements.map((item) => (
                <span key={item}>
                  <Sparkles size={15} />
                  {item}
                </span>
              ))}
            </div>
          </PageShell>
        )}
        {page === "teaching" && (
          <PageShell tag={t.teaching.tag} title={t.teaching.title}>
            <div className="scholar-lede" dangerouslySetInnerHTML={{ __html: t.teaching.bodyHtml }} />
            <div className="teaching-grid">
              {t.teaching.cards.map((card) => (
                <article key={card.kicker}>
                  <span>
                    {card.kicker}
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.detail}</p>
                </article>
              ))}
            </div>
          </PageShell>
        )}
        {page === "talks" && (
          <PageShell tag={t.talks.tag} title={t.talks.title} dark>
            <div className="scholar-lede" dangerouslySetInnerHTML={{ __html: t.talks.bodyHtml }} />
            <div className="talk-list">
              {t.talks.talks.map((talk) => (
                <article key={talk.title}>
                  <span>{talk.type}</span>
                  <div>
                    <h3>{talk.title}</h3>
                    <p>{talk.detail}</p>
                  </div>
                  <ArrowUpRight size={17} />
                </article>
              ))}
            </div>
          </PageShell>
        )}
        {page === "connect" && (
          <PageShell tag={t.connect.tag} title={t.connect.title}>
            <div className="connect-panel">
              <div className="scholar-lede" dangerouslySetInnerHTML={{ __html: t.connect.bodyHtml }} />
              <MailCta t={t.connect} email={t.contact.email} />
            </div>
            <div className="connect-meta">
              <span>
                <CalendarDays size={15} />
                {t.contact.officeHours}
              </span>
              <span>
                <UserRound size={15} />
                {t.contact.email}
              </span>
              <span>
                <FileText size={15} />
                {t.contact.affiliation}
              </span>
            </div>
          </PageShell>
        )}
      </main>
      {selectedTimeline && (
        <div className="timeline-dialog-backdrop" role="presentation" onClick={() => setSelectedTimeline(null)}>
          <section className="timeline-dialog" role="dialog" aria-modal="true" aria-labelledby="timeline-dialog-title" onClick={(event) => event.stopPropagation()}>
            <button className="timeline-dialog-close" type="button" onClick={() => setSelectedTimeline(null)} aria-label={t.chrome.closeDialog}>
              <X size={19} />
            </button>
            <span className="timeline-dialog-year">{selectedTimeline.year}</span>
            <h2 id="timeline-dialog-title">{selectedTimeline.title}</h2>
            <p>{selectedTimeline.detail}</p>
            <span className="timeline-dialog-note">{t.biography.timelineNote}</span>
          </section>
        </div>
      )}
      <footer className="scholar-footer">
        <span className="scholar-footer-mark">王</span>
        <span>
          {siteMeta.shortName} · {t.contact.affiliation}
        </span>
        <span>{t.chrome.footerNote}</span>
      </footer>
    </div>
  );
}

function PageShell({ tag, title, children, dark = false, accent = false }: { tag: string; title: string; children: React.ReactNode; dark?: boolean; accent?: boolean }) {
  return (
    <section className={`scholar-section scholar-page ${dark ? "scholar-section-ink" : accent ? "scholar-section-lime" : "scholar-section-paper"}`}>
      <div className="scholar-section-tag">{tag}</div>
      <h2>{title}</h2>
      <div className="page-content">{children}</div>
    </section>
  );
}
