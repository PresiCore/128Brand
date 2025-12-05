
import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Inicializar Admin SDK
admin.initializeApp();
const db = admin.firestore();

// --- CONFIGURACIÓN SMTP ---
const transporter = nodemailer.createTransport({
  host: "128brand-com.correoseguro.dinaserver.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const DASHBOARD_URL = "https://128brand.com";

// --- PLANTILLAS HTML (MEJORADAS PARA EMAIL) ---
const TEMPLATES = {
  welcome: `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #030014; font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: white;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #030014; width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #0f0c29; border: 1px solid #333; border-radius: 20px; overflow: hidden; margin: 0 auto;">
          <tr>
            <td style="text-align: center; padding: 40px 0;">
              <span style="background-color: #7c3aed; padding: 6px 10px; border-radius: 6px; font-weight: 800; color: white; font-family: sans-serif;">128</span>
              <span style="font-weight: 700; font-size: 20px; margin-left: 10px; color: white; font-family: sans-serif;">BRAND</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <h1 style="font-weight: 800; font-size: 24px; margin-bottom: 16px; color: white;">Bienvenido al Futuro, {{name}}.</h1>
              <p style="color: #9ca3af; line-height: 1.6; margin-bottom: 30px;">Tu cuenta corporativa ha sido creada exitosamente. Accede ahora a la plataforma para gestionar tus agentes.</p>
              <a href="{{dashboard_url}}" style="display: inline-block; padding: 16px 40px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">Entrar al Dashboard</a>
            </td>
          </tr>
          <tr>
             <td style="background-color: #050505; padding: 20px; text-align: center; border-top: 1px solid #222;">
                <p style="color: #444; font-size: 12px; margin: 0;">&copy; 2025 128 Brand. Todos los derechos reservados.</p>
                <p style="color: #444; font-size: 12px; margin: 5px 0 0 0;">Alicante, España | <a href="https://128brand.com" style="color: #666; text-decoration: none;">Privacidad</a></p>
             </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,

  trial: `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #030014; font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: white;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #030014; width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #0f0c29; border: 1px solid #333; border-radius: 20px; overflow: hidden; margin: 0 auto;">
          <tr>
             <td style="text-align: center; padding: 40px 0 0 0;">
                <span style="background-color: #7c3aed; padding: 6px 10px; border-radius: 6px; font-weight: 800; color: white; font-family: sans-serif;">128</span>
                <span style="font-weight: 700; font-size: 20px; margin-left: 10px; color: white; font-family: sans-serif;">BRAND</span>
             </td>
          </tr>
          <tr>
            <td style="text-align: center; padding: 30px 40px 40px 40px;">
              <div style="background-color: rgba(176, 251, 93, 0.1); color: #b0fb5d; display: inline-block; padding: 8px 16px; border-radius: 30px; font-weight: 700; font-size: 12px; border: 1px solid rgba(176, 251, 93, 0.3); margin-bottom: 20px;">
                 ● PRUEBA DE 7 DÍAS ACTIVA
              </div>
              <h1 style="font-weight: 800; font-size: 28px; margin: 0 0 10px 0; color: white;">Instancia Desplegada</h1>
              <p style="color: #9ca3af; margin-bottom: 20px;">Usa este token para conectar tu <strong>Agente Comercial 128</strong>:</p>
              
              <div style="background-color: #000; border: 1px solid #333; border-radius: 10px; padding: 30px 20px; margin: 30px 0;">
                <p style="font-family: 'Courier New', monospace; color: #b0fb5d; font-size: 22px; font-weight: bold; margin: 0; letter-spacing: 1px;">{{token}}</p>
                <p style="font-family: 'Courier New', monospace; color: #ef4444; font-size: 11px; margin-top: 15px; text-transform: uppercase; font-weight: bold;">Expira: {{expiration_date}}</p>
              </div>

              <a href="{{dashboard_url}}" style="background-color: #b0fb5d; color: #000; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; display: inline-block; margin-top: 10px;">Configurar Agente</a>
            </td>
          </tr>
          <tr>
             <td style="background-color: #050505; padding: 20px; text-align: center; border-top: 1px solid #222;">
                <p style="color: #444; font-size: 12px; margin: 0;">&copy; 2025 128 Brand. Todos los derechos reservados.</p>
                <p style="color: #444; font-size: 12px; margin: 5px 0 0 0;">Alicante, España | <a href="https://128brand.com" style="color: #666; text-decoration: none;">Privacidad</a></p>
             </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,

  premium: `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #030014; font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: white;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #030014; width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #0f0c29; border: 1px solid #333; border-radius: 20px; overflow: hidden; margin: 0 auto;">
          <tr>
            <td style="text-align: center; padding: 50px 0 30px 0; background: radial-gradient(circle at center, rgba(124, 58, 237, 0.2), transparent 70%);">
               <div style="font-size: 48px; margin-bottom: 10px;">💎</div>
               <h1 style="font-weight: 800; margin: 10px 0; font-size: 32px; color: white;">¡Eres Premium!</h1>
               <p style="color: #b0fb5d; font-weight: 700; letter-spacing: 2px; font-size: 12px; margin-top: 10px;">PAGO CONFIRMADO</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px;">
               <p style="color: #9ca3af; text-align: center; line-height: 1.6;">Se han eliminado los límites para <strong>Agente Comercial 128</strong>. Tu agente ahora trabaja 24/7 sin restricciones.</p>
               <div style="background-color: white; color: black; border-radius: 12px; padding: 25px; margin-top: 30px;">
                  <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
                     <span>TOTAL PAGADO</span>
                     <span>{{amount}}</span>
                  </div>
                  <div style="font-size: 12px; color: #666;">ID Transacción: <span style="font-family: monospace;">{{transaction_id}}</span></div>
               </div>
            </td>
          </tr>
          <tr>
             <td style="background-color: #050505; padding: 20px; text-align: center; border-top: 1px solid #222;">
                <p style="color: #444; font-size: 12px; margin: 0;">&copy; 2025 128 Brand. Todos los derechos reservados.</p>
                <p style="color: #444; font-size: 12px; margin: 5px 0 0 0;">Alicante, España | <a href="https://128brand.com" style="color: #666; text-decoration: none;">Privacidad</a></p>
             </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,

  urgency: `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #030014; font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: white;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #030014; width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0f0c29; border: 1px solid #333; border-radius: 20px; overflow: hidden; box-shadow: 0 0 60px rgba(239, 68, 68, 0.1);">
          <div style="height: 6px; background: linear-gradient(90deg, #ef4444, #b91c1c);"></div>
          
          <div style="text-align: center; padding: 40px;">
             <div style="width: 80px; height: 80px; background: rgba(239, 68, 68, 0.1); border-radius: 50%; border: 1px solid rgba(239, 68, 68, 0.3); display: inline-flex; align-items: center; justify-content: center; font-size: 40px;">⏳</div>
             <h1 style="font-weight: 800; margin-top: 20px; font-size: 26px; color: white;">Tu Agente se detiene mañana</h1>
             <p style="color: #9ca3af; line-height: 1.6; margin-bottom: 25px;">La prueba de 7 días para <strong>Agente Comercial 128</strong> expira en 24 horas. Si no actualizas, perderás la configuración y los leads entrantes.</p>
             
             <div style="background-color: #1a1a1a; padding: 20px; border-radius: 12px; text-align: left; margin: 20px 0; border: 1px solid #333;">
                <div style="color: #d1d5db; margin-bottom: 8px; font-size: 14px;">❌ Atención 24/7 desactivada</div>
                <div style="color: #d1d5db; font-size: 14px;">❌ Pérdida de leads</div>
             </div>

             <a href="{{upgrade_url}}" style="display: block; width: 100%; padding: 18px 0; background-color: white; color: black; text-decoration: none; font-weight: 800; border-radius: 12px; text-align: center; margin-top: 25px;">Mantener Agente Activo &rarr;</a>
          </div>
          <div style="background-color: #050505; padding: 20px; text-align: center; border-top: 1px solid #222;">
                <p style="color: #444; font-size: 12px; margin: 0;">&copy; 2025 128 Brand. Todos los derechos reservados.</p>
                <p style="color: #444; font-size: 12px; margin: 5px 0 0 0;">Alicante, España | <a href="https://128brand.com" style="color: #666; text-decoration: none;">Privacidad</a></p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`
};

// --- HELPERS ---
const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: '"128 Brand" <hola@128brand.com>',
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
};

// 1. TRIGGER: NUEVO USUARIO REGISTRADO
// Envía el email de bienvenida
export const onUserCreated = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const email = data.email;
    const name = data.name || "Cliente";

    if (!email) {
        console.log("No email found for user");
        return null;
    }

    const html = TEMPLATES.welcome
        .replace("{{name}}", name)
        .replace("{{dashboard_url}}", DASHBOARD_URL);

    try {
        await sendEmail(email, "Bienvenido a 128 Brand | Tu cuenta ha sido creada", html);
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
    return null;
  });

// 2. TRIGGER: NUEVA LICENCIA (TRIAL)
// Envía el email con el token cuando se crea una licencia
export const onLicenseCreated = functions.firestore
  .document("licenses/{licenseId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const token = context.params.licenseId;
    const userId = data.userId;
    const userEmail = data.userEmail; // Asegurarse de guardar esto en el frontend

    // Si no tenemos el email en la licencia, intentamos buscarlo en el usuario
    let emailToUse = userEmail;
    if (!emailToUse) {
        const userSnap = await db.collection("users").doc(userId).get();
        if (userSnap.exists) {
            emailToUse = userSnap.data()?.email;
        }
    }

    if (!emailToUse) {
        console.log("No email found for license");
        return null;
    }

    // Formatear fecha
    let expiration = "7 días";
    if (data.trialEndsAt) {
        // data.trialEndsAt puede ser Timestamp o string
        const dateObj = data.trialEndsAt.toDate ? data.trialEndsAt.toDate() : new Date(data.trialEndsAt);
        expiration = dateObj.toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' });
    }

    const html = TEMPLATES.trial
        .replace("{{token}}", token)
        .replace("{{expiration_date}}", expiration)
        .replace("{{dashboard_url}}", DASHBOARD_URL);

    try {
        await sendEmail(emailToUse, "🚀 Tu Instancia de IA está lista", html);
        console.log(`Trial email sent to ${emailToUse}`);
    } catch (error) {
        console.error("Error sending trial email:", error);
    }
    return null;
  });

// 3. TRIGGER: ACTUALIZACIÓN A PREMIUM
// Envía el email cuando el estado de pago cambia
export const onLicenseUpdated = functions.firestore
    .document("licenses/{licenseId}")
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const oldData = change.before.data();

        // Detectar cambio a Premium (si antes tenía trialEndsAt y ahora es null/undefined, o paymentStatus cambió a paid)
        const becamePremium = oldData.trialEndsAt && !newData.trialEndsAt;
        const paidConfirmed = newData.paymentStatus === 'paid' && oldData.paymentStatus !== 'paid';

        if (becamePremium || paidConfirmed) {
             const userId = newData.userId;
             
             // Obtener email
             let emailToUse = newData.userEmail;
             if (!emailToUse) {
                 const userSnap = await db.collection("users").doc(userId).get();
                 if (userSnap.exists) emailToUse = userSnap.data()?.email;
             }

             if (emailToUse) {
                const html = TEMPLATES.premium
                    .replace("{{amount}}", "350€ + IVA")
                    .replace("{{transaction_id}}", context.params.licenseId); // Usamos el token como ID de ref por simplicidad

                await sendEmail(emailToUse, "💎 Confirmación de Servicio Premium", html);
             }
        }
        return null;
    });

// 4. FUNCION HTTPS: FORMULARIO DE CONTACTO
export const sendContactEmail = functions.https.onCall(async (data, context) => {
    const { name, company, email, message } = data;

    // Validación básica
    if (!name || !email || !message) {
        throw new functions.https.HttpsError('invalid-argument', 'Faltan datos requeridos.');
    }

    const html = `
    <h2>Nuevo Mensaje de Contacto Web</h2>
    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Empresa:</strong> ${company || 'No especificada'}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Mensaje:</strong></p>
    <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #7c3aed;">
        ${message}
    </blockquote>
    `;

    try {
        // Enviar email a TI MISMO (hola@128brand.com)
        await sendEmail("hola@128brand.com", `Nuevo Lead Web: ${name}`, html);
        return { success: true };
    } catch (error) {
        console.error("Error enviando formulario:", error);
        throw new functions.https.HttpsError('internal', 'Error al enviar el email.');
    }
});
