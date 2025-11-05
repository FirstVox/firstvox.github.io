import React from 'react';
import type { User } from '../types';
import { LogOut } from './icons/LogOut';
import { useObjectUrl } from '../hooks/useObjectUrl';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onTitleClick: () => void;
  onNavigateHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onTitleClick, onNavigateHome }) => {
  const { url: logoUrl } = useObjectUrl('/logo.png');

  return (
    <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center flex-shrink-0">
             {logoUrl && <img 
                src={logoUrl} 
                alt="FirstVox Logo" 
                className="h-12 w-12 mr-3 rounded-lg cursor-pointer transition-transform hover:scale-110"
                onClick={onNavigateHome}
                aria-label="Go to homepage"
            />}
             <h1 
              className="text-3xl font-bold text-white cursor-pointer"
              onClick={onTitleClick}
              aria-label="Reset view"
             >
              FirstVox <span className="font-light text-slate-400">//</span> Comms Hub
            </h1>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="text-slate-300 mr-3 hidden sm:block">{user.name}</span>
              <img className="h-10 w-10 rounded-full ring-2 ring-slate-600" src={user.avatarUrl} alt="User avatar" />
            </div>
            <button
              onClick={onLogout}
              className="ml-4 p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-accent-cyan"
              aria-label="Logout"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;