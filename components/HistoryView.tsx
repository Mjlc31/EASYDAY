
import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { Lock, Calendar as CalendarIcon, FileText, Image as ImageIcon, Download, BrainCircuit, Sun, Sunset, Moon, Sparkles } from 'lucide-react';
import { getHeatmapInsights } from '../services/geminiService';

interface HistoryViewProps {
  tasks: Task[];
  isPremium: boolean;
  onUpgrade: () => void;
  onGenerateReport: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ tasks, isPremium, onUpgrade, onGenerateReport }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Helper to get local YYYY-MM-DD key to avoid timezone bugs
  const getLocalKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Calculate Time Distribution
  const completedTasks = tasks.filter(t => t.completed && t.completedAt);
  const morningCount = completedTasks.filter(t => { const h = new Date(t.completedAt!).getHours(); return h >= 5 && h < 12 }).length;
  const afternoonCount = completedTasks.filter(t => { const h = new Date(t.completedAt!).getHours(); return h >= 12 && h < 18 }).length;
  const nightCount = completedTasks.filter(t => { const h = new Date(t.completedAt!).getHours(); return h >= 18 || h < 5 }).length;
  const totalCompleted = morningCount + afternoonCount + nightCount || 1;

  useEffect(() => {
    if (isPremium && !insight && completedTasks.length > 0) {
        setLoadingInsight(true);
        getHeatmapInsights(tasks)
          .then(res => {
            setInsight(res);
          })
          .catch(() => {
            setInsight("Não consegui analisar seus dados agora. Tente produzir mais.");
          })
          .finally(() => {
            setLoadingInsight(false);
          });
    }
  }, [isPremium, tasks, insight]);
  
  // Generate history entries from tasks
  const generateHistory = () => {
    const daysMap = new Map<string, { date: string, count: number, total: number }>();
    const today = new Date();

    // Show 365 days for Premium, but only 2 weeks (14 days) for Free (half locked) to save rendering
    const daysToShow = isPremium ? 180 : 21; 
    
    for (let i = 0; i < daysToShow; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = getLocalKey(d);
        daysMap.set(key, { date: key, count: 0, total: 0 });
    }

    // Populate with real task data using Local Keys
    tasks.forEach(task => {
        if (task.completedAt) {
            const completedDate = new Date(task.completedAt);
            const key = getLocalKey(completedDate);
            if (daysMap.has(key)) {
                const entry = daysMap.get(key)!;
                entry.count += 1;
                entry.total += 1; 
                daysMap.set(key, entry);
            }
        }
    });

    // Sort Descending (Newest First)
    return Array.from(daysMap.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const displayHistory = generateHistory();

  const handleExportCSV = () => {
    if (!isPremium) {
        onUpgrade();
        return;
    }
    
    const headers = ["ID", "Titulo", "Descricao", "Quadrante", "Prazo", "Concluido", "Data Conclusao"];
    const rows = tasks.map(t => [
        t.id,
        `"${t.title}"`,
        `"${t.description || ''}"`,
        t.quadrant,
        t.dueDate,
        t.completed ? "SIM" : "NAO",
        t.completedAt || ""
    ]);

    const csvContent = [
        headers.join(","), 
        ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `easyday_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (!isPremium) {
        onUpgrade();
        return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `easyday_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto pb-32 animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-3xl font-black tracking-tighter text-gray-900">Mapa de Calor</h2>
           <p className="text-xs text-gray-500 font-bold tracking-wide mt-1 uppercase">Seus padrões não mentem.</p>
        </div>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <CalendarIcon className="text-black" size={20} />
        </div>
      </div>

      {/* AI Insight Section */}
      <div className="mb-8 relative">
        <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
           <Sparkles size={12} /> Insight de Ritmo
        </h3>
        {isPremium ? (
           <div className="bg-gradient-to-r from-gray-900 to-black text-white p-5 rounded-2xl shadow-lg border border-gray-800">
              {loadingInsight ? (
                 <div className="animate-pulse flex gap-2">
                    <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full delay-75"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full delay-150"></div>
                 </div>
              ) : (
                 <div className="flex items-start gap-3">
                    <BrainCircuit className="text-royal shrink-0 mt-1" size={20} />
                    <div>
                        <p className="text-sm font-medium italic">"{insight || 'Analisei seus horários. Nenhuma conclusão digna ainda.'}"</p>
                        <p className="text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-widest">- EasyDay AI</p>
                    </div>
                 </div>
              )}
           </div>
        ) : (
           <div className="bg-gray-100 p-5 rounded-2xl border border-gray-200 relative overflow-hidden group cursor-pointer" onClick={onUpgrade}>
              <div className="absolute inset-0 backdrop-blur-[2px] bg-white/50 z-10 flex items-center justify-center">
                 <div className="bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold flex items-center gap-2 shadow-xl transform group-hover:scale-105 transition-transform">
                    <Lock size={12} /> DESBLOQUEAR INSIGHT
                 </div>
              </div>
              <p className="text-sm text-gray-400 blur-sm select-none">
                  Você é incrivelmente produtivo pela manhã, mas suas tardes são um desperdício completo de oxigênio. Melhore.
              </p>
           </div>
        )}
      </div>

      {/* Time Distribution */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-white mb-8">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400">Horários Preferidos</h3>
        </div>
        
        <div className="space-y-4">
            {/* Morning */}
            <div>
                <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span className="flex items-center gap-1 text-orange-400"><Sun size={12}/> Manhã (05-12h)</span>
                    <span className="text-gray-900">{morningCount}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-orange-400 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(morningCount / totalCompleted) * 100}%` }}></div>
                </div>
            </div>

            {/* Afternoon */}
            <div>
                <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span className="flex items-center gap-1 text-blue-500"><Sunset size={12}/> Tarde (12-18h)</span>
                    <span className="text-gray-900">{afternoonCount}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(afternoonCount / totalCompleted) * 100}%` }}></div>
                </div>
            </div>

            {/* Night */}
            <div>
                <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span className="flex items-center gap-1 text-purple-600"><Moon size={12}/> Noite (18-05h)</span>
                    <span className="text-gray-900">{nightCount}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(nightCount / totalCompleted) * 100}%` }}></div>
                </div>
            </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-white mb-8">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400">Consistência Diária</h3>
            {!isPremium && <span className="text-[9px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded">Semana Atual</span>}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {displayHistory.map((entry, index) => {
            // Free users see only first 7 days (index 0-6), rest are locked
            const isLocked = !isPremium && index >= 7;
            
            // Reconstruct date parts from YYYY-MM-DD key to ensure display is correct
            const [y, m, d] = entry.date.split('-').map(Number);
            const displayDate = new Date(y, m - 1, d);
            const dayNum = displayDate.getDate();

            // Intensity logic
            let intensityColor = 'bg-gray-100';
            let textColor = 'text-gray-400';
            if (entry.count > 0) { intensityColor = 'bg-blue-200'; textColor = 'text-blue-800'; }
            if (entry.count > 3) { intensityColor = 'bg-blue-400'; textColor = 'text-white'; }
            if (entry.count > 6) { intensityColor = 'bg-black'; textColor = 'text-white'; }

            return (
              <div 
                key={entry.date} 
                className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-300
                  ${isLocked ? 'bg-gray-50 opacity-40 cursor-not-allowed' : `${intensityColor} hover:scale-105 cursor-default`}
                `}
                title={isLocked ? "Premium Only" : `${displayDate.toLocaleDateString()}: ${entry.count} tarefas`}
              >
                {isLocked ? (
                  <Lock size={12} className="text-gray-300" />
                ) : (
                  <>
                    <span className={`text-[10px] font-bold ${textColor}`}>{dayNum}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Report Action */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-3xl shadow-lg mb-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-royal rounded-full blur-[60px] opacity-30 -mr-6 -mt-6"></div>
         <div className="relative z-10 flex justify-between items-center">
            <div>
                <h3 className="font-black text-lg mb-1 flex items-center gap-2">
                   <BrainCircuit size={20} /> Análise Semanal
                </h3>
                <p className="text-xs text-gray-400 font-medium max-w-[200px]">Receba o feedback brutal da IA sobre seus últimos 7 dias.</p>
            </div>
            <button 
              onClick={onGenerateReport}
              className="bg-white text-black font-bold text-xs px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-md active:scale-95"
            >
              GERAR RELATÓRIO
            </button>
         </div>
      </div>

      <div className="bg-white border border-white rounded-3xl p-6 shadow-sm mb-8">
        <h3 className="font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2 text-gray-400">
          Exportar Dados
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={handleExportCSV} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group">
            <FileText size={24} className="text-gray-400 group-hover:text-green-600 transition-colors" />
            <span className="text-[10px] font-bold">CSV (Excel)</span>
          </button>
          <button onClick={handleExportJSON} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group">
            <Download size={24} className="text-gray-400 group-hover:text-royal transition-colors" />
            <span className="text-[10px] font-bold">Backup JSON</span>
          </button>
        </div>
      </div>

      {!isPremium && (
        <div className="bg-[#1A1A1A] text-white p-8 rounded-3xl relative overflow-hidden shadow-2xl shadow-black/20 cursor-pointer transition-transform hover:scale-[1.01]" onClick={onUpgrade}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
               <Lock size={18} className="text-yellow-500" />
               <h3 className="font-black text-xl tracking-tight">Desbloqueie seu Passado</h3>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-6 leading-relaxed">
              Usuários Free só veem os últimos 7 dias e não recebem insights de horário. Disciplina exige dados completos.
            </p>
            <button 
              className="w-full bg-white text-black text-xs font-black px-4 py-4 rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-widest"
            >
              Desbloquear Tudo
            </button>
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-royal rounded-full blur-[80px] opacity-30 -mr-10 -mt-10"></div>
        </div>
      )}
    </div>
  );
};
