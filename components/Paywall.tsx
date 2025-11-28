
import React from 'react';
import { X, Check, Crown, Zap, Shield } from 'lucide-react';

interface PaywallProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const Paywall: React.FC<PaywallProps> = ({ onClose, onUpgrade }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-10 duration-500">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="p-8 pb-10 bg-[#1A1A1A] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-royal rounded-full blur-[80px] opacity-40 -mr-10 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-danger rounded-full blur-[60px] opacity-20 -ml-10 -mb-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Premium</span>
            </div>
            <h2 className="text-3xl font-black leading-[1.1] mb-4">
              SE VOCÊ NÃO PAGA NEM PELA SUA DISCIPLINA...
            </h2>
            <p className="text-gray-400 font-medium text-lg border-l-2 border-royal pl-4">
              ...você está pagando com a sua vida.
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-5 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5"><Check size={14} strokeWidth={4} /></div>
              <div>
                <h4 className="font-bold text-gray-900">Histórico Ilimitado</h4>
                <p className="text-xs text-gray-500 font-medium">Seu passado prova seu futuro.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5"><Check size={14} strokeWidth={4} /></div>
              <div>
                <h4 className="font-bold text-gray-900">Tarefas Infinitas</h4>
                <p className="text-xs text-gray-500 font-medium">Sem limites artificiais.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5"><Check size={14} strokeWidth={4} /></div>
              <div>
                <h4 className="font-bold text-gray-900">Exportação & Cloud</h4>
                <p className="text-xs text-gray-500 font-medium">PDF, CSV e Backup em nuvem.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5"><Check size={14} strokeWidth={4} /></div>
              <div>
                <h4 className="font-bold text-gray-900">Badges & Status</h4>
                <p className="text-xs text-gray-500 font-medium">Selos de elite no perfil.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onUpgrade}
            className="w-full bg-royal hover:bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm tracking-wide"
          >
            <Zap size={18} fill="currentColor" />
            DESBLOQUEAR DISCIPLINA
          </button>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs font-bold text-gray-900">
              R$ 14,90/mês
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              Cancele quando quiser (se quiser falhar)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
