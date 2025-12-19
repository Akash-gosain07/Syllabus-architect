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
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-academic-900">Alert Rules & Configuration</h2>
        <p className="text-academic-500">Customize how Syllabus Architect detects conflicts and prioritizes your workload.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-academic-200 divide-y divide-academic-100">
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-academic-900">High Impact Threshold</h3>
              <p className="text-sm text-academic-500 mt-1">
                Assignments worth more than this percentage will be flagged as <span className="text-red-600 font-bold">High Priority</span>.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                value={rules.highWeightThreshold}
                onChange={(e) => handleChange('highWeightThreshold', parseInt(e.target.value))}
                className="w-20 p-2 border border-academic-300 rounded-md text-right font-mono"
              />
              <span className="text-academic-500">%</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-academic-900">Exam Week Buffer</h3>
              <p className="text-sm text-academic-500 mt-1">
                Highlight the schedule this many days before a major exam.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                value={rules.examWeekBuffer}
                onChange={(e) => handleChange('examWeekBuffer', parseInt(e.target.value))}
                className="w-20 p-2 border border-academic-300 rounded-md text-right font-mono"
              />
              <span className="text-academic-500">days</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-academic-900">Daily Workload Limit</h3>
              <p className="text-sm text-academic-500 mt-1">
                Trigger a conflict alert if more than this number of items are due on the same day.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                value={rules.maxItemsPerDay}
                onChange={(e) => handleChange('maxItemsPerDay', parseInt(e.target.value))}
                className="w-20 p-2 border border-academic-300 rounded-md text-right font-mono"
              />
              <span className="text-academic-500">items</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex justify-end">
          <button 
            onClick={() => setRules(INITIAL_RULES)}
            className="text-academic-600 hover:text-academic-900 text-sm font-medium"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};