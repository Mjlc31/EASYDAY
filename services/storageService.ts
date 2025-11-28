
import { Task, UserStats } from '../types';
import { INITIAL_BADGES } from '../constants';

const KEYS = {
  TASKS: 'easyday_tasks',
  USER: 'easyday_user',
  VISITED: 'easyday_visited'
};

export const StorageService = {
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  loadTasks: (): Task[] => {
    const stored = localStorage.getItem(KEYS.TASKS);
    return stored ? JSON.parse(stored) : [];
  },

  saveUser: (user: UserStats) => {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  loadUser: (): UserStats | null => {
    const stored = localStorage.getItem(KEYS.USER);
    if (!stored) return null;
    // Ensure badges exist if loading old data structure
    const parsed = JSON.parse(stored);
    if (!parsed.badges) parsed.badges = INITIAL_BADGES;
    return parsed;
  },

  setVisited: () => {
    localStorage.setItem(KEYS.VISITED, 'true');
  },

  hasVisited: () => {
    return localStorage.getItem(KEYS.VISITED) === 'true';
  },

  clearAll: () => {
    localStorage.clear();
    window.location.reload();
  }
};
