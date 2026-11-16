/**
 * DataPatternSelector — Choose the initial data pattern.
 */

import { DATA_PATTERNS } from '../../utils/arrayGenerators';

export default function DataPatternSelector({ selected, onSelect, disabled }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(DATA_PATTERNS).map(([key, pattern]) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          disabled={disabled}
          className={`
            px-3 py-1.5 rounded-lg text-sm transition-all duration-200 border
            ${selected === key
              ? 'border-accent-500/60 bg-accent-500/15 text-accent-400'
              : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
          title={pattern.description}
        >
          {pattern.icon} {pattern.name}
        </button>
      ))}
    </div>
  );
}
