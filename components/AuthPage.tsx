import React, { useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../services/firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Mail, Lock, Loader2, ArrowRight, Chrome, AlertCircle, User, Building2 } from 'lucide-react';

interface AuthPageProps {
    onLoginSuccess: (user: any) => void;
    initialMode?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, initialMode = false }) => {
    const [isRegister, setIsRegister] = useState(initialMode);
    
    // Form States
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Sync initialMode prop with internal state (fixes Navbar navigation issue)
    useEffect(() => {
        setIsRegister(initialMode);
        setError('');
    }, [initialMode]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // Check if user document exists, if not create it (Optional enhancement, usually handled by backend triggers)
            // For now, we proceed to login success
            onLoginSuccess(result.user);
        } catch (err: any) {
            console.error("Google Auth Error", err);
            
            if (err.code === 'auth/unauthorized-domain' || err.code === 'auth/operation-not-allowed') {
                setError('El inicio con Google está restringido. Por favor usa Email/Password.');
            } else if (err.code === 'auth/popup-closed-by-user') {
                setError('Has cerrado la ventana de inicio de sesión.');
            } else {
                setError('Error al conectar con Google.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!email || !password) {
            setError('Por favor, completa el email y la contraseña.');
            return;
        }

        if (isRegister && !name.trim()) {
            setError('El nombre completo es obligatorio para registrarse.');
            return;
        }

        if (isRegister && !company.trim()) {
             setError('El nombre de la empresa es obligatorio.');
             return;
        }
        
        setIsLoading(true);
        setError('');

        try {
            let userCredential;

            if (isRegister) {
                // Register Flow
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // 1. Update Auth Profile
                try {
                    await updateProfile(user, {
                        displayName: name
                    });
                } catch (profileErr) {
                    console.error("Error updating Auth profile", profileErr);
                }

                // 2. Create Firestore User Document
                try {
                    await setDoc(doc(db, "users", user.uid), {
                        uid: user.uid,
                        name: name,
                        company: company,
                        email: email,
                        role: 'client',
                        createdAt: new Date().toISOString(),
                        subscriptionStatus: 'trial',
                        active: true
                    });
                } catch (firestoreErr) {
                    console.error("Error saving user to Firestore", firestoreErr);
                    // We don't block login if this fails, but it's good to log
                }

                onLoginSuccess(user);

            } else {
                // Login Flow
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                onLoginSuccess(userCredential.user);
            }
        } catch (err: any) {
            console.error("Auth Error", err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Este email ya está registrado. Prueba a iniciar sesión.');
            } else if (err.code === 'auth/weak-password') {
                setError('La contraseña debe tener al menos 6 caracteres.');
            } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Credenciales incorrectas. Verifica tu email y contraseña.');
            } else {
                setError('Error de autenticación: ' + (err.message || 'Inténtalo de nuevo.'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent any form submission side effects
        setIsRegister(!isRegister);
        setError('');
        // Clear optional fields when switching to Login
        if (isRegister) { 
            setName('');
            setCompany('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
            <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-brand-accent/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow pointer-events-none"></div>
            
            <div className="bg-[#0f0c29]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 flex flex-col transition-all duration-300">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 transition-all">
                        {isRegister ? 'Crear Cuenta' : 'Acceso Cliente'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {isRegister ? 'Completa tus datos para comenzar tu prueba gratuita.' : 'Entra para gestionar tus servicios y facturación.'}
                    </p>
                </div>

                {/* Google Button - Always visible */}
                <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-white text-black hover:bg-gray-100 font-bold py-3 rounded-xl transition-all flex items-center justify-center mb-4 shadow-lg group"
                >
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                        <>
                            <Chrome className="w-5 h-5 mr-3 text-brand-accent" />
                            {isRegister ? 'Registrarse con Google' : 'Entrar con Google'}
                        </>
                    )}
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#0f0c29] text-gray-500">o usa tu email</span>
                    </div>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                    
                    {/* Campos Exclusivos de Registro */}
                    {isRegister && (
                        <>
                            <div className="space-y-2 animate-fade-in-up">
                                <label className="text-sm text-gray-300 font-medium ml-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Tu nombre y apellido" 
                                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                                <label className="text-sm text-gray-300 font-medium ml-1">Empresa</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input 
                                        type="text" 
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        placeholder="Nombre de tu negocio" 
                                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all" 
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Campos Comunes */}
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
                        className={`w-full text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center group ${isRegister ? 'bg-brand-neon text-black hover:bg-brand-neon/90 shadow-brand-neon/20' : 'bg-brand-accent hover:bg-brand-accent/90 shadow-brand-accent/20'}`}
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                            <>
                                {isRegister ? 'Registrarse Gratis' : 'Entrar al Dashboard'}
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        {isRegister ? '¿Ya tienes cuenta?' : '¿Aún no tienes acceso?'}
                        <button 
                            type="button"
                            onClick={toggleMode}
                            className="ml-2 text-brand-neon hover:underline font-bold relative z-20 cursor-pointer"
                        >
                            {isRegister ? 'Inicia Sesión aquí' : 'Crea una cuenta gratis'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};