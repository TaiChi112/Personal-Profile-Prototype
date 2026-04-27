"use client";

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { InteractiveContentNode } from '../../components/content/InteractiveContentNode';
import { ContentSectionShell } from '../../components/section/SectionPrimitives';
import type { CompositeNode, LayoutNode, UnifiedContentItem } from '../../interfaces/content-tree';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import { ARTICLES_TREE } from '../../services/content/ContentTreeSetup';
import type { EventType } from '../../services/system/notification/NotificationBridge';

type ArticlesSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  activeNodeId: string | null;
  selectedArticleParam?: string;
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

export function ArticlesSection({ currentStyle, labels, activeNodeId, selectedArticleParam, isAdmin, onNotify }: Readonly<ArticlesSectionProps>) {
  const router = useRouter();
  const normalizedParam = useMemo(() => decodeURIComponent(selectedArticleParam ?? '').trim().toLowerCase(), [selectedArticleParam]);

  const selectedNodeId = useMemo(() => {
    if (!normalizedParam) {
      return null;
    }

    return findNodeByParam(ARTICLES_TREE, normalizedParam);
  }, [normalizedParam]);

  const effectiveActiveNodeId = selectedNodeId ?? activeNodeId;

  const handleArticleTitleClick = (item: UnifiedContentItem) => {
    router.push(`/articles/${encodeURIComponent(item.title)}`);
    onNotify(`Opened: ${item.title}`, 'INFO');
  };

  return (
    <ContentSectionShell title={labels.sections.articles} description={labels.sections.articlesDesc} currentStyle={currentStyle}>
      {ARTICLES_TREE.children.map((node) => (
        <InteractiveContentNode
          key={node.id}
          node={node}
          style={currentStyle}
          labels={labels}
          activeNodeId={effectiveActiveNodeId}
          isAdmin={isAdmin}
          notify={onNotify}
          onTitleClick={handleArticleTitleClick}
        />
      ))}
    </ContentSectionShell>
  );
}
