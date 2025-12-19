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
    setProcessingStatus(`Analyzing ${file.name}...`);

    try {
      const base64 = await fileToBase64(file);
      const mimeType = file.type;

      setProcessingStatus("Extracting dates & requirements...");
      
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
      setProcessingStatus("Complete");
      await new Promise(r => setTimeout(r, 500));

    } catch (err: any) {
      console.error(err);
      setError("Could not parse file. Ensure it is a clear syllabus PDF or Image.");
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!apiKey) { setError("API Key not configured"); return; }
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) processFile(files[0]);
  }, [apiKey]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (!apiKey) { setError("API Key not configured"); return; }
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center animate-fade-in">
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Import Course</h2>
        <p className="text-gray-400">Upload your syllabus PDF or Image. We'll handle the rest.</p>
      </div>

      <div 
        className={`relative w-full aspect-[4/3] rounded-3xl transition-all duration-300 flex flex-col items-center justify-center overflow-hidden group cursor-pointer border border-dashed ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-white/10 bg-surface/50 hover:bg-surface/80 hover:border-white/20'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center space-y-4">
             <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
             <p className="text-sm font-medium text-gray-300 animate-pulse">{processingStatus}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6 transform group-hover:-translate-y-2 transition-transform duration-300">
             <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-black transition-colors shadow-xl">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
             </div>
             <div className="text-center">
               <p className="text-lg font-medium text-white">Drop syllabus here</p>
               <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
             </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-error/10 text-error rounded-xl text-sm flex items-center gap-3 border border-error/20">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      <div className="mt-12 grid grid-cols-2 gap-4">
         <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <h4 className="text-sm font-medium text-white mb-1">Supported Formats</h4>
            <p className="text-xs text-gray-500">PDF, PNG, JPEG</p>
         </div>
         <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <h4 className="text-sm font-medium text-white mb-1">Privacy Focused</h4>
            <p className="text-xs text-gray-500">Processed securely via Gemini API.</p>
         </div>
      </div>

    </div>
  );
};