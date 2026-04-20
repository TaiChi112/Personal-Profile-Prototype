import type { ReactNode } from 'react';
import { BookOpen, Briefcase, Code, FileText, Library, Mail, Mic, PieChart, Rss, User } from 'lucide-react';
import type { UILabels } from '../../models/theme/ThemeConfig';

export interface NavItem {
  id: string;
  name: string;
  icon: ReactNode;
  children?: NavItem[];
}

export function createNavItems(labels: UILabels): NavItem[] {
  return [
    { name: labels.nav.home, id: 'home', icon: <User size={18} /> },
    // { name: labels.nav.feed, id: 'feed', icon: <Rss size={18} /> },
    { name: labels.nav.projects, id: 'projects', icon: <Code size={18} /> },
    {
      name: labels.nav.library,
      id: 'library-group',
      icon: <Library size={18} />,
      children: [
        { name: labels.nav.articles, id: 'articles', icon: <BookOpen size={18} /> },
        { name: labels.nav.blog, id: 'blog', icon: <FileText size={18} /> },
        { name: labels.nav.docs, id: 'docs', icon: <FileText size={18} /> },
        { name: labels.nav.podcast, id: 'podcast', icon: <Mic size={18} /> },
      ],
    },
    { name: labels.nav.dashboard, id: 'dashboard', icon: <PieChart size={18} /> },
    { name: labels.nav.resume, id: 'resume', icon: <Briefcase size={18} /> },
    { name: labels.nav.contact, id: 'contact', icon: <Mail size={18} /> },
  ];
}
