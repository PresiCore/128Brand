import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Inicializar Admin SDK
if (admin.apps.length === 0) {
    admin.initializeApp();
}

// --- CONFIGURACIÓN SMTP ---
// Lee las variables del archivo .env
const email = process.env.SMTP_EMAIL;
const password = process.env.SMTP_PASSWORD;

const DASHBOARD_URL = "https://128brand.com";

// --- HELPERS ---
// Crear el transporter DENTRO de la función para asegurar que lee las variables frescas
const createTransporter = () => {
    if (!email || !password) {
        console.error("❌ ERROR CRÍTICO: No se han leído las variables de entorno (.env). Email:", email);
        return null;
    }
    return nodemailer.createTransport({
        host: "128brand-com.correoseguro.dinaserver.com",
        port: 465,
        secure: true,
        auth: { user: email, pass: password },
    });
};

const sendEmailHelper = async (to: string, subject: string, html: string) => {
  const transporter = createTransporter();
  if (!transporter) throw new Error("Servidor de correo no configurado (Variables de entorno faltantes).");
  
  return transporter.sendMail({
    from: `"128 Brand" <${email}>`,
    to,
    subject,
    html,
  });
};

// 1. TRIGGER: NUEVO USUARIO REGISTRADO
export const onUserCreated = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data.email) return null;

    const html = `<h1>Bienvenido a 128 Brand</h1><p>Hola ${data.name || 'Cliente'}, tu cuenta ha sido creada.</p><a href="${DASHBOARD_URL}">Ir al Dashboard</a>`;
    
    try {
        await sendEmailHelper(data.email, "Bienvenido a 128 Brand", html);
    } catch (error) {
        console.error("Error welcome email:", error);
    }
    return null;
  });

// 2. TRIGGER: NUEVA LICENCIA (TRIAL)
export const onLicenseCreated = functions.firestore
  .document("licenses/{licenseId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const userEmail = data.userEmail;
    if (!userEmail) return null;

    const html = `<h1>Licencia Activada</h1><p>Token: <b>${context.params.licenseId}</b></p>`;
    
    try {
        await sendEmailHelper(userEmail, "🚀 Tu Instancia de IA está lista", html);
    } catch (error) {
        console.error("Error trial email:", error);
    }
    return null;
  });

// 3. TRIGGER: ACTUALIZACIÓN A PREMIUM
export const onLicenseUpdated = functions.firestore
    .document("licenses/{licenseId}")
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const oldData = change.before.data();
        
        if (oldData.trialEndsAt && !newData.trialEndsAt) {
             if (newData.userEmail) {
                await sendEmailHelper(newData.userEmail, "💎 Eres Premium", "<h1>Pago Confirmado</h1><p>Gracias por confiar en 128 Brand.</p>");
             }
        }
        return null;
    });

// 4. FUNCION HTTPS: FORMULARIO DE CONTACTO (DEBUG VERSION)
export const sendContactEmail = functions.https.onCall(async (data, context) => {
    console.log("1. Función sendContactEmail iniciada.");
    console.log("   - Datos recibidos:", JSON.stringify(data));

    const { name, company, email: clientEmail, message } = data;

    // Validación
    if (!name || !clientEmail || !message) {
        console.warn("2. Validación fallida: Faltan datos.");
        throw new functions.https.HttpsError('invalid-argument', 'Faltan datos requeridos.');
    }

    const transporter = createTransporter();
    if (!transporter) {
        throw new functions.https.HttpsError('internal', 'Error de configuración del servidor (Credenciales).');
    }

    // Verificar conexión SMTP antes de enviar
    try {
        console.log("3. Verificando conexión con Dinahosting...");
        await transporter.verify();
        console.log("4. Conexión SMTP: OK ✅");
    } catch (error: any) {
        console.error("❌ ERROR CONEXIÓN SMTP:", error);
        throw new functions.https.HttpsError('internal', `No se pudo conectar al correo: ${error.message}`);
    }

    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Nuevo Mensaje de ${name}</h2>
        <p>Email Cliente: ${clientEmail}</p>
        <p>Mensaje: ${message}</p>
    </div>
    `;

    try {
        console.log("5. Intentando enviar email...");
        const info = await transporter.sendMail({
            from: `"Formulario Web" <${email}>`,
            to: "hola@128brand.com",       // <--- Destino Corporativo
            cc: "ivancorebrand@gmail.com", // <--- Copia Seguridad
            replyTo: clientEmail,
            subject: `🔔 Lead: ${name}`,
            html: html
        });

        console.log("6. Email enviado correctamente. ID:", info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error: any) {
        console.error("❌ ERROR AL ENVIAR:", error);
        throw new functions.https.HttpsError('internal', `Error enviando: ${error.message}`);
    }
});