
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, RefreshCcw } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

export const AiDemo: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "¡Hola! 👋 Soy Brandy, especialista en IA de 128 Brand. Estoy aquí para ver si podemos ayudarte a ahorrar tiempo y dinero. Para empezar, ¿cuál es el mayor desafío operativo que tiene tu empresa hoy?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    const userMsg: Message = { role: 'user', text: userText, timestamp: new Date() };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare history for Gemini (excluding the last user message which is sent as the prompt)
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessageToGemini(userText, history);

      const modelMsg: Message = {
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Lo siento, mis servidores neuronales están saturados. ¿Podemos intentarlo de nuevo?', 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([{
      role: 'model',
      text: "¡Hola! 👋 Soy Brandy, especialista en IA de 128 Brand. Estoy aquí para ver si podemos ayudarte a ahorrar tiempo y dinero. Para empezar, ¿cuál es el mayor desafío operativo que tiene tu empresa hoy?",
      timestamp: new Date()
    }]);
    setInputValue('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Organic Background Elements (Consistent with Landing) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-accent/20 rounded-full blur-[120px] animate-blob mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen pointer-events-none"></div>
      
      <div className="w-full max-w-4xl mb-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center p-3 bg-brand-accent/10 rounded-full mb-4 ring-1 ring-brand-accent/30">
          <Bot className="w-8 h-8 text-brand-accent" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Habla con Brandy</h2>
        <p className="text-gray-400">
          Nuestro agente de ventas IA. No solo responde, <strong>entiende tu negocio</strong>.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-[#0f0c29]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] relative z-10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(124,58,237,0.1)]">
        
        {/* Chat Header */}
        <div className="bg-white/5 border-b border-white/5 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-accent to-purple-500 flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0f0c29] rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-bold text-white">Brandy</h3>
              <p className="text-xs text-indigo-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                Senior AI Consultant
              </p>
            </div>
          </div>
          <button 
            onClick={resetChat}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10 group"
            title="Reiniciar conversación"
          >
            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-black/20">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-sm ${
                  msg.role === 'user' ? 'bg-zinc-700 ml-3' : 'bg-brand-accent/20 mr-3'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-gray-300" /> : <Bot className="w-4 h-4 text-brand-accent" />}
                </div>

                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-md backdrop-blur-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand-accent text-white rounded-tr-none' 
                    : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                }`}>
                   {/* Simple markdown-like rendering for bold text */}
                  {msg.text.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="font-bold text-white">{part}</strong> : part
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start w-full animate-fade-in-up">
               <div className="flex items-center space-x-2 ml-11 bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5">
                 <Loader2 className="w-4 h-4 text-brand-accent animate-spin" />
                 <span className="text-xs text-gray-400">Brandy está analizando tu respuesta...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe aquí tu respuesta..."
              disabled={isLoading}
              className="w-full bg-black/30 border border-white/10 text-white rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 p-2 bg-brand-accent rounded-lg text-white hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-brand-accent transition-colors shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-center text-xs text-gray-600 mt-3">
            128 Brand AI Demo. Powered by 128 Brand Intelligence.
          </p>
        </div>

      </div>
    </div>
  );
};