
import React, { useState, useRef, useEffect } from 'react';
import { Task, QuadrantType } from '../types';
import { Clock, MoreHorizontal, Trash2, ArrowRightLeft, Pencil, Zap, AlertTriangle } from 'lucide-react';
import { QUADRANT_CONFIG } from '../constants';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onMove, onEdit }) => {
  const config = QUADRANT_CONFIG[task.quadrant];
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Visual Consequences Logic
  const isUrgentAndOverdue = task.quadrant === QuadrantType.Q1 && isOverdue;
  const daysSinceCreation = task.createdAt ? (new Date().getTime() - new Date(task.createdAt).getTime()) / (1000 * 3600 * 24) : 0;
  const isRotting = daysSinceCreation > 3 && !task.completed;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`
      group relative bg-white p-4 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-transparent transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]
      ${task.completed ? 'opacity-50 grayscale' : 'opacity-100'}
      ${isUrgentAndOverdue ? 'animate-shake ring-2 ring-red-100' : ''}
      ${isRotting ? 'task-decay' : ''}
    `}>
      {isUrgentAndOverdue && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-md z-10 animate-bounce">
          ATRASADA!
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Custom Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`
            mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300
            ${task.completed 
              ? 'bg-black border-black' 
              : 'border-gray-300 hover:border-royal bg-white'}
          `}
        >
          {task.completed && (
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className={`font-bold text-[15px] text-gray-900 leading-snug tracking-tight ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            
            {/* Menu Trigger */}
            <div className="relative ml-2" ref={menuRef}>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                className="p-1 rounded-md text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <MoreHorizontal size={16} />
              </button>
              
              {/* Dropdown */}
              {isMenuOpen && (
                <div className="absolute right-0 top-6 w-36 bg-white shadow-xl rounded-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                   <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(task); setIsMenuOpen(false); }} 
                    className="w-full text-left px-3 py-2.5 text-[11px] font-bold hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                  >
                    <Pencil size={12} /> Editar
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onMove(task.id); setIsMenuOpen(false); }} 
                    className="w-full text-left px-3 py-2.5 text-[11px] font-bold hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                  >
                    <ArrowRightLeft size={12} /> Mover
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(task.id); setIsMenuOpen(false); }} 
                    className="w-full text-left px-3 py-2.5 text-[11px] font-bold hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-gray-50"
                  >
                    <Trash2 size={12} /> Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>

          {task.description && (
            <p className="text-[13px] text-gray-500 mt-1 line-clamp-2 font-medium leading-relaxed">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Quadrant Badge */}
            <span className={`
              inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider
              ${config.badgeColor} bg-opacity-50
            `}>
              {config.title.split('&')[0]}
            </span>

            {/* Date Badge */}
            <span className={`
              inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-gray-50 text-gray-500
              ${isOverdue ? 'bg-red-50 text-red-600' : ''}
            `}>
              <Clock size={10} strokeWidth={3} />
              {new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase().replace('.', '')}
              {isOverdue && <span>!</span>}
            </span>
            
            {isRotting && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-gray-100 text-gray-400" title="Tarefa abandonada">
                    <AlertTriangle size={10} />
                    ABANDONADA
                </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};