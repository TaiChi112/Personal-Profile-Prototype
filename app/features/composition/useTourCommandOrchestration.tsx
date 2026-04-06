import { useEffect, useState } from 'react';
import { historyManager } from '../../models/command/Commands';
import { TourIterator, type TourStep } from '../../models/tour/Tour';
import { useCommandList } from './useCommandList';
import type { EventType } from '../../services/system/notification/NotificationBridge';
import type { StyleKey } from '../../models/theme/ThemeConfig';

type UseTourCommandOrchestrationParams = {
  activeTab: string;
  styleKey: StyleKey;
  setActiveTab: (tab: string) => void;
  setStyleKey: (style: StyleKey) => void;
  toggleDark: () => void;
  toggleRole: () => void;
  notify: (message: string, level: EventType) => void;
};

const TOUR_SEQUENCE: TourStep[] = [
  { type: 'NAV', targetId: 'home', label: 'Start' },
  { type: 'NAV', targetId: 'dashboard', label: 'Stats' },
  { type: 'NAV', targetId: 'projects', label: 'Projects' },
  { type: 'EXPAND', targetId: 'super-app', label: 'Deep Dive' },
  { type: 'RESET_EXPAND', label: 'Reset' },
  { type: 'NAV', targetId: 'feed', label: 'Feed' },
  { type: 'NAV', targetId: 'podcast', label: 'Podcast' },
  { type: 'NAV', targetId: 'articles', label: 'Articles' },
  { type: 'NAV', targetId: 'blog', label: 'Blog' },
  { type: 'NAV', targetId: 'docs', label: 'Docs' },
  { type: 'NAV', targetId: 'resume', label: 'Resume' },
  { type: 'NAV', targetId: 'contact', label: 'Contact' },
];

export function useTourCommandOrchestration({
  activeTab,
  styleKey,
  setActiveTab,
  setStyleKey,
  toggleDark,
  toggleRole,
  notify,
}: UseTourCommandOrchestrationParams) {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const [tourIterator] = useState(() => new TourIterator(TOUR_SEQUENCE));

  const startTour = () => {
    setIsTourActive(true);
    setActiveTab('home');
    tourIterator.reset();
  };

  const stopTour = () => {
    setIsTourActive(false);
    setActiveNodeId(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = useCommandList({
    activeTab,
    styleKey,
    setActiveTab,
    setStyleKey,
    toggleDark,
    toggleRole,
    startTour,
    notify,
  });

  const handleUndo = () => {
    const lastCommand = historyManager.pop();
    if (lastCommand) {
      lastCommand.undo();
      return;
    }
    notify('Nothing to undo', 'INFO');
  };

  const handleTourStep = (step: TourStep) => {
    if (step.type === 'NAV' && step.targetId) {
      setActiveTab(step.targetId);
      setActiveNodeId(null);
      return;
    }

    if (step.type === 'EXPAND' && step.targetId) {
      setActiveNodeId(step.targetId);
      return;
    }

    if (step.type === 'RESET_EXPAND') {
      setActiveNodeId(null);
    }
  };

  return {
    activeNodeId,
    commands,
    handleTourStep,
    handleUndo,
    isCommandOpen,
    isTourActive,
    openCommandPalette: () => setIsCommandOpen(true),
    closeCommandPalette: () => setIsCommandOpen(false),
    startTour,
    stopTour,
    tourIterator,
  };
}
