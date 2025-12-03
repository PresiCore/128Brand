import React from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="py-24 bg-[#030014] relative" id="contact">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Info Text */}
          <div>
            <h2 className="text-brand-accent font-bold tracking-wide uppercase text-sm mb-2">Hablemos</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              ¿Listo para automatizar tu empresa?
            </h3>
            <p className="text-gray-400 text-lg mb-8">
              Déjanos tus datos y Brandy (o un humano, si lo prefieres) se pondrá en contacto contigo para una auditoría gratuita.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email Directo</p>
                  <p className="text-white font-medium">hola@128brand.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Oficinas</p>
                  <p className="text-white font-medium">Alicante, España</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#0f0c29]/50 backdrop-blur-md border border-white/10 p-8 rounded-3xl relative overflow-hidden">
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl"></div>
             
             <form className="relative z-10 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-300">Nombre</label>
                   <input type="text" placeholder="Tu nombre" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-300">Empresa</label>
                   <input type="text" placeholder="Nombre empresa" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all" />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-300">Email Corporativo</label>
                 <input type="email" placeholder="tu@empresa.com" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all" />
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-300">¿Qué necesitas?</label>
                 <select className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all">
                   <option>Consultoría General</option>
                   <option>Desarrollo de Agente IA</option>
                   <option>Automatización de Procesos</option>
                   <option>Otro</option>
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-300">Mensaje</label>
                 <textarea rows={4} placeholder="Cuéntanos sobre tu proyecto..." className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"></textarea>
               </div>

               <button className="w-full bg-brand-accent text-white font-bold py-4 rounded-xl hover:bg-brand-accent/90 transition-all flex items-center justify-center group">
                 Enviar Solicitud
                 <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
               </button>
             </form>
          </div>

        </div>
      </div>
    </div>
  );
};