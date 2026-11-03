import { getDB, queryAll, execute } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';
import { sendTelegramNotification } from '../../../lib/telegram';

export const prerender = false;

// GET: list all leads (requires auth)
export async function GET(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const db = getDB(context.locals);
    const leads = await queryAll(db, 'SELECT * FROM leads ORDER BY created_at DESC');
    return new Response(JSON.stringify({ success: true, leads }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST: insert a new lead (public)
export async function POST(context: any) {
  try {
    const body = await context.request.json();
    const { name, phone, category, source } = body;
    let { email, message } = body;

    // Strict Server-side Validation
    const trimmedName = (name || '').trim();
    if (!trimmedName || trimmedName.length < 3) {
      return new Response(JSON.stringify({ success: false, error: 'Numele este obligatoriu (minim 3 caractere).' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const trimmedPhone = (phone || '').trim();
    const phoneDigits = trimmedPhone.replace(/[^0-9]/g, '');
    if (!trimmedPhone || phoneDigits.length < 10) {
      return new Response(JSON.stringify({ success: false, error: 'Numărul de telefon este invalid (minim 10 cifre).' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const trimmedCategory = (category || '').trim();
    if (!trimmedCategory) {
      return new Response(JSON.stringify({ success: false, error: 'Selectarea unei categorii auto este obligatorie.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract email from message if passed like "Email: ...\n\nMesaj:\n..."
    if (!email && message && message.startsWith('Email: ')) {
      const match = message.match(/^Email:\s*([^\n]+)/);
      if (match) {
        email = match[1].trim();
      }
    }

    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(email.trim())) {
        return new Response(JSON.stringify({ success: false, error: 'Adresa de email este invalidă (trebuie să conțină @ și un domeniu valid).' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Ensure email is saved in database message if provided separately
    let dbMessage = message || '';
    if (email && !dbMessage.includes(email)) {
      dbMessage = `Email: ${email}\n\nMesaj:\n${dbMessage || '-'}`;
    }

    const db = getDB(context.locals);
    await execute(
      db,
      `INSERT INTO leads (name, phone, category, message, status, source) 
       VALUES (?, ?, ?, ?, 'nou', ?)`,
      [name, phone, category || '', dbMessage, source || 'website']
    );

    // Send instant Telegram notification to the group
    try {
      const settingsRows = await queryAll<any>(
        db,
        "SELECT key, value FROM settings WHERE key IN ('telegram_bot_token', 'telegram_chat_id', 'telegram_enabled')"
      );
      const settingsMap: Record<string, string> = {};
      settingsRows.forEach(r => { settingsMap[r.key] = r.value; });

      const isEnabled = settingsMap.telegram_enabled !== '0';
      const botToken = settingsMap.telegram_bot_token || 
                       context.locals?.runtime?.env?.TELEGRAM_BOT_TOKEN || 
                       '9007953709:AAE2orLDkCC_-JHwTNGbJoHyYBPcx5TZOpE';
      const chatId = settingsMap.telegram_chat_id || 
                     context.locals?.runtime?.env?.TELEGRAM_CHAT_ID || 
                     '-5188167926';

      if (isEnabled && botToken && chatId) {
        await sendTelegramNotification(
          {
            name,
            phone,
            email,
            category,
            message: message || '',
            source
          },
          { botToken, chatId }
        );
      }
    } catch (telegramErr) {
      console.error('Eroare trimitere notificare Telegram:', telegramErr);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
