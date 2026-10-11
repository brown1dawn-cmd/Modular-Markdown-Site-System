/**
 * 內容模型的 TypeScript 型別。
 * 實際資料由 scripts/build-content.mjs 從 Markdown 產生（content.generated.ts）。
 */

export type Lang = "zh" | "en";

export interface ChromeStrings {
  nav: string[];
  brandSub: string;
  footerNote: string;
  closeDialog: string;
  openMenu: string;
}

export interface ContactInfo {
  email: string;
  officeHours: string;
  affiliation: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  detail: string;
}

export interface DetailEntry {
  title: string;
  detail: string;
}

export interface CardEntry {
  kicker: string;
  title: string;
  detail: string;
}

export interface PubEntry {
  type: string;
  title: string;
  detail: string;
}

export interface TalkEntry {
  type: string;
  title: string;
  detail: string;
}

export interface NavLink {
  label: string;
  path: string;
}

export interface HeroSection {
  eyebrow: string;
  title: string;
  titleEm: string;
  bodyHtml: string;
  exploreLabel: string;
  explorePath: string;
  meetLabel: string;
  meetPath: string;
  portrait: string;
  photoLabel: string;
  photoNote: string;
}

export interface HomeSection {
  tag: string;
  title: string;
  bodyHtml: string;
  links: NavLink[];
}

export interface BiographySection {
  tag: string;
  title: string;
  bodyHtml: string;
  quote: string;
  quoteBy: string;
  timelineTitle: string;
  timelineNote: string;
  timeline: TimelineEntry[];
  portrait: string;
  photoLabel: string;
  photoNote: string;
}

export interface ExpertiseSection {
  tag: string;
  title: string;
  bodyHtml: string;
  capabilities: DetailEntry[];
}

export interface PublicationsSection {
  tag: string;
  title: string;
  bodyHtml: string;
  publications: PubEntry[];
  achievementTitle: string;
  achievements: string[];
}

export interface TeachingSection {
  tag: string;
  title: string;
  bodyHtml: string;
  cards: CardEntry[];
}

export interface TalksSection {
  tag: string;
  title: string;
  bodyHtml: string;
  talks: TalkEntry[];
}

export interface ConnectFormStrings {
  formTitle: string;
  formName: string;
  formEmail: string;
  formMessage: string;
  formSubmit: string;
  formSending: string;
  formSuccess: string;
  formFallback: string;
  formError: string;
  orWriteDirectly: string;
}

export interface ConnectSection extends ConnectFormStrings {
  tag: string;
  title: string;
  bodyHtml: string;
  buttonLabel: string;
}

export interface SiteContent {
  chrome: ChromeStrings;
  contact: ContactInfo;
  hero: HeroSection;
  home: HomeSection;
  biography: BiographySection;
  expertise: ExpertiseSection;
  publications: PublicationsSection;
  teaching: TeachingSection;
  talks: TalksSection;
  connect: ConnectSection;
}

export interface SiteMeta {
  name: string;
  shortName: string;
  description: string;
  defaultLanguage: Lang;
  languages: Lang[];
  author: string;
  baseUrl: string;
  theme: { accent: string; ink: string; paper: string };
  routes: string[];
}
