/**
 * App.jsx — Main application component.
 *
 * Wires together the algorithm selector, visualizer bars,
 * controls, and stats panel into one beautiful page.
 */

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

import Navbar from './components/Layout/Navbar';
import SortingBars from './components/Visualizer/SortingBars';
import StatsPanel from './components/Visualizer/StatsPanel';
import Controls from './components/Controls/Controls';
import AlgorithmSelector from './components/AlgorithmSelector/AlgorithmSelector';
import DataPatternSelector from './components/Controls/DataPatternSelector';

import { ALGORITHMS } from './algorithms';
import { generateArray } from './utils/arrayGenerators';
import { useSorter } from './hooks/useSorter';

const DEFAULT_SIZE = 50;

export default function App() {
  const [selectedAlgo, setSelectedAlgo] = useState('bubble');
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [dataPattern, setDataPattern] = useState('random');

  const sorter = useSorter();

  // Generate initial array
  useEffect(() => {
    const arr = generateArray(arraySize, dataPattern);
    sorter.setArray(arr);
    sorter.reset();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShuffle = useCallback(() => {
    sorter.reset();
    const arr = generateArray(arraySize, dataPattern);
    sorter.setArray(arr);
  }, [arraySize, dataPattern, sorter]);

  const handlePlay = useCallback(() => {
    const algo = ALGORITHMS[selectedAlgo];
    sorter.start(algo.fn, sorter.array);
  }, [selectedAlgo, sorter]);

  const handleSizeChange = useCallback((size) => {
    setArraySize(size);
    sorter.reset();
    const arr = generateArray(size, dataPattern);
    sorter.setArray(arr);
  }, [dataPattern, sorter]);

  const handlePatternChange = useCallback((pattern) => {
    setDataPattern(pattern);
    sorter.reset();
    const arr = generateArray(arraySize, pattern);
    sorter.setArray(arr);
  }, [arraySize, sorter]);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-neon-purple/5 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-primary-200 to-neon-purple bg-clip-text text-transparent mb-3">
            Watch Algorithms Think
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Visualize, compare, and understand sorting algorithms through 
            beautiful animations. Pick an algorithm, hit play, and see the magic.
          </p>
        </motion.div>

        {/* Algorithm Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AlgorithmSelector
            selected={selectedAlgo}
            onSelect={setSelectedAlgo}
            disabled={sorter.isRunning}
          />
        </motion.div>

        {/* Data Pattern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass p-4"
        >
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Data Pattern</h3>
          <DataPatternSelector
            selected={dataPattern}
            onSelect={handlePatternChange}
            disabled={sorter.isRunning}
          />
        </motion.div>

        {/* Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          id="visualizer"
          className="glass p-6 glow-border"
        >
          <SortingBars
            array={sorter.array}
            comparing={sorter.comparing}
            swapping={sorter.swapping}
            sorted={sorter.sorted}
          />
        </motion.div>

        {/* Controls + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Controls
              isRunning={sorter.isRunning}
              isPaused={sorter.isPaused}
              onPlay={handlePlay}
              onPause={sorter.pause}
              onResume={sorter.resume}
              onStep={sorter.stepForward}
              onReset={handleShuffle}
              onShuffle={handleShuffle}
              speed={sorter.speed}
              onSpeedChange={sorter.setSpeed}
              arraySize={arraySize}
              onArraySizeChange={handleSizeChange}
              disabled={!selectedAlgo}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatsPanel
              stats={sorter.stats}
              currentStep={sorter.currentStep}
              algorithmName={ALGORITHMS[selectedAlgo]?.name}
            />
          </motion.div>
        </div>

        {/* Algorithm Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass p-6"
        >
          <div className="flex items-start gap-4">
            <div
              className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
              style={{ backgroundColor: ALGORITHMS[selectedAlgo]?.color }}
            />
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {ALGORITHMS[selectedAlgo]?.name}
              </h3>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-2 py-0.5 rounded bg-white/5 text-gray-400 font-mono">
                  Time: {ALGORITHMS[selectedAlgo]?.timeComplexity}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-gray-400 font-mono">
                  Space: {ALGORITHMS[selectedAlgo]?.spaceComplexity}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-gray-400">
                  {ALGORITHMS[selectedAlgo]?.category}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coming Soon: Race Mode teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          id="race"
          className="glass p-8 text-center border-dashed border-white/10"
        >
          <div className="text-4xl mb-3">🏁</div>
          <h3 className="text-xl font-bold text-white mb-2">Race Mode — Coming Soon</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Pit algorithms against each other on the same dataset. 
            Watch them race side-by-side with live stats.
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-sm text-gray-600">
        <p>
          Built with React, Framer Motion & Tailwind CSS •{' '}
          <span className="text-primary-400">SortLab</span>
        </p>
      </footer>
    </div>
  );
}
