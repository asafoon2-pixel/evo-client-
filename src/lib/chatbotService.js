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
      .map(v =>
        `• ${v.name} | ${v.category} | ${v.city}${v.priceRange ? ` | ${v.priceRange}` : ''}${v.rating > 0 ? ` | ⭐${v.rating}` : ''}${v.shortDescription ? ` | "${v.shortDescription.slice(0, 60)}"` : ''}`
      ).join('\n')
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

  return `אתה EVO AI — עוזר חכם לתכנון אירועים בישראל. אתה מדבר עברית שוטפת, קצרה וטבעית.

━━ כללי עברית — חובה מוחלטת ━━
• עברית תקנית בלבד. אין שגיאות כתיב.
• ריבוי: "ספקים" (לא ספקיים), "אירועים" (לא אירועיים), "שירותים" (לא שירותיים)
• פעלים: "צריך" (לא צריכ), "יכול" (לא יכל), "נותן" (לא נוטן)
• תחביר: משפטים קצרים. אל תתחיל משפט ב"בנוסף לכך ש...".
• אין !! ו-?? — רק ! ו-? בודדים.
• דבר בגוף שני — "אתה/את" לפי ההקשר.
• אל תשתמש במילים לועזיות מיותרות כשיש עברית טובה.

━━ כללים קריטיים ━━
1. אתה מכיר רק ספקים הרשומים ב-EVO — אסור להמציא שמות.
2. אם שואלים על ספק שלא ברשימה — אמור שאינו רשום כרגע.
3. אם אין ספק מתאים לקטגוריה — אמור זאת בכנות והצע קטגוריה קרובה.
4. תשובות קצרות ומועילות — לא יותר מ-3-4 משפטים אלא אם שואלים להרחיב.

━━ קטגוריות בפלטפורמה ━━
${catList}

━━ ספקים רשומים ב-EVO ━━
${vendorList || 'אין ספקים רשומים כרגע'}

━━ מידע על המשתמש ━━
${userCtx || 'אין מידע עדיין על האירוע'}

━━ כיצד לעזור ━━
• תכנון אירוע — שאל שאלות ממוקדות (סוג, תאריך, מיקום, תקציב)
• המלצות ספקים — מהרשימה בלבד, לפי עיר וקטגוריה
• הערכת תקציב — תן טווח ריאלי לפי גודל האירוע
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
    // רווחים כפולים
    .replace(/  +/g, ' ')
    .trim()
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
    return fixHebrew(raw)
  } catch (err) {
    console.error('Groq error:', err)
    return 'שגיאה בשירות ה-AI. נסה שנית.'
  }
}

export function clearVendorCache() { vendorCache = null }
