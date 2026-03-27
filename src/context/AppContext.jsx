import React, { createContext, useContext, useState, useCallback } from 'react'
import { eventPackages } from '../data/index'

const AppContext = createContext(null)

function detectVibe(swipeResults) {
  const liked = swipeResults.filter(s => s.direction === 'right')
  const tags = liked.flatMap(s => s.tags || [])
  const count = {}
  tags.forEach(t => { count[t] = (count[t] || 0) + 1 })
  const luxury  = (count.luxury  || 0) + (count.elegant || 0) + (count.premium || 0)
  const outdoor = (count.outdoor || 0) + (count.organic || 0) + (count.relaxed || 0)
  const corp    = (count.formal  || 0) + (count.modern  || 0) + (count.professional || 0)
  const energy  = (count.energetic || 0) + (count.colorful || 0) + (count.fun || 0)
  const scores  = { luxury, outdoor, corporate: corp, energetic: energy }
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  return top[1] > 0 ? top[0] : 'curated'
}

function applyBudgetMultiplier(pkg, multiplier) {
  if (multiplier === 1) return pkg
  return {
    ...pkg,
    sections: pkg.sections.map(s => ({
      ...s,
      vendor: { ...s.vendor, price: Math.round(s.vendor.price * multiplier) },
    })),
  }
}

export function AppProvider({ children }) {
  const [currentScreen, setCurrentScreen]     = useState('entry')
  const [swipeResults, setSwipeResults]       = useState([])
  const [briefAnswers, setBriefAnswers]       = useState({ eventType: null, scale: null, date: null, budgetTier: null, startTime: '19:00', endTime: '23:00' })
  const [eventPackage, setEventPackage]       = useState(null)
  const [swapSheet, setSwapSheet]             = useState({ open: false, sectionId: null })
  const [tuneVibeOpen, setTuneVibeOpen]       = useState(false)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [currentSupplier, setCurrentSupplier] = useState(null)
  const [selectedSuppliers, setSelectedSuppliers] = useState({})
  const [generatedEvent, setGeneratedEvent]   = useState({ name: 'Your Curated Evening' })

  const navigate = useCallback((screen) => setCurrentScreen(screen), [])

  const selectSupplier = useCallback((catId, supplier) => {
    setSelectedSuppliers(prev => ({ ...prev, [catId]: supplier }))
  }, [])

  const removeSupplier = useCallback((catId) => {
    setSelectedSuppliers(prev => {
      const next = { ...prev }
      delete next[catId]
      return next
    })
  }, [])

  const addSwipe = useCallback((card, direction) => {
    setSwipeResults(prev => [...prev, { cardId: card.id, direction, tags: card.tags }])
  }, [])

  const updateBrief = useCallback((key, value) => {
    setBriefAnswers(prev => ({ ...prev, [key]: value }))
  }, [])

  const buildPackage = useCallback((results, answers) => {
    const vibe = detectVibe(results || swipeResults)
    const base = eventPackages[vibe] || eventPackages.curated
    const tier = (answers || briefAnswers)?.budgetTier
    const multiplier = tier === 'essential' ? 0.65 : tier === 'signature' ? 1.5 : 1.0
    const pkg = applyBudgetMultiplier(base, multiplier)
    const withTracking = {
      ...pkg,
      sections: pkg.sections.map(s => ({ ...s, currentVendorId: s.vendor.id })),
    }
    setEventPackage(withTracking)
    return withTracking
  }, [swipeResults, briefAnswers])

  const swapVendor = useCallback((sectionId, alternative) => {
    setEventPackage(prev => {
      if (!prev) return prev
      return {
        ...prev,
        sections: prev.sections.map(s => {
          if (s.id !== sectionId) return s
          const oldVendor = s.vendor
          const newAlternatives = [
            { ...oldVendor, evoNote: 'Your previous selection.' },
            ...s.alternatives.filter(a => a.id !== alternative.id),
          ].slice(0, 2)
          return {
            ...s,
            vendor: {
              id: alternative.id,
              name: alternative.name,
              description: alternative.description,
              price: alternative.price,
              rating: s.vendor.rating,
            },
            alternatives: newAlternatives,
            currentVendorId: alternative.id,
          }
        }),
      }
    })
    setSwapSheet({ open: false, sectionId: null })
  }, [])

  const openSwapSheet  = useCallback((sectionId) => setSwapSheet({ open: true, sectionId }), [])
  const closeSwapSheet = useCallback(() => setSwapSheet({ open: false, sectionId: null }), [])

  const totalPrice = eventPackage
    ? eventPackage.sections.reduce((sum, s) => sum + (s.vendor.price || 0), 0)
    : 0
  const depositAmount = Math.round(totalPrice * 0.2)

  const totalBudget = Object.values(selectedSuppliers).reduce(
    (sum, s) => sum + (s.selectedPackage?.price || s.basePrice || 0),
    0
  )

  const value = {
    currentScreen, navigate,
    swipeResults, addSwipe,
    briefAnswers, updateBrief,
    eventPackage, buildPackage,
    swapSheet, openSwapSheet, closeSwapSheet, swapVendor,
    tuneVibeOpen, setTuneVibeOpen,
    totalPrice, depositAmount,
    currentCategory, setCurrentCategory,
    currentSupplier, setCurrentSupplier,
    selectedSuppliers, selectSupplier, removeSupplier,
    generatedEvent, setGeneratedEvent,
    totalBudget,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
