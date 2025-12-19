import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UploadSection } from './components/UploadSection';
import { Dashboard } from './components/Dashboard';
import { RulesConfig } from './components/RulesConfig';
import { INITIAL_RULES } from './constants';
import { ViewState, Course, UserRules } from './types';

const API_KEY = process.env.API_KEY || "";

// --- Intro Animation Component ---
const IntroSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("INITIALIZING...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15);
      });
    }, 150);

    const textTimers = [
      setTimeout(() => setText("LOADING MODULES..."), 800),
      setTimeout(() => setText("OPTIMIZING SCHEDULE..."), 1600),
      setTimeout(() => setText("SYSTEM READY"), 2400),
    ];

    const finishTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      textTimers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono text-white">
      <div className="w-64 space-y-4">
        <div className="flex justify-between text-xs text-accent tracking-widest">
          <span>BOOT_SEQUENCE_V1.0</span>
          <span>{Math.min(progress, 100)}%</span>
        </div>
        <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent shadow-[0_0_10px_#22c55e] transition-all duration-200"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <div className="text-center text-sm text-gray-400 animate-pulse">
          {'>'} {text} <span className="animate-blink">_</span>
        </div>
      </div>
      
      {/* Decorative Glitch Elements */}
      <div className="absolute bottom-10 left-10 text-[10px] text-gray-600 font-mono opacity-50">
        MEM_ALLOC: 0x4921<br/>
        CPU_THREAD: ACTIVE
      </div>
    </div>
  );
};

const LandingPage = ({ onStart }: { onStart: () => void }) => (
  <div className="relative flex flex-col items-center justify-center min-h-full w-full overflow-hidden bg-background">
    
    {/* Dynamic Background */}
    <div className="absolute inset-0 overflow-hidden">
       <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] bg-primary/20 rounded-full blur-[120px] animate-pulse-fast"></div>
       <div className="absolute bottom-[20%] right-[10%] w-[25vw] h-[25vw] bg-accent/10 rounded-full blur-[100px]" style={{ animationDelay: '1s' }}></div>
       <div className="absolute inset-0 bg-noise opacity-30"></div>
       {/* Grid overlay */}
       <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
    </div>
    
    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
      
      {/* Status Badge */}
      <div className="inline-flex items-center gap-3 px-4 py-2 border border-accent/30 rounded-full bg-accent/5 backdrop-blur-md mb-10 animate-slide-up-fade">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
        </span>
        <span className="text-xs font-mono font-bold tracking-widest text-accent uppercase">Academic Weapon Mode: ON</span>
      </div>

      {/* Main Title */}
      <div className="relative mb-8 animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
        <h1 className="text-7xl md:text-9xl font-sans font-bold text-white tracking-tighter leading-none relative z-10 group cursor-default">
          SYLLABUS
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x">ARCHITECT</span>
        </h1>
        {/* Glitch Shadow Effect */}
        <h1 className="absolute top-1 left-1 text-7xl md:text-9xl font-sans font-bold text-red-500/20 tracking-tighter leading-none -z-10 animate-glitch opacity-0 group-hover:opacity-100 transition-opacity">
          SYLLABUS<br/>ARCHITECT
        </h1>
      </div>
      
      <p className="text-lg md:text-xl text-gray-400 font-body max-w-2xl mx-auto leading-relaxed mb-12 animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
        Stop drowning in PDFs. <br/>
        We extract the deadlines. You secure the GPA. 
        <span className="block mt-2 text-white font-mono text-sm opacity-70">Powered by automated intelligence.</span>
      </p>

      {/* Start Button */}
      <div className="animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
        <button 
          onClick={onStart}
          className="group relative px-12 py-5 bg-white text-black font-sans font-bold text-lg uppercase tracking-wider overflow-hidden hover:scale-105 transition-transform duration-300 rounded-sm"
        >
          {/* Button Tech Borders */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-black"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-black"></div>
          
          <span className="relative z-10 flex items-center gap-3">
            Initialize System
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </span>
          <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out -z-0"></div>
        </button>
      </div>

      {/* Stats / Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 border-t border-white/10 pt-8 animate-slide-up-fade" style={{ animationDelay: '0.5s' }}>
        {[
          { label: "Parsing Speed", val: "0.4s" },
          { label: "Accuracy", val: "99.9%" },
          { label: "User Status", val: "Elite" },
          { label: "System", val: "Online" }
        ].map((stat, i) => (
          <div key={i} className="text-left font-mono">
            <div className="text-[10px] text-gray-500 uppercase mb-1">{stat.label}</div>
            <div className="text-xl text-white font-bold">{stat.val}</div>
          </div>
        ))}
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
        <IntroSequence onComplete={() => setLoading(false)} />
      ) : (
        <Layout currentView={view} setView={setView}>
          {renderContent()}
        </Layout>
      )}
    </>
  );
};

export default App;