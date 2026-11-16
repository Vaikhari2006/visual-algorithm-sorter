/**
 * AlgorithmSelector — Pick which sorting algorithm to visualize.
 *
 * Displays a grid of algorithm cards showing name, complexity,
 * and category. The selected one gets a glowing border.
 */

import { ALGORITHMS } from '../../algorithms';

export default function AlgorithmSelector({ selected, onSelect, disabled }) {
  return (
    <div className="glass p-5">
      <h3 className="text-lg font-semibold mb-3 text-gray-300">Choose Algorithm</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {Object.entries(ALGORITHMS).map(([key, algo]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            disabled={disabled}
            className={`
              p-3 rounded-xl text-left transition-all duration-200 border
              ${selected === key
                ? 'border-primary-500/60 bg-primary-500/15 shadow-lg shadow-primary-500/10'
                : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15'
              }
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: algo.color }}
              />
              <span className="text-sm font-semibold text-white truncate">{algo.name}</span>
            </div>
            <div className="text-xs text-gray-500 font-mono">{algo.timeComplexity}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
