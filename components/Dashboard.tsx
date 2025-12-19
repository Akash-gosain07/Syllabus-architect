import React, { useMemo, useState } from 'react';
import { Course, Conflict, UserRules, SyllabusItem } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  courses: Course[];
  rules: UserRules;
}

export const Dashboard: React.FC<DashboardProps> = ({ courses, rules }) => {
  const [filter, setFilter] = useState<'all' | 'exam' | 'assignment'>('all');

  const allItems = useMemo(() => {
    return courses.flatMap(c => c.items.map(i => ({ ...i, courseName: c.name, courseColor: c.color, courseId: c.id })))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [courses]);

  const conflicts = useMemo(() => {
    const conflictMap = new Map<string, SyllabusItem[]>();
    const foundConflicts: Conflict[] = [];

    allItems.forEach(item => {
      const existing = conflictMap.get(item.dueDate) || [];
      conflictMap.set(item.dueDate, [...existing, item]);
    });

    conflictMap.forEach((items, date) => {
      if (items.length > rules.maxItemsPerDay) {
        foundConflicts.push({
          date,
          items: items.map(i => ({ courseId: (i as any).courseId, item: i })),
          severity: 'high',
          reason: `High Workload (${items.length} items)`
        });
      }
      const exams = items.filter(i => i.type === 'exam');
      if (exams.length > 1) {
        foundConflicts.push({
           date,
           items: items.map(i => ({ courseId: (i as any).courseId, item: i })),
           severity: 'high',
           reason: 'Exam Conflict'
        });
      }
    });

    return foundConflicts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allItems, rules]);

  const chartData = useMemo(() => {
    return allItems.filter(i => new Date(i.dueDate) >= new Date()).slice(0, 10).map(i => ({
      name: i.title.substring(0, 12) + (i.title.length > 12 ? '..' : ''),
      date: i.dueDate,
      weight: i.weightage || 10,
      color: (i as any).courseColor,
      fullTitle: i.title,
      course: (i as any).courseName
    }));
  }, [allItems]);

  const filteredItems = filter === 'all' ? allItems : allItems.filter(i => i.type === filter);

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-white/5 flex items-center justify-center mb-6 shadow-xl">
           <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No Courses Added</h3>
        <p className="text-gray-500 text-sm max-w-sm mb-6">Your roadmap is empty. Upload a syllabus to generate your schedule.</p>
        <div className="h-px w-24 bg-white/10"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-2xl font-bold text-white tracking-tight">Semester Roadmap</h2>
           <p className="text-gray-500 text-sm mt-1">Fall 2024</p>
        </div>
        <div>
           <button 
             className="px-4 py-2 text-xs font-medium text-gray-300 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
             onClick={() => {
               const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(allItems, null, 2))}`;
               const link = document.createElement("a");
               link.href = jsonString;
               link.download = "semester_data.json";
               link.click();
             }}
           >
             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             Export Data
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Courses", val: courses.length },
          { label: "Deliverables", val: allItems.length },
          { label: "Upcoming Exams", val: allItems.filter(i => i.type === 'exam').length },
          { label: "Conflicts", val: conflicts.length, alert: conflicts.length > 0 }
        ].map((metric, i) => (
          <div key={i} className="glass-panel p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{metric.label}</span>
            <div className={`text-3xl font-semibold mt-2 ${metric.alert ? 'text-error' : 'text-white'}`}>{metric.val}</div>
          </div>
        ))}
      </div>

      {/* Conflicts Banner */}
      {conflicts.length > 0 && (
        <div className="bg-error/5 border border-error/10 rounded-xl p-4 flex items-start gap-4">
           <div className="mt-1 text-error"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
           <div>
             <h3 className="text-sm font-medium text-white">Schedule Conflicts Detected</h3>
             <p className="text-xs text-gray-400 mt-1 mb-3">You have {conflicts.length} overlapping commitments that require attention.</p>
             <div className="flex gap-2 flex-wrap">
               {conflicts.map((c, idx) => (
                  <span key={idx} className="text-xs bg-error/10 text-error px-2 py-1 rounded border border-error/20">
                    {c.date}: {c.reason}
                  </span>
               ))}
             </div>
           </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Timeline</h3>
            <div className="flex bg-surfaceHighlight rounded-lg p-0.5 border border-white/5">
              {(['all', 'exam', 'assignment'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    filter === f ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative border-l border-white/10 ml-3 space-y-8">
            {filteredItems.map((item, index) => (
              <div key={item.id} className="relative pl-8 group">
                <div 
                  className={`absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full ring-4 ring-background z-10 ${
                    item.type === 'exam' ? 'bg-error' : 'bg-primary'
                  }`}
                ></div>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                  <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                    {item.title}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                   <span 
                     className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-gray-300"
                   >
                     <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: (item as any).courseColor }}></span>
                     {(item as any).courseCode || 'Course'}
                   </span>
                   <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                   {item.weightage && <span className="text-xs text-gray-600">{item.weightage}%</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics */}
        <div>
          <h3 className="text-lg font-medium text-white mb-6">Weight Distribution</h3>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11, fill: '#71717a'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#a1a1aa' }}
                />
                <Bar dataKey="weight" radius={[0, 4, 4, 0]} barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
             <h4 className="text-primary font-medium text-sm mb-1">Pro Tip</h4>
             <p className="text-xs text-gray-400 leading-relaxed">
               Spread out your high-weight assignments. You have 3 major deliverables in the next 14 days.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};