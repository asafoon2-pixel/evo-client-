import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { eventPackages } from '../data/index'
import { onAuthChange, logout } from '../lib/authService'
import { getUser } from '../lib/usersService'
import { createEvent } from '../lib/eventsService'

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

function detectVibeFromText(text) {
  const t = text.toLowerCase()
  const score = (patterns) => patterns.reduce((n, p) => n + (t.match(p) || []).length, 0)
  const scores = {
    luxury:    score([/class/g, /luxur/g, /elegan/g, /black.?tie/g, /gala/g, /champagne/g, /refined/g, /candl/g, /gold/g, /formal/g, /intimate/g, /upscale/g, /premium/g, /fine.?din/g]),
    outdoor:   score([/outdoor/g, /garden/g, /nature/g, /open.?air/g, /rooftop/g, /terrace/g, /fresh/g, /botanical/g, /picnic/g, /beach/g, /vineyard/g, /forest/g]),
    corporate: score([/corporate/g, /business/g, /professional/g, /conference/g, /meeting/g, /summit/g, /networking/g, /launch/g, /office/g, /brand/g, /startup/g, /company/g]),
    energetic: score([/party/g, /danc/g, /energe/g, /fun/g, /celebrat/g, /electric/g, /vibrant/g, /festival/g, /club/g, /dj/g, /rave/g, /lively/g, /loud/g, /birthday/g]),
  }
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
  const [currentScreen, setCurrentScreen]     = useState('home')
  const [currentUser, setCurrentUser]         = useState(null)
  const [authLoading, setAuthLoading]         = useState(true)
  const [authIntent, setAuthIntent]           = useState(null)
  const [firestoreUser, setFirestoreUser]     = useState(null)
  const [currentEventId, setCurrentEventId]  = useState(null)

  useEffect(() => {
    const unsub = onAuthChange(async user => {
      setCurrentUser(user)
      setAuthLoading(false)
      if (user) {
        try {
          const doc = await getUser(user.uid)
          setFirestoreUser(doc)
        } catch (_) {}
      } else {
        setFirestoreUser(null)
      }
    })
    return unsub
  }, [])
  const [swipeResults, setSwipeResults]       = useState([])
  const [briefAnswers, setBriefAnswers]       = useState({ eventType: null, scale: null, date: null, budgetTier: null, startTime: '19:00', endTime: '23:00', indoorOutdoor: null, hasVenue: null })
  const [eventPackage, setEventPackage]       = useState(null)
  const [swapSheet, setSwapSheet]             = useState({ open: false, sectionId: null })
  const [tuneVibeOpen, setTuneVibeOpen]       = useState(false)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [currentSupplier, setCurrentSupplier] = useState(null)
  const [selectedSuppliers, setSelectedSuppliers] = useState({})
  const [generatedEvent, setGeneratedEvent]   = useState({ name: 'Your Curated Evening' })
  const [userProfile, setUserProfile]         = useState({ fullName: '', phone: '', preferredContact: 'whatsapp', email: '', instagramHandle: '', preferredLanguage: 'en' })
  const [eventDetails, setEventDetails]       = useState({ title: '', city: '', venueName: '', fullAddress: '', floor: '', entranceNotes: '', parkingAvailable: null, parkingNotes: '', specialRequests: '', isPrivate: false })

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

  const updateProfile = useCallback((key, value) => {
    setUserProfile(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateEventDetails = useCallback((key, value) => {
    setEventDetails(prev => ({ ...prev, [key]: value }))
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

  const buildPackageFromText = useCallback((text, answers) => {
    const resolvedAnswers = answers || briefAnswers
    const vibe = detectVibeFromText(text || '')
    const base = eventPackages[vibe] || eventPackages.curated
    const tier = resolvedAnswers?.budgetTier
    const multiplier = tier === 'essential' ? 0.65 : tier === 'signature' ? 1.5 : 1.0
    const pkg = applyBudgetMultiplier(base, multiplier)
    const sections = resolvedAnswers?.hasVenue === true
      ? pkg.sections.filter(s => s.id !== 'venue')
      : pkg.sections
    const withTracking = {
      ...pkg,
      sections: sections.map(s => ({ ...s, currentVendorId: s.vendor.id })),
    }
    setEventPackage(withTracking)
    return withTracking
  }, [briefAnswers])

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

  // Save event to Firestore when user confirms at checkout
  const createEventInDb = useCallback(async () => {
    if (!currentUser) return null
    const guestMap = { intimate: 30, medium: 75, grand: 150 }
    try {
      const eventId = await createEvent(currentUser.uid, {
        title:             generatedEvent?.name || 'האירוע שלי',
        type:              briefAnswers.eventType              || '',
        date:              briefAnswers.date !== 'flexible' ? briefAnswers.date : '',
        start_time:        briefAnswers.startTime              || '',
        end_time:          briefAnswers.endTime                || '',
        indoor_outdoor:    briefAnswers.indoorOutdoor          || '',
        guest_count:       guestMap[briefAnswers.scale]        || null,
        budget_range:      briefAnswers.budgetTier             || '',
        budget_exact:      totalPrice                          || 0,
        venue_name:        eventDetails.venueName              || '',
        full_address:      eventDetails.fullAddress            || '',
        city:              eventDetails.city                   || '',
        floor:             eventDetails.floor                  || '',
        entrance_notes:    eventDetails.entranceNotes          || '',
        parking_available: eventDetails.parkingAvailable       || false,
        parking_notes:     eventDetails.parkingNotes           || '',
        special_requests:  eventDetails.specialRequests        || '',
        is_private:        eventDetails.isPrivate              || false,
        status:            'active',
      })
      setCurrentEventId(eventId)
      return eventId
    } catch (e) {
      console.error('createEventInDb failed:', e)
      return null
    }
  }, [currentUser, briefAnswers, eventDetails, generatedEvent, totalPrice])

  const signOut = useCallback(async () => {
    await logout()
    setCurrentUser(null)
    setFirestoreUser(null)
    setCurrentEventId(null)
    navigate('home')
  }, [])

  const value = {
    currentScreen, navigate,
    currentUser, authLoading, signOut,
    firestoreUser, setFirestoreUser,
    currentEventId, createEventInDb,
    authIntent, setAuthIntent,
    swipeResults, addSwipe,
    briefAnswers, updateBrief,
    eventPackage, setEventPackage, buildPackage, buildPackageFromText,
    userProfile, updateProfile,
    eventDetails, updateEventDetails,
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
