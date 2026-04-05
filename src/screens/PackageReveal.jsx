import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Zap, AlertCircle, Star, RefreshCw, MapPin, UtensilsCrossed, Music, Lightbulb, Flower2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import SwapSheet from '../components/SwapSheet'
import Badge from '../components/ui/Badge'

const TUNE_OPTIONS = [
  { id: 'formal',    label: 'More formal' },
  { id: 'casual',    label: 'More casual' },
  { id: 'minimal',   label: 'More minimal' },
  { id: 'abundant',  label: 'More abundant' },
  { id: 'romantic',  label: 'More romantic' },
  { id: 'energetic', label: 'More energetic' },
]

function TuneSheet({ onClose }) {
  const [selected, setSelected] = useState(null)
  const { navigate } = useApp()
  return (
    <AnimatePresence>
      <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.7)' }}
        onClick={onClose} />
      <motion.div key="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-10 pt-6"
        style={{ background: 'var(--surface)', borderRadius: '24px 24px 0 0', border: '1px solid var(--border)', boxShadow: '0 -4px 24px rgba(45,27,105,0.10)' }}>
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'var(--border)' }} />
        <p className="label-overline mb-2">Tune the Vibe</p>
        <p className="font-light mb-6" style={{ color: 'var(--text-primary)' }}>What's not quite right?</p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {TUNE_OPTIONS.map(o => (
            <motion.button key={o.id} onClick={() => setSelected(o.id)} whileTap={{ scale: 0.97 }}
              className="py-3 px-4 rounded-xl text-sm font-light transition-all duration-200"
              style={{
                border:     `1px solid ${selected === o.id ? 'var(--primary)' : 'var(--border)'}`,
                color:      selected === o.id ? 'var(--primary)' : 'var(--text-muted)',
                background: selected === o.id ? 'var(--primary-dim)' : 'transparent',
              }}>
              {o.label}
            </motion.button>
          ))}
        </div>
        <motion.button onClick={() => { onClose(); navigate('building') }} disabled={!selected}
          whileTap={selected ? { scale: 0.97 } : {}}
          className="w-full py-3.5 text-sm font-semibold tracking-wider uppercase transition-all"
          style={{
            borderRadius: 'var(--radius-pill)',
            background: selected ? 'var(--primary)' : 'transparent',
            color: selected ? '#fff' : 'var(--primary)',
            border: selected ? 'none' : '1px solid var(--primary)',
            opacity: selected ? 1 : 0.35,
          }}>
          Apply &amp; Rebuild
        </motion.button>
        <button onClick={onClose} className="w-full mt-3 py-2 text-sm text-center"
          style={{ color: 'var(--text-muted)' }}>Cancel</button>
      </motion.div>
    </AnimatePresence>
  )
}

const CATEGORY_META = {
  venue:         { label: 'The Space',         Icon: MapPin,         tagline: 'Where the evening begins' },
  catering:      { label: 'The Table',         Icon: UtensilsCrossed, tagline: 'Food worth lingering over' },
  entertainment: { label: 'The Sound',         Icon: Music,           tagline: 'Music that moves the room' },
  lighting:      { label: 'The Atmosphere',    Icon: Lightbulb,       tagline: 'Light that shapes the mood' },
  decor:         { label: 'The Feeling',       Icon: Flower2,         tagline: 'Details that tell your story' },
}

// Atmospheric mood words per vibe category
const MOOD_NARRATIVE = {
  venue:         ['intimate', 'warm', 'atmospheric', 'considered'],
  catering:      ['generous', 'refined', 'unforgettable', 'crafted'],
  entertainment: ['alive', 'resonant', 'curated', 'electric'],
  lighting:      ['golden', 'sculpted', 'soft', 'dramatic'],
  decor:         ['textured', 'layered', 'personal', 'beautiful'],
}

function SectionMoodWords({ sectionId }) {
  const words = MOOD_NARRATIVE[sectionId] || ['curated', 'intentional', 'personal', 'refined']
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {words.map(w => (
        <span key={w} className="text-[11px] tracking-widest uppercase px-3 py-1 rounded-full"
          style={{ background: 'rgba(45,27,105,0.06)', color: 'var(--primary)', border: '1px solid rgba(45,27,105,0.12)' }}>
          {w}
        </span>
      ))}
    </div>
  )
}

