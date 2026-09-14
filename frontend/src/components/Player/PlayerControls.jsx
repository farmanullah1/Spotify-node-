import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';

export default function PlayerControls() {
  const {
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    currentTrack,
  } = usePlayer();

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      {/* Shuffle Button */}
      <button
        onClick={toggleShuffle}
        aria-label="Toggle Shuffle"
        className={`relative p-1.5 transition-colors duration-200 ${
          isShuffle ? 'text-spotify-green' : 'text-spotify-subtext hover:text-white'
        }`}
      >
        <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
        {isShuffle && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-spotify-green rounded-full" />
        )}
      </button>

      {/* Previous Track */}
      <button
        onClick={prevTrack}
        disabled={!currentTrack}
        aria-label="Previous Track"
        className="p-1.5 text-spotify-subtext hover:text-white transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
      >
        <SkipBack className="w-5 h-5 fill-current" />
      </button>

      {/* Play / Pause Toggle Button */}
      <button
        onClick={togglePlay}
        disabled={!currentTrack}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all duration-150 flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-black text-black" />
        ) : (
          <Play className="w-5 h-5 fill-black text-black ml-0.5" />
        )}
      </button>

      {/* Next Track */}
      <button
        onClick={nextTrack}
        disabled={!currentTrack}
        aria-label="Next Track"
        className="p-1.5 text-spotify-subtext hover:text-white transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
      >
        <SkipForward className="w-5 h-5 fill-current" />
      </button>

      {/* Repeat Button */}
      <button
        onClick={toggleRepeat}
        aria-label="Toggle Repeat"
        className={`relative p-1.5 transition-colors duration-200 ${
          repeatMode !== 'off' ? 'text-spotify-green' : 'text-spotify-subtext hover:text-white'
        }`}
      >
        {repeatMode === 'one' ? (
          <Repeat1 className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
        {repeatMode !== 'off' && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-spotify-green rounded-full" />
        )}
      </button>
    </div>
  );
}
