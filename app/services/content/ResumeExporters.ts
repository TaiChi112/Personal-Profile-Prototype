import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { AtsExportProfile } from '../../data/resume';

export type ExportLanguage = 'en' | 'th';

type ExportOptions = {
  language?: ExportLanguage;
};

type ExportLocale = {
  sections: {
    summary: string;
    experience: string;
    education: string;
    projects: string;
    skills: string;
    additionalInformation: string;
    contact: string;
  };
  contact: {
    phone: string;
    email: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
};

const EXPORT_LOCALES: Record<ExportLanguage, ExportLocale> = {
  en: {
    sections: {
      summary: 'Summary',
      experience: 'Experience',
      education: 'Education',
      projects: 'Projects',
      skills: 'Skills',
      additionalInformation: 'Additional Information',
      contact: 'Contact',
    },
    contact: {
      phone: 'Phone',
      email: 'Email',
      location: 'Location',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      portfolio: 'Portfolio',
    },
  },
  th: {
    sections: {
      summary: 'สรุป',
      experience: 'ประสบการณ์',
      education: 'การศึกษา',
      projects: 'โปรเจกต์',
      skills: 'ทักษะ',
      additionalInformation: 'ข้อมูลเพิ่มเติม',
      contact: 'ช่องทางติดต่อ',
    },
    contact: {
      phone: 'โทรศัพท์',
      email: 'อีเมล',
      location: 'ที่อยู่',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      portfolio: 'Portfolio',
    },
  },
};

type ExportableResume = {
  name: string;
  title?: string;
  summary?: string;
  sectionVisibility?: {
    summary?: boolean;
    experience?: boolean;
    education?: boolean;
    projects?: boolean;
    skills?: boolean;
    additionalInformation?: boolean;
  };
  experience?: Array<{
    role: string;
    company: string;
    period: string;
    description: string[];
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills?: string[];
  skillGroups?: Array<{
    id?: string;
    title: string;
    items: string[];
  }>;
  keyProjects?: Array<{
    title: string;
    description: string[];
  }>;
  additionalInformation?: string[];
  contact?: {
    phone?: string;
    email?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
};

type NotifyLevel = 'SUCCESS' | 'WARNING' | 'INFO' | 'ERROR';

type NotifyFn = (message: string, level: NotifyLevel) => void;

function asExportableResume(data: unknown): ExportableResume | null {
  if (typeof data !== 'object' || data === null || !('name' in data)) {
    return null;
  }

  return data as ExportableResume;
}

function getExportLocale(language: ExportLanguage): ExportLocale {
  return EXPORT_LOCALES[language] ?? EXPORT_LOCALES.en;
}

function buildExperienceSection(resume: ExportableResume): string {
  return (resume.experience ?? [])
    .map((entry) => [
      `### ${entry.role} at ${entry.company}`,
      `_${entry.period}_`,
      ...entry.description.map((detail) => `- ${detail}`),
    ].join('\n'))
    .join('\n\n');
}

function buildEducationSection(resume: ExportableResume): string {
  return (resume.education ?? [])
    .map((entry) => `- **${entry.degree}**, ${entry.institution} (${entry.year})`)
    .join('\n');
}

function formatProjectLabelForMarkdown(detail: string): string {
  const labels = ['Problem/Motivation', 'Solution/Benefit', 'ปัญหา/แรงจูงใจ', 'แนวทางแก้/ประโยชน์'];
  const matched = labels.find((label) => detail.startsWith(`${label}:`));

  if (!matched) {
    return detail;
  }

  const value = detail.slice(matched.length + 1).trim();
  return `**${matched}:** ${value}`;
}

function buildProjectsSection(resume: ExportableResume): string {
  return (resume.keyProjects ?? [])
    .map((project) => [
      `### ${project.title}`,
      ...project.description.map((detail) => `- ${formatProjectLabelForMarkdown(detail)}`),
    ].join('\n'))
    .join('\n\n');
}

function localizeSkillGroupTitle(title: string, language: ExportLanguage): string {
  if (language === 'en') {
    return title;
  }

  const mapped: Record<string, string> = {
    Languages: 'ภาษาโปรแกรม',
    'Frameworks & Tools': 'เฟรมเวิร์กและเครื่องมือ',
    Databases: 'ฐานข้อมูล',
    'AI & Agent Stack': 'AI และ Agent Stack',
    'Engineering Concepts': 'แนวคิดวิศวกรรมซอฟต์แวร์',
    Other: 'อื่นๆ',
    'Working Style & Soft Skills': 'รูปแบบการทำงานและทักษะเชิงพฤติกรรม',
  };

  return mapped[title] ?? title;
}

function buildSkillLines(resume: ExportableResume, language: ExportLanguage): string[] {
  const groups = resume.skillGroups ?? [];
  const inlineThreshold = 95;

  if (groups.length > 0) {
    return groups.flatMap((group) => {
      const localizedTitle = localizeSkillGroupTitle(group.title, language);
      const merged = group.items.join(', ');
      if (merged.length <= inlineThreshold) {
        return [`- **${localizedTitle}:** ${merged}`];
      }

      return [
        `- **${localizedTitle}:**`,
        ...group.items.map((item) => `  - ${item}`),
      ];
    });
  }

  const flatSkills = resume.skills ?? [];
  return flatSkills.map((skill) => `- ${skill}`);
}

function buildMarkdownContactLines(resume: ExportableResume, locale: ExportLocale): string[] {
  const contact = resume.contact;
  if (!contact) {
    return [];
  }

  const contactLines = [
    contact.phone ? `- **${locale.contact.phone}:** ${contact.phone}` : null,
    contact.email ? `- **${locale.contact.email}:** ${contact.email}` : null,
    contact.location ? `- **${locale.contact.location}:** ${contact.location}` : null,
    contact.linkedin ? `- **${locale.contact.linkedin}:** ${contact.linkedin}` : null,
    contact.github ? `- **${locale.contact.github}:** ${contact.github}` : null,
    contact.portfolio ? `- **${locale.contact.portfolio}:** ${contact.portfolio}` : null,
  ].filter((line): line is string => Boolean(line));

  return contactLines;
}

function pushSection(lines: string[], title: string, content: string): void {
  if (content.length === 0) {
    return;
  }

  lines.push('', title, content);
}

function normalizeUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return `https://${url}`;
}

function addPdfLine(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  marginBottom: number,
): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = y;
  const wrapped = doc.splitTextToSize(text, maxWidth) as string[];

  for (const line of wrapped) {
    if (currentY > pageHeight - marginBottom) {
      doc.addPage();
      currentY = marginBottom;
    }
    doc.text(line, x, currentY);
    currentY += lineHeight;
  }

  return currentY;
}

type PdfState = {
  doc: jsPDF;
  margin: number;
  maxWidth: number;
  lineHeight: number;
  y: number;
};

type ResolvedVisibility = {
  summary: boolean;
  experience: boolean;
  education: boolean;
  projects: boolean;
  skills: boolean;
  additionalInformation: boolean;
};

function createPdfState(): PdfState {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 48;
  const maxWidth = doc.internal.pageSize.getWidth() - (margin * 2);
  return {
    doc,
    margin,
    maxWidth,
    lineHeight: 16,
    y: margin,
  };
}

function writePdfWrappedLine(state: PdfState, text: string, indent = 0, lineHeight = state.lineHeight): void {
  state.y = addPdfLine(
    state.doc,
    text,
    state.margin + indent,
    state.y,
    state.maxWidth - indent,
    lineHeight,
    state.margin,
  );
}

function writePdfInlineLabeledPairs(
  state: PdfState,
  pairs: Array<{ label: string; value: string }>,
  lineHeight = 13,
): void {
  if (pairs.length === 0) {
    return;
  }

  const pageHeight = state.doc.internal.pageSize.getHeight();
  const maxX = state.margin + state.maxWidth;
  const separator = ' | ';
  let x = state.margin;

  for (let index = 0; index < pairs.length; index += 1) {
    const pair = pairs[index];
    const labelText = `${pair.label}: `;
    const valueText = pair.value;
    const separatorText = index < pairs.length - 1 ? separator : '';

    state.doc.setFont('helvetica', 'bold');
    state.doc.setFontSize(10.5);
    const labelWidth = state.doc.getTextWidth(labelText);
    state.doc.setFont('helvetica', 'normal');
    const valueWidth = state.doc.getTextWidth(valueText);
    const separatorWidth = state.doc.getTextWidth(separatorText);
    const pairWidth = labelWidth + valueWidth + separatorWidth;

    if (x + pairWidth > maxX && x > state.margin) {
      state.y += lineHeight;
      x = state.margin;
    }

    if (state.y > pageHeight - state.margin) {
      state.doc.addPage();
      state.y = state.margin;
      x = state.margin;
    }

    state.doc.setFont('helvetica', 'bold');
    state.doc.text(labelText, x, state.y);
    x += labelWidth;

    state.doc.setFont('helvetica', 'normal');
    state.doc.text(valueText, x, state.y);
    x += valueWidth;

    if (separatorText) {
      state.doc.text(separatorText, x, state.y);
      x += separatorWidth;
    }
  }

  state.y += lineHeight;
}

function writePdfSectionTitle(state: PdfState, title: string): void {
  state.y += 6;
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(13);
  writePdfWrappedLine(state, title, 0, 16);
  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(10.5);
}

function resolveVisibility(resume: ExportableResume): ResolvedVisibility {
  return {
    summary: resume.sectionVisibility?.summary ?? true,
    experience: resume.sectionVisibility?.experience ?? true,
    education: resume.sectionVisibility?.education ?? true,
    projects: resume.sectionVisibility?.projects ?? true,
    skills: resume.sectionVisibility?.skills ?? true,
    additionalInformation: resume.sectionVisibility?.additionalInformation ?? true,
  };
}

function writePdfHeader(state: PdfState, resume: ExportableResume): void {
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(16);
  writePdfWrappedLine(state, resume.name, 0, 20);

  if (resume.title) {
    state.doc.setFont('helvetica', 'normal');
    state.doc.setFontSize(13);
    writePdfWrappedLine(state, resume.title);
  }

  state.y += 8;
  state.doc.setFontSize(10.5);
}

function writePdfContacts(state: PdfState, resume: ExportableResume, locale: ExportLocale): void {
  const primaryContacts = [
    resume.contact?.location ? { label: locale.contact.location, value: resume.contact.location } : null,
    resume.contact?.email ? { label: locale.contact.email, value: resume.contact.email } : null,
    resume.contact?.phone ? { label: locale.contact.phone, value: resume.contact.phone } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  writePdfInlineLabeledPairs(state, primaryContacts, 13);

  const linkContacts = [
    resume.contact?.linkedin ? { label: locale.contact.linkedin, value: resume.contact.linkedin } : null,
    resume.contact?.github ? { label: locale.contact.github, value: resume.contact.github } : null,
    resume.contact?.portfolio ? { label: locale.contact.portfolio, value: resume.contact.portfolio } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  writePdfInlineLabeledPairs(state, linkContacts, 13);

  state.y += 8;
}

function writePdfSummary(state: PdfState, resume: ExportableResume, locale: ExportLocale): void {
  if (!resume.summary) return;
  writePdfSectionTitle(state, locale.sections.summary);
  writePdfWrappedLine(state, resume.summary, 0, 11);
}

function writePdfExperience(state: PdfState, resume: ExportableResume, locale: ExportLocale): void {
  const experience = resume.experience ?? [];
  if (experience.length === 0) return;

  writePdfSectionTitle(state, locale.sections.experience);
  for (const item of experience) {
    writePdfWrappedLine(state, `${item.role} - ${item.company} (${item.period})`, 0, 11);
    for (const detail of item.description) {
      writePdfWrappedLine(state, `- ${detail}`, 10, 10.5);
    }
    state.y += 4;
  }
}

function writePdfEducation(state: PdfState, resume: ExportableResume, locale: ExportLocale): void {
  const education = resume.education ?? [];
  if (education.length === 0) return;

  writePdfSectionTitle(state, locale.sections.education);
  for (const item of education) {
    writePdfWrappedLine(state, `${item.degree}, ${item.institution} (${item.year})`, 0, 11);
  }
}

function writePdfProjects(state: PdfState, resume: ExportableResume, locale: ExportLocale): void {
  const projects = resume.keyProjects ?? [];
  if (projects.length === 0) return;

  writePdfSectionTitle(state, locale.sections.projects);
  for (const item of projects) {
    state.doc.setFont('helvetica', 'bold');
    state.doc.setFontSize(12.5);
    writePdfWrappedLine(state, item.title, 0, 14);
    state.doc.setFontSize(10.5);
    for (const detail of item.description) {
      if (detail.startsWith('Problem/Motivation:') || detail.startsWith('Solution/Benefit:') || detail.startsWith('ปัญหา/แรงจูงใจ:') || detail.startsWith('แนวทางแก้/ประโยชน์:')) {
        const separatorIndex = detail.indexOf(':');
        const label = detail.slice(0, separatorIndex + 1);
        const value = detail.slice(separatorIndex + 1).trim();

        state.doc.setFont('helvetica', 'bold');
        writePdfWrappedLine(state, `- ${label}`, 10, 10.5);
        state.doc.setFont('helvetica', 'normal');
        writePdfWrappedLine(state, value, 18, 10.5);
      } else {
        state.doc.setFont('helvetica', 'normal');
        writePdfWrappedLine(state, `- ${detail}`, 10, 10.5);
      }
    }
    state.y += 4;
  }
}

function writePdfSkillBullet(state: PdfState, title: string, items: string[], language: ExportLanguage): void {
  const localizedTitle = localizeSkillGroupTitle(title, language);
  const suffix = items.join(', ');
  const inlineThreshold = 110;

  if (suffix.length <= inlineThreshold) {
    state.doc.setFont('helvetica', 'bold');
    state.doc.setFontSize(10.5);
    writePdfWrappedLine(state, `- ${localizedTitle}:`, 0, 13);
    state.doc.setFont('helvetica', 'normal');
    writePdfWrappedLine(state, suffix, 12, 13);
    return;
  }

  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(10.5);
  writePdfWrappedLine(state, `- ${localizedTitle}:`, 0, 11);
  state.doc.setFont('helvetica', 'normal');
  for (const item of items) {
    writePdfWrappedLine(state, `- ${item}`, 12, 10.5);
  }
  state.y += 2;
}

function writePdfSkills(state: PdfState, resume: ExportableResume, locale: ExportLocale, language: ExportLanguage): void {
  const groups = resume.skillGroups ?? [];
  if (groups.length === 0) return;

  writePdfSectionTitle(state, locale.sections.skills);
  for (const group of groups) {
    writePdfSkillBullet(state, group.title, group.items, language);
  }
}

function writePdfAdditionalInfo(state: PdfState, resume: ExportableResume, locale: ExportLocale): void {
  const additionalInfo = resume.additionalInformation ?? [];
  if (additionalInfo.length === 0) return;

  writePdfSectionTitle(state, locale.sections.additionalInformation);
  for (const item of additionalInfo) {
    writePdfWrappedLine(state, `- ${item}`, 0, 10.5);
  }
}

function triggerDownload(url: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

async function exportResumeAsImage(
  element: HTMLElement,
  filename: string,
  format: 'png' | 'jpg',
): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
  });

  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const quality = format === 'png' ? 1 : 0.95;
  const dataUrl = canvas.toDataURL(mimeType, quality);
  triggerDownload(dataUrl, `${filename}.${format}`);
}

async function exportElementAsPdf(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    onclone: (documentClone) => {
      const clonedElement = documentClone.body.querySelector('[data-resume-export-root="true"]') as HTMLElement | null;
      if (clonedElement) {
        clonedElement.style.transform = 'scale(0.92)';
        clonedElement.style.transformOrigin = 'top left';
        clonedElement.style.width = '108.695652%';
      }
    },
  });
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });

  const margin = 18;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const printableWidth = pageWidth - (margin * 2);
  const printableHeight = pageHeight - (margin * 2);

  const scale = Math.min(printableWidth / canvas.width, printableHeight / canvas.height);
  const renderedWidth = canvas.width * scale;
  const renderedHeight = canvas.height * scale;

  pdf.addImage(
    canvas.toDataURL('image/png'),
    'PNG',
    margin,
    margin,
    renderedWidth,
    renderedHeight,
    undefined,
    'FAST',
  );

  pdf.save(`${filename}.pdf`);
}