export default function PackageReveal() {
  const { navigate, eventPackage, openSwapSheet } = useApp()
  const [tuneOpen, setTuneOpen] = useState(false)

  if (!eventPackage) return (
    <div className="w-full min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="w-full min-h-screen overflow-y-auto pb-32" style={{ background: 'var(--background)' }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: '75vw', maxHeight: 400, minHeight: 280 }}>
        <motion.img src={eventPackage.heroImage} alt=""
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }} animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,10,15,0.2) 0%, rgba(8,10,15,0.05) 40%, rgba(8,10,15,1) 100%)' }} />

        <button onClick={() => navigate('building')}
          className="absolute top-12 left-5 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <ArrowLeft size={18} className="text-white" />
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 text-center px-8 pb-8">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(200,169,110,0.9)' }}>
            EVO Built This For You
          </p>
          <h1 className="font-display text-[30px] sm:text-[36px] font-light text-white leading-tight">
            {eventPackage.name}
          </h1>
        </motion.div>
      </div>

      {/* Tags */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="flex gap-2 justify-center px-6 mt-6 mb-4 flex-wrap">
        {eventPackage.tags.map(tag => <Badge key={tag} label={tag} variant="neutral" size="sm" />)}
      </motion.div>

      {/* Narrative description */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="px-8 mb-12 text-center">
        <p className="text-base font-light leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
          {eventPackage.description}
        </p>
      </motion.div>

      {/* Sections — visual story only, no prices */}
      <div className="space-y-0">
        {eventPackage.sections.map((section, i) => {
          const meta = CATEGORY_META[section.id] || { label: section.label, Icon: MapPin, tagline: '' }
          const Icon = meta.Icon
          return (
            <motion.div key={section.id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}>

              {/* Category overline */}
              <div className="flex items-center gap-3 px-6 mb-5 mt-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--primary-dim)', border: '1px solid var(--primary-glow)' }}>
                  <Icon size={15} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: 'var(--primary)' }}>
                    {meta.label}
                  </p>
                  <p className="text-xs font-light italic" style={{ color: 'var(--text-dim)' }}>{meta.tagline}</p>
                </div>
              </div>

              {/* Full-bleed section image */}
              <div className="relative overflow-hidden mx-6 mb-6" style={{ height: 220, borderRadius: 'var(--radius)' }}>
                <motion.img src={section.image} alt={section.label}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.05 }} animate={{ scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.2 + i * 0.1 }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,10,15,0.8) 0%, transparent 50%)' }} />
                <div className="absolute bottom-4 left-5 right-5">
                  <h3 className="text-white text-lg font-semibold">{section.vendor.name}</h3>
                  {section.vendor.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={11}
                          style={{ color: '#C8A96E', fill: s <= Math.round(section.vendor.rating) ? '#C8A96E' : 'none' }}
                        />
                      ))}
                      <span className="text-xs ml-1 text-white opacity-70">{section.vendor.rating}</span>
                      {section.vendor.reviewCount && (
                        <span className="text-xs opacity-50 text-white">· {section.vendor.reviewCount} reviews</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Vendor story */}
              <div className="px-6 mb-5">
                <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
                  {section.vendor.description}
                </p>
                <SectionMoodWords sectionId={section.id} />
              </div>

              {/* Why EVO chose this */}
              {section.vendor.whyChosen && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.12 + 0.1 }}
                  className="mx-6 mb-5 p-4 rounded-2xl flex gap-3 items-start"
                  style={{ background: 'rgba(200,169,110,0.06)', border: '1px solid rgba(200,169,110,0.18)' }}>
                  <Zap size={13} className="shrink-0 mt-0.5" style={{ color: '#C8A96E' }} />
                  <div>
                    <p className="text-[10px] tracking-[0.18em] uppercase mb-1 font-semibold" style={{ color: '#C8A96E' }}>
                      Why EVO chose this
                    </p>
                    <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {section.vendor.whyChosen}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Constraint */}
              {section.constraint && (
                <div className="mx-6 mb-5 p-4 rounded-2xl flex gap-3 items-start"
                  style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: '#FBBF24' }} />
                  <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {section.constraint.message}
                  </p>
                </div>
              )}

              {/* Swap */}
              <div className="px-6 mb-8">
                <motion.button onClick={() => openSwapSheet(section.id)} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 text-xs tracking-wide px-4 py-2 rounded-full transition-all"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--elevated)' }}>
                  <RefreshCw size={11} /> Change {meta.label.toLowerCase()}
                </motion.button>
              </div>

              {i < eventPackage.sections.length - 1 && (
                <div className="mx-6 h-px mb-10" style={{ background: 'var(--border)' }} />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Closing narrative */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="mx-6 mt-6 mb-8 p-6 rounded-3xl text-center"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--primary)' }}>
          The full picture
        </p>
        <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
          Every element here was chosen with intention — not just to fill a checklist, but to create a feeling. This is the version of your event that EVO believes in.
        </p>
      </motion.div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 z-30"
        style={{ background: 'rgba(245,245,247,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)' }}>
        <motion.button onClick={() => navigate('summary')} whileTap={{ scale: 0.98 }}
          className="w-full py-4 text-sm font-semibold tracking-wider uppercase transition-all mb-3"
          style={{ borderRadius: 'var(--radius-pill)', background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-accent)' }}>
          Review vendors &amp; confirm →
        </motion.button>
        <button onClick={() => setTuneOpen(true)}
          className="w-full py-2 text-sm tracking-wide text-center"
          style={{ color: 'var(--primary)' }}>
          Tune the vibe
        </button>
      </div>

      <SwapSheet />
      {tuneOpen && <TuneSheet onClose={() => setTuneOpen(false)} />}
    </div>
  )
}
