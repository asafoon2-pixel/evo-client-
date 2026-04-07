// Shared illustrated SVG icons for the event world — used in Splash, DrawIconSplash, PackageReveal
export function DiscoBall({ size = 48 }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 48 58" fill="none">
      <line x1="24" y1="0" x2="24" y2="8" stroke="#6B5FE4" strokeWidth="2" strokeLinecap="round"/>
      <rect x="19" y="5" width="10" height="5" rx="2" stroke="#6B5FE4" strokeWidth="1.5" fill="none"/>
      <circle cx="24" cy="28" r="16" stroke="#6B5FE4" strokeWidth="2"/>
      <ellipse cx="24" cy="28" rx="8" ry="16" stroke="#6B5FE4" strokeWidth="1.5"/>
      <line x1="8" y1="28" x2="40" y2="28" stroke="#6B5FE4" strokeWidth="1.5"/>
      <line x1="9" y1="21" x2="39" y2="21" stroke="#6B5FE4" strokeWidth="1"/>
      <line x1="9" y1="35" x2="39" y2="35" stroke="#6B5FE4" strokeWidth="1"/>
      <circle cx="10" cy="22" r="2.5" fill="#E8B86D" opacity="0.9"/>
      <circle cx="38" cy="34" r="2.5" fill="#F2C49B" opacity="0.9"/>
      <circle cx="12" cy="36" r="2" fill="#6B5FE4" opacity="0.6"/>
    </svg>
  )
}

export function Cocktail({ size = 44 }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 44 54" fill="none">
      <path d="M4 6 L22 28 L40 6 Z" stroke="#E8B86D" strokeWidth="2" strokeLinejoin="round" fill="rgba(232,184,109,0.12)"/>
      <line x1="22" y1="28" x2="22" y2="46" stroke="#E8B86D" strokeWidth="2" strokeLinecap="round"/>
      <line x1="13" y1="46" x2="31" y2="46" stroke="#E8B86D" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="31" cy="15" r="3.5" fill="#D4607A" opacity="0.85"/>
      <circle cx="15" cy="12" r="3" fill="#4A9E72" opacity="0.85"/>
      <path d="M33 8 Q39 4 35 11" stroke="#4A9E72" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

export function Speaker({ size = 44 }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 44 48" fill="none">
      <rect x="6" y="4" width="32" height="40" rx="7" stroke="#6B5FE4" strokeWidth="2" fill="rgba(107,95,228,0.06)"/>
      <circle cx="22" cy="29" r="10" stroke="#6B5FE4" strokeWidth="2"/>
      <circle cx="22" cy="29" r="4.5" stroke="#6B5FE4" strokeWidth="1.5" fill="rgba(107,95,228,0.12)"/>
      <rect x="16" y="11" width="12" height="7" rx="3.5" stroke="#E8B86D" strokeWidth="1.5" fill="rgba(232,184,109,0.15)"/>
    </svg>
  )
}

export function Confetti({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="8" y="12" width="9" height="9" rx="2.5" fill="#6B5FE4" opacity="0.8" transform="rotate(15 12 16)"/>
      <rect x="30" y="6" width="7" height="7" rx="2" fill="#E8B86D" opacity="0.9" transform="rotate(-20 33 9)"/>
      <rect x="33" y="28" width="8" height="8" rx="2.5" fill="#D4607A" opacity="0.75" transform="rotate(30 37 32)"/>
      <rect x="6" y="30" width="6" height="6" rx="2" fill="#4A9E72" opacity="0.8" transform="rotate(-10 9 33)"/>
      <circle cx="24" cy="24" r="3.5" fill="#F2C49B"/>
      <circle cx="38" cy="14" r="3" fill="#6B5FE4" opacity="0.55"/>
      <circle cx="10" cy="42" r="2.5" fill="#E8B86D" opacity="0.7"/>
      <line x1="20" y1="8" x2="24" y2="3" stroke="#6B5FE4" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="40" y1="22" x2="45" y2="17" stroke="#D4607A" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="38" x2="10" y2="43" stroke="#4A9E72" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function Microphone({ size = 40 }) {
  return (
    <svg width={size} height={size * 1.35} viewBox="0 0 40 54" fill="none">
      <rect x="11" y="2" width="18" height="28" rx="9" stroke="#2C2016" strokeWidth="2" fill="rgba(44,32,22,0.05)"/>
      <rect x="14" y="9" width="4" height="4" rx="2" fill="#6B5FE4"/>
      <rect x="22" y="9" width="4" height="4" rx="2" fill="#6B5FE4"/>
      <rect x="14" y="16" width="4" height="4" rx="2" fill="#6B5FE4"/>
      <rect x="22" y="16" width="4" height="4" rx="2" fill="#6B5FE4"/>
      <rect x="14" y="23" width="4" height="4" rx="2" fill="#E8B86D"/>
      <rect x="22" y="23" width="4" height="4" rx="2" fill="#E8B86D"/>
      <path d="M6 24 Q6 38 20 38 Q34 38 34 24" stroke="#2C2016" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <line x1="20" y1="38" x2="20" y2="50" stroke="#2C2016" strokeWidth="2" strokeLinecap="round"/>
      <line x1="11" y1="50" x2="29" y2="50" stroke="#2C2016" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export function StarIcon({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <path d="M22 4 L26.2 15.5 L38.5 15.5 L28.9 22.8 L32.4 34.2 L22 27 L11.6 34.2 L15.1 22.8 L5.5 15.5 L17.8 15.5 Z"
        stroke="#E8B86D" strokeWidth="2" strokeLinejoin="round" fill="rgba(232,184,109,0.15)"/>
      <circle cx="22" cy="21" r="4" fill="#E8B86D" opacity="0.45"/>
    </svg>
  )
}

export const ALL_ICONS = [DiscoBall, Cocktail, Speaker, Confetti, Microphone, StarIcon]