function exportResumeAsPdf(resume: ExportableResume, filename: string, language: ExportLanguage = 'en'): void {
  const state = createPdfState();
  const visibility = resolveVisibility(resume);
  const locale = getExportLocale(language);

  writePdfHeader(state, resume);
  writePdfContacts(state, resume, locale);

  if (visibility.summary) writePdfSummary(state, resume, locale);
  if (visibility.experience) writePdfExperience(state, resume, locale);
  if (visibility.education) writePdfEducation(state, resume, locale);
  if (visibility.projects) writePdfProjects(state, resume, locale);
  if (visibility.skills) writePdfSkills(state, resume, locale, language);
  if (visibility.additionalInformation) writePdfAdditionalInfo(state, resume, locale);

  state.doc.save(`${filename}.pdf`);
}

function limitWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }

  return `${words.slice(0, maxWords).join(' ')}...`;
}

function buildAtsResume(resume: ExportableResume, profile: AtsExportProfile): ExportableResume {
  const limitedProjects = (resume.keyProjects ?? [])
    .slice(0, profile.maxProjects)
    .map((project) => ({
      ...project,
      description: project.description.slice(0, profile.maxBulletsPerProject),
    }));

  return {
    ...resume,
    summary: resume.summary ? limitWords(resume.summary, profile.summaryMaxWords) : resume.summary,
    keyProjects: limitedProjects,
    sectionVisibility: {
      ...resume.sectionVisibility,
      experience: profile.includeExperience,
    },
    experience: profile.includeExperience ? resume.experience : [],
  };
}

