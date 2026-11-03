import { isAuthenticated } from '../../../lib/auth';
import { getDB, queryAll } from '../../../lib/db';
import { sendTelegramTestMessage } from '../../../lib/telegram';

export const prerender = false;

export async function POST(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ success: false, error: 'Neautorizat' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await context.request.json().catch(() => ({}));
    let botToken = body.botToken;
    let chatId = body.chatId;

    if (!botToken || !chatId) {
      const db = getDB(context.locals);
      const rows = await queryAll<any>(
        db,
        "SELECT key, value FROM settings WHERE key IN ('telegram_bot_token', 'telegram_chat_id')"
      );
      const map: Record<string, string> = {};
      rows.forEach(r => { map[r.key] = r.value; });

      botToken = botToken || map.telegram_bot_token || context.locals?.runtime?.env?.TELEGRAM_BOT_TOKEN;
      chatId = chatId || map.telegram_chat_id || context.locals?.runtime?.env?.TELEGRAM_CHAT_ID;
    }

    if (!botToken || !chatId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Token-ul sau Chat ID-ul lipsesc.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await sendTelegramTestMessage({ botToken, chatId });
    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Mesajul de test a fost trimis cu succes pe grupul Telegram!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

