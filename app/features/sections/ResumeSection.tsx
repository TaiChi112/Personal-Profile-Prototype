import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, FileCode, FileImage, FileJson, FileText, Image } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getInternshipResume } from '../../data/resume';
import type { ResumeLanguage } from '../../data/resume';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import { createResumeExporters } from '../../services/content/ResumeExporters';
import type { ExportLanguage } from '../../services/content/ResumeExporters';
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

const OWNER_EMAIL = 'anothai.0978452316@gmail.com';

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

function renderProjectDescriptionWithBoldKey(text: string) {
  const labels = ['Problem/Motivation', 'Solution/Benefit', 'ปัญหา/แรงจูงใจ', 'แนวทางแก้/ประโยชน์'];
  const matched = labels.find((label) => text.startsWith(`${label}:`));

  if (!matched) {
    return text;
  }

  const value = text.slice(matched.length + 1).trim();
  return (
    <>
      <strong>{matched}:</strong> {value}
    </>
  );
}

function padDateNumber(value: number): string {
  return String(value).padStart(2, '0');
}

function formatTimelineDate(value: string): string {
  const normalized = value.trim();

  const slashParts = normalized.split('/');
  if (slashParts.length === 3) {
    const [day, month, year] = slashParts;
    const dayNumber = Number(day);
    const monthNumber = Number(month);

    if (!Number.isNaN(dayNumber) && !Number.isNaN(monthNumber) && year) {
      return `${padDateNumber(dayNumber)}/${padDateNumber(monthNumber)}/${year}`;
    }
  }

  const dashParts = normalized.split('-');
  if (dashParts.length === 3) {
    const [year, month, day] = dashParts;
    const dayNumber = Number(day);
    const monthNumber = Number(month);

    if (!Number.isNaN(dayNumber) && !Number.isNaN(monthNumber) && year) {
      return `${padDateNumber(dayNumber)}/${padDateNumber(monthNumber)}/${year}`;
    }
  }

  if (dashParts.length === 2) {
    const [year, month] = dashParts;
    const monthNumber = Number(month);

    if (!Number.isNaN(monthNumber) && year) {
      return `01/${padDateNumber(monthNumber)}/${year}`;
    }
  }

  if (dashParts.length === 1 && dashParts[0].length === 4) {
    return `01/01/${dashParts[0]}`;
  }

  return normalized;
}

function normalizeTimelineState(status?: string): 'present' | 'scale' | 'refactor' | 'maintenance' | 'archive' {
  const source = status?.trim().toLowerCase() ?? '';

  if (source.includes('archive') || source.includes('archived')) {
    return 'archive';
  }

  if (!source || source.includes('กำลังทำอยู่') || source.includes('present') || source.includes('planning')) {
    return 'present';
  }

  if (source.includes('scale')) {
    return 'scale';
  }

  if (source.includes('refactor')) {
    return 'refactor';
  }

  if (source.includes('maintenance') || source.includes('maintenace') || source.includes('maintanace') || source.includes('maintain')) {
    return 'maintenance';
  }

  return 'present';
}

function getProjectTimelineSummary(
  timeline?: { start: string; status?: string },
): string {
  if (!timeline) {
    const state = normalizeTimelineState();
    return `01/01/1970 | ${state}`;
  }

  const startDate = formatTimelineDate(timeline.start);
  const state = normalizeTimelineState(timeline.status);
  return `${startDate} | ${state}`;
}

const VIEW_LABELS: Record<ResumeLanguage, { summary: string; experience: string; education: string; projects: string; skills: string; additionalInformation: string; viewLanguage: string; exportLanguage: string }> = {
  en: {
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    projects: 'Projects',
    skills: 'Skills',
    additionalInformation: 'Additional Information',
    viewLanguage: 'View Language',
    exportLanguage: 'Export Language',
  },
  th: {
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    projects: 'Projects',
    skills: 'Skills',
    additionalInformation: 'Additional Information',
    viewLanguage: 'View Language',
    exportLanguage: 'Export Language',
  },
};

