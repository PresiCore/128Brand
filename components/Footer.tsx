
import React from 'react';
import { MapPin, Mail, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-zinc-950 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-black text-sm">128</span>
              </div>
              <span className="ml-2 text-xl font-bold text-white">BRAND</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Agencia Boutique de Inteligencia Artificial. Especialistas en Agentes IA, Automatización de Procesos y Consultoría Estratégica para empresas que quieren escalar.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                Alicante, España
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Mail className="w-4 h-4 mr-2 text-indigo-500" />
                hola@128brand.com
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onNavigate(ViewState.PRIVACY)}
                  className="group flex items-center text-gray-400 hover:text-white transition-colors text-sm text-left"
                >
                  <ShieldCheck className="w-4 h-4 mr-2 group-hover:text-brand-accent transition-colors" />
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate(ViewState.TERMS)}
                  className="group flex items-center text-gray-400 hover:text-white transition-colors text-sm text-left"
                >
                  <FileText className="w-4 h-4 mr-2 group-hover:text-brand-accent transition-colors" />
                  Términos y Condiciones
                </button>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} 128 Brand. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
