
import React from 'react';
import { ArrowRight, Bot, Sparkles, Cpu, Play } from 'lucide-react';
import { ViewState } from '../types';

interface HeroProps {
  setView: (view: ViewState) => void;
  onOpenChat: () => void;
}

export const Hero: React.FC<HeroProps> = ({ setView, onOpenChat }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      
      {/* Organic Background Elements */}
      <div className="absolute inset-0 z-0 grid-bg opacity-30"></div>
      {/* Animated Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent/20 rounded-full blur-[120px] animate-blob mix-blend-screen"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen"></div>
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-brand-neon/10 rounded-full blur-[80px] animate-blob animation-delay-4000 mix-blend-screen"></div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <div className="text-left space-y-8">
            <div className="reveal-on-scroll inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 cursor-default">
              <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse"></span>
              <span className="text-sm font-medium text-gray-300">Agencia de Inteligencia Artificial</span>
            </div>

            <h1 className="reveal-on-scroll delay-100 text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white">
              Automatiza el <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">Presente.</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-500 text-glow animate-pulse-slow">
                Domina el Futuro.
              </span>
            </h1>

            <div className="reveal-on-scroll delay-200 space-y-4">
                <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                Implementamos Agentes de IA y flujos de automatización con <strong>tecnología de vanguardia</strong>.
                </p>
                <p className="text-lg text-white font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-neon rounded-full"></span>
                    Comienza hoy con tu <span className="text-brand-neon font-bold border-b border-brand-neon/50">Prueba de 7 Días sin compromiso.</span>
                </p>
            </div>

            <div className="reveal-on-scroll delay-300 flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => setView(ViewState.LOGIN)}
                className="relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-black transition-all duration-300 bg-white rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white group overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
              >
                <span className="relative z-10 flex items-center">
                    Empezar Prueba Gratis
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button 
                onClick={onOpenChat}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-brand-accent rounded-xl hover:bg-brand-accent/90 backdrop-blur-sm hover:scale-105"
              >
                <Bot className="w-5 h-5 mr-2" />
                Hablar con Brandy (AI)
              </button>
            </div>
          </div>

          {/* Visual Content (Right Side) */}
          <div className="relative hidden lg:block reveal-on-scroll delay-400">
            {/* Main floating card */}
            <div className="relative z-20 bg-[#0f0c29]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl animate-float w-full max-w-md mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-700 ease-out hover:scale-[1.02]">
              {/* Header of fake UI */}
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-gray-500 font-mono">brandy_agent_v5.py</div>
              </div>

              {/* Content of fake UI */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-brand-accent/20 flex items-center justify-center shadow-inner">
                        <Bot className="text-brand-accent w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="h-2 bg-white/10 rounded w-3/4 animate-pulse"></div>
                        <div className="h-2 bg-white/5 rounded w-1/2 animate-pulse delay-100"></div>
                    </div>
                </div>
                
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-xs text-gray-400 group hover:border-brand-accent/30 transition-colors duration-300">
                    <span className="text-purple-400">class</span> <span className="text-blue-400">SalesAgent</span>:<br/>
                    &nbsp;&nbsp;<span className="text-purple-400">def</span> <span className="text-green-400">optimize_revenue</span>(self):<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;model = <span className="text-yellow-400">"neural-engine-v2"</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-brand-neon group-hover:text-white transition-colors">return model.generate_profit()</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/5 p-3 flex flex-col justify-between hover:bg-white/5 transition-colors duration-300">
                        <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                        <div className="text-xs text-gray-400">Razonamiento</div>
                        <div className="text-xl font-bold text-white">Avanzado</div>
                    </div>
                    <div className="h-24 rounded-xl bg-gradient-to-br from-gray-800/50 to-black border border-white/5 p-3 flex flex-col justify-between hover:bg-white/5 transition-colors duration-300">
                        <Cpu className="w-5 h-5 text-brand-neon" />
                        <div className="text-xs text-gray-400">Latencia</div>
                        <div className="text-xl font-bold text-white">Ultra Low</div>
                    </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white text-black font-bold px-4 py-2 rounded-lg shadow-xl transform rotate-3 flex items-center gap-2 animate-pulse-slow">
                 <Play className="w-4 h-4 fill-black" /> 7 Días Gratis
              </div>
            </div>

            {/* Background decorations behind card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-brand-accent to-pink-600 rounded-full blur-3xl opacity-30 animate-float-delayed"></div>
            <div className="absolute top-1/2 -left-12 w-24 h-24 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-float"></div>
          </div>

        </div>
        
        {/* Clients / Marquee Strip */}
        <div className="mt-24 border-t border-white/5 pt-8 reveal-on-scroll delay-300">
            <p className="text-center text-sm text-gray-500 mb-6 tracking-widest uppercase">Stack Tecnológico</p>
            <div className="flex justify-center gap-8 md:gap-16 flex-wrap opacity-50">
                {['Large Language Models', 'Firestore', 'React 19', 'Python', 'Cloud Functions', 'Stripe'].map((tech, i) => (
                    <span 
                        key={tech} 
                        className="text-xl font-bold text-white/30 hover:text-brand-accent transition-all duration-500 cursor-default hover:scale-110 transform"
                        style={{ transitionDelay: `${i * 50}ms` }}
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
