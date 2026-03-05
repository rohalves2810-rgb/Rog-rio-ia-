import React from 'react';
import { Check, Crown, Star, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PremiumProps {
    onClose?: () => void;
}

const Premium: React.FC<PremiumProps> = ({ onClose }) => {
  const { setUser, user } = useApp();

  const handleSubscribe = () => {
    // Mock subscription
    if (user) {
        setUser({ ...user, isPremium: true });
        alert("Parabéns! Você agora é Premium! (Simulação)");
        if (onClose) onClose();
    }
  };

  return (
    <div className="p-6 h-full flex flex-col items-center text-center animate-fadeIn pb-20">
      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-yellow-500/20">
        <Crown className="w-10 h-10 text-white" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">Evolução Fit <span className="text-yellow-500">Premium</span></h1>
      <p className="text-gray-400 mb-8">Evolua 3x mais rápido com inteligência artificial ilimitada.</p>

      <div className="w-full bg-dark-card border border-yellow-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">
            MELHOR ESCOLHA
        </div>
        
        <div className="text-4xl font-bold text-white mb-1">R$ 29,90<span className="text-sm text-gray-500 font-normal">/mês</span></div>
        <p className="text-xs text-gray-500 mb-6">Cancele quando quiser.</p>

        <ul className="space-y-4 text-left mb-6">
            <li className="flex items-center gap-3 text-sm text-gray-200">
                <div className="bg-yellow-500/20 p-1 rounded-full"><Check size={12} className="text-yellow-500" /></div>
                Treino 100% personalizado
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-200">
                <div className="bg-yellow-500/20 p-1 rounded-full"><Check size={12} className="text-yellow-500" /></div>
                Atualização semanal automática
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-200">
                <div className="bg-yellow-500/20 p-1 rounded-full"><Check size={12} className="text-yellow-500" /></div>
                IA Personal Ilimitada
            </li>
             <li className="flex items-center gap-3 text-sm text-gray-200">
                <div className="bg-yellow-500/20 p-1 rounded-full"><Check size={12} className="text-yellow-500" /></div>
                Plano Alimentar Inteligente
            </li>
        </ul>

        <button 
            onClick={handleSubscribe}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-3 rounded-xl shadow-lg shadow-yellow-500/20 transform transition-transform active:scale-95"
        >
            ASSINAR AGORA
        </button>
      </div>

      <div className="flex gap-4 items-center justify-center text-gray-500 text-xs">
         <span className="flex items-center gap-1"><Star size={12} /> Garantia de 7 dias</span>
         <span className="flex items-center gap-1"><Lock size={12} /> Pagamento Seguro</span>
      </div>
    </div>
  );
};

export default Premium;