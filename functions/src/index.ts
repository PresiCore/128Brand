import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Inicializar Admin SDK
if (admin.apps.length === 0) {
    admin.initializeApp();
}

console.log("--> ARCHIVO INDEX.TS CARGADO CORRECTAMENTE"); // Chivato de carga

// --- TUS CREDENCIALES (HARDCODED) ---
const SMTP_CONFIG = {
    host: "128brand-com.correoseguro.dinaserver.com",
    port: 465,
    secure: true, // true para puerto 465
    auth: {
        user: "hola@128brand.com",
        pass: "EmailGalactica101!" // Tu contraseña
    }
};

// --- FUNCIÓN DEL FORMULARIO ---
export const sendContactEmail = functions.https.onCall(async (data, context) => {
    // 1. Log de inicio (Si ves esto, la conexión web-backend funciona)
    console.log("--> 1. Función invocada. Datos:", data);

    const { name, company, email, message } = data;

    // Validación
    if (!name || !email || !message) {
        console.warn("--> Validación fallida: Faltan datos");
        throw new functions.https.HttpsError('invalid-argument', 'Faltan datos requeridos.');
    }

    // 2. Configurar transporte (AHORA DENTRO DE LA FUNCIÓN)
    // Esto evita que el servidor se rompa si la configuración está mal al inicio
    const transporter = nodemailer.createTransport(SMTP_CONFIG);

    const htmlContent = `
        <h2>Nuevo Lead Web</h2>
        <p><strong>De:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
        <p><strong>Empresa:</strong> ${company || 'No indicada'}</p>
        <p><strong>Mensaje:</strong></p>
        <blockquote style="background: #eee; padding: 10px;">${message}</blockquote>
    `;

    try {
        console.log("--> 2. Verificando conexión SMTP con Dinahosting...");
        await transporter.verify(); // Prueba de conexión antes de enviar
        console.log("--> 3. Conexión SMTP Exitosa. Enviando correo...");

        const info = await transporter.sendMail({
            from: `"Web 128Brand" <${SMTP_CONFIG.auth.user}>`,
            to: "hola@128brand.com",      // Tu correo corporativo
            cc: "ivancorebrand@gmail.com",// Copia de seguridad a Gmail
            replyTo: email,               // Para que respondas al cliente
            subject: `🔔 Nuevo Mensaje: ${name}`,
            html: htmlContent
        });

        console.log("--> 4. ¡CORREO ENVIADO! ID:", info.messageId);
        return { success: true, id: info.messageId };

    } catch (error: any) {
        // Aquí capturamos el error REAL de Dinahosting
        console.error("❌ ERROR CRÍTICO AL ENVIAR:", error);
        
        // Devolvemos el error técnico a la web para que lo veas en la consola del navegador
        throw new functions.https.HttpsError('internal', `Fallo SMTP: ${error.message}`);
    }
});

// Mantener los otros triggers vacíos para no romper despliegues previos
export const onUserCreated = functions.firestore.document("users/{id}").onCreate(() => null);
export const onLicenseCreated = functions.firestore.document("licenses/{id}").onCreate(() => null);
export const onLicenseUpdated = functions.firestore.document("licenses/{id}").onUpdate(() => null);