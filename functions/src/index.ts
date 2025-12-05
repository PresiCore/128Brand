import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Inicializar Admin SDK
if (admin.apps.length === 0) {
    admin.initializeApp();
}
// (Línea de db borrada para evitar error TS6133)

// --- CONFIGURACIÓN SMTP ---
// Lee las variables del archivo .env
const email = process.env.SMTP_EMAIL;
const password = process.env.SMTP_PASSWORD;

// Inicializar transporter
let transporter: nodemailer.Transporter | null = null;

if (email && password) {
    transporter = nodemailer.createTransport({
        host: "128brand-com.correoseguro.dinaserver.com",
        port: 465,
        secure: true,
        auth: {
            user: email,
            pass: password,
        },
    });
} else {
    console.warn("⚠️ Faltan credenciales SMTP en el archivo .env");
}

const DASHBOARD_URL = "https://128brand.com";

// --- HELPERS ---
const sendEmail = async (to: string, subject: string, html: string) => {
  if (!transporter) throw new Error("Servidor de correo no configurado.");
  
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
        await sendEmail(data.email, "Bienvenido a 128 Brand", html);
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
        await sendEmail(userEmail, "🚀 Tu Instancia de IA está lista", html);
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
                await sendEmail(newData.userEmail, "💎 Eres Premium", "<h1>Pago Confirmado</h1><p>Gracias por confiar en 128 Brand.</p>");
             }
        }
        return null;
    });

// 4. FUNCION HTTPS: FORMULARIO DE CONTACTO
export const sendContactEmail = functions.https.onCall(async (data, context) => {
    const { name, company, email: clientEmail, message } = data;

    if (!name || !clientEmail || !message) {
        throw new functions.https.HttpsError('invalid-argument', 'Faltan datos requeridos.');
    }

    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #7c3aed;">Nuevo Mensaje Web</h2>
        <hr style="border: 1px solid #eee;">
        <p><strong>De:</strong> ${name} (<a href="mailto:${clientEmail}">${clientEmail}</a>)</p>
        <p><strong>Empresa:</strong> ${company || 'No indicada'}</p>
        <br>
        <p style="background: #f4f4f5; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed;">${message}</p>
    </div>
    `;

    try {
        if (!transporter) throw new functions.https.HttpsError('internal', 'Servidor de correo no listo');

        await transporter.sendMail({
            from: `"Formulario Web" <${email}>`, 
            to: "hola@128brand.com",             // <--- Destino: Tu correo corporativo
            replyTo: clientEmail,                // <--- Responder a: El cliente
            subject: `🔔 Lead: ${name} - ${company || 'Web'}`,
            html: html
        });

        return { success: true };
    } catch (error: any) {
        console.error("❌ Error enviando formulario:", error);
        throw new functions.https.HttpsError('internal', `Error SMTP: ${error.message}`);
    }
});