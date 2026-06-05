import type { ReactNode } from "react";
import {
  BookOpen,
  Briefcase,
  FileText,
  User,
} from "lucide-react";
import type { UILabels } from "../../models/theme/ThemeConfig";

export interface NavItem {
  id: string;
  name: string;
  icon: ReactNode;
  href: string;
  isActivePath?: (pathname: string) => boolean;
  children?: NavItem[];
}

export function createNavItems(labels: UILabels): NavItem[] {
  return [
    { name: labels.nav.home, id: "home", icon: <User size={18} />, href: "/" },
    // { name: labels.nav.feed, id: 'feed', icon: <Rss size={18} />, href: '/feed' },
    // { name: labels.nav.projects, id: 'projects', icon: <Code size={18} />, href: '/projects' },
    { name: labels.nav.docs, id: "docs", icon: <FileText size={18} />, href: "/docs" },
    { name: labels.nav.articles, id: "articles", icon: <BookOpen size={18} />, href: "/articles" },
    { name: labels.nav.blog, id: "blog", icon: <FileText size={18} />, href: "/blogs" },
    // {
    //   name: labels.nav.library,
    //   id: 'library-group',
    //   icon: <Library size={18} />,
    //   href: '/library',
    //   children: [
    //     { name: labels.nav.articles, id: 'articles', icon: <BookOpen size={18} />, href: '/articles' },
    //     { name: labels.nav.blog, id: 'blog', icon: <FileText size={18} />, href: '/blogs' },
    //     { name: labels.nav.docs, id: 'docs', icon: <FileText size={18} />, href: '/docs' },
    //     { name: labels.nav.podcast, id: 'podcast', icon: <Mic size={18} />, href: '/podcast' },
    //   ],
    // },
    // { name: labels.nav.dashboard, id: 'dashboard', icon: <PieChart size={18} />, href: '/analytics' },
    { name: labels.nav.resume, id: "resume", icon: <Briefcase size={18} />, href: "/resume" },
    // { name: labels.nav.contact, id: 'contact', icon: <Mail size={18} />, href: '/contact' },
  ];
}

export function isNavItemActive(
  item: NavItem,
  pathname: string,
  activeTab?: string
): boolean {
  if (activeTab) return item.id === activeTab;

  if (item.isActivePath) {
    return item.isActivePath(pathname);
  }

  if (item.href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(item.href);
}

