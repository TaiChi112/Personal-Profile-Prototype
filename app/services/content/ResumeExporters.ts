import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { AtsExportProfile } from '../../data/resume';

export type ExportLanguage = 'en' | 'th';

type ExportOptions = {
  language?: ExportLanguage;
};

type PdfExportOptions = {
  selectedProjectIds?: string[];
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
    repoUrl?: string;
    description: string[];
    timeline?: Array<{
      start: string;
      end?: string;
      status?: string;
      note?: string;
    }>;
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

function formatProjectTimelineRange(start: string, end?: string): string {
  return `${start} - ${end ?? 'Present'}`;
}

function buildProjectsSection(resume: ExportableResume): string {
  return (resume.keyProjects ?? [])
    .map((project) => {
      const projectHeading = project.repoUrl
        ? `[${project.title}](${normalizeUrl(project.repoUrl)})`
        : project.title;

      const timelineLines = (project.timeline ?? []).map((item) => {
        const statusLabel = item.status?.trim() || 'กำลังทำอยู่';
        const notePart = item.note ? ` - ${item.note}` : '';
        return `- ${formatProjectTimelineRange(item.start, item.end)} | ${statusLabel}${notePart}`;
      });

      return [
        `### ${projectHeading}`,
        ...project.description.map((detail) => `- ${formatProjectLabelForMarkdown(detail)}`),
        ...(timelineLines.length > 0 ? ['', `**Timeline:**`, ...timelineLines] : []),
      ].join('\n');
    })
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
  if (
    url.startsWith('http://')
    || url.startsWith('https://')
    || url.startsWith('mailto:')
    || url.startsWith('tel:')
    || url.startsWith('#')
  ) {
    return url;
  }

  return `https://${url}`;
}

function normalizeSkillGroupHeading(title: string): string {
  if (title === 'Languages') {
    return 'Language';
  }

  if (title === 'Frameworks & Tools') {
    return 'Framework & Tools';
  }

  return title;
}

function formatSkillsInPdfClone(documentClone: Document): void {
  const headings = Array.from(documentClone.querySelectorAll('section h3'));
  const skillsHeading = headings.find((heading) => {
    const text = heading.textContent?.trim().toLowerCase();
    return text === 'skills' || text === 'ทักษะ';
  });

  if (!skillsHeading) {
    return;
  }

  const section = skillsHeading.closest('section');
  if (!section) {
    return;
  }

  const groups = Array.from(section.querySelectorAll('div.break-inside-avoid'));
  if (groups.length === 0) {
    return;
  }

  const outputList = documentClone.createElement('ul');
  outputList.className = 'list-disc list-outside ml-5 space-y-1 text-[15px]';

  for (const group of groups) {
    const title = group.querySelector('h4')?.textContent?.trim();
    if (!title) {
      continue;
    }

    const items = Array.from(group.querySelectorAll('li'))
      .map((item) => item.textContent?.trim() ?? '')
      .filter((item) => item.length > 0);

    const listItem = documentClone.createElement('li');
    const normalizedTitle = normalizeSkillGroupHeading(title);
    listItem.innerHTML = `<strong>${normalizedTitle}:</strong> ${items.join(',')}`;
    outputList.appendChild(listItem);
  }

  if (outputList.children.length === 0) {
    return;
  }

  const sourceContainer = section.querySelector('div.grid');
  if (!sourceContainer) {
    return;
  }

  sourceContainer.replaceWith(outputList);
}

function formatAdditionalInformationInPdfClone(documentClone: Document): void {
  const headings = Array.from(documentClone.querySelectorAll('section h3'));
  const additionalInfoHeading = headings.find((heading) => {
    const text = heading.textContent?.trim().toLowerCase();
    return text === 'additional information' || text === 'ข้อมูลเพิ่มเติม';
  });

  if (!additionalInfoHeading) {
    return;
  }

  const section = additionalInfoHeading.closest('section');
  if (!section) {
    return;
  }

  const list = section.querySelector('ul') as HTMLElement | null;
  if (list) {
    // Keep bullets inside the content box so long lines are not clipped
    // by html2canvas on the right edge during PDF rendering.
    list.style.listStylePosition = 'inside';
    list.style.paddingLeft = '0';
    list.style.paddingRight = '12px';
    list.style.marginLeft = '0';
  }

  const listItems = Array.from(section.querySelectorAll('ul li'));
  if (listItems.length === 0) {
    return;
  }

  for (const listItem of listItems) {
    const htmlListItem = listItem as HTMLElement;
    htmlListItem.style.whiteSpace = 'normal';
    htmlListItem.style.overflowWrap = 'break-word';
    htmlListItem.style.wordBreak = 'break-word';
    htmlListItem.style.lineHeight = '1.35';
    htmlListItem.style.display = 'list-item';
    htmlListItem.style.width = '100%';
    htmlListItem.style.maxWidth = '100%';
    htmlListItem.style.paddingRight = '0';
    htmlListItem.style.boxSizing = 'border-box';
  }
}

function filterProjectsInPdfClone(documentClone: Document, selectedProjectIds?: string[]): void {
  if (!selectedProjectIds || selectedProjectIds.length === 0) {
    return;
  }

  const selectedProjectIdSet = new Set(selectedProjectIds);
  const projectBlocks = Array.from(documentClone.querySelectorAll('[data-project-id]')) as HTMLElement[];

  for (const block of projectBlocks) {
    const projectId = block.dataset.projectId;
    if (!projectId || !selectedProjectIdSet.has(projectId)) {
      block.remove();
    }
  }
}

function applyCompactLayoutForPdfClone(clonedRoot: HTMLElement): void {
  // Tighten vertical rhythm in export only so content fits one page more reliably.
  const headerBlock = clonedRoot.querySelector('div.pb-6.mb-6') as HTMLElement | null;
  if (headerBlock) {
    headerBlock.style.paddingBottom = '10px';
    headerBlock.style.marginBottom = '12px';
    headerBlock.style.gap = '10px';
    
    // Make contact info text bold in PDF
    const contactSpans = headerBlock.querySelectorAll('span, a');
    for (const span of contactSpans) {
      (span as HTMLElement).style.fontWeight = 'bold';
    }
  }

  const summarySection = clonedRoot.querySelector('section') as HTMLElement | null;
  if (summarySection) {
    summarySection.style.marginBottom = '14px';
  }

  const sections = Array.from(clonedRoot.querySelectorAll('section')) as HTMLElement[];
  for (const [index, section] of sections.entries()) {
    section.style.marginTop = '0';
    section.style.marginBottom = index === sections.length - 1 ? '0' : '14px';
  }

  const sectionHeadings = Array.from(clonedRoot.querySelectorAll('section h3')) as HTMLElement[];
  for (const heading of sectionHeadings) {
    heading.style.marginBottom = '8px';
    heading.style.lineHeight = '1.15';
  }

  const subHeadings = Array.from(clonedRoot.querySelectorAll('section h4')) as HTMLElement[];
  for (const heading of subHeadings) {
    heading.style.marginBottom = '2px';
    heading.style.lineHeight = '1.2';
    heading.style.fontWeight = 'bold';
  }

  const lists = Array.from(clonedRoot.querySelectorAll('ul')) as HTMLElement[];
  for (const list of lists) {
    list.style.marginTop = '6px';
    list.style.marginBottom = '0';
    list.style.lineHeight = '1.25';
    list.style.listStylePosition = 'outside';
  }

  const listItems = Array.from(clonedRoot.querySelectorAll('li')) as HTMLElement[];
  for (const item of listItems) {
    item.style.display = 'list-item';
    item.style.marginTop = '0';
    item.style.marginBottom = '3px';
    item.style.paddingTop = '0';
    item.style.lineHeight = '1.2';
    item.style.verticalAlign = 'top';
  }

  const paragraphs = Array.from(clonedRoot.querySelectorAll('p')) as HTMLElement[];
  for (const paragraph of paragraphs) {
    paragraph.style.marginTop = '0';
    paragraph.style.marginBottom = '0';
    paragraph.style.lineHeight = '1.35';
  }

  // Add a small breathing room so the last baseline is not clipped by rasterization.
  clonedRoot.style.paddingBottom = '20px';
}

function triggerDownload(url: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function getExportElementDimensions(element: HTMLElement): {
  width: number;
  height: number;
} {
  return {
    width: Math.max(
      element.scrollWidth,
      element.offsetWidth,
      Math.ceil(element.getBoundingClientRect().width),
    ),
    height: Math.max(
      element.scrollHeight,
      element.offsetHeight,
      Math.ceil(element.getBoundingClientRect().height),
    ),
  };
}

async function exportResumeAsImage(
  element: HTMLElement,
  filename: string,
  format: 'png' | 'jpg',
): Promise<void> {
  const { width, height } = getExportElementDimensions(element);

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    scrollX: 0,
    scrollY: 0,
    ignoreElements: (node) => {
      const tag = node.tagName?.toLowerCase();
      return tag === 'svg' || tag === 'path' || tag === 'circle' || tag === 'rect' || tag === 'polygon';
    },
    onclone: (documentClone) => {
      const sanitizeStyle = documentClone.createElement('style');
      sanitizeStyle.textContent = `
        * {
          color: #000000 !important;
          background-color: transparent !important;
          border-color: #000000 !important;
          box-shadow: none !important;
          text-shadow: none !important;
          outline-color: #000000 !important;
        }
        a {
          color: #000000 !important;
          text-decoration: underline !important;
        }
      `;
      documentClone.head.appendChild(sanitizeStyle);
      formatSkillsInPdfClone(documentClone);
      formatAdditionalInformationInPdfClone(documentClone);

      const clonedBody = documentClone.body as HTMLElement | null;
      if (clonedBody) {
        clonedBody.style.overflow = 'visible';
      }
    },
  });

  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const quality = format === 'png' ? 1 : 0.95;
  const dataUrl = canvas.toDataURL(mimeType, quality);
  triggerDownload(dataUrl, `${filename}.${format}`);
}

