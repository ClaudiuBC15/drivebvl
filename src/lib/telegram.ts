export interface TelegramLeadData {
  name: string;
  phone: string;
  email?: string;
  category?: string;
  message?: string;
  source?: string;
}

export interface TelegramConfig {
  botToken?: string;
  chatId?: string;
}

export function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function sanitizePhoneForWhatsApp(phone: string): string {
  const digits = (phone || '').replace(/[^0-9]/g, '');
  if (digits.startsWith('0') && digits.length === 10) {
    return '4' + digits; // e.g. 0744123456 -> 40744123456
  }
  if (digits.startsWith('40') && digits.length === 11) {
    return digits;
  }
  return digits;
}

const SOURCE_LABELS: Record<string, string> = {
  website: 'Formular Înscrieri',
  website_contact_page: 'Pagina de Contact',
  website_category_page: 'Pagina Categorie Auto'
};

export async function sendTelegramNotification(
  lead: TelegramLeadData,
  config: TelegramConfig
): Promise<{ success: boolean; error?: string }> {
  const botToken = config.botToken?.trim();
  const chatId = config.chatId?.trim();

  if (!botToken || !chatId) {
    return { success: false, error: 'Token-ul sau Chat ID-ul Telegram lipsesc.' };
  }

  const now = new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' });
  const waPhone = sanitizePhoneForWhatsApp(lead.phone);
  const sourceName = SOURCE_LABELS[lead.source || ''] || lead.source || 'Website';

  const html = `🚗 <b>ÎNSCRIERE NOUĂ PE SITE!</b>\n\n` +
    `👤 <b>Nume:</b> ${escapeHtml(lead.name)}\n` +
    `📞 <b>Telefon:</b> ${escapeHtml(lead.phone)}\n` +
    (lead.email ? `✉️ <b>Email:</b> ${escapeHtml(lead.email)}\n` : '') +
    `📋 <b>Categorie:</b> ${escapeHtml(lead.category || 'Nespecificată')}\n` +
    `💬 <b>Mesaj:</b>\n${escapeHtml(lead.message || '-')}\n\n` +
    `🌐 <b>Sursă:</b> ${escapeHtml(sourceName)}\n` +
    `⏰ <b>Data:</b> ${now}`;

  const buttons: any[] = [];
  if (waPhone && waPhone.length >= 10) {
    buttons.push({
      text: '💬 Scrie pe WhatsApp',
      url: `https://wa.me/${waPhone}`
    });
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: html,
        parse_mode: 'HTML',
        reply_markup: buttons.length > 0 ? { inline_keyboard: [buttons] } : undefined
      })
    });

    const data = (await res.json()) as any;
    if (!data.ok) {
      return { success: false, error: data.description || 'Eroare necunoscută API Telegram' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendTelegramTestMessage(
  config: TelegramConfig
): Promise<{ success: boolean; error?: string }> {
  const botToken = config.botToken?.trim();
  const chatId = config.chatId?.trim();

  if (!botToken || !chatId) {
    return { success: false, error: 'Token-ul sau Chat ID-ul Telegram lipsesc.' };
  }

  const now = new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' });
  const html = `🔔 <b>TEST CONEXIUNE TELEGRAM REUȘIT!</b>\n\n` +
    `Grupul este conectat la site-ul <b>Start Drive BVL</b>.\n` +
    `De acum înainte, toate înscrierile și mesajele din formulare vor apărea instant aici.\n\n` +
    `⏰ <b>Data testului:</b> ${now}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: html,
        parse_mode: 'HTML'
      })
    });

    const data = (await res.json()) as any;
    if (!data.ok) {
      return { success: false, error: data.description || 'Eroare necunoscută API Telegram' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

