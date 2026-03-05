import React from 'react';
import { useApp } from '../context/AppContext';
import { Dumbbell, MessageSquare, User, LayoutDashboard, Utensils } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user } = useApp();

  if (!user) return <>{children}</>;

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Início' },
    { id: 'workout', icon: Dumbbell, label: 'Treino' },
    { id: 'nutrition', icon: Utensils, label: 'Dieta' },
    { id: 'chat', icon: MessageSquare, label: 'IA' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex flex-col max-w-md mx-auto shadow-xl overflow-hidden relative">
      {/* Header */}
      <header className="p-4 bg-dark-card border-b border-gray-800 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">Evolução Fit <span className="text-brand-500">AI</span></h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-dark-card border-t border-gray-800 absolute bottom-0 w-full z-20">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-brand-500' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;