abstract class ContentExporter {
  constructor(private readonly notify: NotifyFn) {}

  public export(data: unknown, filename: string, options?: ExportOptions): void {
    try {
      const formattedData = this.formatData(data, options);
      const mimeType = this.getMimeType();
      const extension = this.getExtension();
      this.downloadFile(formattedData, filename, mimeType, extension);
      this.notify(`Exporting ${filename}.${extension}...`, 'SUCCESS');
    } catch (error) {
      console.error('Export failed:', error);
      this.notify('Export failed. Check console.', 'ERROR');
    }
  }

  protected abstract formatData(data: unknown, options?: ExportOptions): string;
  protected abstract getMimeType(): string;
  protected abstract getExtension(): string;

  protected downloadFile(content: string, filename: string, mimeType: string, extension: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${filename}.${extension}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }
}

export class MarkdownExporter extends ContentExporter {
  protected formatData(data: unknown, options?: ExportOptions): string {
    const resume = asExportableResume(data);
    if (!resume) {
      return JSON.stringify(data, null, 2);
    }

    const language = options?.language ?? 'en';
    const locale = getExportLocale(language);

    const lines = [`# ${resume.name}`];
    const experienceSection = buildExperienceSection(resume);
    const educationSection = buildEducationSection(resume);
    const projectsSection = buildProjectsSection(resume);
    const markdownContactLines = buildMarkdownContactLines(resume, locale);
    if (resume.title) {
      lines.push(`## ${resume.title}`);
    }

    if (markdownContactLines.length > 0) {
      lines.push('', `## ${locale.sections.contact}`, ...markdownContactLines);
    }

    if (resume.summary) {
      lines.push('', `> ${resume.summary}`);
    }

    pushSection(lines, `## ${locale.sections.experience}`, experienceSection);
    pushSection(lines, `## ${locale.sections.education}`, educationSection);
    pushSection(lines, `## ${locale.sections.projects}`, projectsSection);
    pushSection(lines, `## ${locale.sections.skills}`, buildSkillLines(resume, language).join('\n'));

    return lines.join('\n');
  }

