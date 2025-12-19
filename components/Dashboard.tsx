import React, { useMemo, useState } from 'react';
import { Course, Conflict, UserRules, SyllabusItem } from '../types';
import { Icons } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

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
          reason: `Workload exceeds limit (${items.length} items)`
        });
      }
      const exams = items.filter(i => i.type === 'exam');
      if (exams.length > 1) {
        foundConflicts.push({
           date,
           items: items.map(i => ({ courseId: (i as any).courseId, item: i })),
           severity: 'high',
           reason: 'Multiple exams on the same day'
        });
      }
    });

    return foundConflicts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allItems, rules]);

  const chartData = useMemo(() => {
    return allItems.filter(i => new Date(i.dueDate) >= new Date()).slice(0, 10).map(i => ({
      name: i.title.substring(0, 15) + '...',
      date: i.dueDate,
      weight: i.weightage || 10,
      color: (i as any).courseColor,
      type: i.type
    }));
  }, [allItems]);

  const filteredItems = filter === 'all' ? allItems : allItems.filter(i => i.type === filter);

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <div className="p-8 bg-white rounded-full shadow-sm mb-6 border border-academic-100">
           <svg className="w-12 h-12 text-academic-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <h3 className="text-2xl font-serif font-bold text-academic-900">Schedule Empty</h3>
        <p className="text-academic-500 mt-2 font-light">Upload a course syllabus to begin architecting your semester.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end border-b border-academic-200 pb-4">
        <div>
           <h2 className="text-3xl font-serif font-bold text-academic-900">Semester Overview</h2>
           <p className="text-academic-500 font-light mt-1">Academic Year 2024 - 2025</p>
        </div>
        <div className="flex space-x-2">
           <button 
             className="px-5 py-2 text-sm bg-white border border-academic-300 text-academic-700 rounded-sm hover:bg-academic-50 transition-colors uppercase tracking-wide font-medium"
             onClick={() => {
               const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(allItems, null, 2))}`;
               const link = document.createElement("a");
               link.href = jsonString;
               link.download = "semester_schedule.json";
               link.click();
             }}
           >
             Export Data
           </button>
        </div>
      </div>

      {conflicts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {conflicts.map((conflict, idx) => (
            <div key={idx} className="bg-white border-l-4 border-red-600 p-5 rounded-r-md shadow-sm ring-1 ring-black/5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-academic-900 flex items-center font-serif">
                    <span className="mr-2 text-red-600"><Icons.Alert /></span>
                    {conflict.date}
                  </h4>
                  <p className="text-sm text-red-700 mt-2 font-medium">{conflict.reason}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-academic-100 flex -space-x-2 overflow-hidden">
                {conflict.items.map((ci, i) => (
                  <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-academic-400 flex items-center justify-center text-xs text-white shadow-sm" title={ci.item.title}>
                    {i+1}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-sm shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-academic-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-serif font-bold text-academic-800">Upcoming Deliverables</h3>
              <div className="flex space-x-1 bg-academic-100 p-1 rounded-sm">
                {(['all', 'exam', 'assignment'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1 text-xs font-semibold rounded-sm uppercase tracking-wider transition-all ${
                      filter === f ? 'bg-white shadow-sm text-academic-900' : 'text-academic-500 hover:text-academic-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="divide-y divide-academic-100">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center py-4 hover:bg-academic-50 transition-colors group px-2 -mx-2 rounded-sm">
                  <div className="w-16 flex-shrink-0 text-center">
                    <div className="text-[10px] font-bold text-academic-400 uppercase tracking-widest">{new Date(item.dueDate).toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-2xl font-serif font-bold text-academic-900 leading-none mt-1">{new Date(item.dueDate).getDate()}</div>
                  </div>
                  
                  <div className="w-1 h-8 mx-6" style={{ backgroundColor: (item as any).courseColor }}></div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-academic-900 truncate font-serif">{(item as any).courseName}</h4>
                      {item.weightage && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide border ${
                          item.weightage >= rules.highWeightThreshold 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : 'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {item.weightage}% WEIGHT
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-academic-600 truncate mt-1">{item.title}</p>
                    <div className="flex items-center mt-2 space-x-3">
                       <span className={`text-[10px] font-bold uppercase tracking-wider ${
                         item.type === 'exam' ? 'text-red-600' : 'text-academic-400'
                       }`}>
                         {item.type}
                       </span>
                       {item.notes && <span className="text-[10px] text-academic-400 italic border-l border-academic-300 pl-3 truncate max-w-[200px]">{item.notes}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-sm shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-academic-200">
            <h3 className="text-lg font-serif font-bold text-academic-800 mb-6 border-b border-academic-100 pb-2">Workload Analysis</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="date" type="category" width={70} tick={{fontSize: 10, fontFamily: 'Inter'}} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontFamily: 'Inter', fontSize: '12px' }}
                  />
                  <Bar dataKey="weight" radius={[0, 2, 2, 0]} barSize={16}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-center text-academic-400 mt-4">Weighted Distribution (Next 10 Items)</p>
          </div>

          <div className="bg-white p-6 rounded-sm shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-academic-200">
             <h3 className="text-lg font-serif font-bold text-academic-800 mb-6 border-b border-academic-100 pb-2">Metrics</h3>
             <div className="grid grid-cols-2 gap-px bg-academic-200 border border-academic-200">
                <div className="p-4 bg-white text-center">
                   <div className="text-3xl font-serif font-bold text-academic-900">{courses.length}</div>
                   <div className="text-[10px] uppercase tracking-widest text-academic-500 mt-1">Courses</div>
                </div>
                <div className="p-4 bg-white text-center">
                   <div className="text-3xl font-serif font-bold text-academic-900">{allItems.length}</div>
                   <div className="text-[10px] uppercase tracking-widest text-academic-500 mt-1">Deadlines</div>
                </div>
                <div className="p-4 bg-white text-center">
                   <div className="text-3xl font-serif font-bold text-academic-900">{allItems.filter(i => i.type === 'exam').length}</div>
                   <div className="text-[10px] uppercase tracking-widest text-academic-500 mt-1">Exams</div>
                </div>
                <div className="p-4 bg-white text-center">
                   <div className="text-3xl font-serif font-bold text-academic-900 text-red-600">{conflicts.length}</div>
                   <div className="text-[10px] uppercase tracking-widest text-academic-500 mt-1">Alerts</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};