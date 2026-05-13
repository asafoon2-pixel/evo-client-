// Hebrew city names → lat/lng (Israeli cities)
const CITY_COORDS = {
  // Major cities
  'תל אביב':         { lat: 32.0853, lng: 34.7818 },
  'ירושלים':         { lat: 31.7683, lng: 35.2137 },
  'חיפה':            { lat: 32.7940, lng: 34.9896 },
  'באר שבע':         { lat: 31.2519, lng: 34.7993 },
  'נתניה':           { lat: 32.3326, lng: 34.8600 },
  'אשדוד':           { lat: 31.8044, lng: 34.6553 },
  'אשקלון':          { lat: 31.6690, lng: 34.5714 },
  'פתח תקווה':       { lat: 32.0841, lng: 34.8878 },
  'ראשון לציון':     { lat: 31.9730, lng: 34.7925 },
  'בני ברק':         { lat: 32.0833, lng: 34.8333 },
  'רמת גן':          { lat: 32.0700, lng: 34.8238 },
  'חולון':           { lat: 32.0115, lng: 34.7733 },
  'בת ים':           { lat: 32.0200, lng: 34.7500 },
  'רחובות':          { lat: 31.8928, lng: 34.8113 },
  'הרצליה':          { lat: 32.1660, lng: 34.8441 },
  'כפר סבא':         { lat: 32.1752, lng: 34.9077 },
  'רעננה':           { lat: 32.1840, lng: 34.8710 },
  'מודיעין':         { lat: 31.8975, lng: 35.0106 },
  'מודיעין-מכבים-רעות': { lat: 31.8975, lng: 35.0106 },
  'נס ציונה':        { lat: 31.9297, lng: 34.7984 },
  'לוד':             { lat: 31.9527, lng: 34.8954 },
  'רמלה':            { lat: 31.9297, lng: 34.8731 },
  'הוד השרון':       { lat: 32.1500, lng: 34.8900 },
  'גבעתיים':         { lat: 32.0667, lng: 34.8167 },
  'קריית גת':        { lat: 31.6100, lng: 34.7642 },
  'אילת':            { lat: 29.5577, lng: 34.9519 },
  'עפולה':           { lat: 32.6079, lng: 35.2900 },
  'נהריה':           { lat: 33.0043, lng: 35.0948 },
  'כרמיאל':          { lat: 32.9140, lng: 35.2958 },
  'טבריה':           { lat: 32.7940, lng: 35.5300 },
  'צפת':             { lat: 32.9647, lng: 35.4960 },
  'עכו':             { lat: 32.9281, lng: 35.0818 },
  'נצרת':            { lat: 32.7021, lng: 35.2978 },
  'נצרת עילית':      { lat: 32.7050, lng: 35.3280 },
  'נוף הגליל':       { lat: 32.7050, lng: 35.3280 },
  'קריית שמונה':     { lat: 33.2072, lng: 35.5700 },
  'מגדל העמק':       { lat: 32.6762, lng: 35.2397 },
  'טירת כרמל':       { lat: 32.7600, lng: 34.9700 },
  'קריית אתא':       { lat: 32.8069, lng: 35.1063 },
  'קריית ביאליק':    { lat: 32.8367, lng: 35.0800 },
  'קריית מוצקין':    { lat: 32.8333, lng: 35.0833 },
  'קריית ים':        { lat: 32.8500, lng: 35.0667 },
  'גבעת שמואל':      { lat: 32.0792, lng: 34.8461 },
  'אור יהודה':       { lat: 32.0272, lng: 34.8567 },
  'יבנה':            { lat: 31.8767, lng: 34.7437 },
  'גדרה':            { lat: 31.8114, lng: 34.7772 },
  'קריית מלאכי':     { lat: 31.7300, lng: 34.7400 },
  'דימונה':          { lat: 31.0681, lng: 35.0329 },
  'ערד':             { lat: 31.2567, lng: 35.2128 },
  'מצפה רמון':       { lat: 30.6105, lng: 34.8011 },
  'ירוחם':           { lat: 30.9878, lng: 34.9239 },
  'שדרות':           { lat: 31.5218, lng: 34.5967 },
  'קיסריה':          { lat: 32.5000, lng: 34.9000 },
  'זכרון יעקב':      { lat: 32.5697, lng: 34.9481 },
  'פרדס חנה':        { lat: 32.4733, lng: 34.9703 },
  'חדרה':            { lat: 32.4338, lng: 34.9197 },
  'בנימינה':         { lat: 32.5167, lng: 34.9500 },
  'עמק חפר':         { lat: 32.3667, lng: 34.9167 },
  'רמת השרון':       { lat: 32.1467, lng: 34.8408 },
  'אבן יהודה':       { lat: 32.2667, lng: 34.8833 },
  'טול כרם':         { lat: 32.3103, lng: 35.0283 },
  'מעלה אדומים':     { lat: 31.7722, lng: 35.2958 },
  'ביתר עילית':      { lat: 31.6933, lng: 35.1167 },
  'אלעד':            { lat: 32.0519, lng: 34.9467 },
  'קריית ענבים':     { lat: 31.8083, lng: 35.1158 },
  'גן יבנה':         { lat: 31.7933, lng: 34.7133 },
}

