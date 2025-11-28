import React from 'react';
import { LeaderboardEntry } from '../types';
import { Trophy, Flame, Globe } from 'lucide-react';

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Alex Chen', xp: 15420, avatar: 'https://picsum.photos/100/100?random=1', streak: 45, isPremium: true },
  { id: '2', name: 'Sarah Connor', xp: 14200, avatar: 'https://picsum.photos/100/100?random=2', streak: 12, isPremium: true },
  { id: '3', name: 'Você', xp: 8450, avatar: 'https://picsum.photos/100/100?random=3', streak: 5, isPremium: false },
  { id: '4', name: 'John Wick', xp: 8200, avatar: 'https://picsum.photos/100/100?random=4', streak: 89, isPremium: true },
  { id: '5', name: 'Ellen Ripley', xp: 6100, avatar: 'https://picsum.photos/100/100?random=5', streak: 3, isPremium: false },
];

export const Leaderboard: React.FC = () => {
  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight">RANKING GLOBAL</h2>
        <div className="bg-gray-100 p-2 rounded-lg">
          <Globe size={20} />
        </div>
      </div>

      <div className="bg-black text-white p-6 rounded-2xl mb-8 shadow-xl">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-gray-400 font-bold uppercase">Sua Posição</p>
            <h3 className="text-4xl font-black">#3</h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 font-bold uppercase">XP Total</p>
            <h3 className="text-2xl font-bold">8,450 XP</h3>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {MOCK_LEADERBOARD.map((entry, index) => (
          <div 
            key={entry.id}
            className={`
              flex items-center gap-4 p-4 rounded-xl border-2 transition-transform
              ${entry.name === 'Você' ? 'border-black bg-gray-50 scale-[1.02]' : 'border-transparent bg-white shadow-sm'}
            `}
          >
            <span className={`
              w-8 text-center font-black text-lg
              ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-500' : 'text-gray-300'}
            `}>
              {index + 1}
            </span>
            
            <img 
              src={entry.avatar} 
              alt={entry.name} 
              className="w-10 h-10 rounded-full bg-gray-200 object-cover" 
            />
            
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{entry.name}</h4>
              <p className="text-xs text-gray-500 font-medium">{entry.xp.toLocaleString()} XP</p>
            </div>

            <div className="flex items-center gap-1 text-orange-500 font-bold text-sm bg-orange-50 px-2 py-1 rounded-md">
              <Flame size={14} fill="currentColor" />
              {entry.streak}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-center text-xs text-gray-400 mt-8 uppercase font-bold tracking-widest">
        A mediocridade odeia competição
      </p>
    </div>
  );
};