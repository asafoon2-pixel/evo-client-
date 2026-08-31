import Groq from 'groq-sdk'
import { getAllVendors } from './suppliersService'
import { categories } from '../data/index'

const client = import.meta.env.VITE_GROQ_API_KEY
  ? new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true })
  : null

let vendorCache = null
let vendorCacheTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function getVendorContext() {
  if (vendorCache && Date.now() - vendorCacheTime < CACHE_TTL) return vendorCache
  try {
    const vendors = await getAllVendors()
    vendorCache = vendors
      .filter(v => v.name && v.name !== 'ספק')
      .map(v => {
        let line = `• ${v.name} | ${v.category} | ${v.city}`
        if (v.priceRange) line += ` | ${v.priceRange}`
        if (v.rating > 0) line += ` | ⭐${v.rating}`
        if (v.phone || v.whatsapp) line += ` | טל: ${v.whatsapp || v.phone}`
        if (v.shortDescription) line += ` | "${v.shortDescription.slice(0, 60)}"`
        return line
      }).join('\n')
    vendorCacheTime = Date.now()
    return vendorCache
  } catch (_) {
    return 'לא ניתן לטעון ספקים כרגע'
  }
}

function buildSystemPrompt(vendorList, appCtx) {
  const catList = categories.map(c => `${c.icon} ${c.name} — ${c.description}`).join('\n')

  let userCtx = ''
  if (appCtx) {
    const { briefAnswers, eventDetails, selectedSuppliers, cart, firestoreUser } = appCtx

    if (firestoreUser?.displayName || firestoreUser?.full_name) {
      userCtx += `\nשם המשתמש: ${firestoreUser?.displayName || firestoreUser?.full_name}`
    }
    if (briefAnswers?.eventType) {
      userCtx += `\nסוג האירוע שמתכנן: ${briefAnswers.eventType}`
    }
    if (briefAnswers?.scale) {
      const scales = { intimate: 'עד 30 אורחים', medium: 'כ-75 אורחים', grand: '150+ אורחים' }
      userCtx += `\nגודל אירוע: ${scales[briefAnswers.scale] || briefAnswers.scale}`
    }
    if (briefAnswers?.date) {
      userCtx += `\nתאריך: ${briefAnswers.date}`
    }
    if (briefAnswers?.budgetTier) {
      userCtx += `\nרמת תקציב: ${briefAnswers.budgetTier}`
    }
    if (eventDetails?.city) {
      userCtx += `\nעיר האירוע: ${eventDetails.city}`
    }
    const selected = Object.values(selectedSuppliers || {})
    if (selected.length > 0) {
      userCtx += `\nספקים שכבר נבחרו: ${selected.map(s => s.name).join(', ')}`
    }
    const cartItems = (cart || [])
    if (cartItems.length > 0) {
      userCtx += `\nפריטים בסל: ${cartItems.map(c => `${c.item?.label} (${c.supplierName})`).join(', ')}`
    }
  }

  return `אתה EVO AI — עוזר חכם לתכנון אירועים בישראל. אתה פועל אך ורק בתוך פלטפורמת EVO ואין לך גישה לשום מקור חיצוני.

⛔ חוק ברזל — אי אפשר לעבור עליו בשום מצב ⛔
אסור בהחלט לומר "חפש באינטרנט", "גוגל", "האתר שלו", "רשתות חברתיות", "אינסטגרם", "פייסבוק", "אתר", "ווב", "online", "ברשת" — בשום ניסוח ובשום הקשר. אם מידע לא קיים ב-EVO — אמור: "פרטי הקשר לא זמינים ב-EVO כרגע" ועצור שם. אל תציע שום חלופה חיצונית.

━━ כללי עברית — חובה מוחלטת ━━
• עברית תקנית בלבד. אין שגיאות כתיב.
• אסור בהחלט לערבב אנגלית בתוך מילה עברית (כמו "שמthingאחר"). אם אין מילה בעברית — תמצא תחליף עברי.
• ריבוי: "ספקים" (לא ספקיים), "אירועים" (לא אירועיים), "שירותים" (לא שירותיים)
• פעלים: "צריך" (לא צריכ), "יכול" (לא יכל), "נותן" (לא נוטן)
• תחביר: משפטים קצרים. אל תתחיל משפט ב"בנוסף לכך ש...".
• אין !! ו-?? — רק ! ו-? בודדים.
• דבר בגוף שני — "אתה/את" לפי ההקשר.
• אל תשתמש במילים לועזיות מיותרות כשיש עברית טובה.
• לפני שאתה שולח תשובה — קרא אותה שוב ובדוק שאין בה ערבוב שפות או שגיאות כתיב.

━━ כללים קריטיים ━━
1. אתה מכיר רק ספקים הרשומים ב-EVO — אסור להמציא שמות.
2. אם שואלים על ספק שלא ברשימה — אמור שאינו רשום כרגע.
3. אם אין ספק מתאים לקטגוריה — אמור זאת בכנות והצע קטגוריה קרובה.
4. תשובות קצרות ומועילות — לא יותר מ-3-4 משפטים אלא אם שואלים להרחיב.

━━ אסור בהחלט — ללא יוצא מן הכלל ━━
• אסור לומר "חפש באינטרנט", "גוגל", "אתר האינטרנט שלו", "ברשת", "בגוגל" — בשום צורה.
• אסור להפנות לכל מקור חיצוני מחוץ ל-EVO — לא אתרים, לא רשתות חברתיות, לא מנועי חיפוש.
• אם מידע מסוים (טלפון, כתובת, זמינות) לא מופיע ברשימת הספקים — אמור בדיוק: "המידע הזה לא זמין ב-EVO כרגע" ועבור הלאה עם הצעה אחרת בתוך האפליקציה.
• אתה פועל אך ורק בתוך EVO. כל שאלה שדורשת מקור חיצוני — ענה ממה שיש ב-EVO או אמור שאין לך את המידע, ומעולם אל תפנה החוצה.

━━ קטגוריות בפלטפורמה ━━
${catList}

━━ ספקים רשומים ב-EVO ━━
${vendorList || 'אין ספקים רשומים כרגע'}

━━ מידע על המשתמש ━━
${userCtx || 'אין מידע עדיין על האירוע'}

━━ מבנה האפליקציה — ניווט ━━
יש שני מסלולים עיקריים לבניית אירוע:

מסלול 1 — "בנה את האירוע בעצמך":
  המשתמש בוחר קטגוריה (הגברה, צילום, קייטרינג וכו'), רואה ספקים, בוחר חבילה, מוסיף לסל ומשלם.
  → כשמשתמש רוצה לסגור ספקים בעצמו — סיים את התשובה עם: [NAV:categories]

מסלול 2 — "בנה עם EVO AI":
  המשתמש מתאר את האירוע, ה-AI בונה חבילה שלמה עם ספקים מותאמים.
  → כשמשתמש רוצה שה-AI יבחר בשבילו — סיים את התשובה עם: [NAV:aiprompt]

כללי שימוש בתגי ניווט — חמורים ביותר:
  • הוסף [NAV:categories] רק אם המשתמש אמר במפורש משהו כמו "רוצה לבחור ספקים", "בנה בעצמי", "רוצה לגלוש בספקים"
  • הוסף [NAV:aiprompt] רק אם המשתמש אמר במפורש "תבנה לי", "בנה עם AI", "רוצה שה-AI יבחר"
  • שאלות כלליות, ברכות, שאלות על סוג אירוע, תקציב, ספקים — אסור בהחלט להוסיף תג ניווט
  • בממוצע: תג ניווט צריך להופיע לא יותר מפעם אחת בשיחה שלמה, ורק בסוף שיחה שהגיעה להחלטה
  • אם לא ברור לחלוטין — אל תוסיף תג. עדיף לא להוסיף בכלל מאשר להוסיף בטרם עת
  • אל תסביר את התג — הוא מוסתר מהמשתמש

דפים נוספים:
  • "האירועים שלי" — רשימת האירועים שנוצרו
  • "הסל שלי" — ספקים שנבחרו לפני תשלום

━━ כיצד לעזור ━━
• תכנון אירוע — שאל שאלות ממוקדות (סוג, תאריך, מיקום, תקציב)
• המלצות ספקים — מהרשימה בלבד, לפי עיר וקטגוריה
• הערכת תקציב — תן טווח ריאלי לפי גודל האירוע
• כשהמשתמש רוצה לסגור ספקים — הפנה למסלול הנכון (בעצמו או עם AI)
• כשהמשתמש בחר ספקים — אשר שהבחירה הגיונית`
}

