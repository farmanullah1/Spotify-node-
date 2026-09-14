import React, { useState } from 'react';
import { Heart, Music } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';

export default function TrackInfo({ track }) {
  const { isLiked, toggleLike } = usePlayer();
  const [isPopping, setIsPopping] = useState(false);

  if (!track) {
    return (
      <div className="flex items-center gap-3 w-64">
        <div className="w-14 h-14 rounded-md bg-[#242424] flex items-center justify-center flex-shrink-0">
          <Music className="w-6 h-6 text-spotify-muted" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-spotify-muted font-medium">No track playing</span>
          <span className="text-xs text-spotify-muted/70">Select a song to start</span>
        </div>
      </div>
    );
  }

  const liked = isLiked(track.id);

  const handleLikeClick = () => {
    setIsPopping(true);
    toggleLike(track.id);
    setTimeout(() => setIsPopping(false), 300);
  };

  return (
    <div className="flex items-center gap-3.5 max-w-[280px] sm:max-w-xs min-w-0">
      {/* Artwork */}
      <div className="w-14 h-14 rounded-md overflow-hidden bg-gradient-to-br from-[#282828] to-[#181818] flex-shrink-0 shadow-md relative">
        {track.artwork || track.thumbnail ? (
          <img src={track.artwork || track.thumbnail} alt={track.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-emerald-900 to-[#181818]">
            <Music className="w-6 h-6 text-spotify-green" />
          </div>
        )}
      </div>

      {/* Title & Artist */}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
          {track.title}
        </span>
        <span className="text-xs text-spotify-subtext truncate hover:underline hover:text-white cursor-pointer mt-0.5">
          {track.artistName || track.artist?.username || 'Unknown Artist'}
        </span>
      </div>

      {/* Heart / Like Button with Pop Animation */}
      <button
        onClick={handleLikeClick}
        aria-label={liked ? 'Unlike' : 'Like'}
        className={`ml-2 p-1.5 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 ${
          isPopping ? 'scale-125' : 'scale-100'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        }}
      >
        <Heart
          className={`w-5 h-5 transition-colors duration-200 ${
            liked ? 'fill-spotify-green text-spotify-green' : 'text-spotify-subtext hover:text-white'
          }`}
        />
      </button>
    </div>
  );
}
