import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Flame, Calendar, AlertCircle, ArrowRight, Bell, Timer, Zap, Coffee, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { requestNotificationPermission, scheduleReminder } from '../services/notificationService';

interface DashboardProps {
    onStartWorkout: () => void;
    onViewPlan: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartWorkout, onViewPlan }) => {
  const { user, workoutPlan } = useApp();
  const [showNotificationBtn, setShowNotificationBtn] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Improved Day Matching Logic
  const todayDate = new Date().toISOString().split('T')[0];
  const todayDayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday...
  
  // Map JS getDay() to typical Gemini output strings to be safe
  const dayNamesMap = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const currentDayName = dayNamesMap[todayDayIndex];

  const hasTrainedToday = user?.completedWorkouts?.includes(todayDate);

  // Find workout by matching the string (loose match)
  const todayWorkout = workoutPlan?.schedule.find(d => {
      const planDay = d.day.toLowerCase();
      const currDay = currentDayName.toLowerCase();
      // Match "Segunda" in "Segunda-feira"
      return planDay.includes(currDay);
  }) || workoutPlan?.schedule[0]; // Fallback to first day if absolutely nothing matches (safety net)

  const isRestDay = todayWorkout?.focus?.toLowerCase() === "descanso" || todayWorkout?.exercises?.length === 0;

  // Notification Logic
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'default' && !hasTrainedToday && !isRestDay) {
        setShowNotificationBtn(true);
      } else if (Notification.permission === 'granted' && !hasTrainedToday && !isRestDay && user) {
        // If granted and hasn't trained, simulate a "smart reminder" coming in shortly
        const timer = setTimeout(() => {
            scheduleReminder(user, 100); 
        }, 15000); 
        return () => clearTimeout(timer);
      }
    }
  }, [user, hasTrainedToday, isRestDay]);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
        setShowNotificationBtn(false);
        if (user) scheduleReminder(user, 2000);
    }
  };

  // Calculate Chart Data based on history
  const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
          dateStr: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)
      };
  });

  const chartData = last7Days.map(day => ({
      name: day.dayName.charAt(0).toUpperCase() + day.dayName.slice(1),
      count: user?.completedWorkouts?.includes(day.dateStr) ? 1 : 0
  }));

  const totalWorkouts = user?.completedWorkouts?.length || 0;
  
  // Streak calculation (simplified)
  let currentStreak = 0;
  if (user?.completedWorkouts && user.completedWorkouts.length > 0) {
      if (hasTrainedToday) currentStreak = 1; 
      // Simple logic for demo: if totalWorkouts > 0, assume some streak for display
      if (totalWorkouts > 0) currentStreak = hasTrainedToday ? totalWorkouts : totalWorkouts; 
  }

  // Evolution Metrics Calculation
  const estimatedCalories = totalWorkouts * 320; // Avg 320 kcal per session
  const estimatedMinutes = totalWorkouts * 45; // Avg 45 min per session
  
  const formatTime = (mins: number) => {
      if (mins < 60) return `${mins}m`;
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h}h ${m}m`;
  };

  return (
    <div className="p-4 space-y-6 animate-fadeIn pb-24">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
            <h2 className="text-dark-muted text-sm">{getGreeting()},</h2>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
        </div>
        {showNotificationBtn && (
            <button 
                onClick={handleEnableNotifications}
                className="bg-brand-900/40 border border-brand-500/30 text-brand-500 p-2 rounded-full animate-bounce"
                title="Ativar Lembretes de Treino"
            >
                <Bell size={20} />
            </button>
        )}
      </div>

      {/* Visual Reminder (Lembrete Visual) - Only if not rest day */}
      {!hasTrainedToday && !isRestDay && (
          <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border border-orange-500/30 p-4 rounded-xl flex items-center gap-4 animate-pulse shadow-lg shadow-orange-900/20">
            <div className="bg-orange-500/20 p-3 rounded-full">
                <AlertCircle className="text-orange-500" size={24} />
            </div>
            <div className="flex-1">
                <h3 className="text-white font-bold text-sm">Meta Diária Pendente</h3>
                <p className="text-gray-300 text-xs mt-1">
                    Você ainda não treinou hoje. Vamos manter o foco?
                </p>
            </div>
            <button 
                onClick={onStartWorkout}
                className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"
            >
                <ArrowRight size={20} />
            </button>
          </div>
      )}

      {/* Evolution Metrics Grid */}
      <div>
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Activity size={18} className="text-brand-500" /> Sua Evolução
        </h3>
        <div className="grid grid-cols-2 gap-3">
            {/* Streak */}
            <div className="bg-dark-card p-4 rounded-xl border border-gray-800 flex flex-col justify-between h-28">
                <div className="flex items-center gap-2 text-orange-500">
                    <Flame size={20} />
                    <span className="text-xs font-bold uppercase tracking-wider">Sequência</span>
                </div>
                <div>
                    <p className="text-2xl font-bold text-white">{currentStreak}</p>
                    <p className="text-xs text-gray-500">dias seguidos</p>
                </div>
            </div>

            {/* Total Workouts */}
            <div className="bg-dark-card p-4 rounded-xl border border-gray-800 flex flex-col justify-between h-28">
                <div className="flex items-center gap-2 text-brand-500">
                    <Activity size={20} />
                    <span className="text-xs font-bold uppercase tracking-wider">Treinos</span>
                </div>
                <div>
                    <p className="text-2xl font-bold text-white">{totalWorkouts}</p>
                    <p className="text-xs text-gray-500">concluídos</p>
                </div>
            </div>

            {/* Estimated Calories */}
            <div className="bg-dark-card p-4 rounded-xl border border-gray-800 flex flex-col justify-between h-28">
                <div className="flex items-center gap-2 text-red-500">
                    <Zap size={20} />
                    <span className="text-xs font-bold uppercase tracking-wider">Calorias</span>
                </div>
                <div>
                    <p className="text-2xl font-bold text-white">{estimatedCalories}</p>
                    <p className="text-xs text-gray-500">kcal queimadas</p>
                </div>
            </div>

            {/* Estimated Time */}
            <div className="bg-dark-card p-4 rounded-xl border border-gray-800 flex flex-col justify-between h-28">
                <div className="flex items-center gap-2 text-blue-500">
                    <Timer size={20} />
                    <span className="text-xs font-bold uppercase tracking-wider">Tempo</span>
                </div>
                <div>
                    <p className="text-2xl font-bold text-white">{formatTime(estimatedMinutes)}</p>
                    <p className="text-xs text-gray-500">de dedicação</p>
                </div>
            </div>
        </div>
      </div>

      {/* Today's Workout Card */}
      <div className={`p-5 rounded-2xl border relative overflow-hidden shadow-lg ${isRestDay ? 'bg-gradient-to-br from-blue-900 to-slate-900 border-blue-800' : 'bg-gradient-to-br from-brand-900 to-brand-950 border-brand-800 shadow-brand-900/20'}`}>
        <div className="absolute right-0 top-0 p-4 opacity-10">
            <Calendar size={60} />
        </div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className={`${isRestDay ? 'text-blue-200' : 'text-brand-200'} text-sm font-medium uppercase tracking-wider`}>
                        {isRestDay ? 'Hoje é dia de' : 'Treino de Hoje'}
                    </h3>
                    <p className="text-white font-bold text-lg mt-1 capitalize">{todayWorkout?.focus || "Descanso"}</p>
                </div>
                <button 
                  onClick={onViewPlan}
                  className={`${isRestDay ? 'bg-blue-500/20 text-blue-300' : 'bg-brand-500/20 text-brand-300'} text-xs px-2 py-1 rounded capitalize flex items-center gap-1`}
                >
                    {todayWorkout?.day || currentDayName} <ArrowRight size={12} />
                </button>
            </div>
            
            {isRestDay ? (
                 <div className="flex flex-col items-center justify-center py-4 text-center">
                    <Coffee size={40} className="text-blue-400 mb-2" />
                    <p className="text-blue-100 text-sm">O descanso é essencial para a hipertrofia. Recupere-se para amanhã!</p>
                 </div>
            ) : (
                <div className="space-y-2 mb-4">
                    {todayWorkout?.exercises.map((ex, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                            {ex.name}
                        </div>
                    ))}
                </div>
            )}

            {!isRestDay && (
                <button 
                    onClick={onStartWorkout}
                    className="w-full bg-white text-brand-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                >
                    {hasTrainedToday ? 'Ver Treino Concluído' : 'Iniciar Treino'} <ArrowRight size={18} />
                </button>
            )}
        </div>
      </div>

      {/* Weekly Schedule Summary */}
      <div className="bg-dark-card p-4 rounded-xl border border-gray-800">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" /> Cronograma Semanal
        </h3>
        <div className="space-y-3">
            {workoutPlan?.schedule.map((day, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${day.day.toLowerCase().includes(currentDayName.toLowerCase()) ? 'text-brand-500' : 'text-gray-400'}`}>
                        {day.day.split('-')[0]}
                    </span>
                    <span className="text-gray-500 text-xs flex-1 text-right truncate ml-4">
                        {day.focus}
                    </span>
                </div>
            ))}
        </div>
        <button 
            onClick={onViewPlan}
            className="w-full mt-4 text-xs text-brand-500 font-medium hover:underline text-center"
        >
            Ver detalhes do plano
        </button>
      </div>

      {/* Recent Activity */}
      {user?.completedWorkouts && user.completedWorkouts.length > 0 && (
        <div className="bg-dark-card p-4 rounded-xl border border-gray-800">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Activity size={16} className="text-gray-400" /> Atividades Recentes
            </h3>
            <div className="space-y-3">
                {user.completedWorkouts.slice(-3).reverse().map((date, i) => {
                    const d = new Date(date + 'T12:00:00'); // Midday to avoid timezone issues
                    return (
                        <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-brand-900/30 rounded-full flex items-center justify-center">
                                    <CheckCircle size={16} className="text-brand-500" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Treino Concluído</p>
                                    <p className="text-gray-500 text-xs">{d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</p>
                                </div>
                            </div>
                            <span className="text-brand-500 text-xs font-bold">+320 kcal</span>
                        </div>
                    );
                })}
            </div>
        </div>
      )}

      {/* Activity Chart */}
      <div className="bg-dark-card p-4 rounded-xl border border-gray-800">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Activity size={16} className="text-gray-400" /> Histórico Semanal
        </h3>
        <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                        cursor={{fill: '#334155', opacity: 0.4}}
                    />
                    <Bar dataKey="count" radius={[4, 4, 4, 4]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#22c55e' : '#334155'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;