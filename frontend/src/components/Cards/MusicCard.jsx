import React from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import EqualizerAnimation from './EqualizerAnimation.jsx';

export default function MusicCard({ item, queue = [], onClick, subtitle }) {
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

  const displaySubtitle =
    subtitle || item.artistName || item.artist?.username || 'Track';

  return (
    <div
      onClick={onClick || (() => playTrack(item, queue))}
      className="group relative p-3.5 sm:p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-all duration-300 cursor-pointer shadow-spotify-card flex flex-col justify-between hover:-translate-y-1"
    >
      {/* Artwork Container */}
      <div className="relative aspect-square w-full rounded-md overflow-hidden bg-gradient-to-br from-[#282828] to-[#121212] shadow-lg mb-3">
        {item.artwork || item.thumbnail ? (
          <img
            src={item.artwork || item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-950/80 via-[#181818] to-spotify-card p-4 text-center">
            <Music className="w-12 h-12 text-spotify-green mb-2 opacity-80" />
            <span className="text-xs text-spotify-subtext font-medium line-clamp-1">
              {item.title}
            </span>
          </div>
        )}

        {/* Playing Overlay Equalizer */}
        {isCurrent && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full px-2 py-1 flex items-center justify-center">
            <EqualizerAnimation isPlaying={isTrackPlaying} />
          </div>
        )}

        {/* Spring-animated Floating Green Play FAB Button */}
        <button
          onClick={handlePlayClick}
          aria-label={isTrackPlaying ? 'Pause' : 'Play'}
          className="absolute right-2 bottom-2 w-12 h-12 rounded-full bg-spotify-green hover:bg-spotify-green-hover text-black flex items-center justify-center shadow-spotify-glow transform transition-all duration-300 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 active:scale-95 hover:scale-105"
          style={{
            transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          {isTrackPlaying ? (
            <Pause className="w-6 h-6 fill-black text-black" />
          ) : (
            <Play className="w-6 h-6 fill-black text-black ml-0.5" />
          )}
        </button>
      </div>

      {/* Meta Text */}
      <div className="min-w-0">
        <h4
          className={`font-semibold text-sm sm:text-base truncate transition-colors ${
            isCurrent ? 'text-spotify-green font-bold' : 'text-white'
          }`}
        >
          {item.title}
        </h4>
        <p className="text-xs sm:text-sm text-spotify-subtext truncate mt-1">
          {displaySubtitle}
        </p>
      </div>
    </div>
  );
}
