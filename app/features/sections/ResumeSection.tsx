import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, FileCode, FileImage, FileJson, FileText, Image } from 'lucide-react';
import { INTERNSHIP_RESUME } from '../../data/resume';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import { createResumeExporters } from '../../services/content/ResumeExporters';
import type { EventType } from '../../services/system/notification/NotificationBridge';

type ResumeSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  onNotify: (message: string, level: EventType) => void;
};

type ExportFormat = 'md' | 'json' | 'png' | 'jpg' | 'pdf' | 'ats-pdf';

type ExportMenuOption = {
  key: ExportFormat;
  label: string;
  icon: typeof FileText;
};

const EXPORT_GROUPS: Array<{ title: string; options: ExportMenuOption[] }> = [
  {
    title: 'Text Formats',
    options: [
      { key: 'md', label: 'Export Markdown (.md)', icon: FileCode },
      { key: 'json', label: 'Export JSON (.json)', icon: FileJson },
    ],
  },
  {
    title: 'Image Formats',
    options: [
      { key: 'png', label: 'Export PNG (.png)', icon: Image },
      { key: 'jpg', label: 'Export JPG (.jpg)', icon: FileImage },
    ],
  },
  {
    title: 'Document',
    options: [
      { key: 'pdf', label: 'Export PDF (clickable links)', icon: FileText },
      { key: 'ats-pdf', label: 'Export ATS PDF (one-page friendly)', icon: FileText },
    ],
  },
];

