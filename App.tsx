
import React, { useState, useEffect, useMemo } from 'react';
import { Task, QuadrantType, UserStats, ViewState, Badge } from './types';
import { QUADRANT_CONFIG, TOUGH_LOVE_QUOTES, MAX_FREE_TASKS_PER_DAY, INITIAL_BADGES, LEVEL_THRESHOLDS, XP_VALUES } from './constants';
import { TaskItem } from './components/TaskItem';
import { AddTaskModal } from './components/AddTaskModal';
import { Leaderboard } from './components/Leaderboard';
import { StatsView } from './components/StatsView';
import { HistoryView } from './components/HistoryView';
import { Onboarding } from './components/Onboarding';
import { Paywall } from './components/Paywall';
import { CheckoutView } from './components/CheckoutView';
import { ProfileView } from './components/ProfileView';
import { WeeklyReportModal } from './components/WeeklyReportModal';
import { getProductivityRoast, generateWeeklyReport } from './services/geminiService';
import { StorageService } from './services/storageService';
import { 
  Plus, 
  LayoutGrid, 
  Trophy, 
  PieChart, 
  Crown, 
  Zap,
  BrainCircuit,
  CalendarDays,
  User,
  Bell
} from 'lucide-react';

const INITIAL_USER: UserStats = {
  xp: 0,
  level: 1,
  streak: 1,
  tasksCompleted: 0,
  lastLoginDate: new Date().toISOString(),
  isPremium: false,
  badges: INITIAL_BADGES,
};

