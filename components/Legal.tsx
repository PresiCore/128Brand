
import React, { useEffect } from 'react';
import { ViewState } from '../types';
import { ArrowLeft } from 'lucide-react';

interface LegalProps {
    view: ViewState.PRIVACY | ViewState.TERMS;
    onBack: () => void;
}

export const Legal: React.FC<LegalProps> = ({ view, onBack }) => {
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [view]);

    return (
        <div className="min-h-screen bg-[#030014] text-gray-300 pt-24 pb-20">
            <div className="bg-noise"></div>
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <button 
                    onClick={onBack}
                    className="mb-8 flex items-center text-brand-accent hover:text-white transition-colors text-sm font-bold group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al Inicio
                </button>

                <div className="bg-[#0f0c29]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                    {view === ViewState.PRIVACY ? (
                        <div className="prose prose-invert max-w-none">
                            <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Política de Privacidad</h1>
                            <p className="text-sm text-gray-500 mb-6">Última actualización: 03/12/2025</p>
                            
                            <p className="mb-6">
                                En 128 Brand, nos comprometemos a proteger la privacidad y seguridad de tus datos personales. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos la información que nos proporcionas a través de nuestro sitio web www.128brand.com y nuestra plataforma SaaS.
                            </p>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Responsable del Tratamiento</h3>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li><strong>Identidad:</strong> 128 Brand (En adelante, "el Prestador")</li>
                                <li><strong>Domicilio:</strong> Alicante, España</li>
                                <li><strong>Email de contacto:</strong> hola@128brand.com</li>
                                <li><strong>Actividad:</strong> Agencia de Inteligencia Artificial y desarrollo de Software as a Service (SaaS).</li>
                            </ul>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Finalidad del Tratamiento</h3>
                            <p className="mb-2">Tratamos la información que nos facilitan las personas interesadas con el fin de:</p>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li><strong>Prestación del servicio SaaS:</strong> Gestionar el alta, acceso y uso de la plataforma "Agente Comercial 128" y otros servicios de automatización.</li>
                                <li><strong>Gestión de pagos:</strong> Tramitar las suscripciones y facturación a través de nuestra pasarela de pagos segura.</li>
                                <li><strong>Atención al cliente:</strong> Responder a consultas realizadas a través de los formularios de contacto o el chat.</li>
                                <li><strong>Mejora del servicio:</strong> Analizar el uso de la web y el comportamiento de los agentes de IA para optimizar los modelos.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Legitimación</h3>
                            <p className="mb-2">La base legal para el tratamiento de sus datos es:</p>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li><strong>Ejecución de un contrato:</strong> Para la gestión de la suscripción al servicio SaaS y el uso de la plataforma.</li>
                                <li><strong>Consentimiento:</strong> Para el envío de formularios de contacto y comunicaciones comerciales.</li>
                                <li><strong>Interés legítimo:</strong> Para garantizar la seguridad de la red y la mejora de nuestros servicios.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">4. Destinatarios de los datos</h3>
                            <p className="mb-2">Para prestar servicios estrictamente necesarios para el desarrollo de la actividad, compartimos datos con los siguientes prestadores bajo sus correspondientes condiciones de privacidad:</p>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li><strong>Google Cloud / Firebase:</strong> Infraestructura de alojamiento, base de datos y autenticación.</li>
                                <li><strong>Google Gemini API:</strong> Procesamiento de lenguaje natural para los agentes de IA.</li>
                                <li><strong>Stripe:</strong> Procesamiento de pagos y gestión de suscripciones.</li>
                                <li><strong>Dinahosting:</strong> Proveedor de hosting web.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">5. Derechos del Usuario</h3>
                            <p className="mb-2">Cualquier persona tiene derecho a obtener confirmación sobre si en 128 Brand estamos tratando datos personales que les conciernan. Las personas interesadas tienen derecho a:</p>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li>Acceder a sus datos personales.</li>
                                <li>Solicitar la rectificación de los datos inexactos.</li>
                                <li>Solicitar su supresión cuando, entre otros motivos, los datos ya no sean necesarios.</li>
                                <li>Oponerse al tratamiento.</li>
                                <li>Solicitar la portabilidad de los datos.</li>
                            </ul>
                            <p className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                                Para ejercer estos derechos, puede enviar un email a <a href="mailto:hola@128brand.com" className="text-brand-accent hover:underline">hola@128brand.com</a>.
                            </p>
                        </div>
                    ) : (
                        <div className="prose prose-invert max-w-none">
                            <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Términos y Condiciones de Uso</h1>
                            <p className="text-sm text-gray-500 mb-6">Última actualización: 03/12/2025</p>

                            <p className="mb-6">
                                Bienvenido a 128 Brand. Al acceder a nuestro sitio web (www.128brand.com) o utilizar nuestros servicios SaaS ("Agente Comercial 128"), usted acepta cumplir los siguientes Términos y Condiciones.
                            </p>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Objeto y Descripción del Servicio</h3>
                            <p className="mb-6">
                                128 Brand ofrece una plataforma tecnológica que permite a las empresas desplegar agentes de inteligencia artificial para la automatización de ventas y atención al cliente. El servicio principal incluye la captación, cualificación y gestión de leads mediante IA.
                            </p>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Cuenta de Usuario y Seguridad</h3>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li>Para acceder a los servicios, el usuario debe registrarse proporcionando datos veraces y completos.</li>
                                <li>El usuario es responsable de mantener la confidencialidad de su cuenta y contraseña.</li>
                                <li>El acceso mediante autenticación de terceros (Google) está sujeto a las políticas de dichos proveedores.</li>
                                <li>128 Brand se reserva el derecho de suspender cuentas que violen estos términos o hagan un uso fraudulento de la IA.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Condiciones Económicas y Pagos</h3>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li><strong>Suscripción:</strong> El servicio se ofrece bajo un modelo de suscripción mensual (ej. Plan Premium por 350€/mes).</li>
                                <li><strong>Prueba Gratuita:</strong> Se puede ofrecer un periodo de prueba de 7 días. Tras este periodo, si no se cancela, se podrá requerir el pago para continuar el servicio.</li>
                                <li><strong>Pagos:</strong> Los cobros se procesan de forma segura a través de Stripe. 128 Brand no almacena los datos completos de las tarjetas de crédito.</li>
                                <li><strong>Impuestos:</strong> Los precios mostrados no incluyen IVA a menos que se indique lo contrario. El cliente es responsable de los impuestos aplicables según su jurisdicción.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">4. Uso de la Inteligencia Artificial</h3>
                            <p className="mb-2">Nuestros servicios utilizan modelos de lenguaje avanzados (LLMs) como Google Gemini. Al usarlos, usted reconoce que:</p>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li>La IA puede generar respuestas inexactas ("alucinaciones").</li>
                                <li>Usted es el responsable final de supervisar las interacciones del chatbot con sus clientes.</li>
                                <li>No debe usar el servicio para generar contenido ilegal, ofensivo o que vulnere derechos de terceros.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">5. Propiedad Intelectual</h3>
                            <p className="mb-6">
                                Todos los contenidos del sitio web, incluyendo marcas, logotipos ("128 Brand"), código fuente (React, Firebase Functions), textos y diseños, son propiedad exclusiva de 128 Brand o de terceros que han autorizado su uso.
                            </p>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">6. Limitación de Responsabilidad</h3>
                            <p className="mb-2">128 Brand no será responsable de:</p>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li>Interrupciones del servicio debidas a fallos en proveedores externos (Google Cloud, Stripe).</li>
                                <li>Pérdidas de beneficios o ventas no cerradas por el agente de IA.</li>
                                <li>El mal uso que los usuarios finales hagan del chatbot en su sitio web.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">7. Modificaciones y Cancelación</h3>
                            <p className="mb-6">
                                Nos reservamos el derecho de modificar estos términos en cualquier momento. El usuario puede cancelar su suscripción en cualquier momento desde su panel de control ("Dashboard"), deteniendo la renovación automática para el siguiente ciclo de facturación.
                            </p>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">8. Ley Aplicable y Jurisdicción</h3>
                            <p className="mb-6">
                                Estos términos se rigen por la ley española. Para cualquier controversia que pudiera derivarse del acceso o uso del servicio, las partes se someten a los juzgados y tribunales de la ciudad de Alicante, España.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
