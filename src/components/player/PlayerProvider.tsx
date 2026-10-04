import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { RADIO, SONGS, type Playable } from "@/lib/catalog";
import { TAPE_SEEK_RATE } from "@/lib/format";
import { tapeMachine } from "@/lib/tape";
import {
  detectDayPart,
  detectSeason,
  THEME_STORAGE_KEY,
  type DayPart,
  type Season,
} from "@/lib/theme";

export type Mode = "library" | "radio";
export type SeekDirection = 1 | -1;

type ThemeState = { dayPart: DayPart; season: Season };

type PlayerContextValue = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  catalog: Playable[];
  current: Playable;
  playing: boolean;
  loading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  isSeeking: boolean;
  seekDirection: SeekDirection;
  analyser: AnalyserNode | null;
  dayPart: DayPart;
  season: Season;
  setDayPart: (part: DayPart) => void;
  setSeason: (season: Season) => void;
  playTrack: (id: string) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  beginHoldSeek: (direction: SeekDirection) => void;
  endHoldSeek: () => void;
  jogToRatio: (ratio: number) => void;
  beginJog: () => void;
  endJog: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

function readStoredTheme(): ThemeState | null {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ThemeState;
    if (!parsed.dayPart || !parsed.season) return null;
    return parsed;
  } catch {
    return null;
  }
}

function loadTheme(): ThemeState {
  return (
    readStoredTheme() ?? {
      dayPart: detectDayPart(),
      season: detectSeason(),
    }
  );
}

function writeTheme(next: ThemeState) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* private mode */
  }
}

