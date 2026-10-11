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
        <div className="portrait-orbit portrait-orbit-one" />
        <div className="portrait-orbit portrait-orbit-two" />
      </div>
    );
  }
  return (
    <div className="photo-placeholder">
      <div className="photo-placeholder-frame">
        <UserRound size={38} strokeWidth={1} />
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
      <div className="portrait-orbit portrait-orbit-one" />
      <div className="portrait-orbit portrait-orbit-two" />
    </div>
  );
}

function ContactForm({ t, email }: { t: SiteContent["connect"]; email: string }) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "fallback" | "error">("idle");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    // 20 秒超時：網路卡住時給使用者一個說法，而不是永遠轉圈圈
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: from, message }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) setState("done");
      else if (res.status === 501) setState("fallback");
      else setState("error");
    } catch {
      clearTimeout(timer);
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="contact-form">
        <p className="contact-form-note is-success">{t.formSuccess}</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <h3 className="contact-form-title">{t.formTitle}</h3>
      <label>
        <span>{t.formName}</span>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} autoComplete="name" />
      </label>
      <label>
        <span>{t.formEmail}</span>
        <input type="email" value={from} onChange={(e) => setFrom(e.target.value)} required maxLength={200} autoComplete="email" />
      </label>
      <label>
        <span>{t.formMessage}</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} required maxLength={5000} rows={5} />
      </label>
      {state === "fallback" && <p className="contact-form-note">{t.formFallback}</p>}
      {state === "error" && <p className="contact-form-note is-error">{t.formError}</p>}
      <div className="contact-form-actions">
        <button type="submit" className="scholar-button scholar-button-lime" disabled={state === "sending"}>
          {state === "sending" ? t.formSending : t.formSubmit}
          <ArrowUpRight size={16} />
        </button>
        <a className="scholar-text-link" href={`mailto:${email}`}>
          {t.orWriteDirectly}
          <ChevronRight size={16} />
        </a>
      </div>
    </form>
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
                <div className="home-link-list">
                  {t.home.links.map((link, index) => (
                    <button key={link.label} onClick={() => go(link.path)}>
                      <span>0{index + 1}</span>
                      <strong>{link.label}</strong>
                      <ArrowUpRight size={16} />
                    </button>
                  ))}
                </div>
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
              <ContactForm t={t.connect} email={t.contact.email} />
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
