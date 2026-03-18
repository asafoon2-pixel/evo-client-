import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion'

export default function SwipeCard({ card, onSwipe, isTop, stackIndex }) {
  const x = useMotionValue(0)
  const controls = useAnimation()
  const dragStartX = useRef(0)

  const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18])
  const yesOpacity = useTransform(x, [20, 80], [0, 1])
  const passOpacity = useTransform(x, [-80, -20], [1, 0])

  const scale = isTop ? 1 : stackIndex === 1 ? 0.95 : 0.9
  const yOffset = isTop ? 0 : stackIndex === 1 ? 12 : 24

  const handleDragEnd = async (event, info) => {
    const threshold = 80
    if (info.offset.x > threshold) {
      await controls.start({
        x: 600,
        opacity: 0,
        transition: { duration: 0.35, ease: 'easeOut' },
      })
      onSwipe('right', card)
    } else if (info.offset.x < -threshold) {
      await controls.start({
        x: -600,
        opacity: 0,
        transition: { duration: 0.35, ease: 'easeOut' },
      })
      onSwipe('left', card)
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } })
    }
  }

  return (
    <motion.div
      className="swipe-card absolute inset-0"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale,
        y: yOffset,
        zIndex: isTop ? 10 : stackIndex === 1 ? 9 : 8,
        originY: 1,
      }}
      animate={isTop ? controls : { scale, y: yOffset }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-evo-card shadow-2xl select-none">
        {/* Background image */}
        <img
          src={card.image}
          alt={card.label}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* Category pill */}
        <div className="absolute top-5 left-5">
          <span className="text-xs font-medium tracking-widest uppercase bg-black/60 backdrop-blur-sm text-evo-muted border border-evo-border px-3 py-1.5 rounded-full">
            {card.category}
          </span>
        </div>

        {/* YES indicator */}
        {isTop && (
          <motion.div
            className="absolute top-6 left-6 border-2 border-green-400 rounded-lg px-4 py-2 rotate-[-12deg]"
            style={{ opacity: yesOpacity }}
          >
            <span className="text-green-400 font-bold text-xl tracking-widest">YES</span>
          </motion.div>
        )}

        {/* PASS indicator */}
        {isTop && (
          <motion.div
            className="absolute top-6 right-6 border-2 border-white/60 rounded-lg px-4 py-2 rotate-[12deg]"
            style={{ opacity: passOpacity }}
          >
            <span className="text-white/80 font-bold text-xl tracking-widest">PASS</span>
          </motion.div>
        )}

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <h3 className="text-2xl font-light text-white tracking-wide leading-snug">
            {card.label}
          </h3>
          <div className="flex gap-2 mt-3 flex-wrap">
            {card.tags.map(tag => (
              <span key={tag} className="text-xs text-evo-muted tracking-wide">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
