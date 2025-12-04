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

// --- COMPONENTES COMUNES (Diseño 128 Brand) ---
const EMAIL_HEADER = `
  <tr>
    <td align="center" style="padding: 40px 0;">
      <table border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td style="background-color: #7c3aed; padding: 8px 14px; border-radius: 8px; color: #ffffff; font-weight: 900; font-size: 18px; border: 1px solid rgba(255,255,255,0.1); font-family: 'Helvetica', sans-serif;">128</td>
          <td style="padding-left: 12px; color: #ffffff; font-weight: 800; font-size: 20px; letter-spacing: 3px; font-family: 'Helvetica', sans-serif;">BRAND</td>
        </tr>
      </table>
    </td>
  </tr>
`;

const EMAIL_FOOTER = `
  <tr>
    <td align="center" style="padding: 30px 20px; border-top: 1px solid #1a1a2e;">
      <p style="margin: 0; color: #666666; font-size: 12px; font-family: 'Helvetica', sans-serif;">&copy; 2025 128 Brand. Todos los derechos reservados.</p>
      <p style="margin: 5px 0 0 0; color: #444444; font-size: 11px; font-family: 'Helvetica', sans-serif;">Alicante, España | <a href="https://www.128brand.com/" style="color: #666; text-decoration: none;">Política de Privacidad</a></p>
    </td>
  </tr>
`;

// --- PLANTILLAS HTML ---
const TEMPLATES = {
  welcome: `
<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #030014; font-family: 'Helvetica', 'Arial', sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #030014; width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f0c29; border: 1px solid #333; border-radius: 20px; overflow: hidden;">
          ${EMAIL_HEADER}
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <h1 style="font-weight: 800; color: white; margin-top: 0; font-size: 28px;">Bienvenido al Futuro, {{name}}.</h1>
              <p style="color: #9ca3af; line-height: 1.6; font-size: 16px;">Tu cuenta corporativa ha sido creada exitosamente. Has dado el primer paso hacia la automatización total.</p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px;">
                <tr>
                   <td align="center">
                      <a href="{{dashboard_url}}" style="display: inline-block; padding: 16px 40px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">Entrar al Dashboard</a>
                   </td>
                </tr>
              </table>
            </td>
          </tr>
          ${EMAIL_FOOTER}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,

  trial: `
<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #030014; font-family: 'Helvetica', 'Arial', sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #030014; width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f0c29; border: 1px solid #333; border-radius: 20px; overflow: hidden;">
          ${EMAIL_HEADER}
          <tr>
            <td style="text-align: center; padding: 0 40px 40px;">
              <div style="margin-bottom: 25px;">
                <span style="background-color: rgba(176, 251, 93, 0.1); color: #b0fb5d; padding: 8px 16px; border-radius: 30px; font-weight: 700; font-size: 11px; border: 1px solid rgba(176, 251, 93, 0.3); text-transform: uppercase; letter-spacing: 1px;">
                  ● Prueba de 7 Días Activa
                </span>
              </div>
              <h1 style="font-weight: 800; color: white; margin: 10px 0; font-size: 26px;">Instancia Desplegada</h1>
              <p style="color: #9ca3af; margin-bottom: 30px;">Usa este token para conectar tu agente <strong>{{product_name}}</strong>:</p>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000; border: 1px solid #333; border-radius: 12px; margin-bottom: 30px;">
                <tr>
                   <td style="padding: 30px; text-align: center;">
                      <p style="font-family: monospace; color: #b0fb5d; font-size: 22px; font-weight: bold; margin: 0; letter-spacing: 1px;">{{token}}</p>
                      <p style="font-family: monospace; color: #ef4444; font-size: 12px; margin: 10px 0 0 0; text-transform: uppercase;">Expira: {{expiration_date}}</p>
                   </td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                   <td align="center">
                      <a href="{{dashboard_url}}" style="background-color: #b0fb5d; color: #000; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: 800; display: inline-block;">Configurar Agente</a>
                   </td>
                </tr>
              </table>
            </td>
          </tr>
          ${EMAIL_FOOTER}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,

  premium: `
<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #030014; font-family: 'Helvetica', 'Arial', sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #030014; width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f0c29; border: 1px solid #333; border-radius: 20px; overflow: hidden;">
          ${EMAIL_HEADER}
          <tr>
            <td style="text-align: center; padding: 20px 0 30px 0; background: radial-gradient(circle at center, rgba(124, 58, 237, 0.2), transparent 70%);">
               <div style="font-size: 48px; margin-bottom: 10px;">💎</div>
               <h1 style="font-weight: 800; margin: 0 0 10px 0; color: white; font-size: 32px;">¡Eres Premium!</h1>
               <p style="color: #b0fb5d; font-weight: 700; letter-spacing: 3px; margin: 0; font-size: 12px;">PAGO CONFIRMADO</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px;">
               <p style="color: #9ca3af; text-align: center; line-height: 1.6; margin-bottom: 30px;">Se han eliminado los límites para <strong>{{product_name}}</strong>. Tu agente ahora trabaja 24/7 sin restricciones de tiempo.</p>
               
               <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: white; border-radius: 12px; overflow: hidden;">
                  <tr>
                    <td style="padding: 25px; color: black;">
                      <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; margin-bottom: 15px;">
                         <span>TOTAL PAGADO</span>
                         <span style="float: right;">{{amount}}</span>
                      </div>
                      <div style="font-size: 12px; color: #666;">ID Transacción: <span style="font-family: monospace;">{{transaction_id}}</span></div>
                    </td>
                  </tr>
               </table>
            </td>
          </tr>
          ${EMAIL_FOOTER}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,

  urgency: `
<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #030014; font-family: 'Helvetica', 'Arial', sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #030014; width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f0c29; border: 1px solid #333; border-radius: 20px; overflow: hidden; box-shadow: 0 0 60px rgba(239, 68, 68, 0.15);">
          <tr>
            <td height="6" style="background: linear-gradient(90deg, #ef4444, #b91c1c);"></td>
          </tr>
          ${EMAIL_HEADER}
          <tr>
            <td style="text-align: center; padding: 0 40px 40px;">
               <div style="width: 70px; height: 70px; background: rgba(239, 68, 68, 0.1); border-radius: 50%; border: 1px solid rgba(239, 68, 68, 0.3); display: inline-block; line-height: 70px; font-size: 30px; margin-bottom: 20px;">⏳</div>
               <h1 style="font-weight: 800; margin: 0 0 15px 0; color: white; font-size: 24px;">Tu Agente se detiene mañana</h1>
               <p style="color: #9ca3af; line-height: 1.6;">La prueba de 7 días para <strong>{{product_name}}</strong> expira en 24 horas.</p>
               
               <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1a1a1a; border-radius: 12px; border: 1px solid #333; margin: 25px 0;">
                  <tr>
                    <td style="padding: 20px; text-align: left;">
                      <div style="color: #d1d5db; margin-bottom: 8px; font-size: 14px;">❌ Atención 24/7 desactivada</div>
                      <div style="color: #d1d5db; font-size: 14px;">❌ Pérdida de leads potenciales</div>
                    </td>
                  </tr>
               </table>

               <table width="100%" border="0" cellspacing="0" cellpadding="0">
                 <tr>
                    <td align="center">
                       <a href="{{upgrade_url}}" style="display: block; padding: 18px 0; background-color: white; color: black; text-decoration: none; font-weight: 800; border-radius: 12px; width: 100%;">Mantener Agente Activo &rarr;</a>
                    </td>
                 </tr>
               </table>
            </td>
          </tr>
          ${EMAIL_FOOTER}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
};

