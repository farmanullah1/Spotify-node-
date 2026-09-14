import React, { useRef, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { formatDuration } from '../../utils/formatters.js';

export default function ProgressBar() {
  const { currentTime, duration, seek, currentTrack } = usePlayer();
  const barRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => {
    if (!barRef.current || !duration) return;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newFraction = Math.max(0, Math.min(1, clickX / width));
    seek(newFraction * duration);
  };

  return (
    <div className="w-full flex items-center gap-2 max-w-xl text-xs text-spotify-subtext font-medium select-none">
      {/* Current Time */}
      <span className="w-10 text-right tabular-nums">
        {formatDuration(currentTime)}
      </span>

      {/* Track Bar Container */}
      <div
        ref={barRef}
        onClick={handleSeek}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex-1 h-3 flex items-center cursor-pointer"
      >
        {/* Background Track */}
        <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden relative">
          {/* Progress Active Bar */}
          <div
            className={`h-full transition-all duration-75 rounded-full ${
              isHovered ? 'bg-spotify-green' : 'bg-white'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Scrub Handle Dot */}
        <div
          className={`absolute w-3 h-3 bg-white rounded-full shadow-md pointer-events-none -ml-1.5 transition-opacity duration-150 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
          style={{ left: `${percentage}%` }}
        />
      </div>

      {/* Duration */}
      <span className="w-10 tabular-nums">
        {formatDuration(duration)}
      </span>
    </div>
  );
}
