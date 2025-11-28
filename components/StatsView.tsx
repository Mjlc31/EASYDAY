
import React from 'react';
import { UserStats, Badge, Task } from '../types';
import { LEVEL_TITLES, LEVEL_THRESHOLDS } from '../constants';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Lock, Zap, Shield } from 'lucide-react';

interface StatsViewProps {
  user: UserStats;
  tasks: Task[];
  isPremium: boolean;
  onUpgrade: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ user, tasks, isPremium, onUpgrade }) => {
  const nextLevelXP = LEVEL_THRESHOLDS[user.level] || 10000;
  const currentLevelXP = LEVEL_THRESHOLDS[user.level - 1] || 0;
  const progress = Math.min(100, Math.max(0, ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100));

  // Calculate Last 7 Days Data
  const generateChartData = () => {
    const data = [];
    const today = new Date();
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().split('T')[0];
        
        const count = tasks.filter(t => t.completed && t.completedAt && t.completedAt.startsWith(dayStr)).length;
        
        data.push({
            name: days[d.getDay()],
            score: count
        });
    }
    return data;
  };

  const data = generateChartData();

  return (
    <div className="p-6 max-w-2xl mx-auto pb-32 animate-in fade-in">
      <h2 className="text-3xl font-black tracking-tighter mb-2 text-gray-900">Performance</h2>
      <p className="text-gray-500 mb-8 text-xs font-bold tracking-wider uppercase">Números não mentem. Você sim.</p>

      {/* Level Card */}
      <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-4 -mt-4"></div>
        
        <div className="flex justify-between items-end mb-6 relative z-10">
           <div>
             <p className="text-[10px] font-black text-royal uppercase tracking-widest mb-2">Nível {user.level}</p>
             <h3 className="text-3xl font-black text-gray-900 tracking-tight">{LEVEL_TITLES[user.level - 1] || "Novato"}</h3>
           </div>
           <div className="text-right">
             <p className="text-3xl font-black font-mono text-gray-900 tracking-tighter">{user.xp}</p>
             <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">XP Total</p>
           </div>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden relative z-10">
          <div className="bg-black h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-[10px] text-gray-400 mt-3 text-right font-medium">Próximo nível: {nextLevelXP} XP</p>
      </div>

      {/* Chart */}
      <div className="h-56 w-full bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white mb-8">
        <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold uppercase text-gray-400">Últimos 7 dias</span>
            <span className="text-[10px] font-bold uppercase text-green-600 bg-green-50 px-2 py-1 rounded-full">Tarefas Feitas</span>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} 
              dy={10}
            />
            <Tooltip 
              cursor={{fill: '#F8FAFC'}}
              contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold', fontSize: '12px'}}
            />
            <Bar dataKey="score" radius={[6, 6, 6, 6]} barSize={12}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.score > 5 ? '#1A1A1A' : entry.score > 2 ? '#94A3B8' : '#E2E8F0'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-white">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <Shield size={16} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Tarefas</p>
          </div>
          <p className="text-3xl font-black text-gray-900 tracking-tight">{user.tasksCompleted}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-white">
          <div className="flex items-center gap-2 mb-2 text-orange-500">
            <Zap size={16} fill="currentColor" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Streak</p>
          </div>
          <p className="text-3xl font-black text-gray-900 tracking-tight">{user.streak}</p>
        </div>
      </div>

      {/* Badges Section */}
      <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
        Conquistas
      </h3>
      <div className="space-y-3">
        {user.badges.map((badge) => (
          <div 
            key={badge.id}
            className={`
              flex items-center gap-4 p-4 rounded-2xl border transition-all
              ${badge.unlocked ? 'bg-white border-transparent shadow-sm' : 'bg-gray-50 border-transparent opacity-60 grayscale'}
            `}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${badge.unlocked ? 'bg-blue-50' : 'bg-gray-200'}`}>
              {badge.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className={`font-bold text-sm ${badge.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>{badge.name}</h4>
                {!badge.unlocked && <Lock size={12} className="text-gray-400" />}
              </div>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {!isPremium && (
        <button onClick={onUpgrade} className="w-full mt-8 py-4 bg-black hover:bg-gray-900 text-white rounded-2xl text-xs font-bold tracking-widest uppercase transition-colors">
          Ver Badges Premium
        </button>
      )}
    </div>
  );
};
