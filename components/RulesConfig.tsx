import React from 'react';
import { UserRules } from '../types';
import { INITIAL_RULES } from '../constants';

interface RulesConfigProps {
  rules: UserRules;
  setRules: (rules: UserRules) => void;
}

export const RulesConfig: React.FC<RulesConfigProps> = ({ rules, setRules }) => {
  const handleChange = (key: keyof UserRules, value: number) => {
    setRules({ ...rules, [key]: value });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-in">
      
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Configuration</h2>
        <p className="text-gray-500 text-sm mt-1">Customize how the architect analyzes your workload.</p>
      </div>

      <div className="space-y-6">
        
        {/* Setting Item */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 glass-panel rounded-xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="mb-4 sm:mb-0">
             <h3 className="text-base font-medium text-white">High Impact Threshold</h3>
             <p className="text-sm text-gray-500 mt-1 max-w-sm">Items above this weightage will be flagged as critical priority.</p>
          </div>
          <div className="flex items-center gap-3">
             <input 
               type="range" 
               min="10" max="50" step="5"
               value={rules.highWeightThreshold}
               onChange={(e) => handleChange('highWeightThreshold', parseInt(e.target.value))}
               className="w-32 accent-primary h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
             />
             <div className="w-16 px-3 py-2 bg-black/40 rounded-lg border border-white/10 text-center font-mono text-sm text-white">
               {rules.highWeightThreshold}%
             </div>
          </div>
        </div>

        {/* Setting Item */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 glass-panel rounded-xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="mb-4 sm:mb-0">
             <h3 className="text-base font-medium text-white">Exam Warning Buffer</h3>
             <p className="text-sm text-gray-500 mt-1 max-w-sm">How many days in advance should exam proximity alerts trigger?</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-16 px-3 py-2 bg-black/40 rounded-lg border border-white/10 text-center font-mono text-sm text-white">
               {rules.examWeekBuffer}
             </div>
             <span className="text-sm text-gray-500">Days</span>
             <div className="flex flex-col gap-1">
               <button onClick={() => handleChange('examWeekBuffer', rules.examWeekBuffer + 1)} className="p-1 hover:bg-white/10 rounded"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
               <button onClick={() => handleChange('examWeekBuffer', Math.max(1, rules.examWeekBuffer - 1))} className="p-1 hover:bg-white/10 rounded"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
             </div>
          </div>
        </div>

        {/* Setting Item */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 glass-panel rounded-xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="mb-4 sm:mb-0">
             <h3 className="text-base font-medium text-white">Daily Workload Cap</h3>
             <p className="text-sm text-gray-500 mt-1 max-w-sm">Maximum number of deliverables per day before flagging a conflict.</p>
          </div>
           <div className="flex items-center gap-3">
             <div className="w-16 px-3 py-2 bg-black/40 rounded-lg border border-white/10 text-center font-mono text-sm text-white">
               {rules.maxItemsPerDay}
             </div>
             <span className="text-sm text-gray-500">Items</span>
             <div className="flex flex-col gap-1">
               <button onClick={() => handleChange('maxItemsPerDay', rules.maxItemsPerDay + 1)} className="p-1 hover:bg-white/10 rounded"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
               <button onClick={() => handleChange('maxItemsPerDay', Math.max(1, rules.maxItemsPerDay - 1))} className="p-1 hover:bg-white/10 rounded"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
             </div>
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={() => setRules(INITIAL_RULES)}
          className="text-sm text-gray-500 hover:text-white transition-colors underline decoration-dotted"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
};