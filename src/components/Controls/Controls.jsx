/**
 * Controls — Play/Pause, Step, Reset, Speed slider, Size slider.
 *
 * YOUR TASK: Feel free to restyle these, add keyboard shortcuts,
 * or add new controls like a "shuffle" button!
 */

import { FaPlay, FaPause, FaStepForward, FaRedo, FaRandom } from 'react-icons/fa';

export default function Controls({
  isRunning,
  isPaused,
  onPlay,
  onPause,
  onResume,
  onStep,
  onReset,
  onShuffle,
  speed,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  disabled,
}) {
  // Map speed (ms delay) to a user-friendly slider (1=slow, 100=fast)
  const speedValue = Math.round(101 - (speed / 5));

  const handleSpeedSlider = (e) => {
    const val = parseInt(e.target.value);
    // Map slider 1-100 → delay 500ms-5ms
    const delay = Math.max(5, (101 - val) * 5);
    onSpeedChange(delay);
  };

  return (
    <div className="glass p-5 space-y-4">
      {/* Playback Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        {!isRunning ? (
          <button
            onClick={onPlay}
            disabled={disabled}
            className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FaPlay className="text-sm" /> Sort
          </button>
        ) : isPaused ? (
          <button onClick={onResume} className="btn-primary flex items-center gap-2">
            <FaPlay className="text-sm" /> Resume
          </button>
        ) : (
          <button onClick={onPause} className="btn-accent flex items-center gap-2">
            <FaPause className="text-sm" /> Pause
          </button>
        )}

        <button
          onClick={onStep}
          disabled={!isRunning || !isPaused}
          className="btn-secondary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Step forward (only while paused)"
        >
          <FaStepForward className="text-sm" /> Step
        </button>

        <button
          onClick={onReset}
          className="btn-secondary flex items-center gap-2"
        >
          <FaRedo className="text-sm" /> Reset
        </button>

        <button
          onClick={onShuffle}
          disabled={isRunning}
          className="btn-secondary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <FaRandom className="text-sm" /> New Array
        </button>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">
            Speed: <span className="text-white font-mono">{speedValue}%</span>
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={speedValue}
            onChange={handleSpeedSlider}
            className="w-full accent-primary-500 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">
            Array Size: <span className="text-white font-mono">{arraySize}</span>
          </label>
          <input
            type="range"
            min="10"
            max="200"
            value={arraySize}
            onChange={(e) => onArraySizeChange(parseInt(e.target.value))}
            disabled={isRunning}
            className="w-full accent-primary-500 cursor-pointer disabled:opacity-40"
          />
        </div>
      </div>
    </div>
  );
}
