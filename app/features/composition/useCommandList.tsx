import { useMemo } from 'react';
import { Code, Mail, Mic, Monitor, Moon, PieChart, PlayCircle, User, UserCheck, X } from 'lucide-react';
import {
  NavigateCommand,
  StartTourCommand,
  SwitchStyleCommand,
  ToggleRoleCommand,
  ToggleThemeCommand,
  type ICommand,
} from '../../models/command/Commands';
import type { EventType } from '../../services/system/notification/NotificationBridge';
import type { StyleKey } from '../../models/theme/ThemeConfig';

type UseCommandListParams = {
  activeTab: string;
  styleKey: StyleKey;
  setActiveTab: (tab: string) => void;
  setStyleKey: (style: StyleKey) => void;
  toggleDark: () => void;
  toggleRole: () => void;
  startTour: () => void;
  notify: (message: string, level: EventType) => void;
};

export function useCommandList({
  activeTab,
  styleKey,
  setActiveTab,
  setStyleKey,
  toggleDark,
  toggleRole,
  startTour,
  notify,
}: UseCommandListParams): ICommand[] {
  return useMemo(
    () => [
      new NavigateCommand('nav-home', 'Go to Home', <User size={16} />, 'home', setActiveTab, () => activeTab, notify),
      new NavigateCommand('nav-projects', 'Go to Projects', <Code size={16} />, 'projects', setActiveTab, () => activeTab, notify),
      new NavigateCommand('nav-dashboard', 'Go to Analytics', <PieChart size={16} />, 'dashboard', setActiveTab, () => activeTab, notify),
      new NavigateCommand('nav-podcast', 'Go to Podcast', <Mic size={16} />, 'podcast', setActiveTab, () => activeTab, notify),
      new NavigateCommand('nav-contact', 'Go to Contact', <Mail size={16} />, 'contact', setActiveTab, () => activeTab, notify),
      new ToggleThemeCommand(<Moon size={16} />, toggleDark, notify),
      new SwitchStyleCommand('style-modern', 'Style: Modern', <Monitor size={16} />, 'modern', setStyleKey, () => styleKey, notify),
      new SwitchStyleCommand('style-future', 'Style: Future', <Code size={16} />, 'future', setStyleKey, () => styleKey, notify),
      new SwitchStyleCommand('style-minimal', 'Style: Minimal', <X size={16} />, 'minimal', setStyleKey, () => styleKey, notify),
      new ToggleRoleCommand(<UserCheck size={16} />, toggleRole, notify),
      new StartTourCommand(<PlayCircle size={16} />, startTour, notify),
    ],
    [activeTab, notify, setActiveTab, setStyleKey, startTour, styleKey, toggleDark, toggleRole],
  );
}
