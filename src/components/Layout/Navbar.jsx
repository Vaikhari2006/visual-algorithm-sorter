/**
 * Navbar — Top navigation bar.
 *
 * YOUR TASK: This is yours to customize! Add more links,
 * a theme toggle, or whatever you'd like.
 */

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-end gap-0.5 h-8">
              <div className="w-1.5 h-3 bg-primary-500 rounded-t-sm opacity-50" />
              <div className="w-1.5 h-5 bg-primary-500 rounded-t-sm opacity-65" />
              <div className="w-1.5 h-7 bg-primary-500 rounded-t-sm opacity-80" />
              <div className="w-1.5 h-8 bg-primary-500 rounded-t-sm" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-neon-purple bg-clip-text text-transparent">
                SortLab
              </h1>
              <p className="text-[10px] text-gray-500 -mt-1 tracking-wider uppercase">
                Visual Algorithm Sorter
              </p>
            </div>
          </div>

          {/* Nav Links — add more here! */}
          <div className="flex items-center gap-4">
            <a href="#visualizer" className="text-sm text-gray-400 hover:text-white transition-colors">
              Visualizer
            </a>
            <a href="#race" className="text-sm text-gray-400 hover:text-white transition-colors">
              Race Mode
            </a>
            <a href="#learn" className="text-sm text-gray-400 hover:text-white transition-colors">
              Learn
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
