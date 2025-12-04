import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Inicializar Admin SDK
admin.initializeApp();
const db = admin.firestore();

// --- CONFIGURACIÓN SMTP ---
// ¡¡IMPORTANTE: AQUÍ YA NO DEBE HABER NINGÚN "const config = ..."!!

const transporter = nodemailer.createTransport({
  host: "128brand-com.correoseguro.dinaserver.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,     // Solo process.env
    pass: process.env.SMTP_PASSWORD,  // Solo process.env
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
    from: '"128 Brand Platform" <no-reply@128brand.com>',
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

// --- TRIGGERS ---

// A. Bienvenida (Registro de Usuario)
export const sendWelcomeEmail = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    const email = userData.email;
    const name = userData.name || "Usuario";

    if (!email) {
        console.log("No email found for user");
        return;
    }

    const html = replaceTemplate(TEMPLATES.welcome, {
      name: name,
      dashboard_url: DASHBOARD_URL
    });

    await sendEmail(email, "Bienvenido a 128 Brand | Tu cuenta ha sido activada", html);
  });

// B. Activación de Prueba (Nueva Licencia)
export const sendTrialActiveEmail = functions.firestore
  .document("licenses/{licenseId}")
  .onCreate(async (snap, context) => {
    const licenseData = snap.data();
    const email = licenseData.userEmail;
    
    // Solo enviar si es un plan TRIAL
    if (licenseData.plan !== 'trial' || !email) return;

    const token = context.params.licenseId; 
    
    let expiration = "7 días";
    if (licenseData.trialEndsAt) {
       const date = licenseData.trialEndsAt.toDate ? licenseData.trialEndsAt.toDate() : new Date(licenseData.trialEndsAt);
       expiration = date.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const html = replaceTemplate(TEMPLATES.trial, {
      token: token,
      expiration_date: expiration,
      product_name: licenseData.productId || "Agente IA",
      dashboard_url: DASHBOARD_URL
    });

    await sendEmail(email, "🔑 Token de Activación: Tu Agente 128 está listo", html);
  });

// C. Confirmación Premium (Pago realizado)
export const sendPremiumSuccessEmail = functions.firestore
  .document("licenses/{licenseId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.paymentStatus !== 'paid' && after.paymentStatus === 'paid') {
        const email = after.userEmail;
        if (!email) return;

        const html = replaceTemplate(TEMPLATES.premium, {
            product_name: after.productId || "Servicio Premium",
            amount: "350€ + IVA",
            transaction_id: context.eventId,
        });

        await sendEmail(email, "💎 Confirmación de Pago - 128 Brand Premium", html);
    }
  });

// D. Aviso de Expiración (Cron Job diario)
export const checkExpiringTrials = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    const now = new Date();
    const tomorrowStart = new Date(now);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setHours(23, 59, 59, 999);

    console.log(`Checking trials expiring between ${tomorrowStart.toISOString()} and ${tomorrowEnd.toISOString()}`);

    try {
        const snapshot = await db.collection("licenses")
            .where("plan", "==", "trial")
            .where("status", "==", "active")
            .where("trialEndsAt", ">=", admin.firestore.Timestamp.fromDate(tomorrowStart))
            .where("trialEndsAt", "<=", admin.firestore.Timestamp.fromDate(tomorrowEnd))
            .get();

        if (snapshot.empty) {
            console.log("No expiring trials found for tomorrow.");
            return;
        }

        const emailPromises: Promise<void>[] = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            const email = data.userEmail;
            
            if (email) {
                const html = replaceTemplate(TEMPLATES.urgency, {
                    product_name: data.productId || "Agente IA",
                    upgrade_url: DASHBOARD_URL
                });
                
                emailPromises.push(sendEmail(email, "⏳ URGENTE: Tu Agente se detiene mañana", html));
            }
        });

        await Promise.all(emailPromises);
        console.log(`Sent urgency emails to ${emailPromises.length} users.`);

    } catch (error) {
        console.error("Error in checkExpiringTrials cron:", error);
    }
  });