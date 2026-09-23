import { ArrowUpRight, Check, ChevronRight, Code2, FileText, Languages, Layers3, Menu, Sparkles } from "lucide-react";
import { useState } from "react";

const structure = [
  { icon: FileText, label: "content/pages/", value: "5 page definitions" },
  { icon: Layers3, label: "content/sections/", value: "30+ Markdown blocks" },
  { icon: Code2, label: "templates/", value: "6 presentation shells" },
];

const pages = [
  ["01", "Home", "home.html", "hero / features / cta"],
  ["02", "About", "about.html", "intro / principles / cta"],
  ["03", "Services", "services.html", "intro / list / cta"],
  ["04", "Selected work", "work.html", "intro / gallery / cta"],
  ["05", "Contact", "contact.html", "intro / info / form"],
];

export default function Home() {
  const [language, setLanguage] = useState<"EN" | "中文">("EN");
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="studio-shell">
      <div className="studio-noise" />
      <header className="studio-header">
        <a className="studio-brand" href="#top"><span className="studio-logo">M</span><span>Modular<br />Markdown</span></a>
        <nav className={menuOpen ? "studio-nav is-open" : "studio-nav"}>
          <a href="#system">System</a><a href="#templates">Templates</a><a href="#workflow">Workflow</a>
        </nav>
        <div className="studio-actions"><button className="language-button" onClick={() => setLanguage(language === "EN" ? "中文" : "EN")}><Languages size={14} />{language}</button><button className="menu-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}><Menu size={18} /></button></div>
      </header>
      <main id="top">
        <section className="studio-hero">
          <div className="hero-label"><span className="pulse-dot" /> Content infrastructure / 2026</div>
          <div className="hero-title-wrap"><h1>Build pages<br /><em>from meaning.</em></h1><div className="hero-orb"><span>MD</span><div className="orb-ring orb-ring-one" /><div className="orb-ring orb-ring-two" /></div></div>
          <div className="hero-bottom"><p>A bilingual, multi-template site system where Markdown acts like a content database—clean enough to edit, flexible enough to grow.</p><a className="text-link" href="#system">See how it works <ArrowUpRight size={16} /></a></div>
        </section>
        <section className="manifest-section" id="system"><div className="section-tag">01 / The manifest</div><div className="manifest-content"><div><h2>One clear<br /><em>source of truth.</em></h2><p className="section-lede">Content stays legible. Templates stay focused. The build script quietly connects the two.</p></div><div className="manifest-list">{structure.map(({ icon: Icon, label, value }) => <div className="manifest-row" key={label}><Icon size={19} strokeWidth={1.5} /><span className="manifest-label">{label}</span><span className="manifest-value">{value}</span><ChevronRight size={16} /></div>)}</div></div></section>
        <section className="templates-section" id="templates"><div className="section-tag">02 / The template set</div><div className="templates-head"><h2>Every page has<br /><em>its own rhythm.</em></h2><p>Named regions make each layout expressive without making content editing fragile.</p></div><div className="page-table">{pages.map(([number, name, file, regions]) => <a href={`#${file}`} className="page-row" key={file}><span className="page-number">{number}</span><strong>{name}</strong><span className="page-file">{file}</span><span className="page-regions">{regions}</span><ArrowUpRight size={18} /></a>)}</div></section>
        <section className="workflow-section" id="workflow"><div className="workflow-card"><div className="section-tag">03 / The workflow</div><div className="workflow-copy"><h2>Write in Markdown.<br /><em>Ship with confidence.</em></h2><p>Change the content database, commit to GitHub, and let the build produce ordinary HTML for Cloudflare Pages.</p><div className="check-list"><span><Check size={16} /> No HTML editing for content teams</span><span><Check size={16} /> Chinese + English in parallel</span><span><Check size={16} /> CI-ready static output</span></div></div><div className="workflow-badge"><Sparkles size={22} /><span>build.py<br /><b>ready to run</b></span></div></div></section>
      </main>
      <footer className="studio-footer"><div><span className="studio-logo">M</span><span>Modular Markdown Site System</span></div><span>Built for content that moves.</span></footer>
    </div>
  );
}
