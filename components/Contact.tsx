
import React, { useState } from 'react';
import { Mail, MapPin, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { functions } from '../services/firebase';
import { httpsCallable } from 'firebase/functions';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const sendEmailFn = httpsCallable(functions, 'sendContactEmail');
      await sendEmailFn(formData);
      
      console.log('Email enviado:', formData);
      setStatus('success');
      setFormData({ name: '', company: '', email: '', message: '' });
    } catch (error: any) {
      console.error("Error al enviar el formulario:", error);
      // Extraemos el mensaje de error del backend si existe
      setErrorMessage(error.message || 'Error interno del servidor');
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
             
             {status === 'success' ? (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0f0c29]/95 p-8 text-center animate-fade-in-up">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje Enviado!</h3>
                  <p className="text-gray-400">Hemos recibido tu solicitud correctamente. Te responderemos a la brevedad a tu email corporativo.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-sm text-brand-accent font-bold hover:text-white transition-colors"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
             ) : (
                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Nombre</label>
                      <input 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Tu nombre" 
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Empresa</label>
                      <input 
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Nombre empresa" 
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email Corporativo</label>
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email" 
                      placeholder="tu@empresa.com" 
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all" 
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Mensaje</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4} 
                      placeholder="Cuéntanos sobre tu proyecto..." 
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                      required
                    ></textarea>
                  </div>

                  {status === 'error' && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                          Error al enviar: {errorMessage}
                      </div>
                  )}

                  <button 
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-brand-accent text-white font-bold py-4 rounded-xl hover:bg-brand-accent/90 transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                       <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Enviar Solicitud
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};
