import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Clock, Info, Activity, Coffee, ArrowLeft } from 'lucide-react';

interface ActiveWorkoutProps {
    onFinish: () => void;
}

const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({ onFinish }) => {
  const { workoutPlan, completeWorkout } = useApp();
  
  // Improved Date Matching
  const todayDayIndex = new Date().getDay(); // 0 = Sunday
  const dayNamesMap = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const currentDayName = dayNamesMap[todayDayIndex];

  const todayWorkout = workoutPlan?.schedule.find(d => {
      const planDay = d.day.toLowerCase();
      const currDay = currentDayName.toLowerCase();
      return planDay.includes(currDay);
  }) || workoutPlan?.schedule[0];

  const isRestDay = todayWorkout?.focus?.toLowerCase() === "descanso" || !todayWorkout?.exercises || todayWorkout.exercises.length === 0;

  const handleFinish = () => {
      if (todayWorkout) {
          const estimatedDuration = `${todayWorkout.exercises.length * 8 + 10} min`;
          completeWorkout(todayWorkout.focus, estimatedDuration);
      }
      onFinish();
  };

  if (!todayWorkout) return (
      <div className="p-6 text-white text-center flex flex-col items-center justify-center h-full">
          <p>Sem treino encontrado para hoje.</p>
          <button onClick={onFinish} className="mt-4 text-brand-500">Voltar</button>
      </div>
  );

  if (isRestDay) {
      return (
        <div className="p-6 h-full flex flex-col items-center justify-center text-center animate-fadeIn">
            <div className="w-24 h-24 bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                <Coffee size={40} className="text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Dia de Descanso</h1>
            <p className="text-gray-400 mb-8 max-w-xs">
                Hoje é dia de recuperar a musculatura para voltar mais forte amanhã. Alimente-se bem e hidrate-se!
            </p>
            <button 
                onClick={onFinish}
                className="bg-dark-card border border-gray-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
                <ArrowLeft size={18} /> Voltar ao Início
            </button>
        </div>
      );
  }

  return (
    <div className="p-4 space-y-6 pb-24 animate-fadeIn">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-white capitalize">{todayWorkout.focus}</h1>
                <p className="text-brand-500 font-medium uppercase text-sm">{todayWorkout.day}</p>
            </div>
            <div className="bg-brand-900/30 p-2 rounded-lg">
                <Clock className="text-brand-500" size={24} />
            </div>
        </div>

        <div className="space-y-6">
            {todayWorkout.exercises.map((ex, index) => (
                <div key={index} className="bg-dark-card rounded-2xl overflow-hidden border border-gray-800 shadow-lg">
                    {/* Visual Placeholder (Figure) instead of Image */}
                    <div className="h-32 w-full bg-brand-900/10 relative flex items-center justify-center overflow-hidden border-b border-gray-800/50">
                        <Activity className="text-brand-500/20 w-24 h-24 transform -rotate-12" />
                        <div className="absolute bottom-0 left-0 w-full p-4">
                            <h3 className="text-white font-bold text-lg shadow-black drop-shadow-md">{ex.name}</h3>
                        </div>
                    </div>
                    
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                            <div className="bg-gray-800 px-3 py-1 rounded-lg">
                                <span className="text-brand-400 font-bold text-lg">{ex.sets}</span> <span className="text-gray-400 text-xs uppercase">Séries</span>
                            </div>
                            <div className="bg-gray-800 px-3 py-1 rounded-lg">
                                <span className="text-white font-bold text-lg">{ex.reps}</span> <span className="text-gray-400 text-xs uppercase">Reps</span>
                            </div>
                        </div>
                        
                        {ex.notes && (
                            <div className="flex gap-2 text-sm text-gray-400 bg-gray-900/50 p-3 rounded-xl">
                                <Info size={16} className="min-w-[16px] mt-0.5 text-brand-500" />
                                <p>{ex.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>

        <button 
            onClick={handleFinish}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-900/50 transform active:scale-95 transition-all flex items-center justify-center gap-2"
        >
            <CheckCircle size={24} /> Concluir Treino
        </button>
    </div>
  );
};

export default ActiveWorkout;