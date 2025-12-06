
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, ShieldCheck, CheckCircle2, Lock, Store, AlertCircle, CreditCard } from 'lucide-react';
import { SaasProduct } from '../types';

// Initialize Stripe with the provided Test Key
const stripePromise = loadStripe('pk_test_51RBYJ6GbYnUr8PJuaQUsH6DkNyPgUEteUhHVug5IpjnWNdd42pq3Vac1TdEk8wEOeaVhuq6lDNBshEs6VK9jfOB800uVqEQafy');

interface PaymentGatewayProps {
    product: SaasProduct;
    merchantName?: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const CheckoutForm: React.FC<{ product: SaasProduct; onSuccess: () => void }> = ({ product, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [cardHolder, setCardHolder] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (!cardHolder.trim()) {
            setError('Por favor, introduce el nombre del titular.');
            return;
        }

        setProcessing(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        // Create Payment Method
        // This validates the card details with Stripe securely
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: cardHolder,
            },
        });

        if (error) {
            console.error('[error]', error);
            setError(error.message || 'Error al procesar el pago. Revisa los datos.');
            setProcessing(false);
        } else {
            console.log('[PaymentMethod Created]', paymentMethod);
            // In a full backend implementation, you would send paymentMethod.id to your server here.
            // For this setup, we treat a valid card token as a success trigger.
            
            // Simulate processing delay for UX
            setTimeout(() => {
                setProcessing(false);
                onSuccess();
            }, 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto relative z-10">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Titular de la tarjeta</label>
                <input 
                    type="text" 
                    placeholder="NOMBRE APELLIDOS" 
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-colors placeholder-gray-600"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Datos de Tarjeta</label>
                <div className="bg-black/40 border border-white/10 rounded-lg p-4 focus-within:border-brand-accent focus-within:ring-1 focus-within:ring-brand-accent transition-all">
                    <CardElement 
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#ffffff',
                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                    '::placeholder': {
                                        color: '#6b7280',
                                    },
                                    iconColor: '#b0fb5d', // brand-neon
                                },
                                invalid: {
                                    color: '#ef4444',
                                    iconColor: '#ef4444',
                                },
                            },
                            hidePostalCode: true, 
                        }} 
                    />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20 animate-fade-in-up">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <button 
                type="submit" 
                disabled={!stripe || processing}
                className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-accent/20 flex items-center justify-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden relative"
            >
                {processing ? (
                    <div className="flex items-center gap-2">
                         <Loader2 className="animate-spin w-5 h-5" />
                         <span>Procesando pago...</span>
                    </div>
                ) : (
                    <span className="flex items-center gap-2 relative z-10">
                        Confirmar Pago {product.price}
                        <ShieldCheck className="w-5 h-5 group-hover:text-brand-neon transition-colors" />
                    </span>
                )}
            </button>
            
            <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-500 pt-2">
                <Lock className="w-3 h-3" />
                <span>Pagos encriptados SSL. Procesado seguro por Stripe.</span>
            </div>
        </form>
    );
};

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ product, merchantName = "128 Brand", onSuccess, onCancel }) => {
    const [success, setSuccess] = useState(false);

    const handleSuccess = () => {
        setSuccess(true);
        setTimeout(onSuccess, 2000);
    };

    if (success) {
        return (
            <div className="h-full flex flex-col items-center justify-center animate-fade-in-up text-center p-8 bg-[#0f0c29]">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-pop-in">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">¡Pago Realizado!</h3>
                <p className="text-gray-300 text-lg">Tu licencia ha sido actualizada a Premium.</p>
                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Redirigiendo al panel...
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#0f0c29]">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0c29] p-8 border-b border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl"></div>
                
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="flex items-center gap-2 text-brand-neon">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-xs font-black tracking-widest uppercase">Pasarela Segura 128-BIT</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                        <Store className="w-3 h-3 mr-1.5" />
                        Merchant: <span className="text-white font-bold ml-1">{merchantName}</span>
                    </div>
                </div>
                
                <div className="flex justify-between items-end relative z-10">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{product.name}</h3>
                        <div className="flex items-center gap-2">
                             <span className="bg-brand-accent text-white text-[10px] font-bold px-2 py-0.5 rounded">PREMIUM</span>
                             <p className="text-sm text-gray-400">Licencia Mensual Recurrente</p>
                        </div>
                    </div>
                    <div className="text-right">
                         <p className="text-xs text-gray-500 mb-1">Total a pagar</p>
                         <div className="text-3xl font-bold text-white tracking-tight">{product.price}</div>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="flex-1 p-6 md:p-8 flex items-center justify-center bg-grid-white/[0.02] relative">
                <Elements stripe={stripePromise}>
                    <CheckoutForm product={product} onSuccess={handleSuccess} />
                </Elements>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-[#050505] flex justify-center">
                <button onClick={onCancel} className="text-gray-500 hover:text-white text-sm py-2 px-4 transition-colors font-medium">
                    Cancelar transacción
                </button>
            </div>
        </div>
    );
};