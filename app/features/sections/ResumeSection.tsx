import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, FileCode, FileImage, FileJson, FileText, Image, Loader2, Printer } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getInternshipResume, normalizeExternalUrl, validateResumeLinks } from '../../data/resume';
import type { ResumeLanguage } from '../../data/resume';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import { createResumeExporters } from '../../services/content/ResumeExporters';
import { ResumeLeadModal } from './ResumeLeadModal';
import type { ExportLanguage } from '../../services/content/ResumeExporters';
import type { EventType } from '../../services/system/notification/NotificationBridge';

type ResumeSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  onNotify: (message: string, level: EventType) => void;
};

type ExportFormat = 'md' | 'json' | 'png' | 'jpg' | 'pdf' | 'print';

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
      { key: 'print', label: 'Print / Save as ATS PDF', icon: Printer },
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
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [pendingExportFormat, setPendingExportFormat] = useState<ExportFormat | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [viewLanguage, setViewLanguage] = useState<ResumeLanguage>('en');
  const [exportLanguage, setExportLanguage] = useState<ExportLanguage>('en');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(() => getInternshipResume('en').keyProjects.map((project) => project.id));
  const resume = useMemo(() => getInternshipResume(viewLanguage), [viewLanguage]);
  const exportResume = useMemo(() => getInternshipResume(exportLanguage), [exportLanguage]);
  const viewLabels = VIEW_LABELS[viewLanguage];
  const isOwnerGoogleSession = status === 'authenticated'
    && session?.user?.email === OWNER_EMAIL
    && (session?.user as { authProvider?: string } | undefined)?.authProvider === 'google';

  useEffect(() => {
    const warnings = validateResumeLinks(resume);
    if (warnings.length > 0) {
      console.warn('[resume-link-validation]', warnings);
    }
  }, [resume]);

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

  const contactLinks = {
    email: normalizeExternalUrl(`mailto:${resume.contact.email}`),
    linkedin: normalizeExternalUrl(`https://${resume.contact.linkedin}`),
    github: normalizeExternalUrl(`https://${resume.contact.github}`),
    portfolio: normalizeExternalUrl(`https://${resume.contact.portfolio}`),
  };

  const runExport = async (format: ExportFormat) => {
    setIsExporting(true);
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
        print: () => {
          if (isOwnerGoogleSession && selectedProjectIds.length === 0) {
            onNotify('Select at least one project before printing.', 'WARNING');
            return;
          }
          window.print();
        },
      };

      await handlers[format]();
    } catch (err) {
      console.error('Export failed:', err);
      onNotify('Export failed. Please try again or use the Print option.', 'ERROR');
    } finally {
      setIsExporting(false);
      // Restore controls visibility after export
      if (exportControlsRef.current) {
        exportControlsRef.current.style.display = originalDisplay || '';
      }
    }
  };

  const handleExportOptionClick = async (format: ExportFormat) => {
    setIsExportMenuOpen(false);
    if (!isOwnerGoogleSession && (format === 'pdf' || format === 'print')) {
      setPendingExportFormat(format);
      setIsLeadModalOpen(true);
    } else {
      await runExport(format);
    }
  };

  const handleLeadSubmit = async (data: { name: string; company: string; email: string }) => {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to submit lead', err);
    }
    
    setIsLeadModalOpen(false);
    if (pendingExportFormat) {
      await runExport(pendingExportFormat);
      setPendingExportFormat(null);
    }
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
        <div className="pb-6 mb-8 border-b-2 border-[#e5e5e5] flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold mb-1 tracking-tight uppercase text-black">{resume.name}</h1>
            <h2 className="text-base font-semibold mb-4 tracking-wide text-[#666666] uppercase">{resume.title}</h2>
            <div className="flex flex-col gap-1.5 text-sm text-[#333333]">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{resume.contact.location}</span>
                <span className="text-[#b3b3b3]">•</span>
                {contactLinks.email ? (
                  <a href={contactLinks.email} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2 hover:text-black">{resume.contact.email}</a>
                ) : (
                  <span>{resume.contact.email}</span>
                )}
                <span className="text-[#b3b3b3]">•</span>
                <span>{resume.contact.phone}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {contactLinks.linkedin ? (
                  <a href={contactLinks.linkedin} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2 hover:text-black">{resume.contact.linkedin}</a>
                ) : (
                  <span>{resume.contact.linkedin}</span>
                )}
                <span className="text-[#b3b3b3]">•</span>
                {contactLinks.github ? (
                  <a href={contactLinks.github} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2 hover:text-black">{resume.contact.github}</a>
                ) : (
                  <span>{resume.contact.github}</span>
                )}
                <span className="text-[#b3b3b3]">•</span>
                {contactLinks.portfolio ? (
                  <a href={contactLinks.portfolio} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2 hover:text-black">{resume.contact.portfolio}</a>
                ) : (
                  <span>{resume.contact.portfolio}</span>
                )}
              </div>
            </div>
          </div>
          <div ref={exportControlsRef} className="flex items-start gap-3">
            <div className="rounded-lg border border-[#e5e5e5] px-2 py-2">
              <div className="text-[11px] uppercase tracking-wider text-black/50 mb-1">{viewLabels.viewLanguage}</div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-2.5 py-1 rounded-md text-xs border ${viewLanguage === 'en' ? 'bg-black text-white border-black' : 'border-black/30 text-[#333333] hover:bg-black/5'}`}
                  onClick={() => setViewLanguage('en')}
                >
                  EN
                </button>
                <button
                  className={`px-2.5 py-1 rounded-md text-xs border ${viewLanguage === 'th' ? 'bg-black text-white border-black' : 'border-black/30 text-[#333333] hover:bg-black/5'}`}
                  onClick={() => setViewLanguage('th')}
                >
                  TH
                </button>
              </div>
            </div>
            <div ref={exportMenuRef} className="relative">
              <button
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#333333] hover:text-black transition-colors"
                onClick={() => setIsExportMenuOpen((prev) => !prev)}
                disabled={isExporting}
                aria-haspopup="menu"
                aria-expanded={isExportMenuOpen}
              >
                {isExporting ? (
                  <>
                    Processing... <Loader2 size={14} className="animate-spin" />
                  </>
                ) : (
                  <>
                    Export <ChevronDown size={14} className={`${isExportMenuOpen ? 'rotate-180' : ''} transition-transform`} />
                  </>
                )}
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
            className="text-sm font-bold uppercase tracking-widest text-black border-b border-[#cccccc] pb-1.5 mb-4"
          >
            {viewLanguage === 'en' ? labels.sections.summary : viewLabels.summary}
          </h3>
          <p className="leading-snug text-[13.5px] text-[#333333]">{resume.summary}</p>
        </section>}

        {visibility.experience && hasExperience && <section className="mb-7">
          <h3
            className="text-sm font-bold uppercase tracking-widest text-black border-b border-[#cccccc] pb-1.5 mb-4"
          >
            {viewLanguage === 'en' ? labels.sections.experience : viewLabels.experience}
          </h3>
          <div className="space-y-6">
            {resume.experience?.map((experience) => (
              <div key={experience.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className="text-[15px] font-bold text-black">{experience.role}</h4>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#666666]">{experience.period}</span>
                </div>
                <div className="font-semibold italic text-sm text-[#333333] mb-2">
                  {experience.company}
                </div>
                <ul className="list-disc list-outside ml-5 space-y-1.5 text-[13.5px] text-[#333333] leading-snug">
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
            className="text-sm font-bold uppercase tracking-widest text-black border-b border-[#cccccc] pb-1.5 mb-4"
          >
            {viewLabels.projects}
          </h3>
          <div className="space-y-4">
            {resume.keyProjects
              .filter((project) => !isOwnerGoogleSession || selectedProjectIds.includes(project.id))
              .map((project) => (
              <div key={project.id} data-project-id={project.id}>
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <div className="text-[15px] font-bold text-black">
                    {project.repoUrl && normalizeExternalUrl(project.repoUrl) ? (
                      <a href={normalizeExternalUrl(project.repoUrl) ?? undefined} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2 hover:text-[#4d4d4d] transition-colors">
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#666666] whitespace-nowrap">
                    {getProjectTimelineSummary(project.timeline)}
                  </div>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-1.5 text-[13.5px] text-[#333333] leading-snug">
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
            className="text-sm font-bold uppercase tracking-widest text-black border-b border-[#cccccc] pb-1.5 mb-4"
          >
            {viewLanguage === 'en' ? labels.sections.skills : viewLabels.skills}
          </h3>
          <div className="space-y-2 text-[13.5px] leading-snug">
            {resume.skillGroups.map((group) => (
              <div key={group.id} className="break-inside-avoid">
                <span className="font-bold text-black mr-2">{group.title}:</span>
                <span className="text-[#333333]">{group.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>}

        {visibility.education && <section className="mb-7">
          <h3
            className="text-sm font-bold uppercase tracking-widest text-black border-b border-[#cccccc] pb-1.5 mb-4"
          >
            {viewLabels.education}
          </h3>
          <div className="space-y-4">
            {resume.education.map((education) => (
              <div key={education.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-[15px] font-bold text-black">{education.degree}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#666666] whitespace-nowrap">{education.year}</div>
                </div>
                <div className="font-semibold italic text-sm text-[#333333] mb-1.5">{education.institution}</div>
                <ul className="list-disc list-outside ml-5 space-y-1.5 text-[13.5px] text-[#333333] leading-snug">
                  {education.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>}

        {/* {visibility.additionalInformation && <section>
          <h3
            className="text-sm font-bold uppercase tracking-widest text-black border-b border-[#cccccc] pb-1.5 mb-4"
          >
            {viewLabels.additionalInformation}
          </h3>
          <ul className="list-disc list-outside ml-5 space-y-1 text-[14px]">
            {resume.additionalInformation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>} */}

      </div>
      <ResumeLeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
        onSubmit={handleLeadSubmit} 
      />
    </div>
  );
}


