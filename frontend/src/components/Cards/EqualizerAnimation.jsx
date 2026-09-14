import React from 'react';

export default function EqualizerAnimation({ isPlaying = true, className = '' }) {
  return (
    <div className={`flex items-end gap-0.5 h-4 ${className}`}>
      <span
        className={`w-1 bg-spotify-green rounded-full transition-all duration-300 ${
          isPlaying ? 'animate-equalizer-1' : 'h-1'
        }`}
      />
      <span
        className={`w-1 bg-spotify-green rounded-full transition-all duration-300 ${
          isPlaying ? 'animate-equalizer-2' : 'h-2'
        }`}
      />
      <span
        className={`w-1 bg-spotify-green rounded-full transition-all duration-300 ${
          isPlaying ? 'animate-equalizer-3' : 'h-1.5'
        }`}
      />
      <span
        className={`w-1 bg-spotify-green rounded-full transition-all duration-300 ${
          isPlaying ? 'animate-equalizer-4' : 'h-1'
        }`}
      />
    </div>
  );
}