function mediaDuration(audio: HTMLAudioElement | null, fallback: number) {
  if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
    return audio.duration;
  }
  return fallback;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seekingRef = useRef(false);
  const directionRef = useRef<SeekDirection>(1);
  const wasPlayingRef = useRef(false);
  const holdFrameRef = useRef<number | null>(null);
  const lastHoldTsRef = useRef(0);
  const playGenRef = useRef(0);
  const mutedRef = useRef(false);
  const volumeRef = useRef(0.82);

  const [trackId, setTrackId] = useState(SONGS[0].id);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(SONGS[0].duration);
  const [volume, setVolumeState] = useState(0.82);
  const [muted, setMuted] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekDirection, setSeekDirection] = useState<SeekDirection>(1);
  const [theme, setTheme] = useState<ThemeState>(loadTheme);
  const dayPart = theme.dayPart;
  const season = theme.season;

  const catalog = SONGS;
  const library = [RADIO, ...SONGS];
  const current = library.find((item) => item.id === trackId) ?? SONGS[0];
  const mode: Mode = current.live ? "radio" : "library";

  const setDayPart = useCallback((part: DayPart) => {
    setTheme((prev) => {
      const next = { dayPart: part, season: prev.season };
      writeTheme(next);
      return next;
    });
  }, []);

  const setSeason = useCallback((nextSeason: Season) => {
    setTheme((prev) => {
      const next = { dayPart: prev.dayPart, season: nextSeason };
      writeTheme(next);
      return next;
    });
  }, []);

  const playMedia = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    const gen = ++playGenRef.current;
    try {
      audio.muted = mutedRef.current;
      audio.volume = mutedRef.current ? 0 : volumeRef.current;
      await audio.play();
      if (gen !== playGenRef.current) return false;
      setPlaying(true);
      setError(null);
      return true;
    } catch (err) {
      if (gen !== playGenRef.current) return false;
      const name = err instanceof DOMException ? err.name : "";
      if (name === "AbortError") return false;
      setPlaying(false);
      setError("Could not start playback. Press play again.");
      return false;
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.day = dayPart;
    html.dataset.season = season;
    html.classList.add("dark");
  }, [dayPart, season]);

  useEffect(() => {
    mutedRef.current = muted;
    volumeRef.current = volume;
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
    audio.volume = muted ? 0 : volume;
  }, [muted, volume]);

  useEffect(() => {
    return () => {
      if (holdFrameRef.current) cancelAnimationFrame(holdFrameRef.current);
      tapeMachine.stop(true);
    };
  }, []);

  const playTrack = useCallback((id: string) => {
    const item = [RADIO, ...SONGS].find((track) => track.id === id);
    setError(null);
    setTrackId(id);
    setCurrentTime(0);
    setDuration(item?.duration ?? 0);
    setPlaying(true);
  }, []);

  const setMode = useCallback((next: Mode) => {
    const item = next === "radio" ? RADIO : SONGS[0];
    setTrackId(item.id);
    setCurrentTime(0);
    setDuration(item.duration);
    setPlaying(true);
    setError(null);
  }, []);

  const toggle = useCallback(() => {
    if (playing) {
      playGenRef.current += 1;
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    setError(null);
    setPlaying(true);
  }, [playing]);

  const skipBy = useCallback(
    (delta: number) => {
      if (current.live) {
        const item = delta > 0 ? SONGS[0] : SONGS[SONGS.length - 1];
        setTrackId(item.id);
        setCurrentTime(0);
        setDuration(item.duration);
        setPlaying(true);
        return;
      }
      const index = SONGS.findIndex((item) => item.id === current.id);
      const nextItem = SONGS[(index + delta + SONGS.length) % SONGS.length];
      setTrackId(nextItem.id);
      setCurrentTime(0);
      setDuration(nextItem.duration);
      setPlaying(true);
    },
    [current.id, current.live],
  );

  const next = useCallback(() => skipBy(1), [skipBy]);
  const prev = useCallback(() => skipBy(-1), [skipBy]);

  const seek = useCallback(
    (time: number) => {
      if (current.live) return;
      const audio = audioRef.current;
      const total = mediaDuration(audio, duration);
      if (!audio || total <= 0) {
        setCurrentTime(Math.max(0, time));
        return;
      }
      const nextTime = Math.min(Math.max(0, time), total);
      audio.currentTime = nextTime;
      setCurrentTime(nextTime);
    },
    [current.live, duration],
  );

  const setVolume = useCallback((value: number) => {
    const nextValue = Math.min(1, Math.max(0, value));
    setVolumeState(nextValue);
    if (nextValue > 0) setMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((value) => !value);
  }, []);

  const stopHoldLoop = useCallback(() => {
    if (holdFrameRef.current) {
      cancelAnimationFrame(holdFrameRef.current);
      holdFrameRef.current = null;
    }
  }, []);

  const beginHoldSeek = useCallback(
    (direction: SeekDirection) => {
      if (current.live) return;
      const audio = audioRef.current;
      if (!audio) return;
      wasPlayingRef.current = playing && !audio.paused;
      playGenRef.current += 1;
      audio.pause();
      directionRef.current = direction;
      seekingRef.current = true;
      setSeekDirection(direction);
      setIsSeeking(true);
      lastHoldTsRef.current = performance.now();
      void tapeMachine.start(direction);
      stopHoldLoop();
      const loop = () => {
        if (!seekingRef.current) return;
        const media = audioRef.current;
        const now = performance.now();
        const dt = Math.min(0.05, (now - lastHoldTsRef.current) / 1000);
        lastHoldTsRef.current = now;
        const total = mediaDuration(media, duration);
        if (media && total > 0) {
          const nextTime = media.currentTime + dt * TAPE_SEEK_RATE * directionRef.current;
          const clamped = Math.min(Math.max(0, nextTime), total);
          media.currentTime = clamped;
          setCurrentTime(clamped);
        }
        holdFrameRef.current = requestAnimationFrame(loop);
      };
      holdFrameRef.current = requestAnimationFrame(loop);
    },
    [current.live, duration, playing, stopHoldLoop],
  );

  const endHoldSeek = useCallback(() => {
    stopHoldLoop();
    seekingRef.current = false;
    setIsSeeking(false);
    tapeMachine.stop();
    if (wasPlayingRef.current) {
      setPlaying(true);
      void playMedia();
    }
    wasPlayingRef.current = false;
  }, [playMedia, stopHoldLoop]);

  const beginJog = useCallback(() => {
    if (current.live) return;
    const audio = audioRef.current;
    if (!audio || seekingRef.current) return;
    wasPlayingRef.current = playing && !audio.paused;
    playGenRef.current += 1;
    audio.pause();
    seekingRef.current = true;
    setIsSeeking(true);
    void tapeMachine.start(1);
  }, [current.live, playing]);

  const jogToRatio = useCallback(
    (ratio: number) => {
      seek(ratio * mediaDuration(audioRef.current, duration));
    },
    [duration, seek],
  );

  const endJog = useCallback(() => {
    seekingRef.current = false;
    setIsSeeking(false);
    tapeMachine.stop();
    if (wasPlayingRef.current) {
      setPlaying(true);
      void playMedia();
    }
    wasPlayingRef.current = false;
  }, [playMedia]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (event.code === "Space") {
        event.preventDefault();
        toggle();
      } else if (event.code === "ArrowRight") {
        seek(currentTime + 5);
      } else if (event.code === "ArrowLeft") {
        seek(currentTime - 5);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentTime, seek, toggle]);

  const onLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    }
    setLoading(false);
  }, []);

  const onTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || seekingRef.current) return;
    setCurrentTime(audio.currentTime);
  }, []);

  const onEnded = useCallback(() => {
    if (current.live) {
      void playMedia();
      return;
    }
    const index = SONGS.findIndex((item) => item.id === current.id);
    const nextItem = SONGS[(index + 1) % SONGS.length];
    setTrackId(nextItem.id);
    setCurrentTime(0);
    setDuration(nextItem.duration);
    setPlaying(true);
  }, [current.id, current.live, playMedia]);

  const onError = useCallback(() => {
    setLoading(false);
    setPlaying(false);
    setError("Could not load this track. Try another one.");
  }, []);

  const onCanPlay = useCallback(() => {
    setLoading(false);
  }, []);

  const onWaiting = useCallback(() => {
    setLoading(true);
  }, []);

  const onPlaying = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (seekingRef.current) return;
    if (!playing) {
      audio.pause();
      return;
    }
    setLoading(true);
    void playMedia();
  }, [current.id, current.src, playMedia, playing]);

  const value = useMemo<PlayerContextValue>(
    () => ({
      mode,
      setMode,
      catalog,
      current,
      playing,
      loading,
      error,
      currentTime,
      duration,
      volume,
      muted,
      isSeeking,
      seekDirection,
      analyser: null,
      dayPart,
      season,
      setDayPart,
      setSeason,
      playTrack,
      toggle,
      next,
      prev,
      seek,
      setVolume,
      toggleMute,
      beginHoldSeek,
      endHoldSeek,
      jogToRatio,
      beginJog,
      endJog,
    }),
    [
      beginHoldSeek,
      beginJog,
      catalog,
      current,
      currentTime,
      dayPart,
      duration,
      endHoldSeek,
      endJog,
      error,
      isSeeking,
      jogToRatio,
      loading,
      mode,
      muted,
      next,
      playTrack,
      playing,
      prev,
      season,
      seek,
      seekDirection,
      setDayPart,
      setMode,
      setSeason,
      setVolume,
      toggle,
      toggleMute,
      volume,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={current.src}
        crossOrigin="anonymous"
        preload={current.live ? "none" : "auto"}
        playsInline
        loop={false}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        onError={onError}
        onCanPlay={onCanPlay}
        onWaiting={onWaiting}
        onPlaying={onPlaying}
      />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const value = useContext(PlayerContext);
  if (!value) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return value;
}
