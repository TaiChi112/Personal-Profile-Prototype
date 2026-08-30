import { useMemo } from 'react';
import { BarChart3, PieChart } from 'lucide-react';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { TopicCloud } from '../../components/dashboard/TopicCloud';
import { SectionHeader } from '../../components/section/SectionPrimitives';
import type { CompositeNode } from '../../interfaces/content-tree';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import { analyzeContentTrees } from '../../services/content/ContentTreeAnalysis';
import type { EventType } from '../../services/system/notification/NotificationBridge';
import type { Project } from '../../data/content';

type DashboardSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  projectsList: Project[];
  blogsTree: CompositeNode;
  articlesTree: CompositeNode;
  isAdmin: boolean;
  onNotify: (message: string, level: EventType) => void;
};

export function DashboardSection({ currentStyle, labels, projectsList, blogsTree, articlesTree, isAdmin, onNotify }: DashboardSectionProps) {
  const { stats, tags } = useMemo(() => {
    const analysis = analyzeContentTrees([blogsTree, articlesTree]);
    
    // Add projects to tags and stats
    const updatedStats = { ...analysis.stats, project: projectsList.length, total: analysis.stats.total + projectsList.length };
    
    const tagSet = new Set<string>(analysis.tags);
    projectsList.forEach(p => {
      p.techStack.forEach(t => {
        tagSet.add(t);
      });
    });

    return { stats: updatedStats, tags: Array.from(tagSet) };
  }, [projectsList, blogsTree, articlesTree]);

  const overviewMetrics = [
    { label: 'Total Items', value: stats.total, valueClassName: 'text-gray-900 dark:text-white' },
    { label: 'Projects', value: stats.project, valueClassName: 'text-blue-600 dark:text-blue-400' },
    { label: 'Blog Posts', value: stats.blog, valueClassName: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Podcasts', value: stats.podcast, valueClassName: 'text-purple-600 dark:text-purple-400' },
  ];

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <SectionHeader title={labels.sections.dashboard} description={labels.sections.dashboardDesc} currentStyle={currentStyle} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className={`${currentStyle.getCardClass()} p-6`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-lg ${currentStyle.name === 'Future' ? 'bg-cyan-900/30 text-cyan-400' : 'bg-blue-100 text-blue-600'}`}>
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold dark:text-white">Content Overview</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {overviewMetrics.map((metric) => (
              <MetricCard key={metric.label} label={metric.label} value={metric.value} valueClassName={metric.valueClassName} />
            ))}
          </div>
        </div>

        <div className={`${currentStyle.getCardClass()} p-6`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-lg ${currentStyle.name === 'Future' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
              <PieChart size={24} />
            </div>
            <h3 className="text-xl font-bold dark:text-white">Topic Cloud</h3>
          </div>
          <TopicCloud tags={tags} currentStyle={currentStyle} onNotify={onNotify} />
        </div>
      </div>

      
    </div>
  );
}
