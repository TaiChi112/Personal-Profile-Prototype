import { useMemo } from 'react';
import { FeedItemCard } from '../../components/feed/FeedItemCard';
import { UnifiedFeedSection } from '../../components/feed/UnifiedFeedSection';
import {
  MOCK_BLOGS,
  MOCK_PODCASTS,
  MOCK_PROJECTS,
  MOCK_VIDEOS,
} from '../../data/content';
import type { CompositeNode, UnifiedContentItem } from '../../interfaces/content-tree';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import {
  adaptBlogToUnified,
  adaptPodcastToUnified,
  adaptProjectToUnified,
  adaptVideoToUnified,
} from '../../services/content/ContentTreeSetup';
import { type EventType } from '../../services/system/notification/NotificationBridge';
import { ArticlesSection } from '../sections/ArticlesSection';
import { BlogSection } from '../sections/BlogSection';
import { ContactSection } from '../sections/ContactSection';
import { DashboardSection } from '../sections/DashboardSection';
import { DocsSection } from '../sections/DocsSection';
import { HeroSection } from '../sections/HeroSection';
import { PodcastSection } from '../sections/PodcastSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { ResumeSection } from '../sections/ResumeSection';

type UseContentTabMapperParams = {
  activeTab: string;
  currentStyle: StyleFactory;
  labels: UILabels;
  projectTree: CompositeNode;
  onCloneProject: (item: UnifiedContentItem) => void;
  isAdmin: boolean;
  activeNodeId: string | null;
  onNotify: (message: string, level: EventType) => void;
};

export function useContentTabMapper({
  activeTab,
  currentStyle,
  labels,
  projectTree,
  onCloneProject,
  isAdmin,
  activeNodeId,
  onNotify,
}: UseContentTabMapperParams) {
  return useMemo(() => {
    switch (activeTab) {
      case 'home':
        return <HeroSection currentStyle={currentStyle} labels={labels} />;
      case 'dashboard':
        return (
          <DashboardSection
            currentStyle={currentStyle}
            labels={labels}
            projectTree={projectTree}
            onCloneProject={onCloneProject}
            isAdmin={isAdmin}
            onNotify={onNotify}
          />
        );
      case 'feed':
        return (
          <UnifiedFeedSection
            currentStyle={currentStyle}
            labels={labels}
            projects={MOCK_PROJECTS}
            blogs={MOCK_BLOGS}
            videos={MOCK_VIDEOS}
            podcasts={MOCK_PODCASTS}
            adaptProject={adaptProjectToUnified}
            adaptBlog={adaptBlogToUnified}
            adaptVideo={adaptVideoToUnified}
            adaptPodcast={adaptPodcastToUnified}
            notify={onNotify}
            renderItem={(item, currentLayout) => (
              <FeedItemCard
                item={item}
                currentLayout={currentLayout}
                style={currentStyle}
                labels={labels}
                isAdmin={isAdmin}
                onOpenTitle={(itemTitle) => onNotify(`Viewing details for: ${itemTitle}`, 'INFO')}
                onRequestUnlock={() => onNotify('Please ask Admin for access', 'WARNING')}
              />
            )}
          />
        );
      case 'projects':
        return (
          <ProjectsSection
            currentStyle={currentStyle}
            labels={labels}
            projectTree={projectTree}
            activeNodeId={activeNodeId}
            isAdmin={isAdmin}
            onNotify={onNotify}
          />
        );
      case 'podcast':
        return <PodcastSection currentStyle={currentStyle} labels={labels} onNotify={onNotify} />;
      case 'articles':
        return (
          <ArticlesSection
            currentStyle={currentStyle}
            labels={labels}
            activeNodeId={activeNodeId}
            isAdmin={isAdmin}
            onNotify={onNotify}
          />
        );
      case 'blog':
        return (
          <BlogSection
            currentStyle={currentStyle}
            labels={labels}
            activeNodeId={activeNodeId}
            isAdmin={isAdmin}
            onNotify={onNotify}
          />
        );
      case 'docs':
        return <DocsSection currentStyle={currentStyle} labels={labels} />;
      case 'resume':
        return <ResumeSection currentStyle={currentStyle} labels={labels} onNotify={onNotify} />;
      case 'contact':
        return <ContactSection currentStyle={currentStyle} labels={labels} onNotify={onNotify} />;
      default:
        return <HeroSection currentStyle={currentStyle} labels={labels} />;
    }
  }, [activeTab, activeNodeId, currentStyle, isAdmin, labels, onCloneProject, onNotify, projectTree]);
}
