"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { InteractiveContentNode } from '../../components/content/InteractiveContentNode';
import { ContentSectionShell } from '../../components/section/SectionPrimitives';
import { normalizeExternalUrl } from '../../data/resume';
import { LayoutGrid, List, Clock } from 'lucide-react';
import type { CompositeNode, LayoutNode, UnifiedContentItem, LayoutStyleType } from '../../interfaces/content-tree';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import type { EventType } from '../../services/system/notification/NotificationBridge';

type ProjectsSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  projectTree: CompositeNode;
  activeNodeId: string | null;
  selectedProjectParam?: string;
  isAdmin: boolean;
  onNotify: (message: string, level: EventType) => void;
};

const findNodeByParam = (node: LayoutNode | CompositeNode, normalizedParam: string): string | null => {
  if ('data' in node && node.data) {
    const title = node.data.title.trim().toLowerCase();
    const slug = node.data.slug?.trim().toLowerCase();
    if (title === normalizedParam || slug === normalizedParam) {
      return node.id;
    }
  }

  if ('children' in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      const matched = findNodeByParam(child, normalizedParam);
      if (matched) {
        return matched;
      }
    }
  }

  return null;
};

export function ProjectsSection({ currentStyle, labels, projectTree, activeNodeId, selectedProjectParam, isAdmin, onNotify }: Readonly<ProjectsSectionProps>) {
  const router = useRouter();
  const [currentLayout, setCurrentLayout] = useState<LayoutStyleType>('timeline');
  const normalizedParam = useMemo(() => decodeURIComponent(selectedProjectParam ?? '').trim().toLowerCase(), [selectedProjectParam]);

  const selectedNodeId = useMemo(() => {
    if (!normalizedParam) {
      return null;
    }

    return findNodeByParam(projectTree, normalizedParam);
  }, [normalizedParam, projectTree]);

  const effectiveActiveNodeId = selectedNodeId ?? activeNodeId;

  const handleProjectTitleClick = (item: UnifiedContentItem) => {
    if (item.type !== 'project') {
      router.push(`/projects/${encodeURIComponent(item.title)}`);
      onNotify(`Opened: ${item.title}`, 'INFO');
      return;
    }

    const targetUrl = typeof item.actionLink === 'string' ? normalizeExternalUrl(item.actionLink) : null;
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      onNotify(`Opened repository: ${item.title}`, 'SUCCESS');
      return;
    }

    onNotify(`No repository configured for: ${item.title}`, 'WARNING');
  };

  const getLayoutIcon = (layoutStyle: LayoutStyleType, size: number) => {
    if (layoutStyle === 'grid') {
      return <LayoutGrid size={size} />;
    }
    if (layoutStyle === 'list') {
      return <List size={size} />;
    }
    return <Clock size={size} />;
  };

  const getProjectsLayoutClass = () => {
    if (currentLayout === 'grid') {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
    if (currentLayout === 'list') {
      return 'flex flex-col space-y-6';
    }
    if (currentLayout === 'timeline') {
      return 'border-l-2 border-gray-300 dark:border-gray-600 ml-2 pl-4 space-y-6';
    }
    return 'flex flex-col gap-6';
  };

  return (
    <ContentSectionShell title={labels.sections.projects} description={labels.sections.projectsDesc} currentStyle={currentStyle}>
      <div className="flex justify-end mb-6">
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
          {(['grid', 'list', 'timeline'] as LayoutStyleType[]).map((layoutStyle) => (
            <button
              key={layoutStyle}
              onClick={() => setCurrentLayout(layoutStyle)}
              title={`View as ${layoutStyle}`}
              className={`p-2 rounded-md transition-all ${
                currentLayout === layoutStyle
                  ? 'bg-white dark:bg-gray-600 shadow-md text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {getLayoutIcon(layoutStyle, 18)}
            </button>
          ))}
        </div>
      </div>
      <div className={`${getProjectsLayoutClass()} animate-in fade-in duration-300`}>
        {projectTree.children.map((node) => (
          <div
            key={node.id}
            className={currentLayout === 'timeline' ? 'relative' : ''}
          >
            {currentLayout === 'timeline' && (
              <div className="absolute -left-5 top-8 h-3 w-3 rounded-full border-2 border-blue-500 bg-blue-400 shadow-sm" />
            )}
            <InteractiveContentNode
              node={node}
              style={currentStyle}
              labels={labels}
              activeNodeId={effectiveActiveNodeId}
              isAdmin={isAdmin}
              notify={onNotify}
              onTitleClick={handleProjectTitleClick}
            />
          </div>
        ))}
      </div>
    </ContentSectionShell>
  );
}
