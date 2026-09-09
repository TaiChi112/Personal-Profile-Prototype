import { expect, test, describe, mock, beforeEach } from 'bun:test';
import { AudioPlayerContext } from '../../../../../app/models/podcast/AudioPlayerStateMachine';
import type { PodcastEpisode } from '../../../../../app/data/content';

describe('AudioPlayerStateMachine', () => {
  let uiCallbackMock: ReturnType<typeof mock>;
  let notifyMock: ReturnType<typeof mock>;
  let player: AudioPlayerContext;

  const mockTrack: PodcastEpisode = {
    id: 'ep-1',
    type: 'podcast',
    title: 'Design Patterns',
    description: 'Talking about state pattern',
    date: '2024-01-01',
    meta: ['Podcast'],
    audioUrl: '/audio.mp3',
    duration: '10:00'
  };

  beforeEach(() => {
    uiCallbackMock = mock();
    notifyMock = mock();
    player = new AudioPlayerContext(uiCallbackMock, notifyMock);
  });

  test('should initialize in STOPPED state', () => {
    // Cannot directly read private state, but can check behaviors
    player.play();
    expect(notifyMock).toHaveBeenCalledWith('Select a track to play', 'WARNING');
  });

  test('should transition from STOPPED to PLAYING when track is set', () => {
    player.setTrack(mockTrack);
    // setTrack calls play() internally
    expect(notifyMock).toHaveBeenCalledWith('Starting Podcast...', 'INFO');
    expect(uiCallbackMock).toHaveBeenCalledWith('PLAYING', mockTrack);
  });

  test('should transition PLAYING -> PAUSED -> PLAYING', () => {
    player.setTrack(mockTrack); // goes to PLAYING
    uiCallbackMock.mockClear();
    notifyMock.mockClear();

    player.pause(); // PLAYING -> PAUSED
    expect(uiCallbackMock).toHaveBeenCalledWith('PAUSED', mockTrack);
    expect(notifyMock).toHaveBeenCalledWith('Podcast Paused', 'INFO');

    uiCallbackMock.mockClear();
    notifyMock.mockClear();

    player.play(); // PAUSED -> PLAYING
    expect(uiCallbackMock).toHaveBeenCalledWith('PLAYING', mockTrack);
    expect(notifyMock).toHaveBeenCalledWith('Podcast Resumed', 'SUCCESS');
  });

  test('should transition to STOPPED from PLAYING', () => {
    player.setTrack(mockTrack); // goes to PLAYING
    uiCallbackMock.mockClear();
    
    player.stop(); // PLAYING -> STOPPED
    expect(uiCallbackMock).toHaveBeenCalledWith('STOPPED', mockTrack);
  });

  test('should transition to STOPPED from PAUSED', () => {
    player.setTrack(mockTrack); // PLAYING
    player.pause(); // PAUSED
    uiCallbackMock.mockClear();

    player.stop(); // PAUSED -> STOPPED
    expect(uiCallbackMock).toHaveBeenCalledWith('STOPPED', mockTrack);
  });
});
