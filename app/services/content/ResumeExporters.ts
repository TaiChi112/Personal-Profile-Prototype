import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { AtsExportProfile } from '../../data/resume';

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

function buildMergedSkills(resume: ExportableResume): string[] {
  const flatSkills = resume.skills ?? [];
  const groupedSkills = (resume.skillGroups ?? []).flatMap((group) => group.items);
  return [...new Set([...flatSkills, ...groupedSkills])];
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

function writePdfSectionTitle(state: PdfState, title: string): void {
  state.y += 6;
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(12);
  writePdfWrappedLine(state, title, 0, 18);
  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(10);
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
  state.doc.setFontSize(18);
  writePdfWrappedLine(state, resume.name, 0, 22);

  if (resume.title) {
    state.doc.setFont('helvetica', 'normal');
    state.doc.setFontSize(12);
    writePdfWrappedLine(state, resume.title);
  }

  state.y += 8;
  state.doc.setFontSize(10);
}

function writePdfContacts(state: PdfState, resume: ExportableResume): void {
  if (resume.contact?.location) writePdfWrappedLine(state, `Location: ${resume.contact.location}`, 0, 14);
  if (resume.contact?.email) writePdfWrappedLine(state, `Email: ${resume.contact.email}`, 0, 14);
  if (resume.contact?.phone) writePdfWrappedLine(state, `Phone: ${resume.contact.phone}`, 0, 14);

  const linkEntries = [
    { label: 'LinkedIn', value: resume.contact?.linkedin },
    { label: 'GitHub', value: resume.contact?.github },
    { label: 'Portfolio', value: resume.contact?.portfolio },
  ].filter((entry): entry is { label: string; value: string } => Boolean(entry.value));

  for (const entry of linkEntries) {
    const pageHeight = state.doc.internal.pageSize.getHeight();
    if (state.y > pageHeight - state.margin) {
      state.doc.addPage();
      state.y = state.margin;
    }
    state.doc.textWithLink(`${entry.label}: ${entry.value}`, state.margin, state.y, { url: normalizeUrl(entry.value) });
    state.y += 14;
  }
  state.y += 8;
}

function writePdfSummary(state: PdfState, resume: ExportableResume): void {
  if (!resume.summary) return;
  writePdfSectionTitle(state, 'Summary');
  writePdfWrappedLine(state, resume.summary);
}

function writePdfExperience(state: PdfState, resume: ExportableResume): void {
  const experience = resume.experience ?? [];
  if (experience.length === 0) return;

  writePdfSectionTitle(state, 'Experience');
  for (const item of experience) {
    writePdfWrappedLine(state, `${item.role} - ${item.company} (${item.period})`);
    for (const detail of item.description) {
      writePdfWrappedLine(state, `- ${detail}`, 10);
    }
    state.y += 4;
  }
}

function writePdfEducation(state: PdfState, resume: ExportableResume): void {
  const education = resume.education ?? [];
  if (education.length === 0) return;

  writePdfSectionTitle(state, 'Education');
  for (const item of education) {
    writePdfWrappedLine(state, `${item.degree}, ${item.institution} (${item.year})`);
  }
}

function writePdfProjects(state: PdfState, resume: ExportableResume): void {
  const projects = resume.keyProjects ?? [];
  if (projects.length === 0) return;

  writePdfSectionTitle(state, 'Projects');
  for (const item of projects) {
    state.doc.setFont('helvetica', 'bold');
    writePdfWrappedLine(state, item.title);
    state.doc.setFont('helvetica', 'normal');
    for (const detail of item.description) {
      writePdfWrappedLine(state, `- ${detail}`, 10);
    }
    state.y += 4;
  }
}

function writePdfSkills(state: PdfState, resume: ExportableResume): void {
  const groups = resume.skillGroups ?? [];
  if (groups.length === 0) return;

  writePdfSectionTitle(state, 'Skills');
  for (const group of groups) {
    state.doc.setFont('helvetica', 'bold');
    writePdfWrappedLine(state, group.title);
    state.doc.setFont('helvetica', 'normal');
    for (const item of group.items) {
      writePdfWrappedLine(state, `- ${item}`, 10);
    }
    state.y += 4;
  }
}

function writePdfAdditionalInfo(state: PdfState, resume: ExportableResume): void {
  const additionalInfo = resume.additionalInformation ?? [];
  if (additionalInfo.length === 0) return;

  writePdfSectionTitle(state, 'Additional Information');
  for (const item of additionalInfo) {
    writePdfWrappedLine(state, `- ${item}`);
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

function exportResumeAsPdf(resume: ExportableResume, filename: string): void {
  const state = createPdfState();
  const visibility = resolveVisibility(resume);

  writePdfHeader(state, resume);
  writePdfContacts(state, resume);

  if (visibility.summary) writePdfSummary(state, resume);
  if (visibility.experience) writePdfExperience(state, resume);
  if (visibility.education) writePdfEducation(state, resume);
  if (visibility.skills) writePdfSkills(state, resume);
  if (visibility.projects) writePdfProjects(state, resume);
  if (visibility.additionalInformation) writePdfAdditionalInfo(state, resume);

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

  public export(data: unknown, filename: string): void {
    try {
      const formattedData = this.formatData(data);
      const mimeType = this.getMimeType();
      const extension = this.getExtension();
      this.downloadFile(formattedData, filename, mimeType, extension);
      this.notify(`Exporting ${filename}.${extension}...`, 'SUCCESS');
    } catch (error) {
      console.error('Export failed:', error);
      this.notify('Export failed. Check console.', 'ERROR');
    }
  }

  protected abstract formatData(data: unknown): string;
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
  protected formatData(data: unknown): string {
    const resume = asExportableResume(data);
    if (!resume) {
      return JSON.stringify(data, null, 2);
    }

    const lines = [`# ${resume.name}`];
    const experienceSection = buildExperienceSection(resume);
    const educationSection = buildEducationSection(resume);
    const mergedSkills = buildMergedSkills(resume);

    if (resume.title) {
      lines.push(`## ${resume.title}`);
    }

    if (resume.summary) {
      lines.push('', `> ${resume.summary}`);
    }

    pushSection(lines, '## Experience', experienceSection);
    pushSection(lines, '## Education', educationSection);
    pushSection(lines, '## Skills', mergedSkills.join(', '));

    if (resume.contact?.email || resume.contact?.location) {
      lines.push('', '## Contact');
      if (resume.contact.email) {
        lines.push(`- Email: ${resume.contact.email}`);
      }
      if (resume.contact.location) {
        lines.push(`- Location: ${resume.contact.location}`);
      }
    }

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
      export: (data: unknown, filename: string) => {
        try {
          const resume = asExportableResume(data);
          if (!resume) {
            notify('PDF export failed. Invalid resume data.', 'ERROR');
            return;
          }
          exportResumeAsPdf(resume, filename);
          notify(`Exporting ${filename}.pdf...`, 'SUCCESS');
        } catch (error) {
          console.error('PDF export failed:', error);
          notify('PDF export failed. Check console.', 'ERROR');
        }
      },
    },
    atsPdf: {
      export: (data: unknown, filename: string, profile: AtsExportProfile) => {
        try {
          const resume = asExportableResume(data);
          if (!resume) {
            notify('ATS PDF export failed. Invalid resume data.', 'ERROR');
            return;
          }

          const atsResume = buildAtsResume(resume, profile);
          exportResumeAsPdf(atsResume, `${filename}-ats`);
          notify(`Exporting ${filename}-ats.pdf...`, 'SUCCESS');
        } catch (error) {
          console.error('ATS PDF export failed:', error);
          notify('ATS PDF export failed. Check console.', 'ERROR');
        }
      },
    },
  };
}
