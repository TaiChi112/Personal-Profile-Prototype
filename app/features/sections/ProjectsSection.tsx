"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentSectionShell } from '../../components/section/SectionPrimitives';
import { normalizeExternalUrl } from '../../data/resume';
import { LayoutGrid, List, Github, ExternalLink, Code2 } from 'lucide-react';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import type { EventType } from '../../services/system/notification/NotificationBridge';
import type { Project } from '../../data/content';

type ProjectsSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  projectsList: Project[];
  activeNodeId: string | null;
  selectedProjectParam?: string;
  isAdmin: boolean;
  onNotify: (message: string, level: EventType) => void;
};

export function ProjectsSection({ currentStyle, labels, projectsList, selectedProjectParam, onNotify }: Readonly<ProjectsSectionProps>) {
  const router = useRouter();
  const [currentLayout, setCurrentLayout] = useState<'grid' | 'list'>('grid');

  const handleLaunch = (project: Project) => {
    if (project.repoUrl) {
      router.push(project.repoUrl);
      onNotify(`Launched: ${project.title}`, 'SUCCESS');
    }
  };

  const handleSource = (project: Project) => {
    if (project.githubUrl) {
      const url = normalizeExternalUrl(project.githubUrl);
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
        onNotify(`Opened source: ${project.title}`, 'INFO');
      }
    }
  };

  const gridClass = currentLayout === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'flex flex-col space-y-4';

  return (
    <ContentSectionShell title={labels.sections.projects} description={labels.sections.projectsDesc} currentStyle={currentStyle}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {['All', 'Web', 'AI/ML', 'CLI'].map(cat => (
            <button key={cat} className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 transition-colors">
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setCurrentLayout('grid')}
            className={`p-1.5 rounded-md transition-all ${
              currentLayout === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500'
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setCurrentLayout('list')}
            className={`p-1.5 rounded-md transition-all ${
              currentLayout === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500'
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <div className={`${gridClass} animate-in fade-in duration-300`}>
        {projectsList.map((project) => (
          <div key={project.id} className={`flex ${currentLayout === 'grid' ? 'flex-col' : 'flex-row items-center'} gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow group`}>
            
            <div className={`flex-1 flex flex-col h-full ${currentLayout === 'list' ? 'w-full' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  {project.category && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-sm">
                      {project.category}
                    </span>
                  )}
                </div>
                {project.featured && (
                  <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                {project.techStack.map(tech => (
                  <span key={tech} className="text-xs font-mono px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded border border-blue-100 dark:border-blue-800/30">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50">
                {project.repoUrl ? (
                  <button onClick={() => handleLaunch(project)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                    <Code2 size={14} />
                    Launch App
                  </button>
                ) : null}

                {project.githubUrl ? (
                  <button onClick={() => handleSource(project)} className={`flex items-center gap-1.5 px-3 py-1.5 ${project.repoUrl ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' : 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900'} text-sm font-semibold rounded-lg transition-colors`}>
                    <Github size={14} />
                    View Source
                  </button>
                ) : (
                  <span className="text-xs text-gray-400 dark:text-gray-500 italic">No public repository</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ContentSectionShell>
  );
}
