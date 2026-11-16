/**
 * SortingBars — The animated bar chart visualization.
 *
 * Each bar's height represents its value. Colors indicate state:
 *   - Default (gradient)  → unsorted
 *   - Yellow glow         → being compared
 *   - Red glow            → being swapped
 *   - Green glow          → in its sorted position
 */

import { motion } from 'framer-motion';

export default function SortingBars({ array, comparing, swapping, sorted, maxVal }) {
  if (!array || array.length === 0) return null;

  const max = maxVal || Math.max(...array);
  const barWidth = Math.max(2, Math.min(40, (window.innerWidth * 0.6) / array.length));
  const gap = Math.max(1, Math.min(3, barWidth * 0.1));

  return (
    <div
      className="flex items-end justify-center w-full"
      style={{ height: '400px', gap: `${gap}px` }}
    >
      {array.map((value, index) => {
        const heightPercent = (value / max) * 100;
        const isSorted = sorted.includes(index);
        const isComparing = comparing.includes(index);
        const isSwapping = swapping.includes(index);

        let barClass = 'bg-gradient-to-t from-primary-700 to-primary-400';
        let glowClass = '';

        if (isSorted) {
          barClass = 'bg-gradient-to-t from-emerald-600 to-emerald-400';
          glowClass = 'bar-glow-green';
        } else if (isSwapping) {
          barClass = 'bg-gradient-to-t from-red-600 to-red-400';
          glowClass = 'bar-glow-red';
        } else if (isComparing) {
          barClass = 'bg-gradient-to-t from-yellow-600 to-yellow-300';
          glowClass = 'bar-glow-yellow';
        }

        return (
          <motion.div
            key={index}
            className={`rounded-t-sm ${barClass} ${glowClass}`}
            style={{
              width: `${barWidth}px`,
              minWidth: '2px',
            }}
            animate={{
              height: `${heightPercent}%`,
            }}
            transition={{
              duration: 0.08,
              ease: 'easeOut',
            }}
            title={`Index: ${index}, Value: ${value}`}
          />
        );
      })}
    </div>
  );
}
