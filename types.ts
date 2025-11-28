
export enum QuadrantType {
  Q1 = 'Q1', // Faça Agora
  Q2 = 'Q2', // Agende
  Q3 = 'Q3', // Delegue
  Q4 = 'Q4', // Elimine
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO Date string
  quadrant: QuadrantType;
  completed: boolean;
  completedAt?: string;
  createdAt?: string; // Added to track same-day completion
}

export interface Badge {
  id: string;
  name: string;
  icon: string; // emoji or icon name
  description: string;
  unlocked: boolean;
}

export interface UserSettings {
  notifications: boolean;
  sound: boolean;
  darkMode: boolean;
  email: string;
  name: string;
  monkMode?: boolean; // New setting
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  tasksCompleted: number;
  lastLoginDate: string;
  isPremium: boolean;
  badges: Badge[];
  settings?: UserSettings; // Added settings
}

export interface HistoryEntry {
  date: string;
  completedCount: number;
  totalTasks: number;
  disciplineScore: number; // 0-100
}

export interface WeeklyReport {
  summary: string;
  score: number; // 0-100
}

export type ViewState = 'matrix' | 'stats' | 'leaderboard' | 'history' | 'premium' | 'profile' | 'checkout';

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  avatar: string;
  streak: number;
  isPremium: boolean;
}