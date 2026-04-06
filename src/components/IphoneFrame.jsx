/**
 * IphoneFrame — Desktop-only visual overlay.
 *
 * On desktop (>= 500px): renders a fixed, pointer-events:none iPhone 15 Pro
 * chrome around the centered 430px content column. The content itself is NOT
 * affected — fixed/sticky positioning still works normally.
 *
 * On mobile: renders nothing.
 */
export default function IphoneFrame() {
  return (
    <>
      {/* Desktop iPhone chrome overlay */}
      <div
        className="hidden sm:block"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 434,  /* matches max-w-md (28rem = 448px) with frame inset */
          height: '94vh',
          maxHeight: 860,
          minHeight: 700,
          borderRadius: 50,
          /* Titanium frame */
          border: '10px solid #3A3A3C',
          boxShadow: `
            inset 0 0 0 1px rgba(255,255,255,0.12),
            inset 0 0 0 2px rgba(0,0,0,0.3),
            0 40px 80px rgba(44,32,22,0.35),
            0 10px 30px rgba(44,32,22,0.2),
            /* Cream mask outside frame */
            0 0 0 200vw #F5F0E8
          `,
          pointerEvents: 'none',
          zIndex: 900,
          /* Side buttons decoration */
          outline: 'none',
        }}
      >
        {/* Dynamic Island */}
        <div style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 120,
          height: 34,
          borderRadius: 18,
          background: '#000',
          zIndex: 2,
        }} />

        {/* Screen glare */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 41,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* Side button decorations (left) */}
        <div style={{
          position: 'absolute',
          left: -14,
          top: 80,
          width: 4,
          height: 28,
          borderRadius: 2,
          background: '#3A3A3C',
        }} />
        <div style={{
          position: 'absolute',
          left: -14,
          top: 118,
          width: 4,
          height: 44,
          borderRadius: 2,
          background: '#3A3A3C',
        }} />
        <div style={{
          position: 'absolute',
          left: -14,
          top: 172,
          width: 4,
          height: 44,
          borderRadius: 2,
          background: '#3A3A3C',
        }} />

        {/* Power button (right) */}
        <div style={{
          position: 'absolute',
          right: -14,
          top: 130,
          width: 4,
          height: 64,
          borderRadius: 2,
          background: '#3A3A3C',
        }} />
      </div>
    </>
  )
}