async function exportElementAsPdf(
  element: HTMLElement,
  filename: string,
  options?: PdfExportOptions,
): Promise<void> {
  const exportRootAttr = `pdf-export-root-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let clonedAnchors: Array<{ href: string; x: number; y: number; width: number; height: number }> = [];
  let clonedContentWidth = 0;
  let clonedContentHeight = 0;

  element.dataset.exportRoot = exportRootAttr;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      ignoreElements: (node) => {
        const tag = node.tagName?.toLowerCase();
        return tag === 'svg' || tag === 'path' || tag === 'circle' || tag === 'rect' || tag === 'polygon';
      },
      onclone: (documentClone) => {
        const sanitizeStyle = documentClone.createElement('style');
        sanitizeStyle.textContent = `
          * {
            color: #000000 !important;
            background-color: transparent !important;
            border-color: #000000 !important;
            box-shadow: none !important;
            text-shadow: none !important;
            outline-color: #000000 !important;
          }
          a {
            color: #000000 !important;
            text-decoration: underline !important;
          }
        `;
        documentClone.head.appendChild(sanitizeStyle);
        formatSkillsInPdfClone(documentClone);
        formatAdditionalInformationInPdfClone(documentClone);

        const clonedRoot = documentClone.querySelector(`[data-export-root="${exportRootAttr}"]`) as HTMLElement | null;
        if (!clonedRoot) {
          return;
        }

        filterProjectsInPdfClone(documentClone, options?.selectedProjectIds);
        clonedRoot.style.overflow = 'visible';
        clonedRoot.style.height = 'auto';
        clonedRoot.style.maxHeight = 'none';
        applyCompactLayoutForPdfClone(clonedRoot);

        const rootRect = clonedRoot.getBoundingClientRect();
        clonedContentWidth = rootRect.width;
        clonedContentHeight = rootRect.height;

        clonedAnchors = Array.from(clonedRoot.querySelectorAll('a[href]'))
          .map((anchor) => {
            const rect = anchor.getBoundingClientRect();
            return {
              href: anchor.getAttribute('href') ?? '',
              x: rect.left - rootRect.left,
              y: rect.top - rootRect.top,
              width: rect.width,
              height: rect.height,
            };
          })
          .filter((anchor) => anchor.href.length > 0 && anchor.width > 0 && anchor.height > 0);
      },
    });
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });

  const margin = 10;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const printableWidth = pageWidth - (margin * 2);
  const printableHeight = pageHeight - (margin * 2);

  const sourceWidth = clonedContentWidth > 0 ? clonedContentWidth : canvas.width;
  const sourceHeight = clonedContentHeight > 0 ? clonedContentHeight : canvas.height;
  const scale = Math.min(printableWidth / sourceWidth, printableHeight / sourceHeight);
  const renderedWidth = sourceWidth * scale;
  const renderedHeight = sourceHeight * scale;
  const pdfScaleX = renderedWidth / Math.max(1, sourceWidth);
  const pdfScaleY = renderedHeight / Math.max(1, sourceHeight);

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

  for (const anchor of clonedAnchors) {
    const mappedX = margin + (anchor.x * pdfScaleX);
    const mappedY = margin + (anchor.y * pdfScaleY);
    const mappedWidth = anchor.width * pdfScaleX;
    const mappedHeight = anchor.height * pdfScaleY;

    pdf.link(mappedX, mappedY, mappedWidth, mappedHeight, { url: normalizeUrl(anchor.href) });
  }

  pdf.save(`${filename}.pdf`);
  } finally {
    delete element.dataset.exportRoot;
  }
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
  const safeNotify: NotifyFn = (message, level) => {
    try {
      notify(message, level);
    } catch (error) {
      console.warn('Notification failed:', error);
    }
  };

  return {
    markdown: new MarkdownExporter(safeNotify),
    json: new JsonExporter(safeNotify),
    png: {
      export: async (element: HTMLElement, filename: string) => {
        try {
          await exportResumeAsImage(element, filename, 'png');
          safeNotify(`Exporting ${filename}.png...`, 'SUCCESS');
        } catch (error) {
          console.error('PNG export failed:', error);
          safeNotify('PNG export failed. Check console.', 'ERROR');
        }
      },
    },
    jpg: {
      export: async (element: HTMLElement, filename: string) => {
        try {
          await exportResumeAsImage(element, filename, 'jpg');
          safeNotify(`Exporting ${filename}.jpg...`, 'SUCCESS');
        } catch (error) {
          console.error('JPG export failed:', error);
          safeNotify('JPG export failed. Check console.', 'ERROR');
        }
      },
    },
    pdf: {
      export: async (
        data: unknown,
        filename: string,
        _language: ExportLanguage = 'en',
        element?: HTMLElement,
        options?: PdfExportOptions,
      ) => {
        try {
          const resume = asExportableResume(data);
          if (!resume) {
            safeNotify('PDF export failed. Invalid resume data.', 'ERROR');
            return;
          }

          if (!element) {
            safeNotify('PDF export failed. Resume element not found.', 'ERROR');
            return;
          }

          await exportElementAsPdf(element, filename, options);
          safeNotify(`Exporting ${filename}.pdf...`, 'SUCCESS');
        } catch (error) {
          console.error('PDF export failed:', error);
          safeNotify('PDF export failed. Check console.', 'ERROR');
        }
      },
    },
    atsPdf: {
      export: async (
        data: unknown,
        filename: string,
        _profile: AtsExportProfile,
        _language: ExportLanguage = 'en',
        element?: HTMLElement,
        options?: PdfExportOptions,
      ) => {
        try {
          const resume = asExportableResume(data);
          if (!resume) {
            safeNotify('ATS PDF export failed. Invalid resume data.', 'ERROR');
            return;
          }

          if (!element) {
            safeNotify('ATS PDF export failed. Resume element not found.', 'ERROR');
            return;
          }

          await exportElementAsPdf(element, `${filename}-ats-internship`, options);
          safeNotify(`Exporting ${filename}-ats-internship.pdf...`, 'SUCCESS');
        } catch (error) {
          console.error('ATS PDF export failed:', error);
          safeNotify('ATS PDF export failed. Check console.', 'ERROR');
        }
      },
    },
  };
}
