import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  FileText,
  Languages,
  Menu,
  ScrollText,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";

type Language = "zh" | "en";

const copy = {
  zh: {
    nav: ["關於", "能力", "論文", "交流"],
    eyebrow: "歷史學 · 檔案 · 公共記憶",
    title: "讓歷史回到",
    titleEm: "人的身上。",
    intro:
      "王曉民是銀河大學歷史學者，研究日常檔案、城市記憶，以及官方記錄之外仍然存在的故事。",
    primary: "閱讀研究",
    secondary: "認識王曉民",
    portraitLabel: "GALAXY UNIVERSITY / HISTORY",
    portraitNote: "Academic profile demo",
    aboutKicker: "01 / 經歷與故事",
    aboutTitle: "研究日常痕跡的\n歷史學者",
    aboutBody:
      "王曉民從一個關於沉默的問題開始：當一個社群最重要的經驗從未被寫進官方檔案，它會發生什麼事？這個問題帶著他走過社會史、城市研究與公共人文。",
    quote: "歷史之所以有用，是因為它讓當下變得不那麼確定。",
    quoteBy: "— 王曉民",
    timeline: [
      ["2012", "東方子午線大學歷史學博士", "學會把檔案視為一種論證，而不是倉庫。"],
      ["2015", "加入銀河大學", "建立以慢讀與共同證據為核心的研討課文化。"],
      ["2019", "成立日常檔案研究室", "將口述歷史與市政、家庭檔案放在一起閱讀。"],
    ],
    capabilityKicker: "02 / 能力與專長",
    capabilityTitle: "方法也是\n一種照顧。",
    capabilityBody: "從尋找材料，到確認誰的聲音被遺漏，再把成果帶回它所描述的社群。",
    capabilities: [
      ["檔案研究", "市政檔案、私人文書、視覺材料與來源脈絡整理"],
      ["口述歷史", "訪談設計、同意程序、轉錄與敘事分析"],
      ["公共史學", "展覽、數位文章、公開演講與編輯轉譯"],
      ["教學與指導", "研討課設計、論文指導與史料批判工作坊"],
    ],
    publicationKicker: "03 / 論文與成就",
    publicationTitle: "研究書架",
    publicationBody: "一份持續生長的書目，記錄研究如何走出校園，成為更大的對話。",
    publications: [
      ["專書 · 2023", "記得街道的城市", "從日常檔案出發，研究戰後港口城市如何形成城市記憶。"],
      ["期刊論文 · 2022", "聆聽未被歸檔的聲音", "結合口述歷史與市政記錄，提出閱讀「缺席」的方法。"],
      ["展覽 · 2021", "警報之後", "與居民共同策劃的公共史學計畫，整理照片、聲音與記憶。"],
    ],
    achievements: ["銀河大學教學創新獎，2024", "日常檔案研究室主持人，2019–至今", "入選子午線歷史學會專書獎，2023", "「城市如何記得」主題演講，2025"],
    contactKicker: "04 / 邀請交流",
    contactTitle: "帶著問題來，\n不必先帶著答案。",
    contactBody: "歡迎邀請演講、研究合作、研究生指導，或一起籌備公共史學計畫。",
    contactButton: "發送研究邀請",
    footer: "Wang Xiaomin / 王曉民 · Galaxy University",
  },
  en: {
    nav: ["Biography", "Expertise", "Publications", "Connect"],
    eyebrow: "HISTORY · ARCHIVES · PUBLIC MEMORY",
    title: "Reading the past",
    titleEm: "with people in mind.",
    intro:
      "Wang Xiaomin is a historian at Galaxy University whose work connects everyday archives, urban memory, and the stories official records leave behind.",
    primary: "Explore research",
    secondary: "Meet Wang",
    portraitLabel: "GALAXY UNIVERSITY / HISTORY",
    portraitNote: "Academic profile demo",
    aboutKicker: "01 / BIOGRAPHY & STORY",
    aboutTitle: "A historian of\nordinary traces",
    aboutBody:
      "Wang Xiaomin began with a question about silence: what happens to a community when its most important experiences are never entered into an official archive? That question has shaped a career across social history, urban studies, and public humanities.",
    quote: "The past becomes useful when it makes the present less certain.",
    quoteBy: "— Wang Xiaomin",
    timeline: [
      ["2012", "PhD in History, East Meridian University", "Learned to treat the archive as an argument, not a warehouse."],
      ["2015", "Joined Galaxy University", "Built a seminar culture around slow reading and shared evidence."],
      ["2019", "Founded Everyday Archives Lab", "Connected oral histories with municipal and family records."],
    ],
    capabilityKicker: "02 / CAPABILITIES & EXPERTISE",
    capabilityTitle: "Methods are\na form of care.",
    capabilityBody: "Finding material, checking whose voice is missing, making an argument, and returning the work to the communities it describes.",
    capabilities: [
      ["Archival research", "Municipal records, personal papers, visual sources, and provenance mapping"],
      ["Oral history", "Interview design, consent, transcription, and narrative analysis"],
      ["Public history", "Exhibitions, digital essays, public lectures, and editorial translation"],
      ["Teaching & mentoring", "Seminar design, thesis advising, and source criticism workshops"],
    ],
    publicationKicker: "03 / PUBLICATIONS & ACHIEVEMENTS",
    publicationTitle: "Research shelf",
    publicationBody: "A working bibliography that traces how research travels beyond the university and into a larger conversation.",
    publications: [
      ["MONOGRAPH · 2023", "Streets That Remember", "Everyday archives and the making of urban memory in postwar port cities."],
      ["JOURNAL ARTICLE · 2022", "Listening for the Unfiled", "A method for reading absence across oral histories and municipal records."],
      ["EXHIBITION · 2021", "After the Sirens", "A public history project with residents, photographs, remembered sound, and place."],
    ],
    achievements: ["Galaxy University Teaching Innovation Award, 2024", "Principal investigator, Everyday Archives Lab, 2019–present", "Shortlisted, Meridian Historical Association Book Prize, 2023", "Keynote, “Cities Remember,” 2025"],
    contactKicker: "04 / ACADEMIC EXCHANGE",
    contactTitle: "Bring a question,\nnot a finished answer.",
    contactBody: "Invite Wang Xiaomin for a lecture, research collaboration, graduate supervision, or a public history project.",
    contactButton: "Send a research note",
    footer: "Wang Xiaomin · 王曉民 · Galaxy University",
  },
} as const;

