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
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up-fade">
      <div className="space-y-2 border-b border-white/10 pb-6">
        <h2 className="text-3xl font-bold text-white font-sans tracking-tight">SYSTEM PARAMETERS</h2>
        <p className="text-gray-500 font-mono text-sm">Configure threat detection logic and workload thresholds.</p>
      </div>

      <div className="grid gap-6">
        
        {/* Card 1 */}
        <div className="bg-surfaceHighlight/20 border border-white/5 p-6 rounded-lg backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white font-mono uppercase">High Impact Threshold</h3>
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_#a855f7]"></div>
          </div>
          <div className="flex justify-between items-center">
             <p className="text-sm text-gray-400 max-w-md">
                Assignments exceeding this weightage will trigger a <span className="text-primary font-bold">PRIORITY ALERT</span>.
             </p>
             <div className="flex items-center bg-black/50 border border-white/10 rounded px-3 py-2">
                <input 
                  type="number" 
                  value={rules.highWeightThreshold}
                  onChange={(e) => handleChange('highWeightThreshold', parseInt(e.target.value))}
                  className="w-12 bg-transparent text-right font-mono text-white outline-none"
                />
                <span className="text-gray-500 text-xs ml-2">%</span>
             </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surfaceHighlight/20 border border-white/5 p-6 rounded-lg backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white font-mono uppercase">Exam Proximity Buffer</h3>
            <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_5px_#22c55e]"></div>
          </div>
          <div className="flex justify-between items-center">
             <p className="text-sm text-gray-400 max-w-md">
                Define the "Danger Zone" window (in days) before a major exam.
             </p>
             <div className="flex items-center bg-black/50 border border-white/10 rounded px-3 py-2">
                <input 
                  type="number" 
                  value={rules.examWeekBuffer}
                  onChange={(e) => handleChange('examWeekBuffer', parseInt(e.target.value))}
                  className="w-12 bg-transparent text-right font-mono text-white outline-none"
                />
                <span className="text-gray-500 text-xs ml-2">DAYS</span>
             </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surfaceHighlight/20 border border-white/5 p-6 rounded-lg backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white font-mono uppercase">Overload Limit</h3>
            <div className="w-2 h-2 rounded-full bg-alert shadow-[0_0_5px_#ef4444]"></div>
          </div>
          <div className="flex justify-between items-center">
             <p className="text-sm text-gray-400 max-w-md">
                Maximum acceptable deliverables per 24-hour cycle.
             </p>
             <div className="flex items-center bg-black/50 border border-white/10 rounded px-3 py-2">
                <input 
                  type="number" 
                  value={rules.maxItemsPerDay}
                  onChange={(e) => handleChange('maxItemsPerDay', parseInt(e.target.value))}
                  className="w-12 bg-transparent text-right font-mono text-white outline-none"
                />
                <span className="text-gray-500 text-xs ml-2">ITEMS</span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-white/10">
        <button 
          onClick={() => setRules(INITIAL_RULES)}
          className="text-xs font-mono text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
        >
          [ Reset Factory Defaults ]
        </button>
      </div>
    </div>
  );
};