/**
 * ============================================================
 * SORTING ALGORITHMS — Generator Functions
 * ============================================================
 * Each algorithm is a generator that yields "steps" for the
 * animation engine. Each step describes what's happening:
 *
 *   { type: 'compare', indices: [i, j] }
 *   { type: 'swap',    indices: [i, j] }
 *   { type: 'overwrite', index: i, value: v }
 *   { type: 'sorted',  indices: [i] }
 *
 * The animation engine consumes these steps and updates the
 * visual bars accordingly. This keeps algorithms PURE — no
 * DOM, no React, no side effects.
 * ============================================================
 */

// ── Bubble Sort ──────────────────────────────────────────────
export function* bubbleSort(arr) {
  const a = [...arr];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', indices: [j, j + 1] };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { type: 'swap', indices: [j, j + 1], array: [...a] };
        swapped = true;
      }
    }
    yield { type: 'sorted', indices: [n - i - 1] };
    if (!swapped) break;
  }
  yield { type: 'sorted', indices: [0] };
  return a;
}

// ── Selection Sort ───────────────────────────────────────────
export function* selectionSort(arr) {
  const a = [...arr];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', indices: [minIdx, j] };
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { type: 'swap', indices: [i, minIdx], array: [...a] };
    }
    yield { type: 'sorted', indices: [i] };
  }
  yield { type: 'sorted', indices: [n - 1] };
  return a;
}

// ── Insertion Sort ───────────────────────────────────────────
export function* insertionSort(arr) {
  const a = [...arr];
  const n = a.length;

  yield { type: 'sorted', indices: [0] };

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;

    yield { type: 'compare', indices: [i, j] };

    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      yield { type: 'overwrite', index: j + 1, value: a[j], array: [...a] };
      j--;
      if (j >= 0) {
        yield { type: 'compare', indices: [j, j + 1] };
      }
    }
    a[j + 1] = key;
    yield { type: 'overwrite', index: j + 1, value: key, array: [...a] };
    yield { type: 'sorted', indices: [i] };
  }
  return a;
}

// ── Merge Sort ───────────────────────────────────────────────
export function* mergeSort(arr) {
  const a = [...arr];

  yield* mergeSortHelper(a, 0, a.length - 1);

  for (let i = 0; i < a.length; i++) {
    yield { type: 'sorted', indices: [i] };
  }
  return a;
}

function* mergeSortHelper(a, left, right) {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  yield* mergeSortHelper(a, left, mid);
  yield* mergeSortHelper(a, mid + 1, right);
  yield* merge(a, left, mid, right);
}

function* merge(a, left, mid, right) {
  const leftArr = a.slice(left, mid + 1);
  const rightArr = a.slice(mid + 1, right + 1);

  let i = 0, j = 0, k = left;

  while (i < leftArr.length && j < rightArr.length) {
    yield { type: 'compare', indices: [left + i, mid + 1 + j] };
    if (leftArr[i] <= rightArr[j]) {
      a[k] = leftArr[i];
      yield { type: 'overwrite', index: k, value: leftArr[i], array: [...a] };
      i++;
    } else {
      a[k] = rightArr[j];
      yield { type: 'overwrite', index: k, value: rightArr[j], array: [...a] };
      j++;
    }
    k++;
  }

  while (i < leftArr.length) {
    a[k] = leftArr[i];
    yield { type: 'overwrite', index: k, value: leftArr[i], array: [...a] };
    i++;
    k++;
  }

  while (j < rightArr.length) {
    a[k] = rightArr[j];
    yield { type: 'overwrite', index: k, value: rightArr[j], array: [...a] };
    j++;
    k++;
  }
}

// ── Quick Sort ───────────────────────────────────────────────
export function* quickSort(arr) {
  const a = [...arr];

  yield* quickSortHelper(a, 0, a.length - 1);

  for (let i = 0; i < a.length; i++) {
    yield { type: 'sorted', indices: [i] };
  }
  return a;
}

function* quickSortHelper(a, low, high) {
  if (low >= high) return;

  const pivotIdx = yield* partition(a, low, high);
  yield { type: 'sorted', indices: [pivotIdx] };
  yield* quickSortHelper(a, low, pivotIdx - 1);
  yield* quickSortHelper(a, pivotIdx + 1, high);
}

function* partition(a, low, high) {
  const pivot = a[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    yield { type: 'compare', indices: [j, high] };
    if (a[j] < pivot) {
      i++;
      [a[i], a[j]] = [a[j], a[i]];
      yield { type: 'swap', indices: [i, j], array: [...a] };
    }
  }

  [a[i + 1], a[high]] = [a[high], a[i + 1]];
  yield { type: 'swap', indices: [i + 1, high], array: [...a] };

  return i + 1;
}

// ── Heap Sort ────────────────────────────────────────────────
export function* heapSort(arr) {
  const a = [...arr];
  const n = a.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(a, n, i);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    yield { type: 'swap', indices: [0, i], array: [...a] };
    yield { type: 'sorted', indices: [i] };
    yield* heapify(a, i, 0);
  }
  yield { type: 'sorted', indices: [0] };
  return a;
}

function* heapify(a, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n) {
    yield { type: 'compare', indices: [left, largest] };
    if (a[left] > a[largest]) largest = left;
  }

  if (right < n) {
    yield { type: 'compare', indices: [right, largest] };
    if (a[right] > a[largest]) largest = right;
  }

  if (largest !== i) {
    [a[i], a[largest]] = [a[largest], a[i]];
    yield { type: 'swap', indices: [i, largest], array: [...a] };
    yield* heapify(a, n, largest);
  }
}