function App() {
  // State initialization from storage or defaults
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<UserStats>(INITIAL_USER);
  const [loaded, setLoaded] = useState(false);

  const [view, setView] = useState<ViewState>('matrix');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  
  // Edit Task State
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [quote, setQuote] = useState(TOUGH_LOVE_QUOTES[0]);
  const [activeQuadrant, setActiveQuadrant] = useState<QuadrantType | 'ALL'>('ALL');
  
  // Gemini States
  const [roastMessage, setRoastMessage] = useState<string | null>(null);
  const [loadingRoast, setLoadingRoast] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState<string | null>(null);

  // Initial Load
  useEffect(() => {
    const storedTasks = StorageService.loadTasks();
    const storedUser = StorageService.loadUser();
    const visited = StorageService.hasVisited();

    setTasks(storedTasks);
    if (storedUser) setUser(storedUser);
    if (visited) setShowOnboarding(false);
    
    setQuote(TOUGH_LOVE_QUOTES[Math.floor(Math.random() * TOUGH_LOVE_QUOTES.length)]);
    setLoaded(true);
  }, []);

  // Persistence Effects
  useEffect(() => {
    if (loaded) StorageService.saveTasks(tasks);
  }, [tasks, loaded]);

  useEffect(() => {
    if (loaded) StorageService.saveUser(user);
  }, [user, loaded]);

  const finishOnboarding = () => {
    StorageService.setVisited();
    setShowOnboarding(false);
  };

  const checkLevelUp = (currentXp: number, currentLevel: number) => {
    const nextLevelXp = LEVEL_THRESHOLDS[currentLevel];
    if (nextLevelXp && currentXp >= nextLevelXp) {
      return currentLevel + 1;
    }
    return currentLevel;
  };

  const handleSaveTask = (title: string, description: string, date: string, quadrant: QuadrantType, id?: string) => {
    if (id) {
        // Edit Mode
        setTasks(prev => prev.map(t => 
            t.id === id ? { ...t, title, description, dueDate: date, quadrant } : t
        ));
        setTaskToEdit(null);
    } else {
        // Create Mode
        const pendingTasks = tasks.filter(t => !t.completed).length;
        
        if (!user.isPremium && pendingTasks >= MAX_FREE_TASKS_PER_DAY) {
          setShowPaywall(true);
          return;
        }
    
        const newTask: Task = {
          id: Date.now().toString(),
          title,
          description,
          dueDate: date,
          quadrant,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        setTasks(prev => [newTask, ...prev]);
    }
  };

  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => {
      const updatedTasks = prev.map(t => {
        if (t.id === id) {
          return { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined };
        }
        return t;
      });

      // Calculate XP
      const task = prev.find(t => t.id === id);
      const isCompleting = task && !task.completed;
      
      let newXp = user.xp;
      let newTasksCompleted = user.tasksCompleted;

      if (isCompleting) {
        // Base XP
        let gained = XP_VALUES.TASK_COMPLETION;

        // Same Day Q1 Bonus
        if (task.quadrant === QuadrantType.Q1 && task.createdAt) {
            const createdDate = new Date(task.createdAt).toDateString();
            const todayDate = new Date().toDateString();
            if (createdDate === todayDate) {
                gained += XP_VALUES.Q1_SAME_DAY_BONUS;
            }
        }

        // Premium Multiplier
        if (user.isPremium) {
            gained = Math.floor(gained * XP_VALUES.PREMIUM_MULTIPLIER);
        }

        newXp += gained;
        newTasksCompleted += 1;

        // Check for "All Quadrants" bonus (Gamification)
        const quadrantsCompletedToday = new Set(
           updatedTasks
             .filter(t => t.completed && new Date(t.completedAt!).toDateString() === new Date().toDateString())
             .map(t => t.quadrant)
        );
        if (quadrantsCompletedToday.size === 4) {
           newXp += XP_VALUES.DAY_COMPLETE; 
        }

      } else {
        // Remove XP if unchecking (simplified)
        newXp = Math.max(0, newXp - XP_VALUES.TASK_COMPLETION);
        newTasksCompleted = Math.max(0, newTasksCompleted - 1);
      }

      setUser(u => ({
        ...u,
        xp: newXp,
        tasksCompleted: newTasksCompleted,
        level: checkLevelUp(newXp, u.level)
      }));

      return updatedTasks;
    });
  };

  const handleDeleteTask = (id: string) => {
    if (confirm("Desistir é fácil. Tem certeza?")) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleMoveTask = (id: string) => {
    const quadrants = Object.values(QuadrantType);
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const currentIndex = quadrants.indexOf(t.quadrant);
        const nextIndex = (currentIndex + 1) % quadrants.length;
        return { ...t, quadrant: quadrants[nextIndex] };
      }
      return t;
    }));
  };

  const handleRoast = async () => {
    if (!user.isPremium && Math.random() > 0.3) {
      setShowPaywall(true);
      return;
    }
    setLoadingRoast(true);
    const roast = await getProductivityRoast(tasks, user);
    setRoastMessage(roast);
    setLoadingRoast(false);
  };

  const handleGenerateWeeklyReport = async () => {
    setLoadingRoast(true);
    // Generate data from history
    const daysMap = new Map<string, { date: string, count: number, total: number }>();
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        daysMap.set(key, { date: key, count: 0, total: 0 });
    }
    tasks.forEach(task => {
        if (task.completedAt) {
            const key = task.completedAt.split('T')[0];
            if (daysMap.has(key)) {
                const entry = daysMap.get(key)!;
                entry.count += 1;
                entry.total += 1; 
                daysMap.set(key, entry);
            }
        }
    });
    const history = Array.from(daysMap.values()).map(d => ({ 
        date: d.date, 
        completedCount: d.count, 
        totalTasks: d.total, 
        disciplineScore: 0 
    }));

    const report = await generateWeeklyReport(history);
    setWeeklyReport(report);
    setLoadingRoast(false);
  };

  // Triggered from Paywall
  const handleInitiateCheckout = () => {
    setShowPaywall(false);
    setView('checkout');
  };

  const handleCheckoutSuccess = () => {
    setUser(u => ({ ...u, isPremium: true }));
    setView('matrix'); // Return home after upgrade
  };

  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {
      [QuadrantType.Q1]: [],
      [QuadrantType.Q2]: [],
      [QuadrantType.Q3]: [],
      [QuadrantType.Q4]: [],
    };
    tasks.forEach(t => {
      if (activeQuadrant === 'ALL' || t.quadrant === activeQuadrant) {
        groups[t.quadrant].push(t);
      }
    });
    return groups;
  }, [tasks, activeQuadrant]);

  if (!loaded) return null; // Or a loading spinner

  if (showOnboarding) {
    return <Onboarding onComplete={finishOnboarding} />;
  }

  const renderMatrix = () => (
    <div className="pb-36 px-4 space-y-8 animate-in fade-in duration-500">
      <div className="mt-8 mb-4 px-4">
         <p className="text-2xl font-black leading-none tracking-tighter text-graphite text-center">
          {quote}
        </p>
      </div>
      
      <div className="flex justify-center mb-6">
        <button 
          onClick={handleRoast}
          disabled={loadingRoast}
          className="group flex items-center gap-3 px-6 py-3 bg-graphite text-white text-[11px] font-bold rounded-full hover:bg-black transition-all shadow-lg shadow-gray-200 hover:shadow-xl active:scale-95"
        >
          {loadingRoast ? (
            <span className="animate-pulse">JULGANDO...</span>
          ) : (
            <>
              <BrainCircuit size={16} className="group-hover:rotate-12 transition-transform" />
              FEEDBACK BRUTAL
            </>
          )}
        </button>
      </div>
      
      {roastMessage && (
        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl shadow-sm animate-in slide-in-from-top-2">
          <div className="flex justify-between items-start">
            <p className="text-red-900 font-bold text-sm leading-relaxed italic pr-4">"{roastMessage}"</p>
            <button onClick={() => setRoastMessage(null)} className="text-red-400 hover:text-red-600 font-bold">
              <span className="sr-only">Close</span>×
            </button>
          </div>
        </div>
      )}

      {/* Segmented Control for Quadrants */}
      <div className="sticky top-[72px] z-20 bg-[#F2F2F7]/80 backdrop-blur-xl py-2 -mx-4 px-4">
        <div className="flex p-1 bg-gray-200/50 rounded-xl overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveQuadrant('ALL')}
            className={`flex-1 px-4 py-2 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all duration-200 ${activeQuadrant === 'ALL' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            VISÃO GERAL
          </button>
          {Object.values(QuadrantType).map(q => (
            <button 
              key={q}
              onClick={() => setActiveQuadrant(q)}
              className={`flex-1 px-4 py-2 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all duration-200 ${activeQuadrant === q ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(QuadrantType).map((qType) => {
          if (activeQuadrant !== 'ALL' && activeQuadrant !== qType) return null;
          
          const config = QUADRANT_CONFIG[qType];
          const qTasks = groupedTasks[qType];

          return (
            <div key={qType} className="space-y-4">
              <div className="flex items-center justify-between pl-1">
                <div className="flex items-center gap-3">
                   <div className={`p-1.5 rounded-md ${config.bgColor} ${config.color}`}>
                     <config.icon size={16} />
                   </div>
                   <div>
                      <h2 className="font-black uppercase text-xs tracking-wider text-gray-900">{config.title}</h2>
                      <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">{config.subtitle}</p>
                   </div>
                </div>
                <span className="text-[10px] font-bold text-gray-300 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-50">{qTasks.length}</span>
              </div>
              
              <div className="space-y-3 min-h-[80px]">
                {qTasks.length === 0 ? (
                  <button
                    onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
                    className="w-full h-24 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-300 hover:border-royal hover:bg-blue-50/50 hover:text-royal transition-all group"
                  >
                    <div className="bg-gray-50 p-2 rounded-full group-hover:bg-white transition-colors">
                      <Plus size={18} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[10px] font-bold mt-2 uppercase tracking-wider">Adicionar Tarefa</span>
                  </button>
                ) : (
                  qTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                      onMove={handleMoveTask}
                      onEdit={openEditModal}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-graphite font-sans selection:bg-royal selection:text-white pb-safe">
      {showPaywall && (
        <Paywall 
          onClose={() => setShowPaywall(false)} 
          onUpgrade={handleInitiateCheckout} 
        />
      )}

      {/* Weekly Report Modal */}
      <WeeklyReportModal 
        report={weeklyReport} 
        onClose={() => setWeeklyReport(null)} 
      />

      {/* Glass Header */}
      <header className="glass sticky top-0 z-30 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowOnboarding(true)}>
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="9" height="9" rx="2" />
              <rect x="13" y="2" width="9" height="9" rx="2" opacity="0.5"/>
              <rect x="2" y="13" width="9" height="9" rx="2" opacity="0.5"/>
              <rect x="13" y="13" width="9" height="9" rx="2" opacity="0.2"/>
            </svg>
          </div>
          <h1 className="font-black text-lg tracking-tighter text-graphite">EasyDay</h1>
        </div>
        
        <div className="flex items-center gap-5">
           <div className="flex flex-col items-end">
             <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Streak</span>
             <div className="flex items-center gap-1.5 text-orange-500 font-black text-sm leading-none">
               <Zap size={14} fill="currentColor" />
               {user.streak}
             </div>
           </div>
           
           {user.isPremium ? (
             <Crown size={22} className="text-royal fill-royal" />
           ) : (
             <button onClick={() => setShowPaywall(true)} className="text-[10px] font-bold bg-black text-white px-3 py-1.5 rounded-full hover:bg-royal transition-colors shadow-md">
               PRO
             </button>
           )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full">
        {view === 'matrix' && renderMatrix()}
        
        {view === 'checkout' && (
          <CheckoutView 
            onSuccess={handleCheckoutSuccess} 
            onCancel={() => setView('matrix')} 
          />
        )}
        
        {view === 'leaderboard' && <Leaderboard />}
        
        {view === 'history' && (
          <HistoryView 
            tasks={tasks}
            isPremium={user.isPremium} 
            onUpgrade={() => setShowPaywall(true)} 
            onGenerateReport={handleGenerateWeeklyReport}
          />
        )}
        
        {view === 'stats' && (
          <StatsView 
            user={user} 
            tasks={tasks}
            isPremium={user.isPremium} 
            onUpgrade={() => setShowPaywall(true)} 
          />
        )}

        {view === 'profile' && (
          <ProfileView 
            user={user} 
            onUpdateUser={setUser}
            onLogout={() => setShowOnboarding(true)}
            onUpgrade={() => setShowPaywall(true)}
          />
        )}
      </main>

      {view === 'matrix' && (
        <button
          onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
          className="fixed bottom-24 right-6 w-16 h-16 bg-black text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center justify-center z-40 hover:scale-105 hover:bg-royal transition-all active:scale-95 md:bottom-12"
        >
          <Plus size={32} strokeWidth={2.5} />
        </button>
      )}

      {view !== 'checkout' && (
        <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200 pb-safe pt-2 px-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <button 
              onClick={() => setView('matrix')}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all flex-1 ${view === 'matrix' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid size={22} strokeWidth={view === 'matrix' ? 2.5 : 2} />
            </button>
            
            <button 
              onClick={() => setView('history')}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all flex-1 ${view === 'history' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <CalendarDays size={22} strokeWidth={view === 'history' ? 2.5 : 2} />
            </button>

            <button 
              onClick={() => setView('stats')}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all flex-1 ${view === 'stats' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <PieChart size={22} strokeWidth={view === 'stats' ? 2.5 : 2} />
            </button>
            
            <button 
              onClick={() => setView('leaderboard')}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all flex-1 ${view === 'leaderboard' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Trophy size={22} strokeWidth={view === 'leaderboard' ? 2.5 : 2} />
            </button>

            <button 
              onClick={() => setView('profile')}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all flex-1 ${view === 'profile' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <User size={22} strokeWidth={view === 'profile' ? 2.5 : 2} />
            </button>
          </div>
        </nav>
      )}

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}

export default App;