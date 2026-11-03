// ── Audio Player Utility for iOS Safari & Android Autoplay Support ──
const START_SEC = 90;   // 1:30
const END_SEC   = 120;  // 2:00
const SONG_SRC  = '/assets/Seetha Kalyanam - SenSongsMp3.Co.mp3';

let audio = null;
let rafId = null;
let isPlaying = false;
let isMuted = false;
const listeners = new Set();

function notify() {
  listeners.forEach(fn => {
    try {
      fn({ isPlaying, isMuted });
    } catch (e) {
      console.error('Audio listener error:', e);
    }
  });
}

function startLoopChecker() {
  if (rafId) cancelAnimationFrame(rafId);
  const check = () => {
    if (audio && !audio.paused) {
      if (audio.currentTime >= END_SEC || audio.ended) {
        audio.currentTime = START_SEC;
        audio.play().catch(() => {});
      }
      rafId = requestAnimationFrame(check);
    }
  };
  rafId = requestAnimationFrame(check);
}

export function initAudio() {
  if (typeof window === 'undefined') return null;
  if (audio) return audio;

  audio = new Audio(SONG_SRC);
  audio.preload = 'auto';
  audio.loop = false; // We manage the 90s -> 120s loop manually

  const seekStart = () => {
    try {
      if (audio.currentTime < START_SEC || audio.currentTime >= END_SEC) {
        audio.currentTime = START_SEC;
      }
    } catch (e) {
      // Ignore if metadata not loaded yet
    }
  };

  audio.addEventListener('loadedmetadata', seekStart);
  audio.addEventListener('canplay', seekStart, { once: true });

  // Fallback check on timeupdate in case RAF throttles in background tab
  audio.addEventListener('timeupdate', () => {
    if (audio.currentTime >= END_SEC) {
      audio.currentTime = START_SEC;
      audio.play().catch(() => {});
    }
  });

  audio.addEventListener('ended', () => {
    audio.currentTime = START_SEC;
    audio.play().catch(() => {});
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    notify();
  });

  audio.addEventListener('playing', () => {
    isPlaying = true;
    notify();
  });

  return audio;
}

/**
 * Call this synchronously inside any user gesture event (click/touchstart/touchend).
 * This satisfies iOS Safari's strict user activation requirement.
 */
export function playMusic() {
  const a = initAudio();
  if (!a) return;

  try {
    if (a.currentTime < START_SEC || a.currentTime >= END_SEC) {
      a.currentTime = START_SEC;
    }
  } catch (e) {}

  a.muted = isMuted;

  const promise = a.play();
  if (promise !== undefined) {
    promise
      .then(() => {
        isPlaying = true;
        // Verify time range in case it started at 0 before metadata arrived
        if (a.currentTime < START_SEC - 0.5) {
          a.currentTime = START_SEC;
        }
        startLoopChecker();
        notify();
      })
      .catch((err) => {
        console.warn('Playback prevented by browser policy:', err);
      });
  } else {
    isPlaying = true;
    startLoopChecker();
    notify();
  }
}

export function pauseMusic() {
  if (!audio) return;
  audio.pause();
  isPlaying = false;
  if (rafId) cancelAnimationFrame(rafId);
  notify();
}

export function toggleMute() {
  const a = initAudio();
  if (!a) return;
  a.muted = !a.muted;
  isMuted = a.muted;
  notify();
}

export function togglePlay() {
  const a = initAudio();
  if (!a) return;
  if (a.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
}

export function getAudioState() {
  return { isPlaying, isMuted };
}

export function subscribeAudio(fn) {
  listeners.add(fn);
  fn({ isPlaying, isMuted });
  return () => {
    listeners.delete(fn);
  };
}