// ── Shell Sort ───────────────────────────────────────────────
export function* shellSort(arr) {
  const a = [...arr];
  const n = a.length;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = a[i];
      let j = i;

      yield { type: 'compare', indices: [j - gap, j] };
      while (j >= gap && a[j - gap] > temp) {
        a[j] = a[j - gap];
        yield { type: 'overwrite', index: j, value: a[j - gap], array: [...a] };
        j -= gap;
        if (j >= gap) {
          yield { type: 'compare', indices: [j - gap, j] };
        }
      }
      a[j] = temp;
      yield { type: 'overwrite', index: j, value: temp, array: [...a] };
    }
  }

  for (let i = 0; i < n; i++) {
    yield { type: 'sorted', indices: [i] };
  }
  return a;
}

// ── Counting Sort ────────────────────────────────────────────
export function* countingSort(arr) {
  const a = [...arr];
  const n = a.length;
  if (n === 0) return a;

  const max = Math.max(...a);
  const min = Math.min(...a);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(n).fill(0);

  // Count occurrences
  for (let i = 0; i < n; i++) {
    count[a[i] - min]++;
    yield { type: 'compare', indices: [i, i] }; // reading
  }

  // Cumulative count
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  // Build output
  for (let i = n - 1; i >= 0; i--) {
    output[count[a[i] - min] - 1] = a[i];
    count[a[i] - min]--;
  }

  // Copy back
  for (let i = 0; i < n; i++) {
    a[i] = output[i];
    yield { type: 'overwrite', index: i, value: output[i], array: [...a] };
    yield { type: 'sorted', indices: [i] };
  }

  return a;
}

// ── Radix Sort ───────────────────────────────────────────────
export function* radixSort(arr) {
  const a = [...arr];
  const n = a.length;
  if (n === 0) return a;

  const max = Math.max(...a);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    yield* countingSortByDigit(a, n, exp);
  }

  for (let i = 0; i < n; i++) {
    yield { type: 'sorted', indices: [i] };
  }
  return a;
}

function* countingSortByDigit(a, n, exp) {
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) {
    const digit = Math.floor(a[i] / exp) % 10;
    count[digit]++;
    yield { type: 'compare', indices: [i, i] };
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(a[i] / exp) % 10;
    output[count[digit] - 1] = a[i];
    count[digit]--;
  }

  for (let i = 0; i < n; i++) {
    a[i] = output[i];
    yield { type: 'overwrite', index: i, value: output[i], array: [...a] };
  }
}

// ── Tim Sort (simplified) ────────────────────────────────────
const TIM_RUN = 32;

function insertionSortRange(a, left, right) {
  const steps = [];
  for (let i = left + 1; i <= right; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= left && a[j] > key) {
      a[j + 1] = a[j];
      steps.push({ type: 'overwrite', index: j + 1, value: a[j], array: [...a] });
      j--;
    }
    a[j + 1] = key;
    steps.push({ type: 'overwrite', index: j + 1, value: key, array: [...a] });
  }
  return steps;
}

export function* timSort(arr) {
  const a = [...arr];
  const n = a.length;

  // Sort individual runs with insertion sort
  for (let i = 0; i < n; i += TIM_RUN) {
    const right = Math.min(i + TIM_RUN - 1, n - 1);
    const steps = insertionSortRange(a, i, right);
    for (const step of steps) {
      yield step;
    }
  }

  // Merge runs
  for (let size = TIM_RUN; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = Math.min(left + size - 1, n - 1);
      const right = Math.min(left + 2 * size - 1, n - 1);
      if (mid < right) {
        yield* merge(a, left, mid, right);
      }
    }
  }

  for (let i = 0; i < n; i++) {
    yield { type: 'sorted', indices: [i] };
  }
  return a;
}


// ── Algorithm Registry ──────────────────────────────────────
export const ALGORITHMS = {
  bubble:    { name: 'Bubble Sort',    fn: bubbleSort,    timeComplexity: 'O(n²)',      spaceComplexity: 'O(1)',     category: 'Simple',           color: '#ff6b6b' },
  selection: { name: 'Selection Sort', fn: selectionSort, timeComplexity: 'O(n²)',      spaceComplexity: 'O(1)',     category: 'Simple',           color: '#ffa94d' },
  insertion: { name: 'Insertion Sort', fn: insertionSort, timeComplexity: 'O(n²)',      spaceComplexity: 'O(1)',     category: 'Simple',           color: '#ffd43b' },
  merge:     { name: 'Merge Sort',     fn: mergeSort,     timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)',     category: 'Divide & Conquer', color: '#69db7c' },
  quick:     { name: 'Quick Sort',     fn: quickSort,     timeComplexity: 'O(n log n)', spaceComplexity: 'O(log n)', category: 'Divide & Conquer', color: '#339af0' },
  heap:      { name: 'Heap Sort',      fn: heapSort,      timeComplexity: 'O(n log n)', spaceComplexity: 'O(1)',     category: 'Tree-based',       color: '#b197fc' },
  shell:     { name: 'Shell Sort',     fn: shellSort,     timeComplexity: 'O(n log²n)', spaceComplexity: 'O(1)',     category: 'Gap-based',        color: '#e599f7' },
  counting:  { name: 'Counting Sort',  fn: countingSort,  timeComplexity: 'O(n+k)',     spaceComplexity: 'O(k)',     category: 'Non-comparison',   color: '#66d9e8' },
  radix:     { name: 'Radix Sort',     fn: radixSort,     timeComplexity: 'O(nk)',      spaceComplexity: 'O(n+k)',   category: 'Non-comparison',   color: '#38d9a9' },
  tim:       { name: 'Tim Sort',       fn: timSort,       timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)',     category: 'Hybrid',           color: '#ff8787' },
};
