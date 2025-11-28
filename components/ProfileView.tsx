import React, { useState } from 'react';
import { UserStats } from '../types';
import { User, Settings, Moon, Bell, Volume2, LogOut, ChevronRight, Crown, Trash2, Zap, Lock } from 'lucide-react';
import { NOTIFICATION_TEMPLATES } from '../constants';

interface ProfileViewProps {
  user: UserStats;
  onUpdateUser: (updatedUser: UserStats) => void;
  onLogout: () => void;
  onUpgrade: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser, onLogout, onUpgrade }) => {
  // Initialize settings if they don't exist
  const settings = user.settings || {
    notifications: true,
    sound: true,
    darkMode: false,
    name: 'Usuário Determinado',
    email: 'usuario@easyday.app',
    monkMode: false
  };

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(settings.name);

  const toggleSetting = (key: 'notifications' | 'sound' | 'darkMode' | 'monkMode') => {
    onUpdateUser({
      ...user,
      settings: {
        ...settings,
        [key]: !settings[key]
      }
    });
  };

  const handleSaveName = () => {
    onUpdateUser({
      ...user,
      settings: {
        ...settings,
        name: tempName
      }
    });
    setIsEditing(false);
  };

  const testNotification = (type: 'AGGRESSIVE' | 'SOFT') => {
    const messages = NOTIFICATION_TEMPLATES[type];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    
    // Simple alert simulation for web
    alert(`${type === 'AGGRESSIVE' ? '🔥' : '💡'} NOTIFICAÇÃO EASYDAY:\n\n"${randomMsg}"`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto pb-32 animate-in fade-in">
      <h2 className="text-3xl font-black tracking-tighter text-gray-900 mb-1">Perfil</h2>
      <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-8">Quem você escolheu ser.</p>

      {/* Identity Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex items-center gap-5">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg relative">
          <User size={32} className="text-gray-400" />
          {user.isPremium && (
            <div className="absolute -bottom-1 -right-1 bg-royal text-white p-1.5 rounded-full border-2 border-white">
              <Crown size={12} fill="currentColor" />
            </div>
          )}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input 
                value={tempName} 
                onChange={(e) => setTempName(e.target.value)}
                className="bg-gray-50 border border-gray-200 p-1 rounded text-sm font-bold w-full"
                autoFocus
              />
              <button onClick={handleSaveName} className="text-xs bg-black text-white px-2 py-1 rounded">OK</button>
            </div>
          ) : (
            <h3 className="text-xl font-black text-gray-900 leading-tight cursor-pointer hover:opacity-70" onClick={() => setIsEditing(true)}>
              {settings.name}
            </h3>
          )}
          <p className="text-xs text-gray-400 font-medium mt-1">{settings.email}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${user.isPremium ? 'bg-royal text-white border-royal' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
              {user.isPremium ? 'PRO Member' : 'Free Plan'}
            </span>
          </div>
        </div>
      </div>

      {/* Subscription Management */}
      <section className="mb-8">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Assinatura</h4>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {user.isPremium ? (
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-royal flex items-center gap-2"><Crown size={16} fill="currentColor"/> EasyDay PRO Ativo</span>
                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">RENOVAÇÃO AUTO</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Sua próxima cobrança será em 24 de Dezembro.</p>
              <button className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors">
                Gerenciar / Cancelar Assinatura
              </button>
            </div>
          ) : (
            <div className="p-5 relative overflow-hidden group cursor-pointer" onClick={onUpgrade}>
              <div className="absolute right-0 top-0 w-32 h-32 bg-royal/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-royal/10 transition-all"></div>
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <h5 className="font-black text-gray-900 mb-1">Faça o Upgrade</h5>
                  <p className="text-xs text-gray-500">Desbloqueie seu potencial máximo.</p>
                </div>
                <ChevronRight className="text-gray-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Settings */}
      <section className="mb-8">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Preferências</h4>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          <div className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="bg-gray-50 p-2 rounded-lg text-gray-600"><Bell size={18} /></div>
               <span className="text-sm font-bold text-gray-700">Notificações</span>
             </div>
             <button 
               onClick={() => toggleSetting('notifications')}
               className={`w-10 h-6 rounded-full p-1 transition-colors ${settings.notifications ? 'bg-black' : 'bg-gray-200'}`}
             >
               <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-4' : ''}`}></div>
             </button>
          </div>
          
          {/* Notification Test Buttons */}
          {settings.notifications && (
              <div className="p-4 flex gap-3 bg-gray-50">
                <button onClick={() => testNotification('AGGRESSIVE')} className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-red-200">Testar Brutal</button>
                <button onClick={() => testNotification('SOFT')} className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-200">Testar Suave</button>
              </div>
          )}

          <div className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="bg-gray-50 p-2 rounded-lg text-gray-600"><Volume2 size={18} /></div>
               <span className="text-sm font-bold text-gray-700">Efeitos Sonoros</span>
             </div>
             <button 
               onClick={() => toggleSetting('sound')}
               className={`w-10 h-6 rounded-full p-1 transition-colors ${settings.sound ? 'bg-black' : 'bg-gray-200'}`}
             >
               <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.sound ? 'translate-x-4' : ''}`}></div>
             </button>
          </div>

          <div className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className={`bg-gray-50 p-2 rounded-lg ${user.isPremium ? 'text-royal' : 'text-gray-400'}`}><Zap size={18} fill={user.isPremium ? 'currentColor' : 'none'} /></div>
               <div className="flex flex-col">
                   <span className="text-sm font-bold text-gray-700">Modo Monge</span>
                   <span className="text-[10px] text-gray-400">Apenas o essencial. Sem distrações.</span>
               </div>
             </div>
             {user.isPremium ? (
                 <button 
                   onClick={() => toggleSetting('monkMode')}
                   className={`w-10 h-6 rounded-full p-1 transition-colors ${settings.monkMode ? 'bg-black' : 'bg-gray-200'}`}
                 >
                   <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.monkMode ? 'translate-x-4' : ''}`}></div>
                 </button>
             ) : (
                 <Lock size={16} className="text-gray-300" />
             )}
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <button 
          onClick={onLogout}
          className="w-full bg-white border border-red-100 p-4 rounded-2xl flex items-center justify-between group hover:bg-red-50 transition-colors mb-4"
        >
           <div className="flex items-center gap-3 text-red-600">
             <LogOut size={18} />
             <span className="text-sm font-bold">Sair da Conta</span>
           </div>
        </button>

        <button 
           className="w-full p-4 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-300 hover:text-red-500 uppercase tracking-widest transition-colors"
           onClick={() => {
             if(confirm('Isso apagará todo seu histórico e XP. Tem certeza que quer desistir?')) {
                localStorage.clear();
                window.location.reload();
             }
           }}
        >
          <Trash2 size={12} /> Resetar Dados e Desistir
        </button>
      </section>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-gray-300 font-mono">Version 1.0.4 (Build 2024)</p>
      </div>
    </div>
  );
};