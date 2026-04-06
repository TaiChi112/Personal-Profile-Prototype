import type { ResumeData } from '../../data/content';

type NotifyLevel = 'SUCCESS' | 'WARNING' | 'INFO' | 'ERROR';

type NotifyFn = (message: string, level: NotifyLevel) => void;

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
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }
}

export class MarkdownExporter extends ContentExporter {
  protected formatData(data: unknown): string {
    if (typeof data === 'object' && data !== null && 'name' in data && 'experience' in data) {
      const resume = data as ResumeData;
      return `# ${resume.name}\n## ${resume.title}\n\n> ${resume.summary}\n\n## Experience\n${resume.experience.map((entry) => `### ${entry.role} at ${entry.company}\n_${entry.period}_\n${entry.description.map((detail) => `- ${detail}`).join('\n')}`).join('\n\n')}\n\n## Education\n${resume.education.map((entry) => `- **${entry.degree}**, ${entry.institution} (${entry.year})`).join('\n')}\n\n## Skills\n${resume.skills.join(', ')}\n\n## Contact\n- Email: ${resume.contact.email}\n- Location: ${resume.contact.location}`;
    }

    return JSON.stringify(data, null, 2);
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
  };
}
