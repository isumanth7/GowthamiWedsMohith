import { useEffect, useRef, useState, useCallback } from 'react';

// ── Clip window (seconds) ──────────────────────────────────────────
const START_SEC = 90;   // 1:30
const END_SEC   = 120;  // 2:00

// Path to the local MP3 served from /public/assets/
const SONG_SRC = '/assets/Seetha Kalyanam - SenSongsMp3.Co.mp3';

export default function MusicPlayer({ playing }) {
  const audioRef = useRef(null);
  const rafRef   = useRef(null);  // requestAnimationFrame id for end-detection
  const [muted,   setMuted]   = useState(false);
  const [visible, setVisible] = useState(false);

  /* ── Create <audio> element once ────────────────────────────── */
  useEffect(() => {
    const audio       = new Audio(SONG_SRC);
    audio.preload     = 'auto';
    audio.loop        = false;       // we do manual loop to enforce END_SEC
    audio.currentTime = START_SEC;   // pre-seek so first play starts at 1:30
    audioRef.current  = audio;

    /* iOS / Android: unlock with a silent touch on the document so the
       element is "user-activation-tainted" before we call play().
       This means the real play() call can succeed even after setTimeout. */
    const silentUnlock = () => {
      audio.load();  // re-primes the element in the user-gesture context
    };
    document.addEventListener('touchstart', silentUnlock, { once: true, passive: true });
    document.addEventListener('mousedown',  silentUnlock, { once: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      audio.pause();
      audioRef.current = null;
      document.removeEventListener('touchstart', silentUnlock);
      document.removeEventListener('mousedown',  silentUnlock);
    };
  }, []);

  /* ── RAF loop: enforce clip between START_SEC → END_SEC ──────── */
  const startLoopCheck = useCallback(() => {
    const tick = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.currentTime >= END_SEC || audio.ended) {
        audio.currentTime = START_SEC;
        audio.play().catch(() => {});
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  /* ── Start / stop playback when `playing` prop changes ──────── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      setVisible(true);
      audio.currentTime = START_SEC;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => startLoopCheck())
          .catch(() => {
            /* Autoplay blocked — retry on next user interaction */
            const retryPlay = () => {
              audio.currentTime = START_SEC;
              audio.play().then(() => startLoopCheck()).catch(() => {});
            };
            document.addEventListener('click',      retryPlay, { once: true });
            document.addEventListener('touchstart', retryPlay, { once: true, passive: true });
          });
      } else {
        // Older browsers that return undefined from play()
        startLoopCheck();
      }
    } else {
      cancelAnimationFrame(rafRef.current);
      audio.pause();
    }
  }, [playing, startLoopCheck]);

  /* ── Mute toggle ─────────────────────────────────────────────── */
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(m => !m);
  };

  return (
    <>
      {/* Floating music toggle — shown only after invitation opens */}
      {visible && (
        <button
          className={`music-btn${muted ? ' muted' : ''}`}
          onClick={toggleMute}
          aria-label={muted ? 'Unmute music' : 'Mute music'}
          title={muted ? 'Unmute music' : 'Mute music'}
        >
          <span className="music-icon">{muted ? '🔇' : '🎵'}</span>
          <span className="music-bars">
            <span /><span /><span /><span />
          </span>
        </button>
      )}
    </>
  );
}
