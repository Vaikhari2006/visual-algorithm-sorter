/**
 * useSorter — The core hook that drives the sorting visualization.
 *
 * It takes an algorithm generator function, runs it step-by-step,
 * and exposes the current state (array, highlighted bars, stats)
 * for the Visualizer component to render.
 */

import { useState, useRef, useCallback, useEffect } from 'react';

const DEFAULT_SPEED = 50; // ms per step

export function useSorter() {
  const [array, setArray] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0, time: 0 });
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [currentStep, setCurrentStep] = useState('');

  const generatorRef = useRef(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);
  const statsRef = useRef({ comparisons: 0, swaps: 0 });
  const isPausedRef = useRef(false);
  const speedRef = useRef(DEFAULT_SPEED);
  const resolveStepRef = useRef(null);

  // Keep refs in sync with state
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    generatorRef.current = null;
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setIsRunning(false);
    setIsPaused(false);
    setStats({ comparisons: 0, swaps: 0, time: 0 });
    setCurrentStep('');
    statsRef.current = { comparisons: 0, swaps: 0 };
  }, []);

  const runStep = useCallback(() => {
    if (!generatorRef.current) return;

    const { value: step, done } = generatorRef.current.next();

    if (done) {
      setComparing([]);
      setSwapping([]);
      setIsRunning(false);
      const elapsed = performance.now() - startTimeRef.current;
      setStats(prev => ({ ...prev, time: elapsed }));
      setCurrentStep('✅ Sorting complete!');
      // Mark all as sorted
      setArray(prev => {
        setSorted(Array.from({ length: prev.length }, (_, i) => i));
        return prev;
      });
      return;
    }

    if (step) {
      switch (step.type) {
        case 'compare':
          setComparing(step.indices);
          setSwapping([]);
          statsRef.current.comparisons++;
          setStats(prev => ({
            ...prev,
            comparisons: statsRef.current.comparisons,
            time: performance.now() - startTimeRef.current,
          }));
          setCurrentStep(`Comparing indices ${step.indices[0]} and ${step.indices[1]}`);
          break;

        case 'swap':
          setSwapping(step.indices);
          setComparing([]);
          statsRef.current.swaps++;
          if (step.array) setArray(step.array);
          setStats(prev => ({
            ...prev,
            swaps: statsRef.current.swaps,
            time: performance.now() - startTimeRef.current,
          }));
          setCurrentStep(`Swapping indices ${step.indices[0]} and ${step.indices[1]}`);
          break;

        case 'overwrite':
          setSwapping([step.index]);
          setComparing([]);
          statsRef.current.swaps++;
          if (step.array) setArray(step.array);
          setStats(prev => ({
            ...prev,
            swaps: statsRef.current.swaps,
            time: performance.now() - startTimeRef.current,
          }));
          setCurrentStep(`Writing value ${step.value} at index ${step.index}`);
          break;

        case 'sorted':
          setSorted(prev => [...new Set([...prev, ...step.indices])]);
          break;
      }
    }

    // Schedule next step
    const waitForResume = () => {
      if (isPausedRef.current) {
        timeoutRef.current = setTimeout(waitForResume, 100);
      } else {
        timeoutRef.current = setTimeout(runStep, speedRef.current);
      }
    };

    if (isPausedRef.current) {
      timeoutRef.current = setTimeout(waitForResume, 100);
    } else {
      timeoutRef.current = setTimeout(runStep, speedRef.current);
    }
  }, []);

  const start = useCallback((algorithmFn, inputArray) => {
    reset();

    const arr = [...inputArray];
    setArray(arr);
    generatorRef.current = algorithmFn(arr);
    startTimeRef.current = performance.now();
    statsRef.current = { comparisons: 0, swaps: 0 };
    setIsRunning(true);
    setIsPaused(false);

    // Kick off the first step
    timeoutRef.current = setTimeout(runStep, speedRef.current);
  }, [reset, runStep]);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stepForward = useCallback(() => {
    if (!generatorRef.current) return;
    // Temporarily unpause for one step
    const { value: step, done } = generatorRef.current.next();

    if (done) {
      setComparing([]);
      setSwapping([]);
      setIsRunning(false);
      const elapsed = performance.now() - startTimeRef.current;
      setStats(prev => ({ ...prev, time: elapsed }));
      setCurrentStep('✅ Sorting complete!');
      return;
    }

    if (step) {
      switch (step.type) {
        case 'compare':
          setComparing(step.indices);
          setSwapping([]);
          statsRef.current.comparisons++;
          setStats(prev => ({ ...prev, comparisons: statsRef.current.comparisons }));
          setCurrentStep(`Comparing indices ${step.indices[0]} and ${step.indices[1]}`);
          break;
        case 'swap':
          setSwapping(step.indices);
          setComparing([]);
          statsRef.current.swaps++;
          if (step.array) setArray(step.array);
          setStats(prev => ({ ...prev, swaps: statsRef.current.swaps }));
          setCurrentStep(`Swapping indices ${step.indices[0]} and ${step.indices[1]}`);
          break;
        case 'overwrite':
          setSwapping([step.index]);
          setComparing([]);
          statsRef.current.swaps++;
          if (step.array) setArray(step.array);
          setStats(prev => ({ ...prev, swaps: statsRef.current.swaps }));
          setCurrentStep(`Writing value ${step.value} at index ${step.index}`);
          break;
        case 'sorted':
          setSorted(prev => [...new Set([...prev, ...step.indices])]);
          break;
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    array,
    setArray,
    comparing,
    swapping,
    sorted,
    isRunning,
    isPaused,
    stats,
    speed,
    setSpeed,
    currentStep,
    start,
    pause,
    resume,
    stepForward,
    reset,
  };
}
