import { Search, Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="h-16 flex-shrink-0 bg-[#0a0a0a] border-b border-neutral-800 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex-1 max-w-xl flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
        <Search className="w-4 h-4 text-neutral-500" />
        <input 
          type="text" 
          placeholder="Search items..." 
          className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-200 placeholder-neutral-500"
        />
      </div>
      
      <div className="flex items-center gap-6 ml-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs">
          <span className="text-neutral-500">Extension Status:</span>
          <span className="text-emerald-500 font-medium">v3 Connected</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 text-neutral-400 hover:text-white transition-colors rounded hover:bg-neutral-800">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-neutral-900" />
          </button>
          <Link to="/settings" className="p-2 text-neutral-400 hover:text-white transition-colors rounded hover:bg-neutral-800">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