// English city names
const CITY_COORDS_EN = {
  'jerusalem':       { lat: 31.7683, lng: 35.2137 },
  'tel aviv':        { lat: 32.0853, lng: 34.7818 },
  'tel-aviv':        { lat: 32.0853, lng: 34.7818 },
  'haifa':           { lat: 32.7940, lng: 34.9896 },
  'beer sheva':      { lat: 31.2519, lng: 34.7993 },
  "be'er sheva":    { lat: 31.2519, lng: 34.7993 },
  'netanya':         { lat: 32.3326, lng: 34.8600 },
  'ashdod':          { lat: 31.8044, lng: 34.6553 },
  'ashkelon':        { lat: 31.6690, lng: 34.5714 },
  'petah tikva':     { lat: 32.0841, lng: 34.8878 },
  'rishon lezion':   { lat: 31.9730, lng: 34.7925 },
  'rishon le-zion':  { lat: 31.9730, lng: 34.7925 },
  'bnei brak':       { lat: 32.0833, lng: 34.8333 },
  'ramat gan':       { lat: 32.0700, lng: 34.8238 },
  'holon':           { lat: 32.0115, lng: 34.7733 },
  'bat yam':         { lat: 32.0200, lng: 34.7500 },
  'rehovot':         { lat: 31.8928, lng: 34.8113 },
  'herzliya':        { lat: 32.1660, lng: 34.8441 },
  'kfar saba':       { lat: 32.1752, lng: 34.9077 },
  'raanana':         { lat: 32.1840, lng: 34.8710 },
  "ra'anana":        { lat: 32.1840, lng: 34.8710 },
  'modiin':          { lat: 31.8975, lng: 35.0106 },
  "modi'in":         { lat: 31.8975, lng: 35.0106 },
  'nes ziona':       { lat: 31.9297, lng: 34.7984 },
  'lod':             { lat: 31.9527, lng: 34.8954 },
  'ramla':           { lat: 31.9297, lng: 34.8731 },
  'hod hasharon':    { lat: 32.1500, lng: 34.8900 },
  'givatayim':       { lat: 32.0667, lng: 34.8167 },
  'kiryat gat':      { lat: 31.6100, lng: 34.7642 },
  'eilat':           { lat: 29.5577, lng: 34.9519 },
  'afula':           { lat: 32.6079, lng: 35.2900 },
  'nahariya':        { lat: 33.0043, lng: 35.0948 },
  'karmiel':         { lat: 32.9140, lng: 35.2958 },
  'tiberias':        { lat: 32.7940, lng: 35.5300 },
  'safed':           { lat: 32.9647, lng: 35.4960 },
  'tzfat':           { lat: 32.9647, lng: 35.4960 },
  'acre':            { lat: 32.9281, lng: 35.0818 },
  'akko':            { lat: 32.9281, lng: 35.0818 },
  'nazareth':        { lat: 32.7021, lng: 35.2978 },
  'kiryat shmona':   { lat: 33.2072, lng: 35.5700 },
  'hadera':          { lat: 32.4338, lng: 34.9197 },
  'caesarea':        { lat: 32.5000, lng: 34.9000 },
  'zichron yaakov':  { lat: 32.5697, lng: 34.9481 },
  'ramat hasharon':  { lat: 32.1467, lng: 34.8408 },
  'maale adumim':    { lat: 31.7722, lng: 35.2958 },
  "ma'ale adumim":   { lat: 31.7722, lng: 35.2958 },
  'yavne':           { lat: 31.8767, lng: 34.7437 },
  'dimona':          { lat: 31.0681, lng: 35.0329 },
  'arad':            { lat: 31.2567, lng: 35.2128 },
  'mitzpe ramon':    { lat: 30.6105, lng: 34.8011 },
  'sderot':          { lat: 31.5218, lng: 34.5967 },
}

const FALLBACK = { lat: 32.0853, lng: 34.7818 } // Tel Aviv

export function geocodeCity(cityName) {
  if (!cityName) return null
  const trimmed = cityName.trim()
  if (!trimmed) return null

  // Exact match
  if (CITY_COORDS[trimmed]) return CITY_COORDS[trimmed]

  // Partial / substring match Hebrew
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (trimmed.includes(key) || key.includes(trimmed)) return coords
  }

  // English match (case-insensitive)
  const lower = trimmed.toLowerCase()
  if (CITY_COORDS_EN[lower]) return CITY_COORDS_EN[lower]
  for (const [key, coords] of Object.entries(CITY_COORDS_EN)) {
    if (lower.includes(key) || key.includes(lower)) return coords
  }

  return FALLBACK
}
