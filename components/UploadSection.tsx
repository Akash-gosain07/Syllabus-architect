import React, { useState, useCallback } from 'react';
import { extractSyllabusData } from '../services/geminiService';
import { fileToBase64 } from '../services/fileService';
import { Course, SyllabusItem, ItemType } from '../types';
import { COLORS, Icons } from '../constants';
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

      setProcessingStatus("Extracting deadlines & requirements via Gemini AI...");
      
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
      setProcessingStatus("Complete!");
      setTimeout(() => setProcessingStatus(""), 2000);

    } catch (err: any) {
      console.error(err);
      setError("Failed to process file. Ensure it is a valid PDF or Image. Check API Key.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!apiKey) {
      setError("Please configure API Key first (in code or env)");
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [apiKey]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (!apiKey) {
        setError("Please configure API Key first");
        return;
      }
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif font-bold text-academic-900">Syllabus Import</h2>
        <p className="text-academic-500 font-light max-w-xl mx-auto leading-relaxed">
          Upload your course syllabus documentation below. Our system will parse dates, 
          grading schemes, and requirements automatically.
        </p>
      </div>

      <div 
        className={`relative border border-dashed rounded-lg p-16 text-center transition-all duration-300 ${
          isDragging 
            ? 'border-accent-500 bg-accent-50' 
            : 'border-academic-300 hover:border-academic-400 bg-white'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className={`p-5 rounded-full ${isProcessing ? 'bg-accent-50 animate-pulse' : 'bg-academic-50'}`}>
             <svg className={`w-10 h-10 ${isProcessing ? 'text-accent-600' : 'text-academic-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
             </svg>
          </div>
          
          {isProcessing ? (
            <div className="space-y-3">
              <h3 className="text-lg font-serif font-bold text-academic-900">Processing Document</h3>
              <p className="text-sm text-academic-500 font-mono">{processingStatus}</p>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-serif font-bold text-academic-900 mb-1">
                  Drop Syllabus File
                </h3>
                <p className="text-xs uppercase tracking-widest text-academic-500">
                  PDF or Image Format
                </p>
              </div>
              
              <div className="relative group">
                 <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <button className="relative z-10 px-8 py-3 bg-academic-900 text-white rounded-sm text-sm uppercase tracking-wide font-medium hover:bg-academic-800 transition-colors shadow-lg">
                  Select File
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-sm flex items-start space-x-3 border border-red-100">
          <Icons.Alert />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
      
      {!apiKey && (
        <div className="bg-yellow-50 text-yellow-900 p-4 rounded-sm text-sm border border-yellow-100 flex items-start space-x-3">
           <span className="font-bold text-yellow-600">⚠</span>
           <div>
             <strong>Demonstration Mode Active</strong>
             <p className="mt-1 opacity-80">System requires valid Gemini API credentials for extraction capabilities.</p>
           </div>
        </div>
      )}
    </div>
  );
};