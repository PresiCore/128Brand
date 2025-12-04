
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Inicializar Admin SDK para acceso a Firestore
admin.initializeApp();
const db = admin.firestore();

// --- CONFIGURACIÓN SMTP ---
// Para producción, usar variables de entorno: 
// firebase functions:config:set smtp.email="tu@gmail.com" smtp.password="app_password"
const transporter = nodemailer.createTransport({
  service: "gmail", // Cambiar a 'SendGrid' o host SMTP personalizado si es necesario
  auth: {
    user: process.env.SMTP_EMAIL || functions.config().smtp?.email,
    pass: process.env.SMTP_PASSWORD || functions.config().smtp?.password,
  },
});

const DASHBOARD_URL = "https://128brand.com"; // URL de producción

// --- PLANTILLAS HTML ---
const TEMPLATES = {
  welcome: `
<!DOCTYPE html>
<html>
<body style="background-color: #030014; font-family: sans-serif; color: white;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0f0c29; border: 1px solid #333; border-radius: 20px; overflow: hidden;">
    <div style="text-align: center; padding: 40px 0;">
      <span style="background-color: #7c3aed; padding: 6px 10px; border-radius: 6px; font-weight: 800; color: white;">128</span>
      <span style="font-weight: 700; font-size: 20px; margin-left: 10px; color: white;">BRAND</span>
    </div>
    <div style="padding: 20px 40px; text-align: center;">
      <h1 style="font-weight: 800;">Bienvenido al Futuro, {{name}}.</h1>
      <p style="color: #9ca3af;">Tu cuenta corporativa ha sido creada exitosamente. Accede ahora a la plataforma para gestionar tus agentes.</p>
      <a href="{{dashboard_url}}" style="display: inline-block; padding: 16px 40px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 20px;">Entrar al Dashboard</a>
    </div>
  </div>
</body>
</html>`,

  trial: `
<!DOCTYPE html>
<html>
<body style="background-color: #030014; font-family: sans-serif; color: white;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0f0c29; border: 1px solid #333; border-radius: 20px; overflow: hidden;">
    <div style="text-align: center; padding: 30px 40px;">
      <div style="background-color: rgba(176, 251, 93, 0.1); color: #b0fb5d; display: inline-block; padding: 8px 16px; border-radius: 30px; font-weight: 700; font-size: 12px; border: 1px solid rgba(176, 251, 93, 0.3);">
         ● PRUEBA DE 7 DÍAS ACTIVA
      </div>
      <h1 style="font-weight: 800;">Instancia Desplegada</h1>
      <p style="color: #9ca3af;">Usa este token para conectar tu agente {{product_name}}:</p>
      
      <div style="background-color: #000; border: 1px solid #333; border-radius: 10px; padding: 25px; margin: 20px 0;">
        <p style="font-family: monospace; color: #b0fb5d; font-size: 20px; font-weight: bold; margin: 0;">{{token}}</p>
        <p style="font-family: monospace; color: #ef4444; font-size: 12px; margin-top: 10px;">Expira: {{expiration_date}}</p>
      </div>

      <a href="{{dashboard_url}}" style="background-color: #b0fb5d; color: #000; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: 800; display: inline-block;">Configurar Agente</a>
    </div>
  </div>
</body>
</html>`,

  premium: `
<!DOCTYPE html>
<html>
<body style="background-color: #030014; font-family: sans-serif; color: white;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0f0c29; border: 1px solid #333; border-radius: 20px; overflow: hidden;">
    <div style="text-align: center; padding: 50px 0 30px 0; background: radial-gradient(circle at center, rgba(124, 58, 237, 0.2), transparent 70%);">
       <div style="font-size: 40px;">💎</div>
       <h1 style="font-weight: 800; margin: 10px 0;">¡Eres Premium!</h1>
       <p style="color: #b0fb5d; font-weight: 700; letter-spacing: 2px;">PAGO CONFIRMADO</p>
    </div>
    <div style="padding: 0 40px 40px;">
       <p style="color: #9ca3af; text-align: center;">Se han eliminado los límites para {{product_name}}. Tu agente ahora trabaja 24/7 sin restricciones.</p>
       <div style="background-color: white; color: black; border-radius: 12px; padding: 20px; margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
             <span>TOTAL PAGADO</span>
             <span>{{amount}}</span>
          </div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">ID Transacción: {{transaction_id}}</div>
       </div>
    </div>
  </div>
</body>
</html>`,

  urgency: `
<!DOCTYPE html>
<html>
<body style="background-color: #030014; font-family: sans-serif; color: white;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0f0c29; border: 1px solid #333; border-radius: 20px; overflow: hidden; box-shadow: 0 0 60px rgba(239, 68, 68, 0.1);">
    <div style="height: 6px; background: linear-gradient(90deg, #ef4444, #b91c1c);"></div>
    
    <div style="text-align: center; padding: 40px;">
       <div style="width: 80px; height: 80px; background: rgba(239, 68, 68, 0.1); border-radius: 50%; border: 1px solid rgba(239, 68, 68, 0.3); display: inline-flex; align-items: center; justify-content: center; font-size: 40px;">⏳</div>
       <h1 style="font-weight: 800; margin-top: 20px;">Tu Agente se detiene mañana</h1>
       <p style="color: #9ca3af; line-height: 1.6;">La prueba de 7 días para <strong>{{product_name}}</strong> expira en 24 horas. Si no actualizas, perderás la configuración y los leads entrantes.</p>
       
       <div style="background-color: #1a1a1a; padding: 20px; border-radius: 12px; text-align: left; margin: 20px 0; border: 1px solid #333;">
          <div style="color: #d1d5db; margin-bottom: 5px;">❌ Atención 24/7 desactivada</div>
          <div style="color: #d1d5db;">❌ Pérdida de leads</div>
       </div>

       <a href="{{upgrade_url}}" style="display: block; width: 100%; padding: 18px 0; background-color: white; color: black; text-decoration: none; font-weight: 800; border-radius: 12px; text-align: center;">Mantener Agente Activo &rarr;</a>
    </div>
  </div>
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

    const token = context.params.licenseId; // El ID del doc es el token
    
    // Formatear fecha
    let expiration = "7 días";
    if (licenseData.trialEndsAt) {
       // Convertir Timestamp de Firestore a Fecha legible
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

    // Solo si cambia a PAGADO
    if (before.paymentStatus !== 'paid' && after.paymentStatus === 'paid') {
        const email = after.userEmail;
        if (!email) return;

        const html = replaceTemplate(TEMPLATES.premium, {
            product_name: after.productId || "Servicio Premium",
            amount: "350€ + IVA", // O leer del documento si es dinámico
            transaction_id: context.eventId, // Usamos ID de evento como ref de transacción simple
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
                
                emailPromises.push(sendEmail(email, "⏳ URGENTE: Tu Agente se detendrá mañana", html));
            }
        });

        await Promise.all(emailPromises);
        console.log(`Sent urgency emails to ${emailPromises.length} users.`);

    } catch (error) {
        console.error("Error in checkExpiringTrials cron:", error);
    }
  });
