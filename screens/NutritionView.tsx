import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Apple, Clock, Flame, ShoppingCart, ListChecks, ChefHat, Timer, Utensils } from 'lucide-react';

const NutritionView: React.FC = () => {
  const { workoutPlan } = useApp();
  const [activeTab, setActiveTab] = useState<'menu' | 'shopping' | 'recipes'>('menu');
  const diet = workoutPlan?.dietPlan;

  if (!diet) return <div className="p-6 text-gray-500 text-center">Plano alimentar não gerado ainda.</div>;

  return (
    <div className="p-4 space-y-6 animate-fadeIn pb-24">
      {/* Header with Calorie Summary */}
      <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-2xl relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500 rounded-lg">
                <Apple className="text-white" size={24} />
            </div>
            <div>
                <h2 className="text-white font-bold text-xl">Sua Nutrição</h2>
                <p className="text-green-400 text-sm">Foco: {workoutPlan.dietPlan.dailyCalories}</p>
            </div>
         </div>
         <div className="absolute right-[-10px] top-[-10px] opacity-10 rotate-12">
            <Apple size={100} />
         </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-dark-card rounded-xl border border-gray-800 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`flex-1 min-w-[100px] py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'menu' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <ListChecks size={16} /> <span className="hidden sm:inline">Cardápio</span>
          </button>
          <button 
            onClick={() => setActiveTab('shopping')}
            className={`flex-1 min-w-[100px] py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'shopping' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <ShoppingCart size={16} /> <span className="hidden sm:inline">Compras</span>
          </button>
          <button 
            onClick={() => setActiveTab('recipes')}
            className={`flex-1 min-w-[100px] py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'recipes' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <ChefHat size={16} /> <span className="hidden sm:inline">Receitas</span>
          </button>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {activeTab === 'menu' && (
            <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Sugestão de Refeições <span className="text-xs font-normal text-gray-500">(Modelo)</span>
                </h3>
                {diet.meals.map((meal, index) => (
                    <div key={index} className="bg-dark-card border border-gray-800 rounded-xl p-4 flex gap-4 group hover:border-green-500/30 transition-colors">
                        <div className="flex flex-col items-center justify-start pt-1 min-w-[50px]">
                            <div className="bg-gray-800 p-2 rounded-lg mb-1 group-hover:bg-green-900/30 transition-colors">
                                <Clock size={16} className="text-green-500" />
                            </div>
                            <span className="text-white font-bold text-xs">{meal.time}</span>
                        </div>
                        <div className="flex-1 border-l border-gray-800 pl-4">
                            <h4 className="text-green-400 font-bold mb-1 text-sm uppercase tracking-wide">{meal.name}</h4>
                            <p className="text-gray-300 text-sm leading-relaxed">{meal.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'shopping' && (
            <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Para a Semana
                </h3>
                
                {diet.shoppingList && diet.shoppingList.length > 0 ? (
                    <div className="bg-dark-card border border-gray-800 rounded-xl overflow-hidden">
                        {diet.shoppingList.map((item, index) => (
                            <div key={index} className="p-4 border-b border-gray-800 flex items-center gap-3 last:border-0 hover:bg-gray-800/30 transition-colors">
                                <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-transparent hover:bg-green-500 cursor-pointer transition-colors"></div>
                                </div>
                                <span className="text-gray-200 text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 text-gray-500">
                        <ShoppingCart size={40} className="mx-auto mb-2 opacity-30" />
                        <p>Lista de compras indisponível.</p>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'recipes' && (
            <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Receitas Sugeridas
                </h3>
                
                {diet.recipes && diet.recipes.length > 0 ? (
                    diet.recipes.map((recipe, index) => (
                        <div key={index} className="bg-dark-card rounded-2xl overflow-hidden border border-gray-800 shadow-lg">
                            {/* Visual Placeholder (Figure) instead of Image */}
                            <div className="h-24 w-full bg-green-900/10 relative flex items-center justify-center overflow-hidden border-b border-gray-800/50">
                                <Utensils className="text-green-500/20 w-16 h-16 transform rotate-12" />
                                <div className="absolute bottom-0 left-0 w-full p-3">
                                    <h3 className="text-white font-bold text-lg shadow-black drop-shadow-md">{recipe.name}</h3>
                                </div>
                            </div>
                            
                            <div className="p-5">
                                <div className="flex gap-4 mb-4 text-xs font-medium">
                                    <div className="flex items-center gap-1 text-brand-400 bg-brand-900/20 px-2 py-1 rounded">
                                        <Timer size={14} /> {recipe.prepTime}
                                    </div>
                                    <div className="flex items-center gap-1 text-orange-400 bg-orange-900/20 px-2 py-1 rounded">
                                        <Flame size={14} /> {recipe.calories}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-gray-200 font-bold text-sm mb-2 uppercase tracking-wide">Ingredientes</h4>
                                        <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                                            {recipe.ingredients.map((ing, i) => (
                                                <li key={i}>{ing}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-200 font-bold text-sm mb-2 uppercase tracking-wide">Preparo</h4>
                                        <div className="text-sm text-gray-400 space-y-2">
                                            {recipe.instructions.map((step, i) => (
                                                <p key={i}><span className="text-brand-500 font-bold">{i + 1}.</span> {step}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                     <div className="text-center p-8 text-gray-500">
                        <ChefHat size={40} className="mx-auto mb-2 opacity-30" />
                        <p>Receitas não disponíveis para este plano.</p>
                        <p className="text-xs mt-2">Crie um novo plano para gerar receitas.</p>
                    </div>
                )}
            </div>
        )}
      </div>

      <div className="bg-gray-800/50 p-4 rounded-xl text-center">
          <p className="text-[10px] text-gray-500">
              * Consulte um nutricionista antes de iniciar mudanças drásticas na alimentação.
          </p>
      </div>
    </div>
  );
};

export default NutritionView;