function fixHebrew(text) {
  return text
    // ריבוי שגוי
    .replace(/ספקיים/g, 'ספקים')
    .replace(/אירועיים/g, 'אירועים')
    .replace(/מחירים גבוהיים/g, 'מחירים גבוהים')
    .replace(/לקוחיים/g, 'לקוחות')
    .replace(/ניסיונות רבים/g, 'ניסיון רב')
    .replace(/אנשיים/g, 'אנשים')
    .replace(/פריטיים/g, 'פריטים')
    .replace(/שירותיים/g, 'שירותים')
    // כתיב שגוי נפוץ
    .replace(/\bצריכ\b/g, 'צריך')
    .replace(/\bיכל\b/g, 'יכול')
    .replace(/\bמוצאים\b/g, 'מוצאים')
    .replace(/\bהספקיים\b/g, 'הספקים')
    .replace(/\bמוצרים גדולים\b/g, 'מוצרים')
    .replace(/\bתכניות\b/g, 'תוכניות')
    .replace(/\bמיוחדת ביותר\b/g, 'מיוחדת')
    .replace(/\bהכי מומלצת\b/g, 'המומלצת ביותר')
    // ניקוד עברי נפוץ - מה→מה, לא→לא
    .replace(/\bבגלאי\b/g, 'בגלל')
    .replace(/\bמשהוא\b/g, 'משהו')
    .replace(/\bאולאי\b/g, 'אולי')
    .replace(/\bבאמת שלא\b/g, 'לא באמת')
    // מילות קישור שגויות
    .replace(/\bבנוסף לכך ש\b/g, 'בנוסף,')
    .replace(/\bכמו כן,? ש/g, 'כמו כן,')
    // ניקוד כפול
    .replace(/!!+/g, '!')
    .replace(/\?\?+/g, '?')
    .replace(/\.\.\.\.+/g, '...')
    // אנגלית שנתקעה בתוך מילה עברית — מחיקה (למשל "שמthingאחר" → "שמשהו אחר")
    .replace(/[\u0590-\u05FF]+[a-zA-Z]+[\u0590-\u05FF]*/g, m => m.replace(/[a-zA-Z]+/g, ''))
    // מילה אנגלית בודדת בתוך משפט עברי — הסרה
    .replace(/([\u0590-\u05FF\s,."'!?]+)\b[a-zA-Z]{3,}\b([\u0590-\u05FF\s,."'!?]+)/g, '$1$2')
    // רווחים כפולים (שוב, אחרי כל הניקויים)
    .replace(/  +/g, ' ')
    .trim()
}

// מסנן כל הפנייה חיצונית מחוץ ל-EVO
function removeExternalReferrals(text) {
  const sentences = text.split(/(?<=[.!?])\s+/)
  const filtered = sentences.filter(s => {
    const lower = s.toLowerCase()
    return !(
      lower.includes('באינטרנט') ||
      lower.includes('בגוגל') ||
      lower.includes('גוגל') ||
      lower.includes('האתר שלו') ||
      lower.includes('אתר האינטרנט') ||
      lower.includes('רשתות חברתיות') ||
      lower.includes('אינסטגרם') ||
      lower.includes('פייסבוק') ||
      lower.includes('לינקדאין') ||
      lower.includes('online') ||
      lower.includes('ברשת') ||
      lower.includes('חפש את') ||
      lower.includes('לחפש את ה') ||
      lower.includes('דרך האתר') ||
      lower.includes('דרך הרשת')
    )
  })
  return filtered.join(' ').trim()
}

export async function sendMessage(messages, appCtx = null) {
  if (!client) {
    return 'שירות ה-AI אינו מוגדר. הגדר VITE_GROQ_API_KEY ב-.env'
  }
  try {
    const vendorList = await getVendorContext()
    const systemPrompt = buildSystemPrompt(vendorList, appCtx)
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1024,
    })
    const raw = response.choices[0]?.message?.content || 'לא הצלחתי לענות, נסה שנית.'
    return fixHebrew(removeExternalReferrals(raw))
  } catch (err) {
    console.error('Groq error:', err)
    return 'שגיאה בשירות ה-AI. נסה שנית.'
  }
}

export function clearVendorCache() { vendorCache = null }
