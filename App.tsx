import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UploadSection } from './components/UploadSection';
import { Dashboard } from './components/Dashboard';
import { RulesConfig } from './components/RulesConfig';
import { INITIAL_RULES } from './constants';
import { ViewState, Course, UserRules } from './types';

const API_KEY = process.env.API_KEY || "";

// --- Cinematic Intro Animation ---
const IntroOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isExit, setIsExit] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsExit(true);
            setTimeout(onComplete, 800); // Matches slide-up-curtain duration
          }, 400);
          return 100;
        }
        // Random increment for realistic loading feel
        return Math.min(prev + Math.floor(Math.random() * 4) + 1, 100);
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden ${isExit ? 'animate-slide-up-curtain' : ''}`}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20">
         <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-primary/30 rounded-full blur-[150px] animate-blob"></div>
         <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-accent/20 rounded-full blur-[150px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-8 flex flex-col items-center">
        {/* Typography Reveal */}
        <div className="flex flex-col md:flex-row items-baseline gap-2 md:gap-4 overflow-hidden mb-12">
           <div className="overflow-hidden">
             <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tighter animate-text-reveal">
               SYLLABUS
             </h1>
           </div>
           <div className="overflow-hidden">
             <h1 className="text-4xl md:text-7xl font-light text-gray-400 tracking-tighter animate-text-reveal" style={{ animationDelay: '0.1s' }}>
               ARCHITECT
             </h1>
           </div>
        </div>

        {/* Minimal Progress Line */}
        <div className="w-full max-w-sm h-[1px] bg-white/10 relative overflow-hidden">
           <div 
             className="absolute top-0 left-0 h-full bg-white transition-all duration-100 ease-out" 
             style={{ width: `${progress}%` }}
           ></div>
        </div>

        {/* Loading Status */}
        <div className="mt-4 flex justify-between w-full max-w-sm text-[10px] font-mono uppercase tracking-widest text-gray-500">
           <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
             <span>Initializing Neural Core</span>
           </div>
           <span className="tabular-nums">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ onStart }: { onStart: () => void }) => (
  <div className="relative min-h-full w-full overflow-hidden bg-background text-white selection:bg-primary/30">
    
    {/* Ambient Background */}
    <div className="absolute top-0 left-0 right-0 h-[600px] bg-mesh-gradient opacity-60 pointer-events-none"></div>
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[128px] animate-blob mix-blend-screen"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[128px] animate-blob animation-delay-2000 mix-blend-screen"></div>

    <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
      
      {/* Hero Section */}
      <div className="space-y-8 max-w-4xl animate-slide-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          System v2.0 Operational
        </div>
        
        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.9] text-white">
          Semester, <br/>
          <span className="text-shimmer">Architected.</span>
        </h1>
        
        <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
          The intelligent workspace for students who optimize. 
          Upload syllabi, visualize critical paths, and architect your GPA.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-white text-black rounded-full font-medium text-sm hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] overflow-hidden"
          >
            <span className="relative z-10">Start Planning</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
            <span>Watch Demo</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Bento Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-32 w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
        
        {/* Card 1: Large */}
        <div className="md:col-span-2 glass-card p-10 rounded-3xl relative overflow-hidden group text-left border border-white/5 hover:border-white/10 transition-colors duration-500">
          <div className="relative z-10 max-w-md">
            <h3 className="text-2xl font-bold mb-3 text-white">Intelligent Extraction</h3>
            <p className="text-gray-400 leading-relaxed">Our multimodal AI engine ingests PDFs and images instantly. It contextualizes "Midterm", "Final", and ambiguous deadlines with human-like precision.</p>
          </div>
          <div className="absolute right-0 bottom-0 w-2/3 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
          
          {/* Abstract floating UI visual */}
          <div className="absolute right-[-20px] bottom-[-40px] opacity-40 group-hover:opacity-80 transition-all duration-700 ease-out transform group-hover:translate-y-[-10px] group-hover:rotate-[-2deg]">
             <div className="w-64 h-40 bg-[#18181b] rounded-xl border border-white/10 shadow-2xl p-4">
                <div className="w-1/2 h-4 bg-white/20 rounded mb-4"></div>
                <div className="space-y-2">
                   <div className="w-full h-2 bg-white/5 rounded"></div>
                   <div className="w-3/4 h-2 bg-white/5 rounded"></div>
                   <div className="w-full h-2 bg-white/5 rounded"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Card 2: Tall */}
        <div className="md:row-span-2 glass-card p-10 rounded-3xl text-left flex flex-col justify-between group hover:bg-white/[0.02] transition-colors border border-white/5">
           <div>
             <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mb-6 text-secondary border border-secondary/20 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
               <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
             </div>
             <h3 className="text-xl font-bold mb-3 text-white">Strategic Roadmap</h3>
             <p className="text-gray-400 text-sm leading-relaxed">Visualize your entire semester as a linear timeline. Identify high-pressure weeks before they happen.</p>
           </div>
           
           <div className="mt-10 space-y-3 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-secondary"></div>
                 <div className="h-1 flex-1 bg-white/10 rounded-full"></div>
              </div>
              <div className="flex items-center gap-3 pl-4">
                 <div className="w-2 h-2 rounded-full bg-primary"></div>
                 <div className="h-1 flex-1 bg-white/10 rounded-full"></div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-white"></div>
                 <div className="h-1 flex-1 bg-white/10 rounded-full"></div>
              </div>
           </div>
        </div>

        {/* Card 3: Small */}
        <div className="glass-card p-8 rounded-3xl text-left hover:border-white/20 transition-colors border border-white/5 flex flex-col justify-center">
          <h3 className="text-lg font-bold mb-2 text-white">Universal Export</h3>
          <p className="text-gray-400 text-sm">Syncs with Notion, Google Calendar, or raw JSON.</p>
        </div>

        {/* Card 4: Small */}
        <div className="glass-card p-8 rounded-3xl text-left hover:border-error/20 transition-colors border border-white/5 relative overflow-hidden flex flex-col justify-center group">
          <div className="absolute inset-0 bg-gradient-to-br from-error/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-lg font-bold mb-2 text-white relative z-10 flex items-center gap-2">
            Conflict Detection
            <span className="w-2 h-2 bg-error rounded-full animate-pulse"></span>
          </h3>
          <p className="text-gray-400 text-sm relative z-10">Proactive warnings for exam collisions.</p>
        </div>

      </div>
      
      <div className="mt-20 border-t border-white/5 pt-8 w-full flex justify-between items-center text-xs text-gray-600 font-mono uppercase tracking-widest">
        <p>Syllabus Architect © 2024</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>

    </div>
  </div>
);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rules, setRules] = useState<UserRules>(INITIAL_RULES);

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
    <>
      {loading ? (
        <IntroOverlay onComplete={() => setLoading(false)} />
      ) : (
        <Layout currentView={view} setView={setView}>
          {renderContent()}
        </Layout>
      )}
    </>
  );
};

export default App;