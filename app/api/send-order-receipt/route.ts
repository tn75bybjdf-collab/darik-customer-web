import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

type ReceiptItem = {
  name?: string;
  size?: string | null;
  quantity?: number;
  unitPrice?: number;
  lineTotal?: number;
};

type ReceiptPayload = {
  orderId?: string;
  deliveryPin?: string;
  customerEmail?: string | null;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: string;
  deliveryLabel?: string;
  deliveryEtaLabel?: string;
  deliveryAddress?: string;
  deliveryNote?: string | null;
  subtotal?: number;
  deliveryFee?: number;
  darikCreditAppliedAmount?: number;
  total?: number;
  items?: ReceiptItem[];
};

function money(value: unknown) {
  const amount = Number(value ?? 0);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : '0.00'} JOD`;
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function shortOrderId(orderId?: string) {
  if (!orderId) return 'Darik Order';
  return orderId.length > 8 ? orderId.slice(0, 8).toUpperCase() : orderId.toUpperCase();
}

function buildReceiptHtml(payload: ReceiptPayload) {
  const orderShort = shortOrderId(payload.orderId);
  const orderDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Amman',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  });

  const items = Array.isArray(payload.items) ? payload.items : [];

  const itemRows = items
    .map((item) => {
      const sizeLine = item.size ? `<div style="color:#6b7280;font-size:12px;margin-top:3px;">Size: ${escapeHtml(item.size)}</div>` : '';

      return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #eef0f3;">
            <div style="font-weight:800;color:#111827;font-size:14px;line-height:1.35;">${escapeHtml(item.name || 'Darik item')}</div>
            ${sizeLine}
            <div style="color:#6b7280;font-size:12px;margin-top:3px;">Qty: ${Number(item.quantity || 0)}</div>
          </td>
          <td align="right" style="padding:14px 0;border-bottom:1px solid #eef0f3;color:#111827;font-weight:800;white-space:nowrap;">
            ${money(item.lineTotal)}
          </td>
        </tr>
      `;
    })
    .join('');

  const creditRow =
    Number(payload.darikCreditAppliedAmount || 0) > 0
      ? `
        <tr>
          <td style="padding:5px 0;color:#374151;">Darik Credit Applied</td>
          <td align="right" style="padding:5px 0;color:#078c3b;font-weight:800;">-${money(payload.darikCreditAppliedAmount)}</td>
        </tr>
      `
      : '';

  const deliveryPin = payload.deliveryPin
    ? `
      <div style="margin-top:14px;background:#111827;border-radius:14px;padding:14px;text-align:center;">
        <div style="color:#ffd23f;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;">Delivery Code</div>
        <div style="color:#ffffff;font-size:30px;font-weight:900;letter-spacing:.18em;margin-top:4px;">${escapeHtml(payload.deliveryPin)}</div>
        <div style="color:#d1d5db;font-size:12px;margin-top:4px;">Give this code to the driver only when you receive your order.</div>
      </div>
    `
    : '';

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <div style="max-width:680px;margin:0 auto;padding:28px 14px;">
      <div style="background:#111111;border-radius:22px 22px 0 0;padding:22px 24px;">
        <div style="color:#ffd23f;font-size:26px;font-weight:900;letter-spacing:.08em;">DARIK</div>
        <div style="color:#ffffff;font-size:14px;font-weight:700;margin-top:4px;">Your order receipt</div>
      </div>

      <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 22px 22px;padding:24px;">
        <h1 style="margin:0;color:#111827;font-size:24px;line-height:1.2;">Thanks for your order, ${escapeHtml(payload.customerName || 'Darik customer')}.</h1>
        <p style="margin:8px 0 0;color:#6b7280;font-size:14px;line-height:1.5;">
          We received your Darik order and will prepare it for delivery.
        </p>

        <div style="display:block;margin-top:20px;border:1px solid #e5e7eb;border-radius:16px;background:#fafafa;padding:16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#6b7280;font-size:12px;font-weight:800;text-transform:uppercase;">Order</td>
              <td align="right" style="color:#111827;font-size:14px;font-weight:900;">#${escapeHtml(orderShort)}</td>
            </tr>
            <tr>
              <td style="padding-top:8px;color:#6b7280;font-size:12px;font-weight:800;text-transform:uppercase;">Date</td>
              <td align="right" style="padding-top:8px;color:#111827;font-size:14px;font-weight:800;">${escapeHtml(orderDate)}</td>
            </tr>
            <tr>
              <td style="padding-top:8px;color:#6b7280;font-size:12px;font-weight:800;text-transform:uppercase;">Payment</td>
              <td align="right" style="padding-top:8px;color:#111827;font-size:14px;font-weight:800;">${escapeHtml(payload.paymentMethod || 'Cash on Delivery')}</td>
            </tr>
          </table>
        </div>

        ${deliveryPin}

        <h2 style="margin:24px 0 8px;font-size:18px;color:#111827;">Items</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${itemRows || '<tr><td style="padding:14px 0;color:#6b7280;">No item details available.</td></tr>'}
        </table>

        <div style="margin-top:20px;border-top:1px solid #e5e7eb;padding-top:14px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
            <tr>
              <td style="padding:5px 0;color:#374151;">Subtotal</td>
              <td align="right" style="padding:5px 0;color:#111827;font-weight:800;">${money(payload.subtotal)}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;color:#374151;">Delivery</td>
              <td align="right" style="padding:5px 0;color:#111827;font-weight:800;">${money(payload.deliveryFee)}</td>
            </tr>
            ${creditRow}
            <tr>
              <td style="padding:13px 0 0;color:#111827;font-size:18px;font-weight:900;border-top:1px solid #e5e7eb;">Total Due</td>
              <td align="right" style="padding:13px 0 0;color:#111827;font-size:20px;font-weight:900;border-top:1px solid #e5e7eb;">${money(payload.total)}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top:22px;border:1px solid #e5e7eb;border-radius:16px;padding:16px;background:#fffef5;">
          <div style="font-size:14px;font-weight:900;color:#111827;">Delivery details</div>
          <div style="margin-top:7px;color:#374151;font-size:14px;line-height:1.5;">${escapeHtml(payload.deliveryLabel || 'Delivery')}</div>
          <div style="color:#6b7280;font-size:13px;line-height:1.5;">${escapeHtml(payload.deliveryEtaLabel || '')}</div>
          <div style="margin-top:10px;color:#374151;font-size:13px;line-height:1.5;">${escapeHtml(payload.deliveryAddress || '')}</div>
          ${
            payload.deliveryNote
              ? `<div style="margin-top:6px;color:#6b7280;font-size:13px;line-height:1.5;">Note: ${escapeHtml(payload.deliveryNote)}</div>`
              : ''
          }
        </div>

        <p style="margin:22px 0 0;color:#6b7280;font-size:12px;line-height:1.5;text-align:center;">
          Need help? Contact Darik Support from your account settings.
        </p>
      </div>

      <div style="text-align:center;color:#9ca3af;font-size:11px;margin-top:14px;">
        Darik Marketplace • Jordan
      </div>
    </div>
  </body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token) {
      return NextResponse.json({ success: false, error: 'Missing authorization token.' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ success: false, error: 'Missing Supabase environment variables.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      return NextResponse.json({ success: false, error: 'Invalid customer session.' }, { status: 401 });
    }

    const payload = (await request.json()) as ReceiptPayload;
    const recipient = String(payload.customerEmail || userData.user.email || '').trim().toLowerCase();

    if (!recipient || !recipient.includes('@')) {
      return NextResponse.json({ success: false, error: 'Missing valid customer email.' }, { status: 400 });
    }

    if (userData.user.email && recipient !== userData.user.email.toLowerCase()) {
      return NextResponse.json({ success: false, error: 'Receipt email must match logged-in customer email.' }, { status: 403 });
    }

    const smtpHost = process.env.SMTP_HOST || 'mail.privateemail.com';
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail = process.env.SMTP_FROM_EMAIL || smtpUser;
    const fromName = process.env.SMTP_FROM_NAME || 'Darik Support';

    if (!smtpUser || !smtpPass || !fromEmail) {
      return NextResponse.json({ success: false, error: 'SMTP environment variables are missing.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: recipient,
      subject: `Darik receipt for order #${shortOrderId(payload.orderId)}`,
      html: buildReceiptHtml(payload),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Could not send receipt email.' },
      { status: 500 }
    );
  }
}
