
import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, ShoppingBag, LogOut, CheckCircle2, 
    Server, ArrowUpRight, PlayCircle, X,
    Bot, FileText, Workflow, Database, 
    WifiOff, Wifi, Copy, Eye, EyeOff, Key,
    ExternalLink, Gift, Timer, Activity, Check, Code,
    ShieldCheck, AlertTriangle, RefreshCw, Power, Trash2, CreditCard,
    Star
} from 'lucide-react';
import { SaasProduct } from '../types';
import { db } from '../services/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc, arrayUnion } from "firebase/firestore";
import { SAAS_PRODUCTS } from '../constants';
import { PaymentGateway } from './PaymentGateway';

const IconMap: Record<string, React.ElementType> = {
    Bot, FileText, Workflow, Database
};

const SAAS_API_URL = "https://us-central1-brand-ai-chatbot-saas.cloudfunctions.net/activateClientToken";
const AGENCY_SECRET_KEY = "128BRAND_SECRET_KEY_2024";

// --- COMPONENT: OFFER PAGE ---
interface OfferPageProps {
    product: SaasProduct;
    onActivateTrial: () => void;
    onClose: () => void;
    isProvisioning: boolean;
    userCreationTime?: string;
}

const OfferPage: React.FC<OfferPageProps> = ({ product, onActivateTrial, onClose, isProvisioning, userCreationTime }) => {
    const calculateTimeLeft = () => {
        if (!userCreationTime) return 0;
        const created = new Date(userCreationTime).getTime();
        const expires = created + (72 * 60 * 60 * 1000); 
        const now = Date.now();
        const diff = Math.floor((expires - now) / 1000);
        return diff > 0 ? diff : 0;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [provisionStep, setProvisionStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [userCreationTime]);

    useEffect(() => {
        if (isProvisioning) {
            const step1 = setTimeout(() => setProvisionStep(1), 1000); 
            const step2 = setTimeout(() => setProvisionStep(2), 2500); 
            const step3 = setTimeout(() => setProvisionStep(3), 4000); 
            return () => { clearTimeout(step1); clearTimeout(step2); clearTimeout(step3); };
        }
    }, [isProvisioning]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const isOfferExpired = timeLeft === 0;

    return (
        <div className="fixed inset-0 z-[60] bg-[#030014] overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 z-20 bg-[#0f0c29]/90 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center shadow-xl">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} disabled={isProvisioning} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors disabled:opacity-50">
                        <X className="w-6 h-6" />
                    </button>
                    {!isOfferExpired ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
                            <Timer className="w-4 h-4 text-red-500 animate-pulse" />
                            <span className="text-red-500 font-bold font-mono text-lg tracking-widest">{formatTime(timeLeft)}</span>
                            <span className="text-xs text-red-400 uppercase font-bold ml-2">Oferta Expira</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-full">
                            <span className="text-gray-400 font-bold text-sm">Oferta de bienvenida finalizada</span>
                        </div>
                    )}
                </div>
                {!isProvisioning && !isOfferExpired && (
                    <button 
                        onClick={onActivateTrial}
                        className="hidden md:flex bg-brand-accent hover:bg-brand-accent/90 text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all transform hover:scale-105"
                    >
                        Activar Prueba Gratis 7 Días
                    </button>
                )}
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {isProvisioning ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in-up">
                        <div className="relative">
                            <div className="absolute inset-0 bg-brand-accent/20 blur-xl rounded-full animate-pulse"></div>
                            <Server className="w-20 h-20 text-brand-accent animate-bounce relative z-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">Configurando tu Instancia Privada...</h2>
                        <div className="w-full max-w-md space-y-4">
                            <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${provisionStep >= 1 ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                                {provisionStep >= 1 ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-brand-accent animate-spin" />}
                                <span className={provisionStep >= 1 ? 'text-white' : 'text-gray-500'}>Generando Token de Licencia Único</span>
                            </div>
                            <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${provisionStep >= 2 ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                                {provisionStep >= 2 ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-brand-accent animate-spin" />}
                                <span className={provisionStep >= 2 ? 'text-white' : 'text-gray-500'}>Creando Usuario en Base de Datos Maestra</span>
                            </div>
                            <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${provisionStep >= 3 ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                                {provisionStep >= 3 ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-brand-accent animate-spin" />}
                                <span className={provisionStep >= 3 ? 'text-white' : 'text-gray-500'}>Sincronizando con Chatbot Service</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                        <div>
                            {!isOfferExpired && (
                                <div className="inline-block px-4 py-1 bg-brand-neon text-black font-black text-xs uppercase tracking-widest rounded-full mb-6">
                                    Oferta Exclusiva 128 Brand
                                </div>
                            )}
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                                {product.description}
                            </p>
                            <div className="flex items-center gap-6 mb-10">
                                <div className="flex flex-col">
                                    {!isOfferExpired ? (
                                        <>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-gray-400 text-sm font-medium">Precio habitual:</span>
                                                <span className="text-white font-bold text-lg">{product.price}</span>
                                            </div>
                                            <span className="text-4xl font-bold text-white">€0<span className="text-sm text-gray-400 font-normal"> / 7 días</span></span>
                                        </>
                                    ) : (
                                        <span className="text-4xl font-bold text-white">{product.price}</span>
                                    )}
                                </div>
                                <div className="h-10 w-px bg-white/10"></div>
                                <div className="flex items-center text-green-400 text-sm font-bold bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Sin compromiso
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                {!isOfferExpired ? (
                                    <>
                                        <button 
                                            onClick={onActivateTrial}
                                            className="w-full md:w-auto bg-white text-black font-black text-xl px-8 py-5 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center"
                                        >
                                            PROBAR AHORA GRATIS <PlayCircle className="w-6 h-6 ml-2" />
                                        </button>
                                        <p className="text-xs text-gray-500 text-center md:text-left ml-2">
                                            *Se requiere activación mediante Token. No se cobra nada hoy.
                                        </p>
                                    </>
                                ) : (
                                    <div className="p-4 bg-gray-900 rounded-xl border border-white/10 text-gray-400 text-sm">
                                        La oferta de prueba gratuita ha expirado. Puedes contratar el servicio directamente desde el panel.
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/20 to-purple-600/20 rounded-3xl blur-3xl animate-pulse-slow"></div>
                            <div className="relative bg-[#0f0c29] border border-white/10 rounded-3xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700">
                                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="font-mono text-xs text-gray-500">{product.id}_v1.0</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><Bot className="w-6 h-6 text-brand-neon"/></div>
                                        <div>
                                            <div className="h-2 w-32 bg-white/20 rounded mb-2"></div>
                                            <div className="h-2 w-20 bg-white/10 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-400 uppercase">Eficiencia Hoy</span>
                                            <span className="text-green-400 font-bold text-xs">+25%</span>
                                        </div>
                                        <div className="text-3xl font-bold text-white">Active</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENT: CONFIGURATION PANEL ---
interface ConfigPanelProps {
    product: SaasProduct;
    userId: string;
    onStatusChange: (status: 'active' | 'paused') => void;
    onDelete: () => void;
    onUpgrade: () => void;
    isPremium?: boolean;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ product, userId, onStatusChange, onDelete, onUpgrade, isPremium }) => {
    const [showKey, setShowKey] = useState(false);
    // --- ESTADO NUEVO PARA EL CHECK VISUAL ---
    const [copied, setCopied] = useState(false); 

    const isActive = product.status === 'active';
    const token = product.token || `missing_token`;
    const targetUrl = product.serviceUrl 
        ? `${product.serviceUrl}?token=${token}` 
        : `https://service-128brand-ai-chatbot-saas-785237534052.us-west1.run.app?token=${token}`; 

    const handleOpenPlatform = () => window.open(targetUrl, '_blank');

    const handleToggleStatus = () => {
        if (isActive) {
            onStatusChange('paused');
        } else {
            // Si está pausado (o caducado/inactivo) -> Llevamos a pagar
            onUpgrade();
        }
    };

    // --- FUNCIÓN DE COPIADO CORREGIDA ---
    const handleCopyToken = async () => {
        try {
            await navigator.clipboard.writeText(token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Error al copiar:", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-full p-8 text-center space-y-10 animate-fade-in-up pb-20">
            <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                    <div className="bg-brand-accent/10 p-6 rounded-full border border-brand-accent/20 shadow-[0_0_40px_rgba(124,58,237,0.2)]">
                        <LayoutDashboard className="w-16 h-16 text-brand-accent" />
                    </div>
                    {isPremium && (
                         <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-black px-2 py-1 rounded-full border-2 border-[#0f0c29] shadow-lg flex items-center gap-1 animate-pop-in">
                             <Star className="w-3 h-3 fill-black" /> PRO
                         </div>
                    )}
                </div>
                <div className="max-w-xl space-y-4">
                    <h3 className="text-3xl font-bold text-white">Gestión Centralizada</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Toda la configuración de tu <strong>{product.name}</strong> se realiza en nuestra plataforma dedicada.
                    </p>
                </div>
                <button 
                    onClick={handleOpenPlatform}
                    disabled={!isActive}
                    className={`group relative text-xl font-bold px-10 py-5 rounded-2xl flex items-center shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all transform hover:scale-105 ${
                        isActive ? 'bg-brand-accent hover:bg-brand-accent/90 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
                >
                    <ExternalLink className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                    {isActive ? 'Acceder a la Plataforma del Bot' : 'Servicio Pausado'}
                </button>
            </div>
            
            <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
                <div className="bg-[#121212] p-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-brand-neon" /><span className="font-bold text-white">Estado de Licencia</span></div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        {isActive ? 'Activa' : 'Pausada'}
                    </div>
                </div>
                <div className="p-6 space-y-6 text-left">
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold mb-2 block flex items-center gap-2"><Key className="w-4 h-4 text-brand-neon" /> Token de Activación</label>
                        <div className="flex items-center gap-3 bg-black border border-white/10 p-4 rounded-lg group hover:border-brand-accent/30 transition-colors">
                            <code className="text-brand-accent text-sm font-mono flex-1 break-all">{showKey ? token : '••••••••••••••••••••••••••••••••••••••••'}</code>
                            <button onClick={() => setShowKey(!showKey)} className="text-gray-500 hover:text-white p-2 rounded hover:bg-white/5 transition-colors" title={showKey ? "Ocultar" : "Mostrar"}>
                                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            
                            {/* --- BOTÓN ACTUALIZADO CON CHECK --- */}
                            <button 
                                onClick={handleCopyToken} 
                                className={`p-2 rounded transition-colors ${copied ? 'text-green-400 bg-green-400/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                title="Copiar Token"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-400" /> Control Remoto de Servicio
                            </span>
                        </div>
                         <p className="text-xs text-gray-500 mb-4">
                            Esta acción actualiza la base de datos maestra de 128 Brand.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={handleToggleStatus} type="button" className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${isActive ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                {isActive ? <><Power className="w-4 h-4 mr-2" /> Pausar Servicio</> : <><RefreshCw className="w-4 h-4 mr-2" /> Reanudar Servicio</>}
                            </button>
                        </div>
                    </div>
                    {!isPremium && (
                        <div className="border-t border-white/10 pt-6">
                            <button onClick={onUpgrade} className="w-full py-4 bg-gradient-to-r from-brand-accent to-purple-600 rounded-xl font-bold text-white shadow-lg flex items-center justify-center hover:scale-[1.02] transition-transform group">
                                <CreditCard className="w-5 h-5 mr-2" /> Suscripción Premium ({product.price})
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD ---
interface DashboardProps {
    user: any; 
    onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'marketplace'>('overview'); 
    const [marketplaceProducts, setMarketplaceProducts] = useState<SaasProduct[]>(SAAS_PRODUCTS);
    const userId = user.uid;
    const isAdminDemo = userId === 'admin_demo_user';
    const isClientDemo = userId === 'client_demo_user';

    const [myServices, setMyServices] = useState<SaasProduct[]>(() => {
        try {
            const saved = localStorage.getItem(`services_${userId}`);
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });
    
    const [selectedProduct, setSelectedProduct] = useState<SaasProduct | null>(null);
    const [viewMode, setViewMode] = useState<'dashboard' | 'offer' | 'manage' | 'upgrade'>('dashboard');
    const [isProvisioning, setIsProvisioning] = useState(false);
    const [triedProductIds, setTriedProductIds] = useState<string[]>([]);
    const [isOffline, setIsOffline] = useState(true);

    const isAccountOfferExpired = () => {
        if (!user?.metadata?.creationTime) return false;
        const created = new Date(user.metadata.creationTime).getTime();
        const now = Date.now();
        const hoursDiff = (now - created) / (1000 * 60 * 60);
        return hoursDiff > 72;
    };

    const offerExpired = isAccountOfferExpired();

    useEffect(() => {
        if (isAdminDemo && myServices.length === 0) {
            const demoService = { ...SAAS_PRODUCTS[0], status: 'active', token: 'admin_master_token_128', trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() } as SaasProduct;
            setMyServices([demoService]);
            setIsOffline(true);
            return;
        }
        if (isClientDemo) { setIsOffline(true); return; }

        const initFirestore = async () => {
            try {
                if (isAdminDemo || isClientDemo) return;
                await getDocs(collection(db, 'products')); 
                setIsOffline(false);
            } catch (error: any) { setIsOffline(true); }
        };
        initFirestore();
    }, [userId, isAdminDemo, isClientDemo]);

    useEffect(() => {
        const fetchTriedProducts = async () => {
            if (!user || isAdminDemo || isClientDemo) {
                if (isAdminDemo || isClientDemo) setTriedProductIds([]);
                return;
            }
            try {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setTriedProductIds(userData.triedProducts || []);
                }
            } catch (error) { console.error("Error al cargar historial del usuario:", error); }
        };
        fetchTriedProducts();
    }, [user, userId, isAdminDemo, isClientDemo]);

    const handleProductClick = (product: SaasProduct) => {
        const ownedProduct = myServices.find(s => s.id === product.id);
        
        if (ownedProduct) {
            if (isAdminDemo) {
                const token = ownedProduct.token || 'admin_token';
                const url = ownedProduct.serviceUrl || "https://service-128brand-ai-chatbot-saas.web.app";
                window.open(`${url}?token=${token}`, '_blank');
                return;
            }
            setSelectedProduct(ownedProduct);
            setViewMode('manage');
        } else {
            if (triedProductIds.includes(product.id)) {
                setSelectedProduct(product);
                setViewMode('upgrade'); 
            } else {
                setSelectedProduct(product);
                setViewMode('offer');
            }
        }
    };

    const activateTrial = async () => {
        if (!selectedProduct) return;
        
        if (isAccountOfferExpired()) {
            alert("La oferta de prueba gratuita ha expirado para tu cuenta.");
            return;
        }

        const userEmail = user?.email;
        if (!userEmail) { alert("Error: No se detectó un email válido en tu sesión."); return; }
    
        setIsProvisioning(true);

        try {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            
            if (!userSnap.exists()) {
                await setDoc(userRef, { uid: userId, email: userEmail, role: 'client', triedProducts: [] });
            } else {
                const userData = userSnap.data();
                if (userData.triedProducts && userData.triedProducts.includes(selectedProduct.id)) {
                    setIsProvisioning(false);
                    alert("🚫 Ya has disfrutado de la prueba gratuita. Redirigiendo a planes de pago.");
                    setViewMode('upgrade'); 
                    return; 
                }
            }

            const mockToken = `128-${userId.substring(0, 5)}-${Date.now().toString(36)}`;

            // --- LLAMADA API CRÍTICA CORREGIDA ---
            // Si la API falla (por ejemplo, CORS o error 500), lanzamos error y vamos al CATCH.
            // Esto evita que se cree el token falso.
            const apiResponse = await fetch(SAAS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${AGENCY_SECRET_KEY}` },
                body: JSON.stringify({ 
                    token: mockToken, 
                    email: userEmail, 
                    plan: 'trial_7_days', 
                    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() 
                })
            });

            if (!apiResponse.ok) {
                // Forzamos el error para que salte al bloque catch de abajo
                throw new Error(`Error del servidor externo (${apiResponse.status}). Posible bloqueo CORS.`);
            }
            // -------------------------------------
    
            const newService = { ...selectedProduct, status: 'active', deployedAt: new Date().toISOString(), token: mockToken, trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() } as SaasProduct;
            const updatedServices = [...myServices, newService];
            setMyServices(updatedServices);
            localStorage.setItem(`services_${userId}`, JSON.stringify(updatedServices));
            setTriedProductIds(prev => [...prev, selectedProduct.id]);
    
            await setDoc(doc(db, "licenses", mockToken), { userId: userId, productId: selectedProduct.id, status: 'active', createdAt: new Date(), trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), plan: 'trial', userEmail: userEmail });
            await setDoc(userRef, { triedProducts: arrayUnion(selectedProduct.id) }, { merge: true });
    
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsProvisioning(false);
            setSelectedProduct(newService);
            setViewMode('manage');

        } catch (error: any) {
            console.error("❌ ERROR CRÍTICO DE APROVISIONAMIENTO:", error);
            setIsProvisioning(false);
            // Mensaje informativo real para el usuario
            alert(`⚠️ No se pudo conectar con el servidor de licencias.\n\nEl servidor externo está bloqueando la conexión (Error CORS o Red).\n\nMotivo técnico: ${error.message}`);
        }
    };

    const handleUpgradeSuccess = async () => {
        if (!selectedProduct) return;
        const upgradedService = { ...selectedProduct, trialEndsAt: undefined, status: 'active' } as SaasProduct;
        const updatedServices = myServices.map(s => s.id === selectedProduct.id ? upgradedService : s);
        setMyServices(updatedServices);
        localStorage.setItem(`services_${userId}`, JSON.stringify(updatedServices));
        if (selectedProduct.token) {
            try { await updateDoc(doc(db, "licenses", selectedProduct.token), { plan: 'premium_monthly', trialEndsAt: null, updatedAt: new Date(), paymentStatus: 'paid' }); } catch (e) { console.error("Error updating license DB", e); }
        }
        setSelectedProduct(upgradedService);
        setViewMode('manage');
    };

    const handleServiceStatusChange = async (status: 'active' | 'paused') => {
        if (!selectedProduct) return;
        
        if (!selectedProduct.token) {
            alert("Error crítico: La licencia local está corrupta. Por favor, elimina el servicio y vuelve a crearlo.");
            return;
        }
        
        const updatedService = { ...selectedProduct, status };
        const updatedServices = myServices.map(s => s.id === selectedProduct.id ? updatedService : s);
        setMyServices(updatedServices);
        setSelectedProduct(updatedService);
        localStorage.setItem(`services_${userId}`, JSON.stringify(updatedServices));
        
        try { 
            await updateDoc(doc(db, "licenses", selectedProduct.token), { status: status }); 
        } catch (e: any) { 
            console.error("Error updating license in DB", e);
            alert(`Aviso: El estado cambió localmente pero hubo un error de red: ${e.message}`);
        }
    };

    // --- CAMBIO 2: Eliminar servicio -> Llevar al panel principal ---
    const handleDeleteService = async () => {
        if (!selectedProduct || !selectedProduct.token) return;
        const updatedServices = myServices.filter(s => s.id !== selectedProduct.id);
        setMyServices(updatedServices);
        localStorage.setItem(`services_${userId}`, JSON.stringify(updatedServices));
        try { await deleteDoc(doc(db, "licenses", selectedProduct.token)); } catch (e) { console.error("Error deleting license from DB", e); }
        
        // RESETEAR ESTADO PARA VOLVER A LA LISTA
        setViewMode('dashboard');
        setSelectedProduct(null);
        setActiveTab('overview'); // Asegurarnos de ir a la pestaña principal
    };

    return (
        <div className="flex h-screen bg-[#030014] overflow-hidden relative">
            {viewMode === 'offer' && selectedProduct && (
                <OfferPage 
                    product={selectedProduct} 
                    onActivateTrial={activateTrial}
                    onClose={() => { setViewMode('dashboard'); setSelectedProduct(null); }}
                    isProvisioning={isProvisioning}
                    userCreationTime={user?.metadata?.creationTime}
                />
            )}
            {viewMode === 'upgrade' && selectedProduct && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in-up">
                    <div className="bg-[#0f0c29] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden h-auto min-h-[500px]">
                        <PaymentGateway 
                            product={selectedProduct}
                            onSuccess={handleUpgradeSuccess}
                            onCancel={() => setViewMode('manage')} // O volver a dashboard si vino directo
                        />
                    </div>
                </div>
            )}
            {viewMode === 'manage' && selectedProduct && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in-up">
                    <div className="bg-[#0f0c29] w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/10 flex flex-col shadow-2xl overflow-hidden relative">
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#1a1a1a]">
                            <div className="flex items-center space-x-4">
                                <div className="bg-brand-accent/20 p-3 rounded-lg text-brand-accent"><Bot className="w-6 h-6" /></div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{selectedProduct.name}</h3>
                                    <div className={`flex items-center gap-2 mt-1 ${selectedProduct.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                                        <span className={`w-2 h-2 rounded-full ${selectedProduct.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                        <span className="text-xs uppercase font-bold tracking-wider">{selectedProduct.status === 'active' ? 'Servicio Activo' : 'Pausado'}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => { setViewMode('dashboard'); setSelectedProduct(null); }} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400 hover:text-white" /></button>
                        </div>
                        <div className="flex-1 bg-grid-white/[0.02] overflow-y-auto">
                            <ConfigPanel product={selectedProduct} userId={userId} onStatusChange={handleServiceStatusChange} onDelete={handleDeleteService} onUpgrade={() => setViewMode('upgrade')} isPremium={!selectedProduct.trialEndsAt} />
                        </div>
                    </div>
                </div>
            )}

            <aside className="w-64 border-r border-white/10 bg-[#0a0a0a] flex flex-col hidden md:flex">
                <div className="p-6 flex items-center space-x-3 border-b border-white/5"><div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center font-bold text-white">128</div><span className="font-bold text-white tracking-wider">PLATFORM</span></div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}><LayoutDashboard className="w-5 h-5" /><span>Mis Despliegues</span></button>
                    <button onClick={() => setActiveTab('marketplace')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'marketplace' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}><ShoppingBag className="w-5 h-5" /><span>Marketplace</span></button>
                </nav>
                <div className="p-4 border-t border-white/10"><button onClick={onLogout} className="w-full flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 text-sm py-2 bg-red-400/5 rounded-lg transition-colors"><LogOut className="w-4 h-4" /><span>Cerrar Sesión</span></button></div>
            </aside>

            <main className="flex-1 overflow-y-auto relative">
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#030014]/80 backdrop-blur-md sticky top-0 z-20">
                    <h1 className="text-xl font-bold text-white capitalize">{activeTab === 'overview' ? 'Panel Principal' : 'Catálogo de Soluciones'}</h1>
                    <div className={`flex items-center space-x-2 text-sm px-3 py-1 rounded-full border ${isOffline ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-green-400 bg-green-400/10 border-green-400/20'}`}>{isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}<span>{isAdminDemo ? 'Admin Demo' : (isOffline ? 'Offline' : 'Online')}</span></div>
                </header>

                <div className="p-8">
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-[#0f0c29] border border-white/10 p-6 rounded-2xl"><p className="text-gray-400 text-sm">Servicios Activos</p><h3 className="text-3xl font-bold text-white mt-2">{myServices.length}</h3></div>
                                <div className="bg-[#0f0c29] border border-white/10 p-6 rounded-2xl"><p className="text-gray-400 text-sm">Inversión Mensual</p><h3 className="text-3xl font-bold text-white mt-2">{myServices.some(s => !s.trialEndsAt) ? '€350' : '€0'}<span className="text-xs text-gray-500 font-normal"> {myServices.some(s => !s.trialEndsAt) ? ' + IVA (Premium Activo)' : ' (Periodo Prueba)'}</span></h3></div>
                            </div>
                            <h2 className="text-lg font-bold text-white flex items-center"><Server className="w-5 h-5 mr-2 text-brand-accent" /> Infraestructura</h2>
                            {myServices.length === 0 ? (
                                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/5"><p className="text-gray-400 mb-4">No tienes servicios activos.</p><button onClick={() => setActiveTab('marketplace')} className="px-6 py-2 bg-brand-accent rounded-lg text-white font-bold">Ir al Marketplace</button></div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {myServices.map((service, idx) => {
                                        const Icon = IconMap[service.iconName] || Server;
                                        const isPaused = service.status !== 'active';
                                        const isPremium = !service.trialEndsAt;
                                        return (
                                            <div key={service.id + idx} className={`border rounded-2xl p-6 relative overflow-hidden group transition-all ${isPaused ? 'bg-red-500/5 border-red-500/20 opacity-70' : 'bg-[#1a1a1a] border-white/10'}`}>
                                                <div className="absolute top-4 right-4 flex items-center space-x-2"><span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span><span className={`text-xs font-medium uppercase ${isPaused ? 'text-red-500' : 'text-green-500'}`}>{service.status}</span></div>
                                                <div className="flex justify-between items-start mb-4"><div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white"><Icon className="w-6 h-6" /></div>{isPremium && <div className="bg-brand-neon/10 text-brand-neon px-2 py-1 rounded text-xs font-bold border border-brand-neon/20">PRO</div>}</div>
                                                <h3 className="text-xl font-bold text-white">{service.name}</h3>
                                                <p className="text-sm text-gray-400 mt-2 mb-6">{service.description.substring(0, 100)}...</p>
                                                <button onClick={() => handleProductClick(service)} className="text-sm text-brand-accent hover:text-white flex items-center transition-colors cursor-pointer">Gestionar <ArrowUpRight className="w-3 h-3 ml-1" /></button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'marketplace' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Marketplace</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {marketplaceProducts.map((product) => {
                                    const isOwned = myServices.some(s => s.name === product.name);
                                    const Icon = IconMap[product.iconName] || Server;
                                    const hasTried = triedProductIds.includes(product.id);

                                    return (
                                        <div key={product.id} className="bg-[#121212] border border-white/5 rounded-2xl p-6 hover:border-brand-accent/30 transition-all group flex flex-col">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white shadow-lg"><Icon className="w-6 h-6" /></div>
                                                <span className="bg-white/5 text-white px-3 py-1 rounded-full text-xs font-bold">{product.category}</span>
                                            </div>
                                            
                                            {/* Countdown in card - ONLY IF NOT TRIED AND NOT EXPIRED */}
                                            {!hasTried && !offerExpired && (
                                                <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-2 flex items-center justify-center gap-2">
                                                    <Timer className="w-3 h-3 text-red-500 animate-pulse"/>
                                                    <span className="text-xs text-red-400 font-bold uppercase tracking-wide">Oferta 72h</span>
                                                </div>
                                            )}

                                            <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                                            <p className="text-gray-400 text-sm mb-6 min-h-[60px]">{product.description.substring(0, 120)}...</p>
                                            <div className="mt-auto space-y-3">
                                                <div className="flex flex-col gap-1">
                                                    {!hasTried ? (
                                                        <>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-2xl font-bold text-white">€0</span>
                                                                <span className="text-xs text-brand-neon font-bold ml-2">7 días GRATIS</span>
                                                            </div>
                                                            <div className="text-xs text-gray-400 font-medium">Luego <span className="text-white font-bold">{product.price}</span></div>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-2xl font-bold text-white">{product.price}</span>
                                                            <span className="text-xs text-gray-400 font-bold ml-2"></span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 gap-2 pt-2">
                                                    {isOwned ? (
                                                        <button onClick={() => handleProductClick(product)} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-bold flex items-center justify-center border border-green-500/20"><CheckCircle2 className="w-4 h-4 mr-2" /> Gestionar</button>
                                                    ) : (
                                                        <button onClick={() => handleProductClick(product)} className="px-4 py-2 bg-brand-accent text-white rounded-lg text-sm font-bold hover:bg-brand-accent/90 transition-colors flex items-center justify-center shadow-lg shadow-brand-accent/20">
                                                            <Gift className="w-4 h-4 mr-2" /> {hasTried ? 'Contratar Servicio' : 'Probar Gratis'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
