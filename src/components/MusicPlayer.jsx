import { useEffect, useState } from 'react';
import {
  initAudio,
  playMusic,
  toggleMute,
  subscribeAudio,
} from '../utils/audioPlayer';

export default function MusicPlayer({ visible }) {
  const [audioState, setAudioState] = useState({ isPlaying: false, isMuted: false });

  useEffect(() => {
    // Pre-initialize and preload audio asset
    initAudio();

    // Subscribe to playback changes
    const unsubscribe = subscribeAudio(setAudioState);
    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    if (!audioState.isPlaying) {
      playMusic();
    } else {
      toggleMute();
    }
  };

  const isMuted = audioState.isMuted || !audioState.isPlaying;

  return (
    <>
      {/* Floating music toggle — displayed once the invitation is opened */}
      {visible && (
        <button
          className={`music-btn${isMuted ? ' muted' : ''}`}
          onClick={handleClick}
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          title={isMuted ? 'Unmute music' : 'Mute music'}
        >
          <span className="music-icon">{isMuted ? '🔇' : '🎵'}</span>
          <span className="music-bars">
            <span /><span /><span /><span />
          </span>
        </button>
      )}
    </>
  );
}
