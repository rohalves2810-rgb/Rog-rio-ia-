import React from 'react';
import { Dumbbell, ArrowRight, CheckCircle2, LogIn } from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
  onLogin: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart, onLogin }) => {
  return (
    <div className="h-screen flex flex-col bg-dark-bg text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-brand-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="flex-1 flex flex-col justify-center items-center p-8 z-10">
        <div className="w-20 h-20 bg-brand-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/20">
          <Dumbbell className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-center">Evolução Fit <span className="text-brand-500">AI</span></h1>
        <p className="text-dark-muted text-center mb-8 text-lg">
          Seu corpo. Seu objetivo. <br/>Sua evolução guiada por IA. <br/>
          Seu Personal Trainer inteligente e evolutivo.
        </p>

        <div className="space-y-4 w-full max-w-xs">
          <div className="flex items-center gap-3 bg-dark-card p-3 rounded-lg border border-gray-800">
            <CheckCircle2 className="text-brand-500" size={20} />
            <span className="text-sm">Treinos Personalizados</span>
          </div>
          <div className="flex items-center gap-3 bg-dark-card p-3 rounded-lg border border-gray-800">
            <CheckCircle2 className="text-brand-500" size={20} />
            <span className="text-sm">Personal Trainer 24h</span>
          </div>
          <div className="flex items-center gap-3 bg-dark-card p-3 rounded-lg border border-gray-800">
            <CheckCircle2 className="text-brand-500" size={20} />
            <span className="text-sm">Evolução Monitorada</span>
          </div>
        </div>
      </div>

      <div className="p-8 z-10 space-y-3">
        <button 
          onClick={onStart}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-brand-900/50"
        >
          Começar Agora <ArrowRight size={20} />
        </button>

        <button 
          onClick={onLogin}
          className="w-full bg-dark-card border border-gray-700 hover:bg-gray-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          Já tenho conta <LogIn size={20} />
        </button>

        <p className="text-center text-xs text-dark-muted mt-2">
          Ao continuar, você aceita nossos termos de uso.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
