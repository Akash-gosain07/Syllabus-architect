import React from 'react';
import { ViewState } from '../types';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
}

const NavItem = ({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string 
}) => (
  <button
    onClick={onClick}
    title={label}
    className={`w-10 h-10 md:w-full md:h-auto flex items-center md:gap-3 justify-center md:justify-start px-0 md:px-4 py-3 rounded-xl transition-all duration-200 group relative ${
      active 
        ? 'bg-white text-black shadow-lg shadow-white/10' 
        : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
    }`}
  >
    <div className={`transition-transform duration-200 ${active ? 'scale-100' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className="hidden md:block text-sm font-medium tracking-tight">
      {label}
    </span>
    
    {/* Tooltip for mobile/icon-only */}
    <span className="md:hidden absolute left-14 bg-surface border border-white/10 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
      {label}
    </span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-gray-200 selection:bg-primary/30">
      
      {/* Sidebar / Dock */}
      <aside className="w-16 md:w-64 border-r border-white/5 flex flex-col z-20 bg-surface/50 backdrop-blur-xl">
        <div className="p-4 md:p-6 flex flex-col h-full">
          
          {/* Logo Area */}
          <div className="flex items-center gap-3 mb-10 pl-1 cursor-pointer" onClick={() => setView(ViewState.LANDING)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
              S
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-sm text-white tracking-wide">Syllabus<span className="text-gray-500 font-normal">Architect</span></h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            <NavItem 
              active={currentView === ViewState.LANDING} 
              onClick={() => setView(ViewState.LANDING)} 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
              label="Overview" 
            />
            <NavItem 
              active={currentView === ViewState.UPLOAD} 
              onClick={() => setView(ViewState.UPLOAD)} 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Add Course" 
            />
            <NavItem 
              active={currentView === ViewState.DASHBOARD} 
              onClick={() => setView(ViewState.DASHBOARD)} 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>}
              label="Roadmap" 
            />
            <NavItem 
              active={currentView === ViewState.RULES} 
              onClick={() => setView(ViewState.RULES)} 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              label="Settings" 
            />
          </nav>
          
          <div className="hidden md:flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600"></div>
             <div className="flex flex-col overflow-hidden">
               <span className="text-xs font-medium text-white truncate">Student Plan</span>
               <span className="text-[10px] text-gray-500 truncate">Free Tier</span>
             </div>
          </div>

        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10 scroll-smooth">
        <div className="max-w-7xl mx-auto p-6 md:p-12 h-full">
          {children}
        </div>
      </main>
    </div>
  );
};