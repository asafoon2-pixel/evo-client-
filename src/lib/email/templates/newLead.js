import { EMAIL_ASSETS } from '../assets'

const eventTypeMap = {
  birthday: 'יום הולדת', wedding: 'חתונה', corporate: 'אירוע חברה',
  social: 'מסיבה', private: 'אירוע פרטי', bar_mitzvah: 'בר / בת מצווה', other: 'אירוע',
}

export function buildNewLeadEmail(data) {
  const supplierName = data.supplierName || ''
  const customerName = data.customerName || 'לקוח'
  const eventType     = eventTypeMap[data.eventType] || data.eventType || 'אירוע'
  const eventDate     = data.eventDate || 'לא צוין'
  const eventLocation = data.eventLocation || 'לא צוין'
  const budgetRange   = data.budgetRange || 'לא צוין'
  const leadLink       = data.leadLink || 'https://supplier.evoevents.co'

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800&display=swap" rel="stylesheet">
<title>EVO — בקשה חדשה</title>
</head>
<body style="margin:0; padding:0; background-color:#f2f0fb; font-family:'Assistant', Arial, sans-serif;">
<div style="display:none; max-height:0; overflow:hidden;">בקשה חדשה ממתינה לך — הגיבו מהר כדי לא לפספס.</div>
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
<img src="${EMAIL_ASSETS.foxCalculator}" alt="" width="180" style="display:block; margin:0 auto;">
</td>
</tr>

<tr>
<td align="center" style="padding:0 40px 0 40px;">
<span style="display:inline-block; background-color:#FCE3D2; color:#a34d1a; font-size:12px; font-weight:800; padding:7px 18px; border-radius:20px; margin-bottom:16px;">🔥 ליד חדש ממתין לך</span>
<p style="font-size:20px; color:#1C1917; margin:12px 0 14px 0; font-weight:700;">היי ${supplierName},</p>
<p style="font-size:15px; color:#6B6B6B; line-height:1.7; margin:0;"><strong>${customerName}</strong> מחפש/ת שירות שמתאים בול למה שאתם מציעים. ספקים שמגיבים מהר סוגרים יותר עסקאות — כדאי לענות בהקדם.</p>
</td>
</tr>

<tr>
<td style="padding:24px 32px 0 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ece9f7; border-radius:16px;">
<tr><td style="background-color:#E8E4F8; border-radius:16px 16px 0 0; padding:16px 24px;">
<span style="font-size:14px; color:#6B5FE4; font-weight:800;">פרטי הבקשה</span>
</td></tr>
<tr><td style="padding:16px 24px 4px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:10px 0; font-size:14px; color:#6B6B6B;">סוג האירוע</td><td style="padding:10px 0; font-size:14px; color:#1C1917; font-weight:700; text-align:left;">${eventType}</td></tr><tr><td colspan="2" style="border-top:1px solid #ece9df; padding:0;"></td></tr><tr><td style="padding:10px 0; font-size:14px; color:#6B6B6B;">תאריך</td><td style="padding:10px 0; font-size:14px; color:#1C1917; font-weight:700; text-align:left;">${eventDate}</td></tr><tr><td colspan="2" style="border-top:1px solid #ece9df; padding:0;"></td></tr><tr><td style="padding:10px 0; font-size:14px; color:#6B6B6B;">מיקום</td><td style="padding:10px 0; font-size:14px; color:#1C1917; font-weight:700; text-align:left;">${eventLocation}</td></tr><tr><td colspan="2" style="border-top:1px solid #ece9df; padding:0;"></td></tr><tr><td style="padding:10px 0; font-size:14px; color:#6B6B6B;">תקציב משוער</td><td style="padding:10px 0; font-size:14px; color:#1C1917; font-weight:700; text-align:left;">${budgetRange}</td></tr></table>
</td></tr>
</table>
</td>
</tr>

<tr>
<td align="center" style="padding:28px 32px 8px 32px;">
<a href="${leadLink}" style="display:block; background-color:#6B5FE4; color:#ffffff; text-decoration:none; font-size:16px; font-weight:800; padding:20px; border-radius:16px; text-align:center;">לצפייה בבקשה ומענה</a>
</td>
</tr>

<!-- Footer note -->
<tr>
<td align="center" style="padding:16px 32px 44px 32px;">
<p style="font-size:13px; color:#a39cc7; margin:0; line-height:1.6;">הליד הזה עשוי להישלח גם לספקים נוספים — מומלץ להגיב בהקדם.</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
