import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

const WorkoutPlanView: React.FC = () => {
  const { workoutPlan } = useApp();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [allExpanded, setAllExpanded] = useState(false);

  if (!workoutPlan) return <div className="p-4 text-center text-gray-500">Nenhum plano gerado.</div>;

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
    setAllExpanded(false);
  };

  const toggleAll = () => {
    setAllExpanded(!allExpanded);
    setExpandedDay(null);
  };

  return (
    <div className="p-4 space-y-4 animate-fadeIn pb-20">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-2xl font-bold text-white">Seu Plano Semanal</h2>
        <button 
          onClick={toggleAll}
          className="text-xs text-brand-500 font-medium hover:underline"
        >
          {allExpanded ? 'Recolher Tudo' : 'Expandir Tudo'}
        </button>
      </div>
      
      {/* AI Summary */}
      <div className="bg-brand-900/20 border border-brand-500/30 p-4 rounded-xl mb-6">
        <div className="flex items-start gap-3">
            <Info className="text-brand-500 mt-1 min-w-[20px]" size={20} />
            <p className="text-sm text-brand-100 italic">"{workoutPlan.weeklySummary}"</p>
        </div>
      </div>

      <div className="space-y-3">
        {workoutPlan.schedule.map((day, index) => (
          <div key={index} className="bg-dark-card rounded-xl border border-gray-800 overflow-hidden">
            <button 
              onClick={() => toggleDay(day.day)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex flex-col items-start">
                <span className="text-brand-500 font-bold text-sm uppercase">{day.day}</span>
                <span className="text-white font-medium">{day.focus}</span>
              </div>
              {(expandedDay === day.day || allExpanded) ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
            </button>
            
            {(expandedDay === day.day || allExpanded) && (
              <div className="p-4 pt-0 border-t border-gray-800 bg-gray-900/30">
                <div className="space-y-4 mt-3">
                  {day.exercises.map((ex, idx) => (
                    <div key={idx} className="flex justify-between items-start text-sm">
                      <div className="flex-1 pr-4">
                        <p className="text-white font-medium">{ex.name}</p>
                        {ex.notes && <p className="text-xs text-gray-500 mt-0.5">{ex.notes}</p>}
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <span className="block text-brand-400 font-bold">{ex.sets} séries</span>
                        <span className="block text-gray-400 text-xs">{ex.reps} reps</span>
                      </div>
                    </div>
                  ))}
                  {day.exercises.length === 0 && (
                    <p className="text-gray-500 text-center py-2 italic text-sm">Dia de descanso e recuperação.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlanView;