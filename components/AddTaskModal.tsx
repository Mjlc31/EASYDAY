
import React, { useState, useEffect } from 'react';
import { QuadrantType, Task } from '../types';
import { QUADRANT_CONFIG } from '../constants';
import { X, ChevronRight, Calendar } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, date: string, quadrant: QuadrantType, id?: string) => void;
  taskToEdit?: Task | null;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quadrant, setQuadrant] = useState<QuadrantType>(QuadrantType.Q1);

  // Effect to pre-fill data when editing
  useEffect(() => {
    if (isOpen && taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setDate(taskToEdit.dueDate.split('T')[0]);
      setQuadrant(taskToEdit.quadrant);
    } else if (isOpen && !taskToEdit) {
      // Reset on open if new task
      setTitle('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setQuadrant(QuadrantType.Q1);
    }
  }, [isOpen, taskToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title, description, date, quadrant, taskToEdit?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 fade-in duration-300">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black tracking-tight text-gray-900">
              {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="O que precisa ser feito?"
                className="w-full p-0 text-xl font-bold text-gray-900 placeholder:text-gray-300 border-none focus:ring-0 bg-transparent"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicione detalhes (opcional)..."
                className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-400 border-none focus:ring-2 focus:ring-gray-100 resize-none"
                rows={3}
              />
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                 <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between group focus-within:ring-2 focus-within:ring-royal/20 transition-all">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Calendar size={18} />
                      <label className="text-xs font-bold uppercase">Prazo</label>
                    </div>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-transparent text-sm font-bold text-gray-900 focus:outline-none text-right"
                    />
                 </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 pl-1">Prioridade (Matriz Eisenhower)</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(QuadrantType).map((q) => {
                     const isSelected = quadrant === q;
                     const config = QUADRANT_CONFIG[q];
                     return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuadrant(q)}
                        className={`
                          w-full p-3 rounded-xl text-left transition-all flex items-center justify-between
                          ${isSelected 
                            ? 'bg-black text-white shadow-lg scale-[1.02]' 
                            : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${config.bgColor.replace('bg-', 'bg-').replace('-50', '-500')}`}></div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold leading-none">{config.title.split('&')[0]}</span>
                            <span className="text-[9px] font-medium opacity-70 mt-0.5">{config.subtitle.substring(0, 25)}...</span>
                          </div>
                        </div>
                        {isSelected && <ChevronRight size={16} />}
                      </button>
                     );
                  })}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-royal text-white font-black py-4 rounded-2xl mt-4 hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {taskToEdit ? 'SALVAR ALTERAÇÕES' : 'ADICIONAR TAREFA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
