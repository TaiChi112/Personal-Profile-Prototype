import { InteractiveContentNode } from '../../components/content/InteractiveContentNode';
import { ContentSectionShell } from '../../components/section/SectionPrimitives';
import type { CompositeNode } from '../../interfaces/content-tree';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import type { EventType } from '../../services/system/notification/NotificationBridge';

type ProjectsSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  projectTree: CompositeNode;
  activeNodeId: string | null;
  isAdmin: boolean;
  onNotify: (message: string, level: EventType) => void;
};

export function ProjectsSection({ currentStyle, labels, projectTree, activeNodeId, isAdmin, onNotify }: ProjectsSectionProps) {
  return (
    <ContentSectionShell title={labels.sections.projects} description={labels.sections.projectsDesc} currentStyle={currentStyle}>
      {projectTree.children.map((node) => (
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
