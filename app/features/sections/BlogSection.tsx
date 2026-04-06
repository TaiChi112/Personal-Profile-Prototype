import { InteractiveContentNode } from '../../components/content/InteractiveContentNode';
import { ContentSectionShell } from '../../components/section/SectionPrimitives';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import { BLOGS_TREE } from '../../services/content/ContentTreeSetup';
import type { EventType } from '../../services/system/notification/NotificationBridge';

type BlogSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  activeNodeId: string | null;
  isAdmin: boolean;
  onNotify: (message: string, level: EventType) => void;
};

export function BlogSection({ currentStyle, labels, activeNodeId, isAdmin, onNotify }: BlogSectionProps) {
  return (
    <ContentSectionShell title={labels.sections.blog} description={labels.sections.blogDesc} currentStyle={currentStyle}>
      {BLOGS_TREE.children.map((node) => (
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
