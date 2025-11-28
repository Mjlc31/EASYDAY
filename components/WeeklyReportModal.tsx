import React from 'react';
import { X, BrainCircuit, Target, Flame } from 'lucide-react';

interface WeeklyReportModalProps {
  report: string | null;
  onClose: () => void;
}

export const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-black text-white p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[60px] opacity-30 -mr-10 -mt-10"></div>
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20"
            >
                <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className="bg-white/20 p-2 rounded-lg">
                    <BrainCircuit size={24} className="text-white" />
                </div>
                <span className="text-[10px] font-black tracking-widest uppercase bg-red-600 px-2 py-1 rounded">Confidencial</span>
            </div>
            <h2 className="text-2xl font-black tracking-tighter relative z-10">RELATÓRIO SEMANAL</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wide relative z-10">A verdade dói, mas liberta.</p>
        </div>

        {/* Content */}
        <div className="p-8">
            <div className="prose prose-sm max-w-none">
                <p className="text-lg font-medium text-gray-800 leading-relaxed whitespace-pre-line font-mono border-l-4 border-black pl-4 bg-gray-50 p-4 rounded-r-xl">
                    "{report}"
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center text-center">
                    <Target size={24} className="text-gray-400 mb-2" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Foco</span>
                    <span className="text-xl font-black text-gray-900">68%</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center text-center">
                    <Flame size={24} className="text-orange-500 mb-2" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Consistência</span>
                    <span className="text-xl font-black text-gray-900">Baixa</span>
                </div>
            </div>

            <button 
                onClick={onClose}
                className="w-full mt-8 bg-black hover:bg-gray-900 text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
                ENTENDI. VOU MELHORAR.
            </button>
        </div>
      </div>
    </div>
  );
};