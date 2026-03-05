import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile, UserGoal, UserLevel, TrainingLocation, Gender } from '../types';
import { ArrowRight, ArrowLeft, Ruler, Weight, User as UserIcon, Lock, Mail, Loader2 } from 'lucide-react';
import { generateWorkoutPlan } from '../services/geminiService';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { register, saveGeneratedPlan, setIsLoading } = useApp();
  const [step, setStep] = useState(1);
  const [localLoading, setLocalLoading] = useState(false);
  const totalSteps = 4;

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    password: '',
    age: 25,
    weight: 70,
    height: 170,
    gender: Gender.Male,
    goal: UserGoal.MuscleGain,
    level: UserLevel.Beginner,
    location: TrainingLocation.Gym,
    isPremium: true,
    freeQuestionsCount: 0,
    joinedDate: new Date().toISOString(),
    completedWorkouts: [] // Start with zero metrics
  });

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      // Finish - Register and Generate
      setLocalLoading(true);
      try {
        const fullProfile = formData as UserProfile;
        
        // 1. Register User in "Database" and get the ID back
        const registeredUser = await register(fullProfile);
        
        // 2. Generate initial plan
        const plan = await generateWorkoutPlan(registeredUser);
        
        // 3. Save plan to "Database" using the user object directly to avoid state race condition
        await saveGeneratedPlan(plan, registeredUser);
        
        onComplete();
      } catch (error: any) {
        alert(error.message || "Erro ao gerar treino inicial. Tente novamente.");
        console.error(error);
      } finally {
        setLocalLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  if (localLoading) {
      return (
        <div className="h-screen bg-dark-bg text-white p-6 flex flex-col items-center justify-center text-center max-w-md mx-auto animate-fadeIn">
            <div className="w-20 h-20 bg-brand-900/30 rounded-full flex items-center justify-center mb-6 relative">
                 <Loader2 size={40} className="text-brand-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Criando seu Plano...</h2>
            <p className="text-gray-400">Nossa IA está analisando seu perfil e montando um treino exclusivo de {formData.goal}.</p>
        </div>
      );
  }

  return (
    <div className="h-screen bg-dark-bg text-white p-6 flex flex-col max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="mb-8 mt-4">
        <div className="flex justify-between text-xs text-dark-muted mb-2">
          <span>Passo {step} de {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 bg-dark-card rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-500 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold">Criar sua conta</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-muted mb-1">Nome</label>
                <div className="flex items-center bg-dark-card border border-gray-700 rounded-lg px-3 focus-within:border-brand-500">
                    <UserIcon size={18} className="text-gray-500 mr-2" />
                    <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full bg-transparent p-3 text-white focus:outline-none"
                    placeholder="Seu nome"
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm text-dark-muted mb-1">Email</label>
                <div className="flex items-center bg-dark-card border border-gray-700 rounded-lg px-3 focus-within:border-brand-500">
                    <Mail size={18} className="text-gray-500 mr-2" />
                    <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full bg-transparent p-3 text-white focus:outline-none"
                    placeholder="seu@email.com"
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm text-dark-muted mb-1">Senha</label>
                <div className="flex items-center bg-dark-card border border-gray-700 rounded-lg px-3 focus-within:border-brand-500">
                    <Lock size={18} className="text-gray-500 mr-2" />
                    <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full bg-transparent p-3 text-white focus:outline-none"
                    placeholder="Mínimo 6 caracteres"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark-muted mb-1">Sexo Biológico</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(Gender).map((g) => (
                    <button
                      key={g}
                      onClick={() => handleChange('gender', g)}
                      className={`p-3 rounded-lg border ${formData.gender === g ? 'bg-brand-500/20 border-brand-500 text-brand-500' : 'bg-dark-card border-gray-700 text-gray-400'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold">Suas medidas</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-dark-muted mb-1">Idade</label>
                <div className="flex items-center bg-dark-card border border-gray-700 rounded-lg px-3">
                  <UserIcon size={20} className="text-gray-500" />
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => handleChange('age', Number(e.target.value))}
                    className="w-full bg-transparent p-3 text-white focus:outline-none"
                  />
                  <span className="text-gray-500 text-sm">anos</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-dark-muted mb-1">Peso</label>
                <div className="flex items-center bg-dark-card border border-gray-700 rounded-lg px-3">
                  <Weight size={20} className="text-gray-500" />
                  <input 
                    type="number" 
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', Number(e.target.value))}
                    className="w-full bg-transparent p-3 text-white focus:outline-none"
                  />
                  <span className="text-gray-500 text-sm">kg</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-dark-muted mb-1">Altura</label>
                <div className="flex items-center bg-dark-card border border-gray-700 rounded-lg px-3">
                  <Ruler size={20} className="text-gray-500" />
                  <input 
                    type="number" 
                    value={formData.height}
                    onChange={(e) => handleChange('height', Number(e.target.value))}
                    className="w-full bg-transparent p-3 text-white focus:outline-none"
                  />
                  <span className="text-gray-500 text-sm">cm</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold">Seu Objetivo</h2>
            <div className="grid grid-cols-1 gap-3">
              {Object.values(UserGoal).map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleChange('goal', goal)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.goal === goal 
                    ? 'bg-brand-500/20 border-brand-500 text-white' 
                    : 'bg-dark-card border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <span className="font-semibold block">{goal}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold">Experiência e Local</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-muted mb-2">Nível de Experiência</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(UserLevel).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handleChange('level', lvl)}
                      className={`p-3 rounded-lg border text-sm ${formData.level === lvl ? 'bg-brand-500/20 border-brand-500 text-brand-500' : 'bg-dark-card border-gray-700 text-gray-400'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark-muted mb-2">Onde você treina?</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(TrainingLocation).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => handleChange('location', loc)}
                      className={`p-3 rounded-lg border text-sm ${formData.location === loc ? 'bg-brand-500/20 border-brand-500 text-brand-500' : 'bg-dark-card border-gray-700 text-gray-400'}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        {step > 1 && (
          <button 
            onClick={handleBack}
            className="px-6 py-4 rounded-xl bg-dark-card text-white font-bold border border-gray-700"
          >
            <ArrowLeft />
          </button>
        )}
        <button 
          onClick={handleNext}
          disabled={step === 1 && (!formData.name || !formData.email || !formData.password)}
          className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === totalSteps ? 'Criar Conta e Treino' : 'Próximo'} 
          {step !== totalSteps && <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
