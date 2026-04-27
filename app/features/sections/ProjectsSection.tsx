"use client";

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { InteractiveContentNode } from '../../components/content/InteractiveContentNode';
import { ContentSectionShell } from '../../components/section/SectionPrimitives';
import type { CompositeNode, LayoutNode, UnifiedContentItem } from '../../interfaces/content-tree';
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
  const normalizedParam = useMemo(() => decodeURIComponent(selectedProjectParam ?? '').trim().toLowerCase(), [selectedProjectParam]);

  const selectedNodeId = useMemo(() => {
    if (!normalizedParam) {
      return null;
    }

    return findNodeByParam(projectTree, normalizedParam);
  }, [normalizedParam, projectTree]);

  const effectiveActiveNodeId = selectedNodeId ?? activeNodeId;

  const handleProjectTitleClick = (item: UnifiedContentItem) => {
    router.push(`/projects/${encodeURIComponent(item.title)}`);

    if (item.type !== 'project') {
      onNotify(`Opened: ${item.title}`, 'INFO');
      return;
    }

    if (typeof item.actionLink === 'string' && /^https?:\/\//i.test(item.actionLink)) {
      window.open(item.actionLink, '_blank', 'noopener,noreferrer');
      onNotify(`Opened repository: ${item.title}`, 'SUCCESS');
      return;
    }

    onNotify(`No repository configured for: ${item.title}`, 'WARNING');
  };

  return (
    <ContentSectionShell title={labels.sections.projects} description={labels.sections.projectsDesc} currentStyle={currentStyle}>
      {projectTree.children.map((node) => (
        <InteractiveContentNode
          key={node.id}
          node={node}
          style={currentStyle}
          labels={labels}
          activeNodeId={effectiveActiveNodeId}
          isAdmin={isAdmin}
          notify={onNotify}
          onTitleClick={handleProjectTitleClick}
        />
      ))}
    </ContentSectionShell>
  );
}
