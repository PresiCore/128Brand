import React from 'react';
import { Trophy, Users, Crosshair, Zap } from 'lucide-react';

export const Esports: React.FC = () => {
  return (
    <div className="py-32 bg-black relative overflow-hidden border-t border-white/10">
      
      {/* Glitch Background Effect */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #111 0, #111 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
      <div className="absolute top-0 left-1/2 w-[800px] h-[600px] bg-brand-neon/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Content */}
          <div className="lg:w-1/2">
            <div className="flex items-center space-x-2 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-neon opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-neon"></span>
                </span>
                <span className="text-brand-neon font-mono text-sm tracking-widest font-bold">NUESTRO CLUB</span>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black text-white mb-6 uppercase italic tracking-tighter leading-none">
              CORE<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-purple-600">128</span>
            </h2>
            
            <h3 className="text-xl font-bold text-white/80 mb-8 uppercase tracking-wide">
              Born in Alicante. Built for Glory.
            </h3>
            
            <p className="text-lg text-gray-400 mb-10 leading-relaxed border-l-4 border-brand-neon pl-6">
              CORE 128 no es un servicio, es nuestra identidad. Representamos la fusión perfecta entre competición de alto nivel y cultura digital urbana.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-zinc-900/80 backdrop-blur-sm p-5 rounded-xl border border-white/10 hover:border-brand-neon/50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <Crosshair className="w-8 h-8 text-white group-hover:text-brand-neon transition-colors" />
                        <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white">MAIN ROSTER</span>
                    </div>
                    <h4 className="font-black text-2xl text-white italic uppercase">Valorant</h4>
                    <p className="text-xs text-gray-500 mt-1">Compitiendo en Liga Regional</p>
                </div>
                
                <div className="bg-zinc-900/80 backdrop-blur-sm p-5 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <Zap className="w-8 h-8 text-white group-hover:text-purple-500 transition-colors" />
                         <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white">CREATORS</span>
                    </div>
                    <h4 className="font-black text-2xl text-white italic uppercase">Content</h4>
                    <p className="text-xs text-gray-500 mt-1">Streamers & Influencers</p>
                </div>
            </div>

            <div className="mt-10 flex items-center space-x-8">
                <button className="px-8 py-4 bg-white text-black font-black uppercase italic text-lg hover:bg-brand-neon hover:text-black transition-colors skew-x-[-10deg]">
                    <span className="skew-x-[10deg] inline-block">Ver Partidos</span>
                </button>
                <div className="flex -space-x-4">
                     {[1,2,3,4].map((i) => (
                         <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*128}&backgroundColor=b6e3f4`} alt="player" />
                         </div>
                     ))}
                     <div className="w-12 h-12 rounded-full border-2 border-black bg-brand-accent flex items-center justify-center text-white font-bold text-xs">
                         +12
                     </div>
                </div>
            </div>
          </div>

          {/* Image / Visuals */}
          <div className="lg:w-1/2 w-full relative mt-12 lg:mt-0">
             <div className="relative rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(176,251,93,0.2)] group border border-white/10 transform rotate-2 hover:rotate-0 transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-90"></div>
                
                {/* Esports Image */}
                <img 
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" 
                    alt="CORE 128 Setup" 
                    className="w-full h-[600px] object-cover transform group-hover:scale-110 transition-transform duration-700 grayscale contrast-125 group-hover:grayscale-0"
                />
                
                {/* Overlay Branding */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 z-20">
                    <div className="flex justify-between w-full">
                         <div className="bg-brand-neon text-black font-black px-3 py-1 text-xs uppercase tracking-widest">Official Club</div>
                         <Trophy className="text-brand-neon w-8 h-8 drop-shadow-[0_0_10px_rgba(176,251,93,0.8)]" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/60 font-mono text-xs">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            NEXT MATCH IN 2 DAYS
                        </div>
                        <h2 className="text-5xl font-black text-white italic uppercase leading-[0.85]">
                            CORE<br/><span className="text-brand-neon">128</span>
                        </h2>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};