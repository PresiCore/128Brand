
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, RefreshCcw, X, Sparkles, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { SAAS_PRODUCTS } from '../constants';

interface AiDemoProps {
  onClose: () => void;
}

export const AiDemo: React.FC<AiDemoProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hola. Soy Brandy, tu consultora de Inteligencia Artificial. ¿Te gustaría saber cómo automatizar tus ventas y ahorrar costes hoy mismo?",
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
      // Send history as pure text for the model context
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await sendMessageToGemini(userText, history);

      const modelMsg: Message = {
        role: 'model',
        text: response.text,
        timestamp: new Date(),
        productRecommendation: response.productRecommendation
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Error de conexión. Intenta de nuevo.', 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([{
      role: 'model',
      text: "Hola. Soy Brandy, tu consultora de Inteligencia Artificial. ¿Te gustaría saber cómo automatizar tus ventas y ahorrar costes hoy mismo?",
      timestamp: new Date()
    }]);
    setInputValue('');
  };

  // Helper to find product details
  const getProductDetails = (id?: string) => SAAS_PRODUCTS.find(p => p.id === id);

  return (
    <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-[100] w-full md:w-[400px] h-[100dvh] md:h-[650px] md:max-h-[85vh] flex flex-col pointer-events-none">
       {/* Container with animation */}
       <div className="flex-1 flex flex-col bg-[#0f0c29]/95 backdrop-blur-xl border border-white/20 md:rounded-2xl shadow-2xl overflow-hidden pointer-events-auto animate-pop-in">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-brand-accent/20 to-purple-900/40 border-b border-white/10 p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-accent to-purple-500 flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0f0c29] rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Brandy AI</h3>
              <p className="text-[10px] text-indigo-300 flex items-center gap-1 uppercase tracking-wider font-medium">
                <Sparkles className="w-3 h-3" /> Online Sales Agent
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
             <button 
                onClick={resetChat}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Reiniciar chat"
             >
                <RefreshCcw className="w-4 h-4" />
             </button>
             <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
             >
                <X className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide bg-black/20">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex flex-col w-full animate-fade-in-up space-y-2`}
            >
              <div className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                   {msg.role !== 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mr-3 mt-1">
                         <Bot className="w-4 h-4 text-brand-accent" />
                      </div>
                   )}
                  
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-brand-accent text-white rounded-tr-none' 
                      : 'bg-[#1a1a2e] text-gray-200 rounded-tl-none border border-white/5'
                  }`}>
                     {msg.text.split('**').map((part, i) => 
                      i % 2 === 1 ? <span key={i} className="font-bold text-white">{part}</span> : part
                    )}
                  </div>
                </div>
              </div>

              {/* Product Card Rendering */}
              {msg.productRecommendation && getProductDetails(msg.productRecommendation) && (
                  <div className="ml-11 max-w-[80%] animate-pop-in">
                      <div className="bg-gradient-to-br from-[#1e1e2f] to-[#0f0c29] border border-brand-accent/30 rounded-xl overflow-hidden shadow-lg group hover:border-brand-accent/60 transition-colors">
                          <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                  <div className="bg-brand-neon text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-black" /> Recomendado
                                  </div>
                              </div>
                              <h4 className="text-white font-bold text-lg mb-1">{getProductDetails(msg.productRecommendation)?.name}</h4>
                              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{getProductDetails(msg.productRecommendation)?.description}</p>
                              <div className="flex items-center gap-2 mb-4">
                                  <span className="text-brand-accent font-bold text-lg">350€</span>
                                  <span className="text-gray-500 text-xs">+ IVA / mes</span>
                              </div>
                              <button 
                                onClick={() => {
                                    onClose();
                                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full bg-white text-black font-bold py-2 rounded-lg text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                              >
                                  Probar Gratis 7 Días <ArrowRight className="w-3 h-3" />
                              </button>
                          </div>
                      </div>
                  </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start w-full animate-fade-in-up">
               <div className="flex items-center space-x-2 ml-11 bg-[#1a1a2e] p-3 px-5 rounded-2xl rounded-tl-none border border-white/5">
                 <Loader2 className="w-3 h-3 text-brand-accent animate-spin" />
                 <span className="text-xs text-gray-400">Analizando respuesta...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-[#0a0a12] border-t border-white/10 shrink-0">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pregunta sobre nuestros servicios..."
              className="w-full bg-[#1a1a2e] border border-white/10 text-white text-sm rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-1 focus:ring-brand-accent/50 focus:border-brand-accent transition-all placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 p-2 bg-brand-accent rounded-lg text-white hover:bg-brand-accent/90 disabled:opacity-50 disabled:bg-gray-800 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-2 flex items-center justify-center gap-1 opacity-50">
             <div className="w-1.5 h-1.5 bg-brand-neon rounded-full animate-pulse"></div>
             <span className="text-[10px] text-gray-500 font-medium">Powered by 128 Brand Intelligence</span>
          </div>
        </div>
      </div>
    </div>
  );
};
