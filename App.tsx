import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UploadSection } from './components/UploadSection';
import { Dashboard } from './components/Dashboard';
import { RulesConfig } from './components/RulesConfig';
import { INITIAL_RULES } from './constants';
import { ViewState, Course, UserRules } from './types';

// Mock API Key handling - In a real app, this would be injected via process.env
const API_KEY = process.env.API_KEY || "";

const LandingPage = ({ onStart }: { onStart: () => void }) => (
  <div className="relative flex flex-col items-center justify-center min-h-full w-full bg-academic-50 overflow-hidden">
    {/* Architectural Background Grid */}
    <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none"></div>
    
    {/* Geometric Accents */}
    <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-academic-200 to-transparent opacity-50"></div>
    <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-academic-200 to-transparent opacity-50"></div>
    
    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-12">
      
      {/* Header Section */}
      <div className="space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 border border-academic-300 rounded-full bg-white/50 backdrop-blur-sm opacity-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <span className="w-2 h-2 rounded-full bg-accent-600"></span>
          <span className="text-xs font-semibold tracking-widest uppercase text-academic-600">v1.0 System Operational</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-bold text-academic-900 tracking-tight leading-tight opacity-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Syllabus <br />
          <span className="italic font-light text-academic-700">Architect</span>
        </h1>
        
        <div className="w-24 h-1 bg-academic-900 mx-auto opacity-0 animate-draw-line" style={{ animationDelay: '0.6s' }}></div>

        <p className="text-lg md:text-xl text-academic-600 font-light max-w-2xl mx-auto leading-relaxed opacity-0 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          An intelligent system for the modern scholar. <br/>
          Transform chaotic course requirements into a unified, conflict-free strategic plan.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 opacity-0 animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <button 
          onClick={onStart}
          className="group relative px-8 py-3 bg-academic-900 text-white rounded-md font-medium text-sm tracking-wide uppercase overflow-hidden hover:bg-academic-800 transition-all shadow-lg hover:shadow-xl"
        >
          <span className="relative z-10">Initialize Workspace</span>
          <div className="absolute inset-0 h-full w-full bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
        </button>
        
        <a 
          href="https://ai.google.dev" 
          target="_blank" 
          rel="noreferrer"
          className="px-8 py-3 bg-transparent text-academic-700 border border-academic-300 rounded-md font-medium text-sm tracking-wide uppercase hover:bg-white hover:border-academic-400 transition-all"
        >
          Powered by Gemini
        </a>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left opacity-0 animate-slide-up" style={{ animationDelay: '0.8s' }}>
        {[
          { title: "Ingestion", desc: "Multimodal analysis of PDF and image-based syllabi.", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
          { title: "Extraction", desc: "Precision identification of critical academic dates.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
          { title: "Synthesis", desc: "Conflict detection and workload optimization.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" }
        ].map((item, idx) => (
          <div key={idx} className="p-6 border border-academic-200 bg-white/60 backdrop-blur-sm hover:border-accent-500/30 hover:shadow-lg transition-all duration-300 group">
            <div className="w-10 h-10 mb-4 text-academic-400 group-hover:text-accent-600 transition-colors">
               <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
            </div>
            <h3 className="font-serif font-bold text-academic-900 mb-2">{item.title}</h3>
            <p className="text-sm text-academic-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <p className="text-xs text-academic-400 font-mono">System Status: Online • {new Date().getFullYear()} Edition</p>
      </div>
    </div>
  </div>
);

const App = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rules, setRules] = useState<UserRules>(INITIAL_RULES);

  useEffect(() => {
    // Debugging helper: Check console to see if API Key is loaded
    if (API_KEY) {
      console.log("System Check: API Key is configured and loaded.");
    } else {
      console.warn("System Check: API Key is MISSING or undefined.");
    }
  }, []);

  const handleCourseAdd = (course: Course) => {
    setCourses(prev => [...prev, course]);
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.LANDING:
        return <LandingPage onStart={() => setView(ViewState.UPLOAD)} />;
      case ViewState.UPLOAD:
        return <UploadSection onCourseAdded={handleCourseAdd} apiKey={API_KEY} />;
      case ViewState.DASHBOARD:
        return <Dashboard courses={courses} rules={rules} />;
      case ViewState.RULES:
        return <RulesConfig rules={rules} setRules={setRules} />;
      default:
        return <LandingPage onStart={() => setView(ViewState.UPLOAD)} />;
    }
  };

  return (
    <Layout currentView={view} setView={setView}>
      {renderContent()}
    </Layout>
  );
};

export default App;