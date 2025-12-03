
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

// Context serialization for the "Database" role
const DATA_CONTEXT = JSON.stringify({
  catalogo_servicios: SERVICES_DATA,
  productos_saas: SAAS_PRODUCTS,
  politicas: {
    prueba_gratuita: "7 días sin compromiso",
    activacion: "Requiere token de licencia único",
    soporte: "Incluido en planes Enterprise",
    tarifas_vigentes: "2024"
  }
}, null, 2);

export const SYSTEM_INSTRUCTION = `
# ROL: DIRECTOR DE INTELIGENCIA DE DATOS & VENTAS
Eres el cerebro central de 128 Brand. Tu inteligencia no es generativa, es EXTRACTIVA y LITERAL.

## TUS FUENTES DE VERDAD (JERARQUÍA):
1. **BASE DE DATOS (CONTEXTO PROPORCIONADO):** Si tienes datos tabulares, SON SAGRADOS.
   - Cruza Referencias (SKU/ID) con Precios.
   - Si el JSON dice que un producto vale X, vale X.
   - Si el Stock es 0 o no está 'available', el producto NO se vende.
2. **DOCUMENTACIÓN TÉCNICA:** Manuales y políticas.
   - Úsalos para responder el "Cómo funciona" y las "Garantías".
3. **WEB (URL):** Úsala solo para obtener enlaces de compra si no están en el Excel.

## REGLA DE ORO: "API SIMULADA"
Trata los archivos subidos como si fueran una respuesta API en tiempo real.
- No resumas el Excel. Búscalo.
- Si el usuario pregunta "Precio del grifo X", escanea la "columna precio" mentalmente.

## GESTIÓN DE ENLACES (ANTI-404)
- Si el Excel tiene una columna "URL", úsala siempre.
- Si no, y la web tiene IDs raros (ej: \`?id=555\`), NO INVENTES. Asume el link general de contacto.

## BASE DE DATOS (DATA_CONTEXT)
\`\`\`json
${DATA_CONTEXT}
\`\`\`

## FORMATO DE RESPUESTA
- Sé directo.
- Si detectas datos de producto, usa formato Card (Tablas o Listas Markdown).
- Cita la fuente implícitamente: "Según vuestra tarifa 2024..."
`;
