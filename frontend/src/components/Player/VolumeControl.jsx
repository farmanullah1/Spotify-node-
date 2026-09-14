import React, { useRef, useState } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';

export default function VolumeControl() {
  const { volume, setVolumeLevel, isMuted, toggleMute } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);
  const barRef = useRef(null);

  const effectiveVolume = isMuted ? 0 : volume;

  const handleBarClick = (e) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newVol = Math.max(0, Math.min(1, clickX / width));
    setVolumeLevel(newVol);
  };

  const VolumeIcon = effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-2">
      {/* Mute Button */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        className="text-spotify-subtext hover:text-white transition-colors p-1"
      >
        <VolumeIcon className="w-5 h-5" />
      </button>

      {/* Volume Slider Bar */}
      <div
        ref={barRef}
        onClick={handleBarClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-20 sm:w-24 h-3 flex items-center cursor-pointer"
      >
        <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden relative">
          <div
            className={`h-full transition-all duration-75 rounded-full ${
              isHovered ? 'bg-spotify-green' : 'bg-white'
            }`}
            style={{ width: `${effectiveVolume * 100}%` }}
          />
        </div>

        {/* Scrub Handle Dot */}
        <div
          className={`absolute w-3 h-3 bg-white rounded-full shadow-md pointer-events-none -ml-1.5 transition-opacity duration-150 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
          style={{ left: `${effectiveVolume * 100}%` }}
        />
      </div>
    </div>
  );
}
