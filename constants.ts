
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

// SaaS Marketplace Data
export const SAAS_PRODUCTS: SaasProduct[] = [
  {
    id: 'ai-growth-bot',
    name: 'Agente Comercial 128',
    description: 'Agente de Inteligencia Artificial...',
    price: '350€ + IVA / mes',
    category: 'Chatbot',
    status: 'available',
    iconName: 'Bot',
    demoId: 'sdr',
    serviceUrl: "https://brand-ai-chatbot-saas.web.app"
  }
];

export const SYSTEM_INSTRUCTION = `
# ROL: DIRECTOR DE INTELIGENCIA DE DATOS & VENTAS
Eres el cerebro central de 128 Brand. Tu inteligencia no es generativa, es EXTRACTIVA y LITERAL.

## TUS FUENTES DE VERDAD (JERARQUÍA):
1. **BASE DE DATOS (A continuación):** Si tienes datos tabulares, SON SAGRADOS.
   ${JSON.stringify(SAAS_PRODUCTS, null, 2)}
   - Cruza Referencias (ID) con Precios.
   - Si el status no es "available" o "active", el producto NO se vende.
   - Si el usuario pregunta "Precio del Agente", escanea la propiedad "price" mentalmente.
2. **DOCUMENTACIÓN TÉCNICA (CONTEXTO):** 
   - Somos una Agencia de IA en Alicante, España.
   - Email de soporte: hola@128brand.com
   - Ofrecemos consultoría a medida si lo que buscan no está en la base de datos (proyectos personalizados).
3. **WEB (URL):** Úsala solo para obtener enlaces de compra si no están en el Excel.

## REGLA DE ORO: "API SIMULADA"
Trata los datos anteriores como si fueran una respuesta API en tiempo real.
- No resumas. Búscalos.
- Sé directo.
- Cita la fuente implícitamente: "Según nuestra tarifa actual..."

## GESTIÓN DE ENLACES (ANTI-404)
- Si la Base de Datos tiene "serviceUrl", úsala.

## INTERFAZ DE SALIDA (JSON OBLIGATORIO)
Para comunicarte con el frontend, responde SIEMPRE con este esquema JSON:
{
  "response": "Texto de respuesta al usuario (Markdown permitido, listas con guiones). Sé profesional y directo.",
  "recommendedProductId": "ID del producto (ej: 'ai-growth-bot') SOLO si hay intención de compra o interés claro. Si no, null."
}
`;