  protected getMimeType() { return 'text/markdown'; }
  protected getExtension() { return 'md'; }
}

export class JsonExporter extends ContentExporter {
  protected formatData(data: unknown): string { return JSON.stringify(data, null, 2); }
  protected getMimeType() { return 'application/json'; }
  protected getExtension() { return 'json'; }
}

export function createResumeExporters(notify: NotifyFn) {
  return {
    markdown: new MarkdownExporter(notify),
    json: new JsonExporter(notify),
    png: {
      export: async (element: HTMLElement, filename: string) => {
        try {
          await exportResumeAsImage(element, filename, 'png');
          notify(`Exporting ${filename}.png...`, 'SUCCESS');
        } catch (error) {
          console.error('PNG export failed:', error);
          notify('PNG export failed. Check console.', 'ERROR');
        }
      },
    },
    jpg: {
      export: async (element: HTMLElement, filename: string) => {
        try {
          await exportResumeAsImage(element, filename, 'jpg');
          notify(`Exporting ${filename}.jpg...`, 'SUCCESS');
        } catch (error) {
          console.error('JPG export failed:', error);
          notify('JPG export failed. Check console.', 'ERROR');
        }
      },
    },
    pdf: {
      export: async (data: unknown, filename: string, language: ExportLanguage = 'en', element?: HTMLElement) => {
        try {
          const resume = asExportableResume(data);
          if (!resume) {
            notify('PDF export failed. Invalid resume data.', 'ERROR');
            return;
          }

          if (language === 'th') {
            if (!element) {
              notify('PDF TH export failed. Resume element not found.', 'ERROR');
              return;
            }
            await exportElementAsPdf(element, filename);
            notify(`Exporting ${filename}.pdf...`, 'SUCCESS');
            return;
          }

          exportResumeAsPdf(resume, filename, language);
          notify(`Exporting ${filename}.pdf...`, 'SUCCESS');
        } catch (error) {
          console.error('PDF export failed:', error);
          notify('PDF export failed. Check console.', 'ERROR');
        }
      },
    },
    atsPdf: {
      export: async (data: unknown, filename: string, profile: AtsExportProfile, language: ExportLanguage = 'en', element?: HTMLElement) => {
        try {
          const resume = asExportableResume(data);
          if (!resume) {
            notify('ATS PDF export failed. Invalid resume data.', 'ERROR');
            return;
          }

          if (language === 'th') {
            if (!element) {
              notify('ATS PDF TH export failed. Resume element not found.', 'ERROR');
              return;
            }
            await exportElementAsPdf(element, `${filename}-ats-internship`);
            notify(`Exporting ${filename}-ats-internship.pdf...`, 'SUCCESS');
            return;
          }

          const atsResume = buildAtsResume(resume, profile);
          exportResumeAsPdf(atsResume, `${filename}-ats-internship`, language);
          notify(`Exporting ${filename}-ats-internship.pdf...`, 'SUCCESS');
        } catch (error) {
          console.error('ATS PDF export failed:', error);
          notify('ATS PDF export failed. Check console.', 'ERROR');
        }
      },
    },
  };
}
