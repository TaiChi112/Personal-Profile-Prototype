import { InteractiveContentNode } from '../../components/content/InteractiveContentNode';
import { ContentSectionShell } from '../../components/section/SectionPrimitives';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import { ARTICLES_TREE } from '../../services/content/ContentTreeSetup';
import type { EventType } from '../../services/system/notification/NotificationBridge';

type ArticlesSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  activeNodeId: string | null;
  isAdmin: boolean;
  onNotify: (message: string, level: EventType) => void;
};

export function ArticlesSection({ currentStyle, labels, activeNodeId, isAdmin, onNotify }: ArticlesSectionProps) {
  return (
    <ContentSectionShell title={labels.sections.articles} description={labels.sections.articlesDesc} currentStyle={currentStyle}>
      {ARTICLES_TREE.children.map((node) => (
        <InteractiveContentNode
          key={node.id}
          node={node}
          style={currentStyle}
          labels={labels}
          activeNodeId={activeNodeId}
          isAdmin={isAdmin}
          notify={onNotify}
        />
      ))}
    </ContentSectionShell>
  );
}