export default function Home() {
  const [language, setLanguage] = useState<Language>("zh");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = copy[language];
  const isZh = language === "zh";

  return (
    <div className="scholar-shell">
      <div className="scholar-noise" />
      <header className="scholar-header">
        <a className="scholar-brand" href="#top" aria-label="Wang Xiaomin home">
          <span className="scholar-brand-mark">王</span>
          <span><strong>WANG XIAOMIN</strong><small>{isZh ? "歷史學者 · 銀河大學" : "HISTORIAN · GALAXY UNIVERSITY"}</small></span>
        </a>
        <nav className={menuOpen ? "scholar-nav is-open" : "scholar-nav"} aria-label="Primary navigation">
          <a href="#biography" onClick={() => setMenuOpen(false)}>{t.nav[0]}</a>
          <a href="#expertise" onClick={() => setMenuOpen(false)}>{t.nav[1]}</a>
          <a href="#publications" onClick={() => setMenuOpen(false)}>{t.nav[2]}</a>
          <a href="#connect" onClick={() => setMenuOpen(false)}>{t.nav[3]}</a>
        </nav>
        <div className="scholar-actions">
          <button className="scholar-language" onClick={() => setLanguage(isZh ? "en" : "zh")} aria-label="Switch language"><Languages size={15} />{isZh ? "EN" : "中文"}</button>
          <button className="scholar-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </header>

      <main id="top">
        <section className="scholar-hero">
          <div className="scholar-hero-copy">
            <div className="scholar-eyebrow"><span className="pulse-dot" />{t.eyebrow}</div>
            <h1>{t.title}<br /><em>{t.titleEm}</em></h1>
            <p className="scholar-intro">{t.intro}</p>
            <div className="scholar-hero-actions"><a className="scholar-button scholar-button-dark" href="#publications">{t.primary}<ArrowUpRight size={16} /></a><a className="scholar-text-link" href="#biography">{t.secondary}<ChevronRight size={16} /></a></div>
          </div>
          <div className="scholar-portrait" aria-label={t.portraitLabel}>
            <div className="portrait-orbit portrait-orbit-one" /><div className="portrait-orbit portrait-orbit-two" />
            <div className="portrait-paper"><span className="portrait-monogram">王</span><span className="portrait-caption">{t.portraitLabel}</span><span className="portrait-note">{t.portraitNote}</span></div>
          </div>
        </section>

        <section className="scholar-section scholar-section-paper" id="biography">
          <div className="scholar-section-tag">{t.aboutKicker}</div>
          <div className="scholar-split"><div><h2>{t.aboutTitle.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2><p className="scholar-lede">{t.aboutBody}</p></div><div className="scholar-quote"><ScrollText size={23} /><p>“{t.quote}”</p><span>{t.quoteBy}</span></div></div>
          <div className="scholar-timeline">{t.timeline.map(([year, title, detail]) => <article className="timeline-row" key={year}><span className="timeline-year">{year}</span><div><h3>{title}</h3><p>{detail}</p></div><ChevronRight size={17} /></article>)}</div>
        </section>

        <section className="scholar-section scholar-section-ink" id="expertise">
          <div className="scholar-section-tag">{t.capabilityKicker}</div>
          <div className="scholar-split scholar-split-capability"><div><h2>{t.capabilityTitle.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2><p className="scholar-lede">{t.capabilityBody}</p></div><div className="capability-list">{t.capabilities.map(([title, detail], index) => <article className="capability-row" key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{detail}</p></div><ArrowUpRight size={17} /></article>)}</div></div>
        </section>

        <section className="scholar-section scholar-section-lime" id="publications">
          <div className="scholar-section-tag">{t.publicationKicker}</div><div className="scholar-publication-head"><div><h2>{t.publicationTitle}</h2><p className="scholar-lede">{t.publicationBody}</p></div><BookOpen size={38} strokeWidth={1} /></div>
          <div className="publication-grid">{t.publications.map(([type, title, detail], index) => <article className={`publication-card publication-card-${index + 1}`} key={title}><span>{type}</span><h3>{title}</h3><p>{detail}</p><ArrowUpRight size={18} /></article>)}</div>
          <div className="achievement-bar"><div className="achievement-label"><Sparkles size={17} />{isZh ? "代表成就" : "Selected achievements"}</div><div className="achievement-list">{t.achievements.map((achievement) => <span key={achievement}>{achievement}</span>)}</div></div>
        </section>

        <section className="scholar-section scholar-section-paper scholar-connect" id="connect"><div className="scholar-section-tag">{t.contactKicker}</div><div className="connect-panel"><div><h2>{t.contactTitle.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2><p className="scholar-lede">{t.contactBody}</p></div><a className="scholar-button scholar-button-lime" href="mailto:wang.xiaomin@galaxy-university.example">{t.contactButton}<ArrowUpRight size={16} /></a></div><div className="connect-meta"><span><CalendarDays size={15} />{isZh ? "週二、週四 · 14:00–16:00" : "Tue & Thu · 14:00–16:00"}</span><span><UserRound size={15} />wang.xiaomin@galaxy-university.example</span><span><FileText size={15} />{isZh ? "銀河大學 · 歷史學系" : "Department of History · Galaxy University"}</span></div></section>
      </main>
      <footer className="scholar-footer"><span className="scholar-footer-mark">王</span><span>{t.footer}</span><span>{isZh ? "雙語學術檔案示範" : "Bilingual academic profile demo"}</span></footer>
    </div>
  );
}
