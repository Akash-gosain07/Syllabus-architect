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
          reason: `OVERLOAD (${items.length} items)`
        });
      }
      const exams = items.filter(i => i.type === 'exam');
      if (exams.length > 1) {
        foundConflicts.push({
           date,
           items: items.map(i => ({ courseId: (i as any).courseId, item: i })),
           severity: 'high',
           reason: 'EXAM CONFLICT'
        });
      }
    });

    return foundConflicts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allItems, rules]);

  const chartData = useMemo(() => {
    return allItems.filter(i => new Date(i.dueDate) >= new Date()).slice(0, 10).map(i => ({
      name: i.title.substring(0, 10),
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
      <div className="flex flex-col items-center justify-center h-full py-20 text-center animate-slide-up-fade">
        <div className="w-24 h-24 rounded-full border border-dashed border-gray-700 flex items-center justify-center mb-6">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
             <span className="text-4xl">📂</span>
           </div>
        </div>
        <h3 className="text-3xl font-sans font-bold text-white mb-2">NO DATA DETECTED</h3>
        <p className="text-gray-500 font-mono text-sm max-w-md">Initialize the parser by uploading your syllabus documents in the Ingest Data tab.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up-fade pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6">
        <div>
           <h2 className="text-4xl font-sans font-bold text-white tracking-tight">TACTICAL OVERVIEW</h2>
           <p className="text-gray-500 mt-1 font-mono text-sm">SEMESTER_ID: FALL_2024 // ACTIVE</p>
        </div>
        <div className="mt-4 md:mt-0">
           <button 
             className="px-5 py-2 text-xs bg-white/5 border border-white/10 hover:border-accent text-white hover:text-accent font-mono uppercase tracking-widest transition-all flex items-center gap-2"
             onClick={() => {
               const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(allItems, null, 2))}`;
               const link = document.createElement("a");
               link.href = jsonString;
               link.download = "semester_data.json";
               link.click();
             }}
           >
             <span>Export_JSON</span>
             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
           </button>
        </div>
      </div>

      {/* Metrics HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Courses", val: courses.length, color: "text-white" },
          { label: "Pending Tasks", val: allItems.length, color: "text-white" },
          { label: "Major Exams", val: allItems.filter(i => i.type === 'exam').length, color: "text-primary" },
          { label: "Conflicts", val: conflicts.length, color: conflicts.length > 0 ? "text-alert" : "text-accent" }
        ].map((metric, i) => (
          <div key={i} className="bg-surfaceHighlight/30 backdrop-blur-sm border border-white/5 p-6 rounded-lg relative overflow-hidden group hover:border-white/20 transition-colors">
            {/* Tech Decoration */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20"></div>
            
            <span className={`text-4xl font-mono font-bold ${metric.color} mb-1 block`}>{metric.val}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono">{metric.label}</span>
          </div>
        ))}
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <div className="border border-alert/30 bg-alert/5 rounded-lg p-1">
          <div className="bg-alert/10 p-4 rounded flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-alert text-black flex items-center justify-center font-bold text-xl rounded animate-pulse">!</div>
               <div>
                 <h3 className="text-white font-bold font-mono tracking-wide">CRITICAL CONFLICTS DETECTED</h3>
                 <p className="text-alert text-xs font-mono">IMMEDIATE ATTENTION REQUIRED</p>
               </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {conflicts.map((c, idx) => (
                 <div key={idx} className="bg-black/40 border border-alert/40 px-3 py-2 rounded text-xs text-gray-300 font-mono whitespace-nowrap">
                   <span className="text-alert font-bold">{c.date}</span>: {c.reason}
                 </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surfaceHighlight/20 border border-white/5 rounded-xl p-6 min-h-[500px] backdrop-blur-sm">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10 sticky top-0 bg-[#18181b]/95 z-10 pt-2">
              <h3 className="text-lg font-bold text-white tracking-wide">TIMELINE</h3>
              <div className="flex bg-black/50 p-1 rounded border border-white/10">
                {(['all', 'exam', 'assignment'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider transition-all rounded ${
                      filter === f ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              {filteredItems.map((item, index) => (
                <div key={item.id} className="relative pl-6 group">
                  {/* Timeline Line */}
                  <div className="absolute left-[3px] top-0 bottom-0 w-px bg-white/10 group-hover:bg-accent/50 transition-colors"></div>
                  
                  {/* Timeline Dot */}
                  <div 
                    className={`absolute left-0 top-1.5 w-[7px] h-[7px] rounded-full ring-4 ring-[#09090b] z-10 ${
                      item.type === 'exam' ? 'bg-alert shadow-[0_0_8px_#ef4444]' : 'bg-accent shadow-[0_0_8px_#22c55e]'
                    }`}
                  ></div>
                  
                  <div className="bg-white/5 border border-white/5 hover:border-white/20 p-4 rounded-lg transition-all hover:translate-x-1">
                    <div className="flex justify-between items-start mb-2">
                       <span 
                         className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-black"
                         style={{ backgroundColor: (item as any).courseColor }}
                       >
                         {(item as any).courseCode || 'UNK-101'}
                       </span>
                       <span className="text-xs font-mono text-gray-400">
                          {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                       </span>
                    </div>
                    
                    <h4 className="text-base font-bold text-gray-100 group-hover:text-accent transition-colors">
                      {item.title}
                    </h4>
                    
                    <div className="flex items-center gap-3 mt-3">
                       <span className={`text-[10px] font-mono uppercase px-2 py-1 rounded border ${
                         item.type === 'exam' 
                           ? 'bg-alert/10 text-alert border-alert/30' 
                           : 'bg-white/5 text-gray-400 border-white/10'
                       }`}>
                         {item.type}
                       </span>
                       {item.weightage && (
                         <span className="text-[10px] font-mono text-gray-500">
                           WEIGHT: {item.weightage}%
                         </span>
                       )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Column */}
        <div className="space-y-6">
          <div className="bg-surfaceHighlight/20 border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Workload Distribution</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 9, fill: '#71717a', fontFamily: 'monospace'}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="weight" radius={[0, 2, 2, 0]} barSize={12}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="p-6 rounded-xl relative overflow-hidden group border border-accent/20">
             <div className="absolute inset-0 bg-accent/5 backdrop-blur-sm z-0"></div>
             <div className="relative z-10">
               <h3 className="font-mono font-bold text-accent mb-2 flex items-center gap-2">
                 <span className="animate-pulse">●</span> OPTIMIZATION TIP
               </h3>
               <p className="text-gray-400 text-xs leading-relaxed font-mono">
                 Balance your load. Front-load low-weight assignments to clear mental RAM for major exams.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};