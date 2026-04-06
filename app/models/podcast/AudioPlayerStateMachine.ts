import type { PodcastEpisode } from '../../data/content';

type NotifyLevel = 'SUCCESS' | 'WARNING' | 'INFO' | 'ERROR';

type NotifyFn = (message: string, level: NotifyLevel) => void;

interface IAudioPlayerState {
  name: string;
  play(): void;
  pause(): void;
  stop(): void;
}

export class AudioPlayerContext {
  private state: IAudioPlayerState;
  private currentTrack: PodcastEpisode | null = null;

  constructor(
    private readonly uiCallback: (stateName: string, track: PodcastEpisode | null) => void,
    private readonly notify: NotifyFn,
  ) {
    this.state = new StoppedState(this);
  }

  changeState(state: IAudioPlayerState) {
    this.state = state;
    this.uiCallback(state.name, this.currentTrack);
  }

  setTrack(track: PodcastEpisode) {
    this.currentTrack = track;
    this.state = new StoppedState(this);
    this.play();
  }

  play() { this.state.play(); }
  pause() { this.state.pause(); }
  stop() { this.state.stop(); }
  getTrack() { return this.currentTrack; }
  getNotifier() { return this.notify; }
}

class StoppedState implements IAudioPlayerState {
  name = 'STOPPED';
  constructor(private readonly player: AudioPlayerContext) {}

  play() {
    if (this.player.getTrack()) {
      this.player.getNotifier()('Starting Podcast...', 'INFO');
      this.player.changeState(new PlayingState(this.player));
    } else {
      this.player.getNotifier()('Select a track to play', 'WARNING');
    }
  }

  pause() {}
  stop() {}
}

class PlayingState implements IAudioPlayerState {
  name = 'PLAYING';
  constructor(private readonly player: AudioPlayerContext) {}

  play() {}

  pause() {
    this.player.changeState(new PausedState(this.player));
    this.player.getNotifier()('Podcast Paused', 'INFO');
  }

  stop() {
    this.player.changeState(new StoppedState(this.player));
  }
}

class PausedState implements IAudioPlayerState {
  name = 'PAUSED';
  constructor(private readonly player: AudioPlayerContext) {}

  play() {
    this.player.changeState(new PlayingState(this.player));
    this.player.getNotifier()('Podcast Resumed', 'SUCCESS');
  }

  pause() {}

  stop() {
    this.player.changeState(new StoppedState(this.player));
  }
}
