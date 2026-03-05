import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Welcome from './screens/Welcome';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Layout from './components/Layout';
import WorkoutPlanView from './screens/WorkoutPlanView';
import ActiveWorkout from './screens/ActiveWorkout';
import NutritionView from './screens/NutritionView';
import AIChat from './screens/AIChat';
import UserProfileView from './screens/UserProfileView';
import { Loader2 } from 'lucide-react';

const MainApp = () => {
  const { user, isLoading } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Navigation State
  const [view, setView] = useState<'welcome' | 'login' | 'onboarding' | 'app'>('welcome');

  // Loading Overlay
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-dark-bg flex flex-col items-center justify-center text-brand-500">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="text-white font-medium animate-pulse">Carregando seus dados...</p>
      </div>
    );
  }

  // If user is authenticated, force 'app' view
  if (user) {
      // We render Layout directly below
  } else {
      // Unauthenticated Routes
      if (view === 'login') return <Login onBack={() => setView('welcome')} />;
      if (view === 'onboarding') return <Onboarding onComplete={() => setView('app')} />;
      return <Welcome onStart={() => setView('onboarding')} onLogin={() => setView('login')} />;
  }

  // Authenticated App (User is present)
  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <Dashboard 
          onStartWorkout={() => setActiveTab('active-workout')} 
          onViewPlan={() => setActiveTab('workout')}
        />
      )}
      {activeTab === 'workout' && <WorkoutPlanView />}
      {activeTab === 'active-workout' && <ActiveWorkout onFinish={() => setActiveTab('dashboard')} />}
      {activeTab === 'nutrition' && <NutritionView />}
      {activeTab === 'chat' && <AIChat />}
      {activeTab === 'profile' && <UserProfileView />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
