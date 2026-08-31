// Hosted URLs for images used inside transactional email HTML.
// Files live in evo-client/public/email/ (served at app.evoevents.co/email/...).
// Also duplicated in evo-supplier/functions/lib/email/assets.js since that's a
// separate deploy target and can't import across repos.
export const EMAIL_ASSETS = {
  logo:         'https://app.evoevents.co/email/evo-logo.png',
  foxConfident: 'https://app.evoevents.co/email/fox-confident.png',
  foxClipboard: 'https://app.evoevents.co/email/fox-clipboard.png',
  foxCalculator: 'https://app.evoevents.co/email/fox-calculator.png',
  foxCheckmark: 'https://app.evoevents.co/email/fox-checkmark.png',
  foxTray:      'https://app.evoevents.co/email/fox-tray.png',
}
