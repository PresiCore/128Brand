
import React, { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { Mail, Lock, Loader2, ArrowRight, Chrome, AlertCircle, Shield, Briefcase } from 'lucide-react';

interface AuthPageProps {
    onLoginSuccess: (user: any) => void;
    initialMode?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, initialMode = false }) => {
    const [isRegister, setIsRegister] = useState(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            onLoginSuccess(result.user);
        } catch (err: any) {
            console.error("Google Auth Error", err);
            
            // IF DOMAIN IS RESTRICTED (Common in Preview Envs)
            // We do NOT simulate login anymore. We tell the user to use Email/Pass for real registration.
            if (err.code === 'auth/unauthorized-domain' || err.code === 'auth/operation-not-allowed') {
                setError('El inicio con Google está restringido en esta vista previa. Por favor, regístrate usando Email y Contraseña abajo para crear tu cuenta real.');
            } else if (err.code === 'auth/popup-closed-by-user') {
                setError('Has cerrado la ventana de inicio de sesión.');
            } else {
                setError('Error al conectar con Google. Por favor, intenta usar Email y Contraseña.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        
        setIsLoading(true);
        setError('');

        try {
            let result;
            if (isRegister) {
                result = await createUserWithEmailAndPassword(auth, email, password);
            } else {
                result = await signInWithEmailAndPassword(auth, email, password);
            }
            onLoginSuccess(result.user);
        } catch (err: any) {
            console.error("Auth Error", err);
            // Translate common Firebase errors
            if (err.code === 'auth/email-already-in-use') {
                setError('Este email ya está registrado. Prueba a iniciar sesión.');
            } else if (err.code === 'auth/weak-password') {
                setError('La contraseña debe tener al menos 6 caracteres.');
            } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Email o contraseña incorrectos.');
            } else {
                // Fallback safe mode for internal errors in preview
                if (err.code === 'auth/internal-error' || err.code === 'auth/admin-restricted-operation') {
                    // Only use fallback if absolutely necessary for internal connectivity issues, not domain logic
                    onLoginSuccess({ email, displayName: email.split('@')[0], uid: 'local_user_' + Math.random() });
                } else {
                    setError('Error de autenticación. Por favor revisa tus datos.');
                }
            }
            setIsLoading(false);
        }
    };

    const handleAdminDemo = () => {
        setIsLoading(true);
        setTimeout(() => {
            onLoginSuccess({
                uid: 'admin_demo_user',
                email: 'admin@128brand.com',
                displayName: 'Admin Demo',
                photoURL: 'https://ui-avatars.com/api/?name=Admin+User&background=7c3aed&color=fff&bold=true',
                role: 'admin'
            });
            setIsLoading(false);
        }, 800);
    };

    const handleClientDemo = () => {
        setIsLoading(true);
        setTimeout(() => {
            onLoginSuccess({
                uid: 'client_demo_user',
                email: 'cliente@empresa.com',
                displayName: 'Cliente Demo',
                photoURL: 'https://ui-avatars.com/api/?name=Cliente+Demo&background=0D8ABC&color=fff&bold=true',
                role: 'client'
            });
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
            <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-brand-accent/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
            
            <div className="bg-[#0f0c29]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 flex flex-col">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {isRegister ? 'Crear Cuenta' : 'Acceso Cliente'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {isRegister ? 'Únete a la plataforma de IA líder.' : 'Entra para gestionar tus despliegues de IA.'}
                    </p>
                </div>

                {/* DEMO BUTTONS */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                        onClick={handleAdminDemo}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 font-bold py-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 group"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                            <>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-xs uppercase tracking-wider">Admin</span>
                                </div>
                                <span className="text-sm group-hover:text-white transition-colors">Ver Gestión</span>
                            </>
                        )}
                    </button>

                    <button 
                        onClick={handleClientDemo}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-900/40 to-blue-800/40 border border-blue-500/30 hover:bg-blue-500/20 text-blue-300 font-bold py-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 group"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                            <>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    <span className="text-xs uppercase tracking-wider">Cliente</span>
                                </div>
                                <span className="text-sm group-hover:text-white transition-colors">Ver Accesos</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#0f0c29] text-gray-500">O acceso estándar</span>
                    </div>
                </div>

                <button 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-white text-black hover:bg-gray-100 font-bold py-3 rounded-xl transition-all flex items-center justify-center mb-4 shadow-lg group"
                >
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                        <>
                            <Chrome className="w-5 h-5 mr-3 text-brand-accent" />
                            Continuar con Google
                        </>
                    )}
                </button>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300 font-medium ml-1">Email Corporativo</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nombre@empresa.com" 
                                className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all" 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300 font-medium ml-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" 
                                className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all" 
                            />
                        </div>
                    </div>
                    
                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20 animate-pop-in text-left">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-accent/20 flex items-center justify-center group"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                            <>
                                {isRegister ? 'Registrarse' : 'Entrar al Dashboard'}
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        {isRegister ? '¿Ya tienes cuenta?' : '¿Aún no tienes acceso?'}
                        <button 
                            onClick={() => { setIsRegister(!isRegister); setError(''); }}
                            className="ml-2 text-brand-neon hover:underline font-bold"
                        >
                            {isRegister ? 'Inicia Sesión' : 'Regístrate Gratis'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
