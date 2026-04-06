import { useMemo, useState } from 'react';
import { Clock, Headphones, Mic, Pause, Play, PlayCircle, Square, Volume2 } from 'lucide-react';
import { SectionBanner } from '../../components/section/SectionPrimitives';
import { MOCK_PODCASTS, type PodcastEpisode } from '../../data/content';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import { AudioPlayerContext } from '../../models/podcast/AudioPlayerStateMachine';
import type { EventType } from '../../services/system/notification/NotificationBridge';

type PodcastSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  onNotify: (message: string, level: EventType) => void;
};

export function PodcastSection({ currentStyle, labels, onNotify }: PodcastSectionProps) {
  const [playerStateName, setPlayerStateName] = useState('STOPPED');
  const [currentTrack, setCurrentTrack] = useState<PodcastEpisode | null>(null);
  const playerContext = useMemo(
    () =>
      new AudioPlayerContext(
        (newStateName, track) => {
          setPlayerStateName(newStateName);
          setCurrentTrack(track);
        },
        (message, level) => onNotify(message, level),
      ),
    [onNotify],
  );

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <SectionBanner
        title={labels.sections.podcast}
        description={labels.sections.podcastDesc}
        currentStyle={currentStyle}
        rightSlot={(
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full dark:bg-purple-900/20 dark:text-purple-300">
            <Headphones size={24} />
          </div>
        )}
      />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {MOCK_PODCASTS.map((episode) => (
            <div key={episode.id} className={`${currentStyle.getCardClass()} p-4 flex items-center justify-between group hover:scale-[1.01] transition-transform`}>
              <div className="flex items-center gap-4">
                <div
                  className={`p-4 rounded-full ${
                    currentTrack?.id === episode.id && playerStateName === 'PLAYING'
                      ? 'bg-green-100 text-green-600 animate-pulse'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {currentTrack?.id === episode.id && playerStateName === 'PLAYING' ? <Volume2 size={24} /> : <Mic size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg dark:text-white group-hover:text-blue-600 transition-colors">{episode.title}</h3>
                  <div className="flex gap-2 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {episode.duration}
                    </span>
                    <span>•</span>
                    <span>{episode.date}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => playerContext.setTrack(episode)}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                  currentTrack?.id === episode.id && playerStateName === 'PLAYING'
                    ? 'bg-green-600 text-white shadow-lg'
                    : currentStyle.getButtonClass('secondary')
                }`}
              >
                {currentTrack?.id === episode.id && playerStateName === 'PLAYING' ? labels.actions.playing : labels.actions.listen}
                {currentTrack?.id === episode.id && playerStateName === 'PLAYING' ? <Volume2 size={16} /> : <PlayCircle size={16} />}
              </button>
            </div>
          ))}
        </div>
        <div className="lg:w-96">
          <div className={`sticky top-24 ${currentStyle.getCardClass()} p-6 border-t-4 ${playerStateName === 'PLAYING' ? 'border-green-500' : 'border-gray-300'} shadow-2xl`}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Now Playing</h3>
              <span
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                  playerStateName === 'PLAYING' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                Status: {playerStateName}
              </span>
            </div>
            {currentTrack ? (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="aspect-square bg-linear-to-tr from-purple-500 to-blue-500 rounded-lg mb-6 flex items-center justify-center shadow-inner">
                  <Headphones size={64} className="text-white opacity-50" />
                </div>
                <h4 className="font-bold text-xl mb-1 dark:text-white line-clamp-1" title={currentTrack.title}>
                  {currentTrack.title}
                </h4>
                <p className="text-sm text-gray-500 mb-6">{currentTrack.description}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className={`h-full bg-blue-600 ${playerStateName === 'PLAYING' ? 'animate-[width_20s_linear]' : ''}`}
                    style={{ width: playerStateName === 'PLAYING' ? '100%' : '30%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mb-6">
                  <span>12:45</span>
                  <span>{currentTrack.duration}</span>
                </div>
                <div className="flex justify-center gap-4">
                  <button onClick={() => playerContext.stop()} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Stop">
                    <Square size={20} fill="currentColor" />
                  </button>
                  <button
                    onClick={() => (playerStateName === 'PLAYING' ? playerContext.pause() : playerContext.play())}
                    className={`p-4 rounded-full shadow-xl hover:scale-105 transition-transform ${
                      playerStateName === 'PLAYING' ? 'bg-white text-blue-600 border border-gray-200' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {playerStateName === 'PLAYING' ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Headphones size={48} className="mx-auto mb-4 opacity-20" />
                <p>Select an episode to start listening</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
