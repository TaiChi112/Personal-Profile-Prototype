import { useMemo } from 'react';
import { FeedItemCard } from '../../components/feed/FeedItemCard';
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
import dynamic from 'next/dynamic';

const ArticlesSection = dynamic(() => import('../sections/ArticlesSection').then(mod => mod.ArticlesSection));
const BlogSection = dynamic(() => import('../sections/BlogSection').then(mod => mod.BlogSection));
const ContactSection = dynamic(() => import('../sections/ContactSection').then(mod => mod.ContactSection));
const DashboardSection = dynamic(() => import('../sections/DashboardSection').then(mod => mod.DashboardSection));
const DocsSection = dynamic(() => import('../sections/DocsSection').then(mod => mod.DocsSection));
const HeroSection = dynamic(() => import('../sections/HeroSection').then(mod => mod.HeroSection));
const PodcastSection = dynamic(() => import('../sections/PodcastSection').then(mod => mod.PodcastSection));
const ProjectsSection = dynamic(() => import('../sections/ProjectsSection').then(mod => mod.ProjectsSection));
const ResumeSection = dynamic(() => import('../sections/ResumeSection').then(mod => mod.ResumeSection));
const UnifiedFeedSection = dynamic(() => import('../../components/feed/UnifiedFeedSection').then(mod => mod.UnifiedFeedSection)) as typeof import('../../components/feed/UnifiedFeedSection').UnifiedFeedSection;

type UseContentTabMapperParams = {
  activeTab: string;
  selectedDocParam?: string;
  selectedProjectParam?: string;
  selectedBlogParam?: string;
  selectedArticleParam?: string;
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
  selectedDocParam,
  selectedProjectParam,
  selectedBlogParam,
  selectedArticleParam,
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
                onRequestUnlock={() => onNotify('Please sign in with Google to access this content', 'WARNING')}
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
            selectedProjectParam={selectedProjectParam}
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
            selectedArticleParam={selectedArticleParam}
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
            selectedBlogParam={selectedBlogParam}
            isAdmin={isAdmin}
            onNotify={onNotify}
          />
        );
      case 'docs':
        return <DocsSection currentStyle={currentStyle} labels={labels} selectedDocParam={selectedDocParam} />;
      case 'resume':
        return <ResumeSection currentStyle={currentStyle} labels={labels} onNotify={onNotify} />;
      case 'contact':
        return <ContactSection currentStyle={currentStyle} labels={labels} onNotify={onNotify} />;
      default:
        return <HeroSection currentStyle={currentStyle} labels={labels} />;
    }
  }, [
    activeTab,
    activeNodeId,
    currentStyle,
    isAdmin,
    labels,
    onCloneProject,
    onNotify,
    projectTree,
    selectedArticleParam,
    selectedBlogParam,
    selectedDocParam,
    selectedProjectParam,
  ]);
}
