import { ArrowUpRight, BookOpen, CalendarDays, ChevronRight, FileText, Languages, Menu, ScrollText, Sparkles, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

type Language = "zh" | "en";

const copy = {
  zh: {
    nav: ["首頁", "我的故事", "研究專長", "論文成就", "教學指導", "演講交流", "聯絡我"],
    paths: ["/", "/biography", "/expertise", "/publications", "/teaching", "/talks", "/connect"],
    eyebrow: "歷史學 · 檔案 · 公共記憶",
    heroTitle: "讓歷史回到",
    heroEm: "人的身上。",
    heroIntro: "我在銀河大學研究歷史，關注日常檔案、城市記憶，以及官方記錄之外仍然存在的故事。",
    explore: "閱讀我的研究",
    meet: "認識我",
    photo: "可上傳個人照片",
    photoNote: "建議尺寸 800 × 1000 px\n正式發布前替換這個位置",
    homeTag: "首頁 / WANG XIAOMIN",
    homeTitle: "我研究那些\n容易被忽略的痕跡。",
    homeBody: "我的工作在檔案館、課堂與公共空間之間移動。我相信歷史不只是過去的知識，也是一種重新理解現在的練習。",
    homeLinks: ["我的故事", "研究專長", "最新論文"],
    aboutTag: "01 / 我的故事",
    aboutTitle: "我從一個\n關於沉默的問題開始。",
    aboutBody: "當一個社群最重要的經驗從未被寫進官方檔案，它會發生什麼事？這個問題帶著我走過社會史、城市研究與公共人文，也成為我在銀河大學教學與研究的起點。",
    quote: "歷史之所以有用，是因為它讓當下變得不那麼確定。",
    quoteBy: "— 我在研究筆記裡寫下的一句話",
    timelineTitle: "我的學術時間軸",
    timeline: [["2012", "東方子午線大學歷史學博士", "學會把檔案視為一種論證，而不是倉庫。"], ["2015", "加入銀河大學", "建立以慢讀與共同證據為核心的研討課文化。"], ["2019", "成立日常檔案研究室", "將口述歷史與市政、家庭檔案放在一起閱讀。"], ["2024", "北大西洋記憶研究院訪問學人", "把研究延伸至比較城市記憶。"]],
    expertiseTag: "02 / 研究專長",
    expertiseTitle: "我用方法，\n照顧被留下的聲音。",
    expertiseBody: "我參與研究的完整循環：尋找材料、確認誰的聲音被遺漏、建立論證，再把成果帶回它所描述的社群。",
    capabilities: [["檔案研究", "市政檔案、私人文書、視覺材料與來源脈絡整理"], ["口述歷史", "訪談設計、同意程序、轉錄與敘事分析"], ["公共史學", "展覽、數位文章、公開演講與編輯轉譯"], ["情感史", "從日常語彙、身體經驗與記憶理解歷史變化"]],
    pubTag: "03 / 論文與成就",
    pubTitle: "我的研究書架",
    pubBody: "這是一份持續生長的書目，記錄我的研究如何走出校園，成為更大的對話。",
    publications: [["專書 · 2023", "記得街道的城市", "從日常檔案出發，研究戰後港口城市如何形成城市記憶。"], ["期刊論文 · 2022", "聆聽未被歸檔的聲音", "結合口述歷史與市政記錄，提出閱讀「缺席」的方法。"], ["展覽 · 2021", "警報之後", "與居民共同策劃的公共史學計畫，整理照片、聲音與記憶。"]],
    achievementTitle: "我走過的幾個節點",
    achievements: ["銀河大學教學創新獎，2024", "日常檔案研究室主持人，2019–至今", "入選子午線歷史學會專書獎，2023", "「城市如何記得」主題演講，2025"],
    teachingTag: "04 / 教學與指導",
    teachingTitle: "我把課堂\n當作一間工作坊。",
    teachingBody: "我希望學生先學會提出更好的問題，再急著尋找看似簡單的答案。課堂是一起讀材料、練習懷疑、逐步建立自己方法的地方。",
    teachingCards: [["研討課", "慢讀史料", "近現代東亞史、城市記憶、情感史"], ["論文指導", "一起找問題", "從題目形成到史料批判與寫作"], ["工作坊", "讓研究被看見", "口述歷史、展覽與公共寫作"]],
    talksTag: "05 / 演講與交流",
    talksTitle: "我願意把研究\n帶到更多地方。",
    talksBody: "如果你正在籌備講座、課程、研究工作坊或公共史學計畫，我很樂意從一個具體問題開始交流。",
    talks: [["公開演講", "城市如何記得", "從居民口述、舊照片與城市聲音談記憶的形成。"], ["研究工作坊", "如何閱讀一份檔案", "給第一次進入檔案館的研究者的實作課。"], ["對談主持", "歷史與日常生活", "和不同領域的創作者一起談記憶如何進入作品。"]],
    connectTag: "06 / 聯絡我",
    connectTitle: "帶著問題來，\n不必先帶著答案。",
    connectBody: "你可以邀請我進行演講、研究合作、研究生指導，或一起籌備公共史學計畫。",
    connectButton: "寫信給我",
    email: "wang.xiaomin@galaxy-university.example",
    footer: "王曉民 · 銀河大學歷史學系",
  },
  en: {
    nav: ["Home", "My story", "Expertise", "Publications", "Teaching", "Talks", "Connect"],
    paths: ["/", "/biography", "/expertise", "/publications", "/teaching", "/talks", "/connect"],
    eyebrow: "HISTORY · ARCHIVES · PUBLIC MEMORY",
    heroTitle: "Reading the past",
    heroEm: "with people in mind.",
    heroIntro: "I study history at Galaxy University, focusing on everyday archives, urban memory, and the stories official records leave behind.",
    explore: "Read my research",
    meet: "Meet me",
    photo: "Portrait photo placeholder",
    photoNote: "Recommended: 800 × 1000 px\nReplace before publishing",
    homeTag: "HOME / WANG XIAOMIN",
    homeTitle: "I study the traces\nthat are easy to miss.",
    homeBody: "My work moves between archives, classrooms, and public spaces. I see history not only as knowledge of the past, but as a practice for understanding the present again.",
    homeLinks: ["My story", "Research expertise", "Latest publications"],
    aboutTag: "01 / MY STORY",
    aboutTitle: "I began with a question\nabout silence.",
    aboutBody: "What happens to a community when its most important experiences are never entered into an official archive? That question has taken me through social history, urban studies, and public humanities, and remains the starting point for my teaching and research at Galaxy University.",
    quote: "The past becomes useful when it makes the present less certain.",
    quoteBy: "— A line from my research notebook",
    timelineTitle: "My academic timeline",
    timeline: [["2012", "PhD in History, East Meridian University", "I learned to treat the archive as an argument, not a warehouse."], ["2015", "Joined Galaxy University", "I built a seminar culture around slow reading and shared evidence."], ["2019", "Founded Everyday Archives Lab", "I connected oral histories with municipal and family records."], ["2024", "Visiting fellow, North Atlantic Memory Institute", "I extended my work into comparative urban memory."]],
    expertiseTag: "02 / RESEARCH EXPERTISE",
    expertiseTitle: "I use method\nas a form of care.",
    expertiseBody: "I work across the full research cycle: finding material, checking whose voice is missing, making an argument, and returning the work to the communities it describes.",
    capabilities: [["Archival research", "Municipal records, personal papers, visual sources, and provenance mapping"], ["Oral history", "Interview design, consent, transcription, and narrative analysis"], ["Public history", "Exhibitions, digital essays, public lectures, and editorial translation"], ["History of emotions", "Understanding change through everyday language, bodies, and memory"]],
    pubTag: "03 / PUBLICATIONS & ACHIEVEMENTS",
    pubTitle: "My research shelf",
    pubBody: "A working bibliography that traces how my research travels beyond the university and into a larger conversation.",
    publications: [["MONOGRAPH · 2023", "Streets That Remember", "Everyday archives and the making of urban memory in postwar port cities."], ["JOURNAL ARTICLE · 2022", "Listening for the Unfiled", "A method for reading absence across oral histories and municipal records."], ["EXHIBITION · 2021", "After the Sirens", "A public history project with residents, photographs, remembered sound, and place."]],
    achievementTitle: "A few milestones",
    achievements: ["Galaxy University Teaching Innovation Award, 2024", "Principal investigator, Everyday Archives Lab, 2019–present", "Shortlisted, Meridian Historical Association Book Prize, 2023", "Keynote, “Cities Remember,” 2025"],
    teachingTag: "04 / TEACHING & MENTORING",
    teachingTitle: "I treat the classroom\nas a workshop.",
    teachingBody: "I want students to ask better questions before reaching for easy answers. A classroom is a place to read together, practice doubt, and build a method of one’s own.",
    teachingCards: [["Seminars", "Slow reading", "Modern East Asian history, urban memory, history of emotions"], ["Supervision", "Finding the question", "From topic formation to source criticism and writing"], ["Workshops", "Making research visible", "Oral history, exhibitions, and public writing"]],
    talksTag: "05 / TALKS & EXCHANGE",
    talksTitle: "I want to take research\nto more places.",
    talksBody: "If you are planning a lecture, course, research workshop, or public history project, I would be glad to begin with one concrete question.",
    talks: [["Public lecture", "How Cities Remember", "Memory-making through residents’ stories, old photographs, and urban sound."], ["Research workshop", "How to Read an Archive", "A practical session for researchers entering an archive for the first time."], ["Conversation", "History and Everyday Life", "A cross-disciplinary exchange about how memory enters creative work."]],
    connectTag: "06 / CONNECT WITH ME",
    connectTitle: "Bring a question,\nnot a finished answer.",
    connectBody: "Invite me for a lecture, research collaboration, graduate supervision, or a public history project.",
    connectButton: "Write to me",
    email: "wang.xiaomin@galaxy-university.example",
    footer: "Wang Xiaomin · Department of History, Galaxy University",
  },
} as const;

function PhotoPlaceholder({ t }: { t: { photo: string; photoNote: string } }) {
  return <div className="photo-placeholder"><div className="photo-placeholder-frame"><UserRound size={38} strokeWidth={1} /><strong>{t.photo}</strong><span>{t.photoNote.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</span></div><div className="portrait-orbit portrait-orbit-one" /><div className="portrait-orbit portrait-orbit-two" /></div>;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("zh");
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const t = copy[language];
  const isZh = language === "zh";
  const page = location === "/" ? "home" : location.replace("/", "") || "home";
  const go = (path: string) => { setMenuOpen(false); setLocation(path); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return <div className="scholar-shell"><div className="scholar-noise" /><header className="scholar-header"><button className="scholar-brand" onClick={() => go("/")}><span className="scholar-brand-mark">王</span><span><strong>WANG XIAOMIN</strong><small>{isZh ? "歷史學者 · 銀河大學" : "HISTORIAN · GALAXY UNIVERSITY"}</small></span></button><nav className={menuOpen ? "scholar-nav is-open" : "scholar-nav"}>{t.nav.map((label, index) => <button key={label} className={t.paths[index].slice(1) === page || (index === 0 && page === "home") ? "is-current" : ""} onClick={() => go(t.paths[index])}>{label}</button>)}</nav><div className="scholar-actions"><button className="scholar-language" onClick={() => setLanguage(isZh ? "en" : "zh")}><Languages size={15} />{isZh ? "EN" : "中文"}</button><button className="scholar-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button></div></header>
    <main>
      {page === "home" && <><section className="scholar-hero"><div className="scholar-hero-copy"><div className="scholar-eyebrow"><span className="pulse-dot" />{t.eyebrow}</div><h1>{t.heroTitle}<br /><em>{t.heroEm}</em></h1><p className="scholar-intro">{t.heroIntro}</p><div className="scholar-hero-actions"><button className="scholar-button scholar-button-dark" onClick={() => go("/publications")}>{t.explore}<ArrowUpRight size={16} /></button><button className="scholar-text-link" onClick={() => go("/biography")}>{t.meet}<ChevronRight size={16} /></button></div></div><PhotoPlaceholder t={t} /></section><section className="scholar-section scholar-section-paper"><div className="scholar-section-tag">{t.homeTag}</div><div className="scholar-split"><div><h2>{t.homeTitle}</h2><p className="scholar-lede">{t.homeBody}</p></div><div className="home-link-list">{t.homeLinks.map((label, index) => <button key={label} onClick={() => go(t.paths[index + 1])}><span>0{index + 1}</span><strong>{label}</strong><ArrowUpRight size={16} /></button>)}</div></div></section></>}
      {page === "biography" && <PageShell tag={t.aboutTag} title={t.aboutTitle}><div className="scholar-split"><div><p className="scholar-lede">{t.aboutBody}</p><div className="scholar-quote"><ScrollText size={23} /><p>“{t.quote}”</p><span>{t.quoteBy}</span></div></div><PhotoPlaceholder t={t} /></div><h3 className="subsection-title">{t.timelineTitle}</h3><div className="scholar-timeline">{t.timeline.map(([year, title, detail]) => <article className="timeline-row" key={year}><span className="timeline-year">{year}</span><div><h3>{title}</h3><p>{detail}</p></div><ChevronRight size={17} /></article>)}</div></PageShell>}
      {page === "expertise" && <PageShell tag={t.expertiseTag} title={t.expertiseTitle} dark><p className="scholar-lede">{t.expertiseBody}</p><div className="capability-list page-list">{t.capabilities.map(([title, detail], index) => <article className="capability-row" key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{detail}</p></div><ArrowUpRight size={17} /></article>)}</div></PageShell>}
      {page === "publications" && <PageShell tag={t.pubTag} title={t.pubTitle} accent><p className="scholar-lede">{t.pubBody}</p><div className="publication-grid">{t.publications.map(([type, title, detail], index) => <article className={`publication-card publication-card-${index + 1}`} key={title}><span>{type}</span><h3>{title}</h3><p>{detail}</p><ArrowUpRight size={18} /></article>)}</div><h3 className="subsection-title">{t.achievementTitle}</h3><div className="achievement-list page-achievements">{t.achievements.map((item) => <span key={item}><Sparkles size={15} />{item}</span>)}</div></PageShell>}
      {page === "teaching" && <PageShell tag={t.teachingTag} title={t.teachingTitle}><p className="scholar-lede">{t.teachingBody}</p><div className="teaching-grid">{t.teachingCards.map(([type, title, detail], index) => <article key={type}><span>0{index + 1} / {type}</span><h3>{title}</h3><p>{detail}</p></article>)}</div></PageShell>}
      {page === "talks" && <PageShell tag={t.talksTag} title={t.talksTitle} dark><p className="scholar-lede">{t.talksBody}</p><div className="talk-list">{t.talks.map(([type, title, detail]) => <article key={title}><span>{type}</span><div><h3>{title}</h3><p>{detail}</p></div><ArrowUpRight size={17} /></article>)}</div></PageShell>}
      {page === "connect" && <PageShell tag={t.connectTag} title={t.connectTitle}><div className="connect-panel"><p className="scholar-lede">{t.connectBody}</p><a className="scholar-button scholar-button-lime" href={`mailto:${t.email}`}>{t.connectButton}<ArrowUpRight size={16} /></a></div><div className="connect-meta"><span><CalendarDays size={15} />{isZh ? "週二、週四 · 14:00–16:00" : "Tue & Thu · 14:00–16:00"}</span><span><UserRound size={15} />{t.email}</span><span><FileText size={15} />{isZh ? "銀河大學 · 歷史學系" : "Department of History · Galaxy University"}</span></div></PageShell>}
    </main><footer className="scholar-footer"><span className="scholar-footer-mark">王</span><span>{t.footer}</span><span>{isZh ? "雙語學術檔案示範" : "Bilingual academic profile demo"}</span></footer></div>;
}

function PageShell({ tag, title, children, dark = false, accent = false }: { tag: string; title: string; children: React.ReactNode; dark?: boolean; accent?: boolean }) {
  return <section className={`scholar-section scholar-page ${dark ? "scholar-section-ink" : accent ? "scholar-section-lime" : "scholar-section-paper"}`}><div className="scholar-section-tag">{tag}</div><h2>{title}</h2><div className="page-content">{children}</div></section>;
}
