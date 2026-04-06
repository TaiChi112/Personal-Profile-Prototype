import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import { notify } from '../../services/system/notification/NotificationBridge';

type HeroSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
};

export function HeroSection({ currentStyle, labels }: HeroSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div
        className={`w-32 h-32 rounded-full mb-8 flex items-center justify-center text-4xl font-bold animate-pulse ${
          currentStyle.name === 'Future'
            ? 'bg-cyan-900 text-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.5)]'
            : currentStyle.name === 'Minimal'
              ? 'bg-black text-white dark:bg-white dark:text-black border-4 border-double'
              : 'bg-linear-to-tr from-blue-400 to-indigo-500 text-white shadow-xl'
        }`}
      >
        AD
      </div>
      <h1
        className={`mb-4 ${
          currentStyle.name === 'Future'
            ? 'text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600'
            : 'text-5xl font-extrabold text-gray-900 dark:text-white'
        }`}
      >
        {labels.hero.titlePrefix}{' '}
        <span className={currentStyle.name === 'Academic' ? 'italic text-[#8b1e3f]' : 'text-blue-600'}>{labels.hero.titleHighlight}</span>
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8 leading-relaxed">{labels.hero.description}</p>
      <div className="flex space-x-4">
        <button className={currentStyle.getButtonClass('primary')} onClick={() => notify.notify('Navigating to Projects...', 'INFO')}>
          {labels.hero.btnProjects}
        </button>
        <button className={currentStyle.getButtonClass('secondary')}>{labels.hero.btnArticles}</button>
      </div>
    </div>
  );
}
