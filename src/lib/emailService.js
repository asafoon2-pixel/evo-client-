const FROM = 'EVO Events <noreply@evoevents.co>'

async function sendEmail(payload) {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) console.error('sendEmail error:', await res.json())
  } catch (err) {
    console.error('sendEmail failed:', err)
  }
}

const eventTypeMap = {
  birthday: 'יום הולדת', wedding: 'חתונה', corporate: 'אירוע חברה',
  social: 'מסיבה', private: 'אירוע פרטי', other: 'אירוע',
}

export async function sendLeadEmail({ vendor, lead }) {
  if (!vendor.email) return

  const eventType  = eventTypeMap[lead.eventType] || lead.eventType || 'אירוע'
  const guestCount = lead.guestCount  || 'לא צוין'
  const date       = lead.date        || 'לא צוין'
  const budget     = lead.budgetRange || 'לא צוין'

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; direction: rtl; }
  .container { max-width: 560px; margin: 32px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: #6B5FE4; padding: 32px; text-align: center; }
  .header img { margin-bottom: 16px; }
  .header h1 { color: #fff; margin: 0; font-size: 28px; }
  .header p { color: rgba(255,255,255,0.75); margin: 8px 0 0; font-size: 14px; }
  .badge { display: inline-block; background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.3); border-radius: 100px; padding: 4px 14px; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; }
  .body { padding: 32px; }
  .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
  .row:last-child { border-bottom: none; }
  .label { color: #888; font-size: 13px; }
  .value { color: #1a1a1a; font-size: 14px; font-weight: 600; }
  .cta { margin: 24px 0 0; text-align: center; }
  .cta a { background: #6B5FE4; color: #fff; text-decoration: none; padding: 14px 36px; border-radius: 100px; font-size: 15px; font-weight: 700; display: inline-block; }
  .footer { padding: 20px 32px; background: #fafafa; text-align: center; color: #bbb; font-size: 12px; }
</style></head>
<body>
<div class="container">
  <div class="header">
    <img src="https://app.evoevents.co/logo.svg" alt="EVO" width="87" height="30" />
    <div class="badge">ליד חדש</div>
    <h1>בקשה חדשה!</h1>
    <p>לקוח מעוניין בשירותיך דרך EVO</p>
  </div>
  <div class="body">
    <p style="color:#444;font-size:15px;margin:0 0 20px">שלום <strong>${vendor.name}</strong>,<br>קיבלת בקשה חדשה מ-EVO. הנה הפרטים:</p>
    <div class="row"><span class="label">לקוח</span><span class="value">${lead.client_name || 'לא צוין'}</span></div>
    <div class="row"><span class="label">סוג אירוע</span><span class="value">${eventType}</span></div>
    <div class="row"><span class="label">תאריך</span><span class="value">${date}</span></div>
    <div class="row"><span class="label">אורחים</span><span class="value">${guestCount}</span></div>
    <div class="row"><span class="label">תקציב</span><span class="value">${budget}</span></div>
    <div class="cta">
      <a href="https://evo-supplier.web.app">פתח את לוח הספקים</a>
    </div>
  </div>
  <div class="footer">EVO Events · כל הזכויות שמורות</div>
</div>
</body>
</html>`

  await sendEmail({
    from: FROM,
    to: vendor.email,
    subject: `בקשה חדשה מ-${lead.client_name || 'לקוח'} — EVO`,
    html,
  })
}

export async function sendClientConfirmationEmail({ clientEmail, clientName, eventName, totalPrice, depositAmount }) {
  if (!clientEmail) return

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; direction: rtl; }
  .container { max-width: 560px; margin: 32px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { background: #6B5FE4; padding: 32px; text-align: center; }
  .header h1 { color: #fff; margin: 0; font-size: 26px; }
  .header p { color: rgba(255,255,255,0.75); margin: 8px 0 0; font-size: 14px; }
  .body { padding: 32px; }
  .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
  .row:last-child { border-bottom: none; }
  .label { color: #888; font-size: 13px; }
  .value { color: #1a1a1a; font-size: 14px; font-weight: 600; }
  .note { background: #f0eeff; border-radius: 12px; padding: 16px; margin-top: 20px; color: #6B5FE4; font-size: 13px; line-height: 1.6; }
  .footer { padding: 20px 32px; background: #fafafa; text-align: center; color: #bbb; font-size: 12px; }
</style></head>
<body>
<div class="container">
  <div class="header">
    <img src="https://app.evoevents.co/logo.svg" alt="EVO" width="87" height="30" style="margin-bottom:16px;display:block;margin-left:auto;margin-right:auto;" />
    <h1>הבקשה שלך התקבלה!</h1>
    <p>נציג EVO יצור איתך קשר בקרוב לסגירת הפרטים</p>
  </div>
  <div class="body">
    <p style="color:#444;font-size:15px;margin:0 0 20px">שלום <strong>${clientName || 'לקוח יקר'}</strong>,<br>קיבלנו את הבקשה שלך לאירוע <strong>${eventName}</strong>. הנה סיכום:</p>
    <div class="row"><span class="label">שם האירוע</span><span class="value">${eventName}</span></div>
    <div class="row"><span class="label">עלות כוללת משוערת</span><span class="value">&#8362;${totalPrice?.toLocaleString() || '0'}</span></div>
    <div class="row"><span class="label">מקדמה לאישור</span><span class="value">&#8362;${depositAmount?.toLocaleString() || '0'}</span></div>
    <div class="note">
      נציג EVO יצור איתך קשר תוך 24 שעות לאישור הבקשה וסגירת אמצעי התשלום. לפני שהתשלום יתבצע תקבל אישור מלא.
    </div>
  </div>
  <div class="footer">EVO Events · כל הזכויות שמורות · app.evoevents.co</div>
</div>
</body>
</html>`

  await sendEmail({
    from: FROM,
    to: clientEmail,
    subject: `קיבלנו את הבקשה שלך — ${eventName}`,
    html,
  })
}
