import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import EqualizerAnimation from './EqualizerAnimation.jsx';

export default function QuickAccessCard({ item, onClick, queue = [] }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const isCurrent = currentTrack?.id === item.id;
  const isTrackPlaying = isCurrent && isPlaying;

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(item, queue);
    }
  };

  return (
    <div
      onClick={onClick}
      className="group relative flex items-center bg-[#2a2a2a]/60 hover:bg-[#353535] transition-colors duration-200 rounded-md overflow-hidden cursor-pointer shadow-md pr-4"
    >
      {/* Miniature Artwork */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gradient-to-br from-[#282828] to-[#121212] flex items-center justify-center relative overflow-hidden">
        {item.artwork ? (
          <img src={item.artwork} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-spotify-subtext font-semibold text-lg bg-gradient-to-tr from-emerald-900/60 to-spotify-card">
            {item.title?.charAt(0)?.toUpperCase() || '♪'}
          </div>
        )}
      </div>

      {/* Title & Artist */}
      <div className="flex-1 px-4 min-w-0">
        <h3
          className={`font-bold text-sm sm:text-base truncate ${
            isCurrent ? 'text-spotify-green' : 'text-white'
          }`}
        >
          {item.title}
        </h3>
        {item.artistName && (
          <p className="text-xs text-spotify-subtext truncate mt-0.5">{item.artistName}</p>
        )}
      </div>

      {/* Playing Equalizer Indicator */}
      {isCurrent && (
        <div className="mr-3">
          <EqualizerAnimation isPlaying={isTrackPlaying} />
        </div>
      )}

      {/* Floating Green Play FAB Button */}
      <button
        onClick={handlePlayClick}
        aria-label={isTrackPlaying ? 'Pause' : 'Play'}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-spotify-green hover:bg-spotify-green-hover text-black flex items-center justify-center shadow-spotify-glow transform transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 active:scale-95 flex-shrink-0"
      >
        {isTrackPlaying ? (
          <Pause className="w-5 h-5 fill-black text-black" />
        ) : (
          <Play className="w-5 h-5 fill-black text-black ml-0.5" />
        )}
      </button>
    </div>
  );
}
