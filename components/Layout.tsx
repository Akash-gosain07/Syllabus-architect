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
    className={`w-full flex items-center gap-4 px-4 py-4 rounded-lg transition-all duration-200 group relative ${
      active 
        ? 'bg-white/5 text-white' 
        : 'text-gray-500 hover:text-white hover:bg-white/5'
    }`}
  >
    {/* Active Neon Bar */}
    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full shadow-[0_0_10px_#22c55e]"></div>
    )}

    <div className={`relative z-10 transition-transform duration-200 ${active ? 'scale-110 text-accent' : 'group-hover:text-gray-300'}`}>
      {icon}
    </div>
    <span className={`relative z-10 text-sm font-sans tracking-wide ${active ? 'font-bold' : 'font-medium'}`}>
      {label}
    </span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-gray-200 selection:bg-accent selection:text-black">
      {/* Scanline Overlay */}
      <div className="scanlines"></div>

      {/* Floating Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-900/20 rounded-full blur-[128px]"></div>
      </div>

      {/* Modern Sidebar */}
      <aside className="w-20 md:w-72 border-r border-white/10 flex flex-col z-20 bg-black/40 backdrop-blur-xl relative">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => setView(ViewState.LANDING)}>
            <div className="w-10 h-10 bg-white text-black rounded-sm flex items-center justify-center font-bold text-xl relative overflow-hidden">
              <span className="relative z-10">S</span>
              <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <div className="hidden md:block">
              <h1 className="font-sans font-bold text-lg leading-none tracking-tight">SYLLABUS<br/><span className="text-gray-500 text-xs font-mono uppercase">Architect OS</span></h1>
            </div>
          </div>

          <nav className="space-y-2">
            <div className="hidden md:block px-4 pb-2 text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest">Navigation</div>
            
            <NavItem 
              active={currentView === ViewState.LANDING} 
              onClick={() => setView(ViewState.LANDING)} 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
              label="Home" 
            />
            <NavItem 
              active={currentView === ViewState.UPLOAD} 
              onClick={() => setView(ViewState.UPLOAD)} 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
              label="Ingest Data" 
            />
            <NavItem 
              active={currentView === ViewState.DASHBOARD} 
              onClick={() => setView(ViewState.DASHBOARD)} 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>}
              label="Tactical View" 
            />
            <NavItem 
              active={currentView === ViewState.RULES} 
              onClick={() => setView(ViewState.RULES)} 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>}
              label="Parameters" 
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/10 hidden md:block">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#22c55e] animate-pulse"></div>
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Network</span>
               <span className="text-xs text-white font-mono">SECURE_V1</span>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative z-10 scroll-smooth">
        <div className="max-w-7xl mx-auto p-6 md:p-12 h-full">
          {children}
        </div>
      </main>
    </div>
  );
};