import { Wand2, Github } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#fbf7f0]/80 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-600/20">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-800 tracking-tight">AI Image Studio</h1>
            <p className="text-xs text-stone-400">Powered by Pollinations AI</p>
          </div>
        </div>
        <a
          href="https://pollinations.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-teal-600 transition-colors"
        >
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline">Pollinations.ai</span>
        </a>
      </div>
    </header>
  );
}
