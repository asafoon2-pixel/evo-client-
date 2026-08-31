import { EMAIL_ASSETS } from '../assets'

export function buildWelcomeEmail(data) {
  const customerName = data.customerName || 'לקוח יקר'
  const startLink     = data.startLink || 'https://app.evoevents.co'

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800&display=swap" rel="stylesheet">
<title>EVO — ברוכים הבאים</title>
</head>
<body style="margin:0; padding:0; background-color:#f2f0fb; font-family:'Assistant', Arial, sans-serif;">
<div style="display:none; max-height:0; overflow:hidden;">ברוך הבא ל-EVO — האירוע שלך, מופק.</div>
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
<img src="${EMAIL_ASSETS.foxConfident}" alt="" width="190" style="display:block; margin:0 auto;">
</td>
</tr>

<tr>
<td align="center" style="padding:8px 40px 0 40px;">
<p style="font-size:20px; color:#1C1917; margin:0 0 14px 0; font-weight:700;">ברוך הבא, ${customerName} 🎉</p>
<p style="font-size:15px; color:#6B6B6B; line-height:1.7; margin:0;">נרשמת בהצלחה ל-EVO. עכשיו זה פשוט — תארו לנו את האירוע שלכם, ותוך דקות תתחילו לקבל הצעות מחיר מהספקים הכי מתאימים בסביבה שלכם.</p>
</td>
</tr>

<tr>
<td style="padding:28px 32px 0 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:14px 18px; background-color:#E8E4F8; border-radius:14px;"><span style="font-size:15px; color:#322C6E; font-weight:700;">1. תארו את האירוע שלכם</span></td></tr>
<tr><td style="height:10px;"></td></tr>
<tr><td style="padding:14px 18px; background-color:#C6E9D8; border-radius:14px;"><span style="font-size:15px; color:#1a5c40; font-weight:700;">2. קבלו הצעות מחיר תוך דקות</span></td></tr>
<tr><td style="height:10px;"></td></tr>
<tr><td style="padding:14px 18px; background-color:#FCE3D2; border-radius:14px;"><span style="font-size:15px; color:#a34d1a; font-weight:700;">3. בחרו ספק וסגרו את האירוע</span></td></tr>
</table>
</td>
</tr>

<tr>
<td align="center" style="padding:28px 32px 8px 32px;">
<a href="${startLink}" style="display:block; background-color:#6B5FE4; color:#ffffff; text-decoration:none; font-size:16px; font-weight:800; padding:20px; border-radius:16px; text-align:center;">בואו נתחיל</a>
</td>
</tr>

<!-- Footer note -->
<tr>
<td align="center" style="padding:16px 32px 44px 32px;">
<p style="font-size:13px; color:#a39cc7; margin:0; line-height:1.6;">שאלות? אנחנו כאן: info@evoevents.co</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
