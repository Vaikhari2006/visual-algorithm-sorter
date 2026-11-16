/**
 * StatsPanel — Shows live statistics during sorting.
 */

export default function StatsPanel({ stats, currentStep, algorithmName }) {
  const formatTime = (ms) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-300">Live Stats</h3>
        {algorithmName && (
          <span className="text-sm px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 font-medium">
            {algorithmName}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-yellow-400">
            {stats.comparisons.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">Comparisons</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-red-400">
            {stats.swaps.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">Swaps</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-blue-400">
            {formatTime(stats.time)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Time</div>
        </div>
      </div>

      {currentStep && (
        <div className="text-sm text-gray-400 bg-black/30 rounded-lg px-4 py-2 font-mono truncate">
          {currentStep}
        </div>
      )}
    </div>
  );
}
