// Sends the sign-in code with Resend (https://resend.com). Needs RESEND_API_KEY
// and EMAIL_FROM, for example "TenseMaster <acceso@tensemasterapp.com>".
export class EmailUnavailable extends Error {
  constructor(message: string) { super(message); this.name = 'EmailUnavailable'; }
}

export function emailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY?.trim();
}

export async function sendSignInCode(to: string, code: string, minutes: number): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new EmailUnavailable('RESEND_API_KEY is not configured');
  const from = process.env.EMAIL_FROM?.trim() || 'TenseMaster <onboarding@resend.dev>';
  const text = `Your TenseMaster code is ${code}\n\nTu código de TenseMaster es ${code}\n\nIt expires in ${minutes} minutes. If you did not ask for it, you can ignore this email.\nVence en ${minutes} minutos. Si no lo pediste, ignora este correo.`;
  const html = `<div style="font-family:Arial,sans-serif;font-size:16px;color:#1e1b4b">
<p>Your TenseMaster code is / Tu código de TenseMaster es:</p>
<p style="font-size:32px;font-weight:bold;letter-spacing:6px;margin:16px 0">${code}</p>
<p style="color:#475569;font-size:14px">It expires in ${minutes} minutes. If you did not ask for it, you can ignore this email.<br>Vence en ${minutes} minutos. Si no lo pediste, ignora este correo.</p></div>`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject: `${code} es tu código de TenseMaster`, text, html }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    const detail = (await response.text().catch(() => '')).slice(0, 300);
    throw new EmailUnavailable(`Resend responded ${response.status}: ${detail}`);
  }
}
