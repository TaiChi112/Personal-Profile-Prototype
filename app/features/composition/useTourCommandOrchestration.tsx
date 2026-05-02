import { useEffect, useState } from 'react';
import { historyManager } from '../../models/command/Commands';
import { TourIterator, type TourStep } from '../../models/tour/Tour';
import { useCommandList } from './useCommandList';
import type { EventType } from '../../services/system/notification/NotificationBridge';
import type { StyleKey } from '../../models/theme/ThemeConfig';

type UseTourCommandOrchestrationParams = {
  activeTab: string;
  styleKey: StyleKey;
  setTourTab: (tab: string) => void;
  setActiveTab: (tab: string) => void;
  setStyleKey: (style: StyleKey) => void;
  toggleDark: () => void;
  toggleRole: () => void;
  notify: (message: string, level: EventType) => void;
};

const TOUR_SEQUENCE: TourStep[] = [
  {
    type: 'NAV',
    targetId: 'home',
    label: 'Start',
    description: 'เริ่มจากหน้า Home เพื่อดูภาพรวมของโปรไฟล์และธีมของเว็บไซต์',
    hint: 'คลิกไอคอน Home หรือปุ่มถัดไปเพื่อไปต่อ',
    highlightId: 'nav-home',
  },
  {
    type: 'NAV',
    targetId: 'projects',
    label: 'Projects',
    description: 'หน้าที่รวมโปรเจกต์และผลงานที่สามารถเข้าไปสำรวจได้',
    hint: 'คุณสามารถเปิดดูรายละเอียดโปรเจกต์หรือไปยังหน้าถัดไปได้',
    highlightId: 'nav-projects',
  },
  {
    type: 'NAV',
    targetId: 'articles',
    label: 'Articles',
    description: 'ส่วนบทความสำหรับอ่านแนวคิด เทคนิค และการสรุปการทำงาน',
    hint: 'เหมาะสำหรับคนที่อยากรู้วิธีคิดและแนวทางการพัฒนา',
    highlightId: 'nav-articles',
  },
  {
    type: 'NAV',
    targetId: 'blog',
    label: 'Blog',
    description: 'พื้นที่สำหรับบันทึกเรื่องเล่า หรือมุมมองส่วนตัวระหว่างพัฒนา',
    hint: 'ถ้าชอบอ่านสั้น ๆ แต่มีบริบท ลองดูส่วนนี้',
    highlightId: 'nav-blog',
  },
  {
    type: 'NAV',
    targetId: 'docs',
    label: 'Docs',
    description: 'หน้าเอกสารและข้อมูลอ้างอิงของระบบ เพื่อช่วยให้เข้าใจโครงสร้าง',
    hint: 'ใช้เป็นจุดอ้างอิงเมื่ออยากรู้ว่าระบบนี้ประกอบด้วยอะไร',
    highlightId: 'nav-docs',
  },
  {
    type: 'NAV',
    targetId: 'resume',
    label: 'Resume',
    description: 'หน้าประวัติและสรุปประสบการณ์ เพื่อดูความพร้อมในการทำงาน',
    hint: 'เหมาะสำหรับดู timeline ทักษะและประสบการณ์',
    highlightId: 'nav-resume',
  },
];

export function useTourCommandOrchestration({
  activeTab,
  styleKey,
  setTourTab,
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
    setTourTab('home');
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

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
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
      setTourTab(step.targetId);
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
