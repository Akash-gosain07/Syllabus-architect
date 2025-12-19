import React, { useState, useCallback } from 'react';
import { extractSyllabusData } from '../services/geminiService';
import { fileToBase64 } from '../services/fileService';
import { Course, SyllabusItem, ItemType } from '../types';
import { COLORS } from '../constants';
import { v4 as uuidv4 } from 'uuid';

interface UploadSectionProps {
  onCourseAdded: (course: Course) => void;
  apiKey: string;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onCourseAdded, apiKey }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setProcessingStatus(`SCANNING: ${file.name.toUpperCase()}...`);

    try {
      const base64 = await fileToBase64(file);
      const mimeType = file.type;

      setProcessingStatus("DECRYPTING DATA STRUCTURE...");
      
      const data = await extractSyllabusData(base64, mimeType, apiKey);

      const items: SyllabusItem[] = data.items.map(item => ({
        id: uuidv4(),
        type: (item.type as ItemType) || 'assignment',
        title: item.title,
        dueDate: item.due_date,
        weightage: item.weightage,
        notes: item.notes,
        status: 'pending'
      }));

      const newCourse: Course = {
        id: uuidv4(),
        code: data.course_code || 'UNK',
        name: data.course_name,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        items: items,
        rawFile: file
      };

      onCourseAdded(newCourse);
      setProcessingStatus("INTEGRATION COMPLETE");
      
      // Delay to show success state
      await new Promise(r => setTimeout(r, 800));

    } catch (err: any) {
      console.error(err);
      setError("PARSING FAILED: UNREADABLE FORMAT");
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!apiKey) { setError("ERR: API KEY MISSING"); return; }
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) processFile(files[0]);
  }, [apiKey]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (!apiKey) { setError("ERR: API KEY MISSING"); return; }
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center animate-slide-up-fade">
      
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-5xl font-sans font-bold text-white tracking-tighter">DATA INGESTION</h2>
        <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Upload Syllabus PDF/IMG to begin analysis</p>
      </div>

      <div 
        className={`w-full max-w-2xl aspect-[16/9] relative rounded-lg transition-all duration-300 flex flex-col items-center justify-center overflow-hidden border-2 border-dashed ${
          isDragging 
            ? 'border-accent bg-accent/5 scale-105' 
            : 'border-white/20 bg-black/20 hover:border-white/40'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Animated Scanner Bar */}
        {isProcessing && (
           <div className="absolute inset-0 z-0 animate-scanline bg-gradient-to-b from-transparent via-accent/20 to-transparent h-1/4 w-full pointer-events-none"></div>
        )}

        <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
          
          <div className={`w-20 h-20 rounded-full flex items-center justify-center border transition-all ${
            isProcessing ? 'border-accent animate-spin' : 'border-white/30'
          }`}>
             {isProcessing ? (
               <div className="w-16 h-16 bg-accent/20 rounded-full animate-pulse"></div>
             ) : (
               <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
               </svg>
             )}
          </div>
          
          <div className="text-center space-y-4">
            {isProcessing ? (
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white tracking-widest animate-pulse">PROCESSING</h3>
                <p className="text-xs text-accent font-mono">{processingStatus}</p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-bold text-white">DROP TARGET</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">SUPPORTED: PDF // JPG // PNG</p>
                </div>
                
                <div className="relative group inline-block">
                   <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <button className="px-8 py-2 bg-white text-black font-bold font-mono text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
                    Select File Manually
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Corner Markers */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/30 m-4"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/30 m-4"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/30 m-4"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/30 m-4"></div>
      </div>

      {error && (
        <div className="mt-8 bg-alert/10 border border-alert text-alert px-6 py-4 rounded flex items-center space-x-3 w-full max-w-2xl animate-pop">
          <span className="font-bold font-mono">ERR::</span>
          <span className="text-sm font-mono">{error}</span>
        </div>
      )}
      
      {!apiKey && (
        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 px-6 py-4 rounded flex items-center space-x-3 w-full max-w-2xl font-mono text-xs">
           <span className="font-bold">WARN:</span>
           <span>DEMO_MODE // API KEY NOT DETECTED</span>
        </div>
      )}
    </div>
  );
};