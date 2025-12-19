import React from 'react';
import { ViewState } from '../types';
import { Icons, Icons as IconComponents } from '../constants';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
}

const NavItem = ({ 
  active, 
  onClick, 
  icon: Icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ElementType; 
  label: string 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 group ${
      active 
        ? 'bg-academic-800 text-white shadow-md ring-1 ring-black/5' 
        : 'text-academic-500 hover:bg-academic-100 hover:text-academic-900'
    }`}
  >
    <div className={`${active ? 'text-white' : 'text-academic-400 group-hover:text-academic-700'}`}>
      <Icon />
    </div>
    <span className={`text-sm font-medium tracking-wide ${active ? 'font-semibold' : ''}`}>{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  return (
    <div className="flex h-screen bg-academic-50 overflow-hidden font-sans text-academic-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-academic-200 flex flex-col z-10 shadow-[2px_0_24px_-12px_rgba(0,0,0,0.1)]">
        <div className="p-8 border-b border-academic-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-academic-900 rounded-sm flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
              S
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-academic-900 leading-tight">Syllabus<br/>Architect</h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <div className="px-4 pb-2 text-xs font-semibold text-academic-400 uppercase tracking-wider">Menu</div>
          <NavItem 
            active={currentView === ViewState.LANDING} 
            onClick={() => setView(ViewState.LANDING)} 
            icon={() => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
            label="Home" 
          />
          <NavItem 
            active={currentView === ViewState.UPLOAD} 
            onClick={() => setView(ViewState.UPLOAD)} 
            icon={() => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>}
            label="Upload Syllabi" 
          />
          <NavItem 
            active={currentView === ViewState.DASHBOARD} 
            onClick={() => setView(ViewState.DASHBOARD)} 
            icon={() => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            label="Master Schedule" 
          />
          <NavItem 
            active={currentView === ViewState.RULES} 
            onClick={() => setView(ViewState.RULES)} 
            icon={() => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            label="Configuration" 
          />
        </nav>

        <div className="p-6 border-t border-academic-100">
          <div className="bg-academic-50 p-4 rounded-md border border-academic-200">
            <div className="flex items-center space-x-2 mb-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <p className="text-xs text-academic-800 font-bold uppercase tracking-wider">Active Session</p>
            </div>
            <p className="text-xs text-academic-500 font-mono">Student Lic. #8492</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative bg-[#f8f9fa] bg-grid-pattern">
        <div className="max-w-7xl mx-auto p-12 h-full">
          {children}
        </div>
      </main>
    </div>
  );
};