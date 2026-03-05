import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { chatWithTrainer } from '../services/geminiService';
import { Send, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const { user, chatHistory, addChatMessage } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await chatWithTrainer(chatHistory, input, user);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      addChatMessage(botMsg);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Erro ao conectar. Tente novamente.",
        timestamp: Date.now()
      };
      addChatMessage(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-bg">
      <div className="p-4 bg-dark-card border-b border-gray-800 shadow-sm">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="text-brand-500" /> Personal AI
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center mt-10 opacity-50">
            <Bot size={48} className="mx-auto mb-2 text-brand-500" />
            <p className="text-sm">Olá, {user?.name}! Sou seu Personal IA.</p>
            <p className="text-xs mt-1">Pergunte sobre sua dieta, execução de exercícios ou motivação.</p>
          </div>
        )}

        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                ? 'bg-brand-600 text-white rounded-tr-none' 
                : 'bg-dark-card text-gray-200 border border-gray-700 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-dark-card border border-gray-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
               <Loader2 size={16} className="animate-spin text-brand-500" />
               <span className="text-xs text-gray-400">Digitando...</span>
             </div>
           </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-dark-card border-t border-gray-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
            placeholder="Digite sua dúvida..."
            className="flex-1 bg-dark-bg border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 text-sm disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-brand-600 hover:bg-brand-700 disabled:bg-gray-700 text-white p-3 rounded-xl transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;