export function ResumeSection({ labels, onNotify }: Readonly<ResumeSectionProps>) {
  const exporters = useMemo(() => createResumeExporters((message, level) => onNotify(message, level)), [onNotify]);
  const resume = INTERNSHIP_RESUME;
  const resumeDocumentRef = useRef<HTMLDivElement | null>(null);
  const exportMenuRef = useRef<HTMLDivElement | null>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const exportFilename = 'resume-anothai-vichapaiboon';

  const runExport = async (format: ExportFormat) => {
    const handlers: Record<ExportFormat, () => Promise<void> | void> = {
      md: () => exporters.markdown.export(resume, exportFilename),
      json: () => exporters.json.export(resume, exportFilename),
      png: async () => {
        if (!resumeDocumentRef.current) {
          onNotify('Cannot export PNG. Resume element not found.', 'ERROR');
          return;
        }
        await exporters.png.export(resumeDocumentRef.current, exportFilename);
      },
      jpg: async () => {
        if (!resumeDocumentRef.current) {
          onNotify('Cannot export JPG. Resume element not found.', 'ERROR');
          return;
        }
        await exporters.jpg.export(resumeDocumentRef.current, exportFilename);
      },
      pdf: () => exporters.pdf.export(resume, exportFilename),
      'ats-pdf': () => exporters.atsPdf.export(resume, exportFilename, resume.atsExportProfile),
    };

    await handlers[format]();
  };

  const handleExportOptionClick = async (format: ExportFormat) => {
    await runExport(format);
    setIsExportMenuOpen(false);
  };

  useEffect(() => {
    if (!isExportMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!exportMenuRef.current?.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExportMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExportMenuOpen]);

  const visibility = {
    summary: resume.sectionVisibility?.summary ?? true,
    experience: resume.sectionVisibility?.experience ?? true,
    education: resume.sectionVisibility?.education ?? true,
    projects: resume.sectionVisibility?.projects ?? true,
    skills: resume.sectionVisibility?.skills ?? true,
    additionalInformation: resume.sectionVisibility?.additionalInformation ?? true,
  };
  const hasExperience = (resume.experience?.length ?? 0) > 0;

  return (
    <div className="bg-white text-black py-10 px-4 md:px-8">
      <div ref={resumeDocumentRef} className="max-w-4xl mx-auto">
        <div className="pb-6 mb-6 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">{resume.name}</h1>
            <h2 className="text-lg font-medium mb-4">{resume.title}</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <span>{resume.contact.location}</span>
                <a href={`mailto:${resume.contact.email}`} className="underline underline-offset-2">{resume.contact.email}</a>
                <span>{resume.contact.phone}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <a href={`https://${resume.contact.linkedin}`} target="_blank" rel="noreferrer" className="underline underline-offset-2">{resume.contact.linkedin}</a>
                <a href={`https://${resume.contact.github}`} target="_blank" rel="noreferrer" className="underline underline-offset-2">{resume.contact.github}</a>
                <a href={`https://${resume.contact.portfolio}`} target="_blank" rel="noreferrer" className="underline underline-offset-2">{resume.contact.portfolio}</a>
              </div>
            </div>
          </div>
          <div ref={exportMenuRef} className="relative">
            <button
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-black/80 hover:text-black transition-colors"
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={isExportMenuOpen}
            >
              Export <ChevronDown size={14} className={`${isExportMenuOpen ? 'rotate-180' : ''} transition-transform`} />
            </button>
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 min-w-72 rounded-2xl border border-white/10 bg-[#111317] text-white shadow-2xl py-2 z-20">
                {EXPORT_GROUPS.map((group, groupIndex) => (
                  <div key={group.title}>
                    {groupIndex > 0 && <div className="my-2 border-t border-white/10" />}
                    <div className="px-3 pt-1 pb-2 text-[11px] uppercase tracking-wider text-white/50">{group.title}</div>
                    {group.options.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.key}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 flex items-center justify-between"
                          onClick={() => {
                            void handleExportOptionClick(option.key);
                          }}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Icon size={16} className="text-white/70" />
                            <span>{option.label}</span>
                          </span>
                          <span className="text-white/40">↗</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {visibility.summary && <section className="mb-7">
          <h3
            className="text-sm font-bold uppercase tracking-widest mb-3"
          >
            {labels.sections.summary}
          </h3>
          <p className="leading-relaxed text-[15px]">{resume.summary}</p>
        </section>}
        {visibility.experience && hasExperience && <section className="mb-7">
          <h3
            className="text-sm font-bold uppercase tracking-widest mb-3"
          >
            {labels.sections.experience}
          </h3>
          <div className="space-y-6">
            {resume.experience?.map((experience) => (
              <div key={experience.id}>
                <div className="flex justify-between items-baseline mb-1 gap-2">
                  <h4 className="text-base font-semibold">{experience.role}</h4>
                  <span className="text-sm">{experience.period}</span>
                </div>
                <div className="font-medium mb-2">
                  {experience.company}
                </div>
                <ul className="list-disc list-outside ml-5 space-y-1 text-[15px]">
                  {experience.description.map((description) => (
                    <li key={`${experience.id}-${description}`}>{description}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>}
        {visibility.education && <section className="mb-7">
          <h3
            className="text-sm font-bold uppercase tracking-widest mb-3"
          >
            Education
          </h3>
          <div className="space-y-4">
            {resume.education.map((education) => (
              <div key={education.id} className="p-1">
                <div className="font-semibold">{education.degree}</div>
                <div>{education.institution}</div>
                <div className="text-sm">{education.year}</div>
                <ul className="mt-2 list-disc list-outside ml-5 space-y-1">
                  {education.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>}
        {visibility.skills && <section className="mb-7">
          <h3
            className="text-sm font-bold uppercase tracking-widest mb-3"
          >
            {labels.sections.skills}
          </h3>
          <div className="grid gap-x-6 gap-y-3 lg:grid-cols-3 text-[15px]">
            {resume.skillGroups.map((group) => (
              <div key={group.id} className="break-inside-avoid">
                <h4 className="font-semibold mb-0.5">{group.title}</h4>
                <ul className="list-disc list-outside ml-5 space-y-1">
                  {group.items.map((item) => (
                    <li key={`${group.id}-${item}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>}
        {visibility.projects && <section className="mb-7">
          <h3
            className="text-sm font-bold uppercase tracking-widest mb-3"
          >
            Projects
          </h3>
          <div className="space-y-4">
            {resume.keyProjects.map((project) => (
              <div key={project.id}>
                <div className="font-semibold">{project.title}</div>
                <ul className="mt-2 list-disc list-outside ml-5 space-y-1">
                  {project.description.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>}
        {visibility.additionalInformation && <section>
          <h3
            className="text-sm font-bold uppercase tracking-widest mb-3"
          >
            Additional Information
          </h3>
          <ul className="list-disc list-outside ml-5 space-y-1 text-[15px]">
            {resume.additionalInformation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>}
      </div>
    </div>
  );
}

            
