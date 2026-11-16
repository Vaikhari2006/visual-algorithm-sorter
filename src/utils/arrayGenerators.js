/**
 * Array generator utilities for different data patterns.
 * Users can pick these to see how algorithms perform on
 * different types of input data.
 */

export function generateArray(size, pattern = 'random') {
  switch (pattern) {
    case 'random':       return randomArray(size);
    case 'nearlySorted': return nearlySortedArray(size);
    case 'reversed':     return reversedArray(size);
    case 'fewUnique':    return fewUniqueArray(size);
    case 'sawtooth':     return sawtoothArray(size);
    case 'sorted':       return sortedArray(size);
    default:             return randomArray(size);
  }
}

function randomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * size) + 5);
}

function nearlySortedArray(size) {
  const arr = Array.from({ length: size }, (_, i) => i + 5);
  // Swap ~10% of elements
  const swaps = Math.floor(size * 0.1);
  for (let i = 0; i < swaps; i++) {
    const idx1 = Math.floor(Math.random() * size);
    const idx2 = Math.floor(Math.random() * size);
    [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
  }
  return arr;
}

function reversedArray(size) {
  return Array.from({ length: size }, (_, i) => size - i + 4);
}

function fewUniqueArray(size) {
  const values = [10, 30, 50, 70, 90];
  return Array.from({ length: size }, () => values[Math.floor(Math.random() * values.length)]);
}

function sawtoothArray(size) {
  const teethCount = 4;
  const toothSize = Math.ceil(size / teethCount);
  return Array.from({ length: size }, (_, i) => (i % toothSize) + 5);
}

function sortedArray(size) {
  return Array.from({ length: size }, (_, i) => i + 5);
}

export const DATA_PATTERNS = {
  random:       { name: 'Random',        icon: '🎲', description: 'Completely random values' },
  nearlySorted: { name: 'Nearly Sorted', icon: '📊', description: '90% sorted, 10% shuffled' },
  reversed:     { name: 'Reversed',      icon: '🔄', description: 'Sorted in descending order' },
  fewUnique:    { name: 'Few Unique',    icon: '🎯', description: 'Only 5 distinct values' },
  sawtooth:     { name: 'Sawtooth',      icon: '📈', description: 'Repeating ascending pattern' },
  sorted:       { name: 'Already Sorted',icon: '✅', description: 'Best case for some algorithms' },
};
