import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Favorites / Liked Tracks (persisted to localStorage)
  const [likedTrackIds, setLikedTrackIds] = useState(() => {
    try {
      const saved = localStorage.getItem('spotify_liked_tracks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const audioRef = useRef(new Audio());

  // Save liked tracks to localStorage
  useEffect(() => {
    localStorage.setItem('spotify_liked_tracks', JSON.stringify(likedTrackIds));
  }, [likedTrackIds]);

  // Handle Audio events
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNext();
      }
    };

    const handleError = (e) => {
      console.warn('Audio playback error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [repeatMode, currentIndex, queue]);

  // Sync volume with audio element
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const playTrack = (track, newQueue = null) => {
    if (!track || !track.uri) return;

    if (newQueue) {
      setQueue(newQueue);
      const idx = newQueue.findIndex((t) => t.id === track.id);
      setCurrentIndex(idx !== -1 ? idx : 0);
    } else if (queue.length === 0) {
      setQueue([track]);
      setCurrentIndex(0);
    }

    setCurrentTrack(track);
    const audio = audioRef.current;
    audio.src = track.uri;
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn('Playback failed:', err);
        setIsPlaying(false);
      });
  };

  const togglePlay = () => {
    if (!currentTrack) {
      if (queue.length > 0) {
        playTrack(queue[0]);
      }
      return;
    }

    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleNext = () => {
    if (queue.length === 0) return;

    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }

    setCurrentIndex(nextIndex);
    playTrack(queue[nextIndex]);
  };

  const handlePrev = () => {
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart the song
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    setCurrentIndex(prevIndex);
    playTrack(queue[prevIndex]);
  };

  const seek = (time) => {
    if (isNaN(time)) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolumeLevel = (val) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const toggleLike = (trackId) => {
    setLikedTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const isLiked = (trackId) => likedTrackIds.includes(trackId);

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen((prev) => !prev);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        isRightSidebarOpen,
        isUploadModalOpen,
        setIsUploadModalOpen,
        openUploadModal: () => setIsUploadModalOpen(true),
        closeUploadModal: () => setIsUploadModalOpen(false),
        playTrack,
        togglePlay,
        nextTrack: handleNext,
        prevTrack: handlePrev,
        seek,
        setVolumeLevel,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        toggleLike,
        isLiked,
        toggleRightSidebar,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
