import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Dumbbell, ArrowRight, ArrowLeft, Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
    onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack }) => {
    const { login } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Preencha todos os campos.');
            return;
        }

        setError('');
        setLoading(true);
        try {
            await login(email, password);
            // Navigation handled by App.tsx observing user state
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login.');
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-dark-bg text-white p-6 flex flex-col max-w-md mx-auto animate-fadeIn">
            <button 
                onClick={onBack}
                className="self-start p-2 text-gray-400 hover:text-white mb-8"
            >
                <ArrowLeft />
            </button>

            <div className="flex flex-col items-center mb-10">
                <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-500/20">
                    <Dumbbell className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold">Bem-vindo de volta!</h1>
                <p className="text-gray-400 text-sm mt-1">Faça login para acessar seu treino.</p>
            </div>

            <div className="space-y-4 w-full">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <div className="flex items-center bg-dark-card border border-gray-700 rounded-xl px-4 py-3 focus-within:border-brand-500 transition-colors">
                        <Mail size={20} className="text-gray-500 mr-3" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent w-full text-white focus:outline-none"
                            placeholder="seu@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Senha</label>
                    <div className="flex items-center bg-dark-card border border-gray-700 rounded-xl px-4 py-3 focus-within:border-brand-500 transition-colors">
                        <Lock size={20} className="text-gray-500 mr-3" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent w-full text-white focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/10 p-3 rounded-lg">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <button 
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-900/50 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? 'Entrando...' : 'Entrar'} <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default Login;