export function ResumeSection({ labels, onNotify }: Readonly<ResumeSectionProps>) {
  const exporters = useMemo(() => createResumeExporters((message, level) => onNotify(message, level)), [onNotify]);
  const resumeDocumentRef = useRef<HTMLDivElement | null>(null);
  const exportControlsRef = useRef<HTMLDivElement | null>(null);
  const exportMenuRef = useRef<HTMLDivElement | null>(null);
  const { data: session, status } = useSession();
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [viewLanguage, setViewLanguage] = useState<ResumeLanguage>('en');
  const [exportLanguage, setExportLanguage] = useState<ExportLanguage>('en');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(() => getInternshipResume('en').keyProjects.map((project) => project.id));
  const resume = useMemo(() => getInternshipResume(viewLanguage), [viewLanguage]);
  const exportResume = useMemo(() => getInternshipResume(exportLanguage), [exportLanguage]);
  const viewLabels = VIEW_LABELS[viewLanguage];
  const isOwnerGoogleSession = status === 'authenticated'
    && session?.user?.email === OWNER_EMAIL
    && (session?.user as { authProvider?: string } | undefined)?.authProvider === 'google';

  const selectAllExportProjects = () => {
    setSelectedProjectIds(exportResume.keyProjects.map((project) => project.id));
  };

  const clearExportProjects = () => {
    setSelectedProjectIds([]);
  };

  const toggleExportProject = (projectId: string) => {
    setSelectedProjectIds((current) => (
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId]
    ));
  };

  const exportFilename = 'resume-anothai-vichapaiboon';

  const runExport = async (format: ExportFormat) => {
    // Hide right-side controls during export to prevent them from being captured
    const originalDisplay = exportControlsRef.current?.style.display;
    if (exportControlsRef.current) {
      exportControlsRef.current.style.display = 'none';
    }

    try {
      const handlers: Record<ExportFormat, () => Promise<void> | void> = {
        md: () => exporters.markdown.export(exportResume, exportFilename, { language: exportLanguage }),
        json: () => exporters.json.export(exportResume, exportFilename),
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
        pdf: async () => {
          if (!resumeDocumentRef.current) {
            onNotify('Cannot export PDF. Resume element not found.', 'ERROR');
            return;
          }

          if (isOwnerGoogleSession && selectedProjectIds.length === 0) {
            onNotify('Select at least one project before exporting PDF.', 'WARNING');
            return;
          }

          await exporters.pdf.export(
            exportResume,
            exportFilename,
            exportLanguage,
            resumeDocumentRef.current,
            isOwnerGoogleSession ? { selectedProjectIds } : undefined,
          );
        },
        'ats-pdf': async () => {
          if (!resumeDocumentRef.current) {
            onNotify('Cannot export ATS PDF. Resume element not found.', 'ERROR');
            return;
          }

          if (isOwnerGoogleSession && selectedProjectIds.length === 0) {
            onNotify('Select at least one project before exporting ATS PDF.', 'WARNING');
            return;
          }

          await exporters.atsPdf.export(
            exportResume,
            exportFilename,
            exportResume.atsExportProfile,
            exportLanguage,
            resumeDocumentRef.current,
            isOwnerGoogleSession ? { selectedProjectIds } : undefined,
          );
        },
      };

      await handlers[format]();
    } finally {
      // Restore controls visibility after export
      if (exportControlsRef.current) {
        exportControlsRef.current.style.display = originalDisplay || '';
      }
    }
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
                <span className="font-semibold">{resume.contact.location}</span>
                <a href={`mailto:${resume.contact.email}`} className="font-semibold underline underline-offset-2">{resume.contact.email}</a>
                <span className="font-semibold">{resume.contact.phone}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <a href={`https://${resume.contact.linkedin}`} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">{resume.contact.linkedin}</a>
                <a href={`https://${resume.contact.github}`} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">{resume.contact.github}</a>
                <a href={`https://${resume.contact.portfolio}`} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">{resume.contact.portfolio}</a>
              </div>
            </div>
          </div>
          <div ref={exportControlsRef} className="flex items-start gap-3">
            <div className="rounded-lg border border-black/10 px-2 py-2">
              <div className="text-[11px] uppercase tracking-wider text-black/50 mb-1">{viewLabels.viewLanguage}</div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-2.5 py-1 rounded-md text-xs border ${viewLanguage === 'en' ? 'bg-black text-white border-black' : 'border-black/30 text-black/80 hover:bg-black/5'}`}
                  onClick={() => setViewLanguage('en')}
                >
                  EN
                </button>
                <button
                  className={`px-2.5 py-1 rounded-md text-xs border ${viewLanguage === 'th' ? 'bg-black text-white border-black' : 'border-black/30 text-black/80 hover:bg-black/5'}`}
                  onClick={() => setViewLanguage('th')}
                >
                  TH
                </button>
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
                  <div className="px-3 pt-1 pb-2 text-[11px] uppercase tracking-wider text-white/50">{viewLabels.exportLanguage}</div>
                  <div className="px-3 pb-2 flex items-center gap-2">
                    <button
                      className={`px-2.5 py-1 rounded-md text-xs border ${exportLanguage === 'en' ? 'bg-white text-black border-white' : 'border-white/30 text-white/80 hover:bg-white/10'}`}
                      onClick={() => setExportLanguage('en')}
                    >
                      EN
                    </button>
                    <button
                      className={`px-2.5 py-1 rounded-md text-xs border ${exportLanguage === 'th' ? 'bg-white text-black border-white' : 'border-white/30 text-white/80 hover:bg-white/10'}`}
                      onClick={() => setExportLanguage('th')}
                    >
                      TH
                    </button>
                  </div>
                  {isOwnerGoogleSession && (
                    <div className="px-3 pb-3 pt-1">
                      <div className="text-[11px] uppercase tracking-wider text-white/50 mb-2">PDF Projects</div>
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          className="px-2.5 py-1 rounded-md text-xs border border-white/20 text-white/80 hover:bg-white/10"
                          onClick={selectAllExportProjects}
                        >
                          Select all
                        </button>
                        <button
                          className="px-2.5 py-1 rounded-md text-xs border border-white/20 text-white/80 hover:bg-white/10"
                          onClick={clearExportProjects}
                        >
                          Clear
                        </button>
                      </div>
                      <div className="max-h-44 overflow-y-auto pr-1 space-y-1">
                        {exportResume.keyProjects.map((project) => {
                          const isSelected = selectedProjectIds.includes(project.id);

                          return (
                            <label key={project.id} className="flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-white/5 cursor-pointer text-sm text-white/85">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleExportProject(project.id)}
                                className="mt-0.5 h-4 w-4 rounded border-white/30 bg-transparent text-white focus:ring-white"
                              />
                              <span className="leading-snug">{project.title}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="my-2 border-t border-white/10" />
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
        </div>
        {visibility.summary && <section className="mb-7">
          <h3
            className="text-sm font-bold uppercase tracking-widest mb-3"
          >
            {viewLanguage === 'en' ? labels.sections.summary : viewLabels.summary}
          </h3>
          <p className="leading-relaxed text-[15px]">{resume.summary}</p>
        </section>}
        {visibility.experience && hasExperience && <section className="mb-7">
          <h3
            className="text-sm font-bold uppercase tracking-widest mb-3"
          >
            {viewLanguage === 'en' ? labels.sections.experience : viewLabels.experience}
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

        {visibility.projects && <section className="mb-7">
          <h3
            className="text-sm font-bold uppercase tracking-widest mb-3"
          >
            {viewLabels.projects}
          </h3>
          <div className="space-y-4">
            {resume.keyProjects.map((project) => (
              <div key={project.id} data-project-id={project.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <div className="font-semibold">
                    {project.repoUrl ? (
                      <a href={project.repoUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-black/65 whitespace-nowrap">
                    {getProjectTimelineSummary(project.timeline)}
                  </div>
                </div>
                <ul className="mt-2 list-disc list-outside ml-5 space-y-1">
                  {project.description.map((item) => (
                    <li key={item}>{renderProjectDescriptionWithBoldKey(item)}</li>
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
            {viewLanguage === 'en' ? labels.sections.skills : viewLabels.skills}
          </h3>
          <div className="grid gap-x-6 gap-y-3 lg:grid-cols-3 text-[15px]">
            {resume.skillGroups.map((group) => (
              <div key={group.id} className="break-inside-avoid">
                <h4 className="font-bold mb-0.5">{group.title}</h4>
                <ul className="list-disc list-outside ml-5 space-y-1">
                  {group.items.map((item) => (
                    <li key={`${group.id}-${item}`}>{item}</li>
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
            {viewLabels.education}
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
        {visibility.additionalInformation && <section>
          <h3
            className="text-sm font-bold uppercase tracking-widest mb-3"
          >
            {viewLabels.additionalInformation}
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


