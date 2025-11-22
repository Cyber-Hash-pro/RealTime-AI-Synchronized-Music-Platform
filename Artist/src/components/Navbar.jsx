import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-16 bg-(--color-bg-main)/80 backdrop-blur-md border-b border-(--color-border-subtle) flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-(--color-bg-card) border border-(--color-border-subtle) rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-(--color-accent-green) transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-(--color-text-secondary) hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-(--color-accent-green) rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-(--color-border-subtle)">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-white">Hi, John Doe</p>
            <p className="text-xs text-(--color-text-secondary)">Artist Account</p>
          </div>
          <div className="w-10 h-10 bg-(--color-card-hover) rounded-full flex items-center justify-center border border-(--color-border-subtle)">
            <User size={20} className="text-(--color-text-secondary)" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
