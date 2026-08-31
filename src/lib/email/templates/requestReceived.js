import { EMAIL_ASSETS } from '../assets'

const eventTypeMap = {
  birthday: 'יום הולדת', wedding: 'חתונה', corporate: 'אירוע חברה',
  social: 'מסיבה', private: 'אירוע פרטי', bar_mitzvah: 'בר / בת מצווה', other: 'אירוע',
}

export function buildRequestReceivedEmail(data) {
  const customerName = data.customerName || 'לקוח יקר'
  const eventName     = data.eventName || 'האירוע שלי'
  const eventType     = eventTypeMap[data.eventType] || data.eventType || 'אירוע'
  const eventDate     = data.eventDate || 'גמיש'
  const requestId     = data.requestId || ''
  const requestLink   = data.requestLink || 'https://app.evoevents.co'

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800&display=swap" rel="stylesheet">
<title>EVO — קיבלנו את הבקשה שלך</title>
</head>
<body style="margin:0; padding:0; background-color:#f2f0fb; font-family:'Assistant', Arial, sans-serif;">
<div style="display:none; max-height:0; overflow:hidden;">קיבלנו את הבקשה שלך לאירוע — אנחנו כבר על זה.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f0fb; padding:32px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:20px; overflow:hidden; max-width:600px; width:100%;">

<!-- Logo -->
<tr>
<td align="center" style="padding:48px 24px 0 24px;">
<img src="${EMAIL_ASSETS.logo}" alt="EVO" width="140" style="display:block; margin:0 auto;">
<div style="font-family:'Assistant', Arial, sans-serif; font-weight:700; font-size:12px; letter-spacing:2px; color:#1C1917; margin-top:14px; text-transform:uppercase;">Your Event. Produced.</div>
</td>
</tr>

<!-- Mascot -->
<tr>
<td align="center" style="padding:20px 24px 8px 24px;">
<img src="${EMAIL_ASSETS.foxClipboard}" alt="" width="180" style="display:block; margin:0 auto;">
</td>
</tr>

<tr>
<td align="center" style="padding:8px 40px 0 40px;">
<p style="font-size:20px; color:#1C1917; margin:0 0 14px 0; font-weight:700;">היי ${customerName},</p>
<p style="font-size:15px; color:#6B6B6B; line-height:1.7; margin:0;">קיבלנו את הבקשה שלך לאירוע ${eventName} ואנחנו כבר עובדים על זה. אנחנו מחברים אותך עם הספקים הכי מתאימים, ותקבל/י עדכון ברגע שיש הצעות מחיר.</p>
</td>
</tr>

<tr>
<td style="padding:24px 32px 0 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ece9f7; border-radius:16px;">
<tr><td style="background-color:#E8E4F8; border-radius:16px 16px 0 0; padding:16px 24px;">
<span style="font-size:14px; color:#6B5FE4; font-weight:800;">פרטי הבקשה</span>
</td></tr>
<tr><td style="padding:16px 24px 4px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:10px 0; font-size:14px; color:#6B6B6B;">סוג האירוע</td><td style="padding:10px 0; font-size:14px; color:#1C1917; font-weight:700; text-align:left;">${eventType}</td></tr><tr><td colspan="2" style="border-top:1px solid #ece9df; padding:0;"></td></tr><tr><td style="padding:10px 0; font-size:14px; color:#6B6B6B;">תאריך משוער</td><td style="padding:10px 0; font-size:14px; color:#1C1917; font-weight:700; text-align:left;">${eventDate}</td></tr><tr><td colspan="2" style="border-top:1px solid #ece9df; padding:0;"></td></tr><tr><td style="padding:10px 0; font-size:14px; color:#6B6B6B;">מספר בקשה</td><td style="padding:10px 0; font-size:14px; color:#1C1917; font-weight:700; text-align:left;">#${requestId}</td></tr></table>
</td></tr>
</table>
</td>
</tr>

<tr>
<td style="padding:20px 32px 0 32px;">
<p style="font-size:13px; color:#a39cc7; margin:0; line-height:1.6; text-align:center;">⏱️ בדרך כלל ספקים מגיבים תוך 24–48 שעות. נעדכן אותך במייל ברגע שמגיעה הצעה ראשונה.</p>
</td>
</tr>

<tr>
<td align="center" style="padding:28px 32px 8px 32px;">
<a href="${requestLink}" style="display:block; background-color:#6B5FE4; color:#ffffff; text-decoration:none; font-size:16px; font-weight:800; padding:20px; border-radius:16px; text-align:center;">לצפייה בבקשה שלי</a>
</td>
</tr>

<!-- Footer note -->
<tr>
<td align="center" style="padding:16px 32px 44px 32px;">
<p style="font-size:13px; color:#a39cc7; margin:0; line-height:1.6;">שאלות לגבי הבקשה? פשוט השב/י למייל הזה ונחזור אליך בהקדם.</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