// --- HELPER FUNCTIONS ---

const replaceTemplate = (template: string, data: Record<string, string>) => {
  let output = template;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      output = output.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
    }
  }
  return output;
};

const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: '"128 Brand" <no-reply@128brand.com>',
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// --- TRIGGERS (BIENVENIDA, TRIAL, PREMIUM, EXPIRACIÓN) ---
// (Misma lógica de triggers que ya funcionaba, solo han cambiado los templates arriba)

export const sendWelcomeEmail = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    const email = userData.email;
    const name = userData.name || "Usuario";
    if (!email) return;
    const html = replaceTemplate(TEMPLATES.welcome, { name, dashboard_url: DASHBOARD_URL });
    await sendEmail(email, "Bienvenido a 128 Brand | Tu cuenta ha sido activada", html);
  });

export const sendTrialActiveEmail = functions.firestore
  .document("licenses/{licenseId}")
  .onCreate(async (snap, context) => {
    const licenseData = snap.data();
    const email = licenseData.userEmail;
    if (licenseData.plan !== 'trial' || !email) return;
    const token = context.params.licenseId;
    let expiration = "7 días";
    if (licenseData.trialEndsAt) {
       const date = licenseData.trialEndsAt.toDate ? licenseData.trialEndsAt.toDate() : new Date(licenseData.trialEndsAt);
       expiration = date.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    const html = replaceTemplate(TEMPLATES.trial, { token, expiration_date: expiration, product_name: licenseData.productId || "Agente IA", dashboard_url: DASHBOARD_URL });
    await sendEmail(email, "🔑 Token de Activación: Tu Agente 128 está listo", html);
  });

export const sendPremiumSuccessEmail = functions.firestore
  .document("licenses/{licenseId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    if (before.paymentStatus !== 'paid' && after.paymentStatus === 'paid') {
        const email = after.userEmail;
        if (!email) return;
        const html = replaceTemplate(TEMPLATES.premium, { product_name: after.productId || "Servicio Premium", amount: "350€ + IVA", transaction_id: context.eventId });
        await sendEmail(email, "💎 Confirmación de Pago - 128 Brand Premium", html);
    }
  });

export const checkExpiringTrials = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    const now = new Date();
    const tomorrowStart = new Date(now); tomorrowStart.setDate(tomorrowStart.getDate() + 1); tomorrowStart.setHours(0, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrowStart); tomorrowEnd.setHours(23, 59, 59, 999);
    try {
        const snapshot = await db.collection("licenses")
            .where("plan", "==", "trial")
            .where("status", "==", "active")
            .where("trialEndsAt", ">=", admin.firestore.Timestamp.fromDate(tomorrowStart))
            .where("trialEndsAt", "<=", admin.firestore.Timestamp.fromDate(tomorrowEnd))
            .get();
        if (snapshot.empty) return;
        const emailPromises: Promise<void>[] = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const email = data.userEmail;
            if (email) {
                const html = replaceTemplate(TEMPLATES.urgency, { product_name: data.productId || "Agente IA", upgrade_url: DASHBOARD_URL });
                emailPromises.push(sendEmail(email, "⏳ URGENTE: Tu Agente se detendrá mañana", html));
            }
        });
        await Promise.all(emailPromises);
    } catch (error) { console.error("Error in checkExpiringTrials cron:", error); }
  });