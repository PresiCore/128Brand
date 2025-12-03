import React from 'react';
import { Bot, FileText, Workflow, Database, PlayCircle, Check, Timer } from 'lucide-react';
import { SAAS_PRODUCTS } from '../constants';

// Icon mapping for dynamic rendering
const IconMap: Record<string, React.ElementType> = {
    Bot,
    FileText,
    Workflow,
    Database
};

export const Services: React.FC = () => {
  return (
    <div className="py-32 bg-[#030014] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 text-center">
          <h2 className="reveal-on-scroll text-brand-accent font-bold tracking-wide uppercase text-sm mb-2">Marketplace de IA</h2>
          <h3 className="reveal-on-scroll delay-100 text-4xl md:text-5xl font-bold text-white leading-tight">
            Nuestra Solución Estrella
          </h3>
          <p className="reveal-on-scroll delay-200 mt-4 text-gray-400 max-w-2xl mx-auto">
            Hemos condensado todo nuestro conocimiento en un único producto capaz de transformar tu empresa.
          </p>
        </div>

        {/* Product Grid - Centered for single item */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-lg mx-auto">
            {SAAS_PRODUCTS.map((product, index) => {
                const Icon = IconMap[product.iconName] || Bot;
                const isPopular = true; 

                return (
                    <div 
                        key={product.id} 
                        className={`reveal-on-scroll group relative flex flex-col rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 overflow-hidden ${
                            isPopular 
                                ? 'bg-[#0f0c29] border border-brand-accent shadow-[0_0_50px_rgba(124,58,237,0.3)]' 
                                : 'bg-[#0a0a0a] border border-white/5 hover:border-white/20'
                        }`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        {isPopular && (
                            <div className="absolute top-0 right-0 z-20">
                                <div className="bg-brand-neon text-black text-xs font-black px-4 py-1 rounded-bl-xl shadow-lg flex items-center gap-1">
                                    <Timer className="w-3 h-3" />
                                    PRUEBA GRATIS ACTIVA
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-center mb-6 mt-4">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300 relative">
                                <Icon className="w-8 h-8" />
                                <div className="absolute -inset-2 rounded-2xl bg-brand-accent/20 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </div>

                        <div className="mb-6 text-center">
                            <h4 className="text-2xl font-bold text-white mb-3">{product.name}</h4>
                            <p className="text-base text-gray-400 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <div className="mt-auto">
                            <div className="flex items-center justify-center mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-white">€0</span>
                                        <span className="text-sm text-brand-neon font-bold uppercase">/ 7 Días</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10">
                                        <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Renovación:</span>
                                        <span className="text-sm text-white font-bold">€350/mes</span>
                                    </div>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 bg-black/20 p-6 rounded-xl border border-white/5">
                                <li className="flex items-center text-sm text-gray-300">
                                    <Check className="w-4 h-4 text-brand-neon mr-3 flex-shrink-0" />
                                    <span>Aprendizaje Continuo (IA Avanzada)</span>
                                </li>
                                <li className="flex items-center text-sm text-gray-300">
                                    <Check className="w-4 h-4 text-brand-neon mr-3 flex-shrink-0" />
                                    <span>Lead Scoring & CRM Integrado</span>
                                </li>
                                <li className="flex items-center text-sm text-gray-300">
                                    <Check className="w-4 h-4 text-brand-neon mr-3 flex-shrink-0" />
                                    <span>Personalización Total de Branding</span>
                                </li>
                            </ul>

                            <button 
                                className={`w-full flex items-center justify-center py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                                    isPopular 
                                        ? 'bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg shadow-brand-accent/25 hover:shadow-brand-accent/40 transform hover:scale-[1.02]' 
                                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                }`}
                                onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})}
                            >
                                <PlayCircle className="w-5 h-5 mr-2" />
                                Empezar Prueba Gratis
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};