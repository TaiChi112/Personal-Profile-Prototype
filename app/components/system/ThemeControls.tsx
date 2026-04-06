import { useState } from 'react';
import { Lock, MessageCircle, Moon, Play, RotateCcw, Sun, Terminal, Unlock } from 'lucide-react';
import { setNotificationChannel } from '../../services/system/notification/NotificationBridge';

type FloatingActionButtonProps = {
  title: string;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
};

function FloatingActionButton({ title, onClick, className, children }: FloatingActionButtonProps) {
  return (
    <button onClick={onClick} className={className} title={title}>
      {children}
    </button>
  );
}

type ThemeControlsProps = {
  isDark: boolean;
  toggleDark: () => void;
  openCommandPalette: () => void;
  undoLastAction: () => void;
  isAdmin: boolean;
  toggleRole: () => void;
  startTour: () => void;
  isAuthenticated: boolean;
  userDisplayName: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
};

export function ThemeControls({
  isDark,
  toggleDark,
  openCommandPalette,
  undoLastAction,
  isAdmin,
  toggleRole,
  startTour,
  isAuthenticated,
  userDisplayName,
  onSignIn,
  onSignOut,
}: ThemeControlsProps) {
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const channels: Array<'Toast' | 'Console' | 'Alert'> = ['Toast', 'Console', 'Alert'];

  const toggleChannel = () => {
    const nextIndex = (currentChannelIndex + 1) % channels.length;
    setCurrentChannelIndex(nextIndex);
    setNotificationChannel(channels[nextIndex]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      <div className="bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 rounded-full shadow-lg px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 max-w-52 truncate">
        {isAuthenticated ? `Signed in: ${userDisplayName ?? 'Google User'}` : 'Signed out'}
      </div>
      <div className="mb-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm pointer-events-none opacity-50">
        Try <span className="font-mono font-bold">Cmd+K</span>
      </div>
      <div className="flex gap-2">
        <FloatingActionButton
          onClick={isAuthenticated ? onSignOut : onSignIn}
          title={isAuthenticated ? 'Sign out' : 'Sign in with Google'}
          className={`px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-105 transition-transform text-xs font-bold ${isAuthenticated ? 'bg-red-600 text-white border-red-700' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
        >
          {isAuthenticated ? 'Sign Out' : 'Sign In'}
        </FloatingActionButton>
      </div>
      <div className="flex gap-2">
        <FloatingActionButton onClick={startTour} title="Start Guided Tour" className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-transform animate-bounce">
          <Play size={20} fill="currentColor" />
        </FloatingActionButton>
        <FloatingActionButton onClick={toggleRole} title="Toggle Admin Role" className={`p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform ${isAdmin ? 'bg-green-600 text-white border-green-700' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
          {isAdmin ? <Unlock size={20} /> : <Lock size={20} />}
        </FloatingActionButton>
      </div>
      <div className="flex gap-2">
        <FloatingActionButton onClick={undoLastAction} title="Undo Last Action" className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform">
          <RotateCcw size={20} className="text-gray-600 dark:text-gray-300" />
        </FloatingActionButton>
        <FloatingActionButton onClick={openCommandPalette} title="Command Palette" className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform">
          <Terminal size={20} className="text-gray-600 dark:text-gray-300" />
        </FloatingActionButton>
      </div>

      <div className="flex gap-2">
        <FloatingActionButton onClick={toggleChannel} title={`Current Notification Channel: ${channels[currentChannelIndex]}`} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform flex items-center gap-1">
          <MessageCircle size={20} className={currentChannelIndex === 0 ? 'text-green-500' : currentChannelIndex === 1 ? 'text-blue-500' : 'text-red-500'} />
          <span className="text-[10px] font-bold uppercase w-12 text-center">{channels[currentChannelIndex]}</span>
        </FloatingActionButton>
        <FloatingActionButton onClick={toggleDark} title="Toggle Dark Mode" className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform">
          {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}
        </FloatingActionButton>
      </div>
    </div>
  );
}
