import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, User, Settings, Crown, Bell, Activity, Clock, CheckCircle } from 'lucide-react';
import { requestNotificationPermission, sendWorkoutReminder } from '../services/notificationService';

const UserProfileView: React.FC = () => {
  const { user, logout } = useApp();

  if (!user) return null;

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleTestNotification = async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
          sendWorkoutReminder(user);
      } else {
          alert("Por favor, habilite as notificações no seu navegador.");
      }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-dark-card rounded-full flex items-center justify-center border-2 border-brand-500">
            <User size={40} className="text-brand-500" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">{user.email}</span>
                {user.isPremium && <Crown size={14} className="text-yellow-500" />}
            </div>
        </div>
      </div>

      <div className="bg-dark-card rounded-xl border border-gray-800 p-4 space-y-4">
        <h3 className="font-bold text-white border-b border-gray-800 pb-2">Seus Dados</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
                <p className="text-gray-500">Peso</p>
                <p className="text-white font-medium">{user.weight} kg</p>
            </div>
            <div>
                <p className="text-gray-500">Altura</p>
                <p className="text-white font-medium">{user.height} cm</p>
            </div>
             <div>
                <p className="text-gray-500">Objetivo</p>
                <p className="text-white font-medium">{user.goal}</p>
            </div>
             <div>
                <p className="text-gray-500">Nível</p>
                <p className="text-white font-medium">{user.level}</p>
            </div>
        </div>
      </div>

      {/* Histórico de Treinos */}
      <div className="bg-dark-card rounded-xl border border-gray-800 p-4 space-y-4">
        <h3 className="font-bold text-white border-b border-gray-800 pb-2 flex items-center gap-2">
            <Activity size={18} className="text-brand-500" /> Histórico de Treinos
        </h3>
        {user.completedWorkouts && user.completedWorkouts.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                {user.completedWorkouts.slice().reverse().map((date, i) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-gray-900/40 p-3 rounded-lg border border-gray-800/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle size={16} className="text-brand-500" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Treino Concluído</p>
                                <p className="text-gray-500 text-xs">{formatDate(date)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                            <Clock size={12} />
                            <span>45 min</span>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 text-sm italic text-center py-4">Nenhum treino concluído ainda.</p>
        )}
      </div>

      <div className="space-y-3">
        <button 
            onClick={handleTestNotification}
            className="w-full flex items-center justify-between p-4 bg-dark-card rounded-xl border border-gray-800 hover:bg-gray-800 transition-colors"
        >
            <span className="flex items-center gap-3 text-white">
                <Bell size={18} /> Testar Notificação
            </span>
        </button>

        <button className="w-full flex items-center justify-between p-4 bg-dark-card rounded-xl border border-gray-800 hover:bg-gray-800 transition-colors">
            <span className="flex items-center gap-3 text-white">
                <Settings size={18} /> Configurações
            </span>
        </button>
        
        <button 
            onClick={logout}
            className="w-full flex items-center justify-between p-4 bg-red-900/10 rounded-xl border border-red-900/30 hover:bg-red-900/20 transition-colors"
        >
            <span className="flex items-center gap-3 text-red-500">
                <LogOut size={18} /> Sair
            </span>
        </button>
      </div>
    </div>
  );
};

export default UserProfileView;