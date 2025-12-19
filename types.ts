export type ItemType = 'assignment' | 'exam' | 'quiz' | 'reading' | 'project';

export interface SyllabusItem {
  id: string;
  type: ItemType;
  title: string;
  dueDate: string; // YYYY-MM-DD
  weightage: number | null; // Percentage 0-100
  notes: string;
  status: 'pending' | 'completed';
}

export interface Course {
  id: string;
  code: string;
  name: string;
  color: string;
  items: SyllabusItem[];
  rawFile?: File;
}

export interface Conflict {
  date: string;
  items: { courseId: string; item: SyllabusItem }[];
  severity: 'high' | 'medium' | 'low';
  reason: string;
}

export interface UserRules {
  highWeightThreshold: number; // e.g., 15%
  examWeekBuffer: number; // days
  maxItemsPerDay: number;
}

export enum ViewState {
  LANDING,
  UPLOAD,
  DASHBOARD,
  RULES
}