import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Inicializar Admin SDK
if (admin.apps.length === 0) {
    admin.initializeApp();
}

// --- CONFIGURACIÓN SMTP (HARDCODED PARA DEBUG) ---
const email = "hola@128brand.com";
const password = "EmailGalactica101!"; // Tu contraseña real

// --- HELPERS ---
const createTransporter = () => {
    if (!email || !password) {
        console.error("❌ ERROR CRÍTICO: Credenciales de correo no definidas.");
        return null;
    }
    return nodemailer.createTransport({
        host: "128brand-com.correoseguro.dinaserver.com",
        port: 465,
        secure: true,
        auth: { user: email, pass: password },
    });
};

// 1. TRIGGER: NUEVO USUARIO (Opcional)
export const onUserCreated = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    return null; 
  });

// 2. TRIGGER: LICENCIAS (Opcional)
export const onLicenseCreated = functions.firestore
  .document("licenses/{licenseId}")
  .onCreate(async (snap, context) => {
    return null;
  });

// 3. TRIGGER: ACTUALIZACIÓN (Opcional)
export const onLicenseUpdated = functions.firestore
    .document("licenses/{licenseId}")
    .onUpdate(async (change, context) => {
        return null;
    });

// 4. FUNCION HTTPS: FORMULARIO DE CONTACTO
export const sendContactEmail = functions.https.onCall(async (data, context) => {
    console.log("1. Función sendContactEmail iniciada.");
    
    // Aquí declaramos 'company'
    const { name, company, email: clientEmail, message } = data;

    // Validación
    if (!name || !clientEmail || !message) {
        console.warn("2. Validación fallida: Faltan datos.");
        throw new functions.https.HttpsError('invalid-argument', 'Faltan datos requeridos.');
    }

    const transporter = createTransporter();
    if (!transporter) {
        throw new functions.https.HttpsError('internal', 'Error de configuración del servidor.');
    }

    try {
        console.log("3. Verificando conexión con Dinahosting...");
        await transporter.verify();
        console.log("4. Conexión SMTP: OK ✅");
    } catch (error: any) {
        console.error("❌ ERROR CONEXIÓN SMTP:", error);
        throw new functions.https.HttpsError('internal', `No se pudo conectar al correo: ${error.message}`);
    }

    // HTML del correo
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Nuevo Mensaje de ${name}</h2>
        <p><strong>Empresa:</strong> ${company || 'No especificada'}</p>
        <p><strong>Email Cliente:</strong> ${clientEmail}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
    </div>
    `;

    try {
        console.log("5. Intentando enviar email...");
        const info = await transporter.sendMail({
            from: `"Formulario Web" <${email}>`,
            to: "hola@128brand.com",       // Destino Corporativo
            cc: "ivancorebrand@gmail.com", // Copia Seguridad
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