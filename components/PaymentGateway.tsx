import React, { useState } from 'react';
import { Loader2, CreditCard, ShieldCheck, CheckCircle2, Lock, Store } from 'lucide-react';
import { SaasProduct } from '../types';

interface PaymentGatewayProps {
    product: SaasProduct;
    merchantName?: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ product, merchantName = "128 Brand Platform", onSuccess, onCancel }) => {
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
    
    // Form State
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardNumber || !expiry || !cvc) return;

        setStep('processing');
        setProcessing(true);

        // Simulate Stripe API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        setProcessing(false);
        setStep('success');

        // Auto close after success
        setTimeout(() => {
            onSuccess();
        }, 1500);
    };

    // Format card number visually
    const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        val = val.match(/.{1,4}/g)?.join(' ') || val;
        setCardNumber(val);
    };

    if (step === 'success') {
        return (
            <div className="h-full flex flex-col items-center justify-center animate-fade-in-up text-center p-8">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Pago Realizado!</h3>
                <p className="text-gray-400">Desplegando tu instancia privada...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="bg-gradient-to-r from-brand-accent/20 to-blue-900/20 p-6 border-b border-white/10">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-brand-neon tracking-widest uppercase">Suscripción Mensual</span>
                    <div className="flex items-center text-xs text-gray-400 bg-black/20 px-2 py-1 rounded">
                        <Store className="w-3 h-3 mr-1" />
                        Pagando a: <span className="text-white font-bold ml-1">{merchantName}</span>
                    </div>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-xl font-bold text-white">{product.name}</h3>
                        <p className="text-sm text-gray-400">{product.description.substring(0, 40)}...</p>
                    </div>
                    <div className="text-2xl font-bold text-white">{product.price}</div>
                </div>
            </div>

            <div className="flex-1 p-6 flex items-center justify-center">
                {step === 'processing' ? (
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-brand-accent/20 blur-xl rounded-full"></div>
                            <Loader2 className="w-16 h-16 text-brand-accent animate-spin relative z-10" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Procesando pago seguro...</h4>
                        <p className="text-sm text-gray-500">Conectando con {merchantName} Bank Gateway</p>
                    </div>
                ) : (
                    <form onSubmit={handlePay} className="space-y-6 w-full max-w-md mx-auto">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Titular de la tarjeta</label>
                            <input type="text" placeholder="NOMBRE APELLIDOS" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-brand-accent outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Número de Tarjeta</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input 
                                    type="text" 
                                    value={cardNumber}
                                    onChange={handleCardInput}
                                    placeholder="0000 0000 0000 0000" 
                                    className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm font-mono focus:border-brand-accent outline-none" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Expiración</label>
                                <input 
                                    type="text" 
                                    value={expiry}
                                    onChange={e => setExpiry(e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').substring(0,5))}
                                    placeholder="MM/YY" 
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-mono focus:border-brand-accent outline-none" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">CVC</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                        type="text" 
                                        value={cvc}
                                        onChange={e => setCvc(e.target.value.replace(/\D/g, '').substring(0,3))}
                                        placeholder="123" 
                                        className="w-full bg-black/30 border border-white/10 rounded-lg pl-9 pr-4 py-3 text-white text-sm font-mono focus:border-brand-accent outline-none" 
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={!cardNumber || !expiry || !cvc}
                            className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-accent/20 flex items-center justify-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Pagar {product.price}
                        </button>
                        
                        <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-500">
                            <Lock className="w-3 h-3" />
                            <span>Pagos encriptados SSL de 256-bits. Powered by Stripe.</span>
                        </div>
                    </form>
                )}
            </div>
            
            <div className="p-4 border-t border-white/10 bg-[#050505]">
                <button onClick={onCancel} disabled={processing} className="w-full text-gray-400 hover:text-white text-sm py-2">
                    Cancelar y volver
                </button>
            </div>
        </div>
    );
};