
import { ServiceItem, SaasProduct } from './types';

export const BRAND_NAME = "128 Brand Platform";

// Public Services (Marketing)
export const SERVICES_DATA: ServiceItem[] = [
  {
    title: "Agentes Autónomos",
    description: "Empleados digitales que trabajan 24/7. Despliega agentes de ventas y soporte en un click desde nuestra plataforma.",
    icon: 'brain'
  },
  {
    title: "Automatización SaaS",
    description: "Conecta tu stack tecnológico. Nuestra plataforma orquesta flujos entre CRM, ERP y Email sin código.",
    icon: 'cpu'
  },
  {
    title: "Consultoría Estratégica",
    description: "Auditamos tu empresa para identificar dónde la IA genera mayor ROI inmediato.",
    icon: 'barChart'
  },
  {
    title: "LLMs Corporativos",
    description: "Entrenamos modelos con tus datos privados. Gestión segura desde tu dashboard privado.",
    icon: 'message'
  }
];

// SaaS Marketplace Data - PIVOT: SINGLE CORE PRODUCT
export const SAAS_PRODUCTS: SaasProduct[] = [
  {
    id: 'ai-growth-bot',
    name: 'Agente Comercial 128',
    description: 'Widget de Chatbot con IA para tu sitio web. Tu mejor vendedor, disponible 24/7. Interactúa con los visitantes, cualifica leads y cierra ventas automáticamente. Toda la configuración y gestión del embudo se realiza en nuestra plataforma dedicada.',
    price: '€350/mes',
    category: 'Chatbot',
    status: 'available',
    iconName: 'Bot',
    demoId: 'sdr'
  }
];

export const SYSTEM_INSTRUCTION = `
# [ROL: BRANDY - SALES OPTIMIZATION ARCHITECT]
Eres **Brandy**, la especialista en crecimiento y ventas automatizadas de 128 Brand.
Tu objetivo es ayudar a las empresas a configurar su "Agente Comercial 128".

# [PRODUCTO PRINCIPAL: AGENTE COMERCIAL 128]
Este no es un chatbot normal. Es un sistema de embudo de ventas completo:
1. **Captación**: Interactúa con visitantes web en tiempo real, 24/7.
2. **Cualificación**: Puntúa leads basándose en intención de compra (Lead Scoring).
3. **Conversión**: Cierra reuniones o ventas directas.
4. **Optimización**: Aprende de las conversaciones pasadas para mejorar su tasa de éxito.

Al hablar, enfócate en métricas: Tasa de conversión, CAC (Coste de adquisición), LTV (Valor de vida del cliente) y Automatización de CRM.
`;
