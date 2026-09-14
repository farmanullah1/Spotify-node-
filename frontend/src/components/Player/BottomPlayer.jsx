import React from 'react';
import { PanelRightClose, PanelRightOpen, ListMusic, Mic2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import TrackInfo from './TrackInfo.jsx';
import PlayerControls from './PlayerControls.jsx';
import ProgressBar from './ProgressBar.jsx';
import VolumeControl from './VolumeControl.jsx';
import EqualizerAnimation from '../Cards/EqualizerAnimation.jsx';

export default function BottomPlayer() {
  const {
    currentTrack,
    isPlaying,
    isRightSidebarOpen,
    toggleRightSidebar,
  } = usePlayer();

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 sm:h-24 bg-[#121212]/95 backdrop-blur-xl border-t border-[#282828] z-50 px-3 sm:px-5 flex items-center justify-between">
      {/* Left Segment: Track Information */}
      <div className="w-1/4 min-w-[180px] sm:min-w-[240px]">
        <TrackInfo track={currentTrack} />
      </div>

      {/* Center Segment: Player Controls & Scrubbing Bar */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl px-2">
        <PlayerControls />
        <div className="w-full mt-1.5 flex justify-center">
          <ProgressBar />
        </div>
      </div>

      {/* Right Segment: Secondary Utilities & Volume */}
      <div className="w-1/4 min-w-[180px] sm:min-w-[240px] flex items-center justify-end gap-2 sm:gap-3">
        {/* Animated Sound Equalizer when playing */}
        {isPlaying && (
          <div className="hidden sm:flex items-center mr-2 px-2 py-1 bg-black/40 rounded-full border border-white/5">
            <EqualizerAnimation isPlaying={isPlaying} />
          </div>
        )}

        {/* Now Playing Drawer Toggle */}
        <button
          onClick={toggleRightSidebar}
          aria-label={isRightSidebarOpen ? 'Close details panel' : 'Open details panel'}
          className={`p-2 rounded-full transition-colors ${
            isRightSidebarOpen ? 'text-spotify-green bg-white/5' : 'text-spotify-subtext hover:text-white'
          }`}
          title="Now playing view"
        >
          {isRightSidebarOpen ? (
            <PanelRightClose className="w-5 h-5" />
          ) : (
            <PanelRightOpen className="w-5 h-5" />
          )}
        </button>

        {/* Volume Slider */}
        <VolumeControl />
      </div>
    </footer>
  );
}
