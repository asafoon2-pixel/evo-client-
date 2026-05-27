import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { onAuthChange, logout } from '../lib/authService'
import { getUser } from '../lib/usersService'
import { createEvent, updateEvent } from '../lib/eventsService'
import { createLead } from '../lib/leadsService'
import { sendClientConfirmationEmail } from '../lib/emailService'

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
  const [cart, setCart]                       = useState([])
  const [chatLead, setChatLead]               = useState(null)

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

  // buildPackage / buildPackageFromText just mark intent — Building.jsx
  // fetches real vendors from Firestore and calls setEventPackage with real data.
  const buildPackage = useCallback((results, answers) => {
    setEventPackage({ name: 'האירוע המיוחד שלך', sections: [] })
  }, [])

  const buildPackageFromText = useCallback((text, answers) => {
    setEventPackage({ name: 'האירוע המיוחד שלך', sections: [] })
  }, [])

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

  const addToCart = useCallback((supplierId, supplierName, type, item) => {
    setCart(prev => {
      const cartId = `${supplierId}_${type}_${item.id}`
      const existing = prev.find(c => c.cartId === cartId)
      if (existing) return prev.map(c => c.cartId === cartId ? { ...c, quantity: c.quantity + 1 } : c)
      return [...prev, { cartId, supplierId, supplierName, type, item, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((cartId) => {
    setCart(prev => prev.filter(c => c.cartId !== cartId))
  }, [])

  const updateCartQty = useCallback((cartId, qty) => {
    if (qty <= 0) setCart(prev => prev.filter(c => c.cartId !== cartId))
    else setCart(prev => prev.map(c => c.cartId === cartId ? { ...c, quantity: qty } : c))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const totalPrice = eventPackage
    ? eventPackage.sections.reduce((sum, s) => sum + (s.vendor.price || 0), 0)
    : 0
  const depositAmount = Math.round(totalPrice * 0.2)

  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0)
  const cartTotal = cart.reduce((sum, c) => sum + (c.item.price || 0) * c.quantity, 0)

  const totalBudget = Object.values(selectedSuppliers).reduce(
    (sum, s) => sum + (s.selectedPackage?.price || s.basePrice || 0),
    0
  )

  // Auto-save event draft when AI finishes building the package
  useEffect(() => {
    if (!eventPackage?.sections?.length || !currentUser || currentEventId) return
    const guestMap = { intimate: 30, medium: 75, grand: 150 }
    createEvent(currentUser.uid, {
      title:       eventPackage.name || 'האירוע שלי',
      type:        briefAnswers?.eventType || '',
      date:        briefAnswers?.date !== 'flexible' ? (briefAnswers?.date || '') : '',
      guest_count: guestMap[briefAnswers?.scale] || null,
      budget_range: briefAnswers?.budgetTier || '',
      status:      'draft',
    }).then(id => {
      setCurrentEventId(id)
      console.log('Event draft saved:', id)
    }).catch(e => console.error('Auto-save draft failed:', e))
  }, [eventPackage, currentUser])

  // Save event to Firestore when user confirms at checkout
  const createEventInDb = useCallback(async () => {
    if (!currentUser) return null
    const guestMap = { intimate: 30, medium: 75, grand: 150 }
    const fullData = {
      title:              eventPackage?.name || generatedEvent?.name || 'האירוע שלי',
      type:               briefAnswers.eventType              || '',
      date:               briefAnswers.date !== 'flexible' ? briefAnswers.date : '',
      start_time:         briefAnswers.startTime              || '',
      end_time:           briefAnswers.endTime                || '',
      indoor_outdoor:     briefAnswers.indoorOutdoor          || '',
      guest_count:        guestMap[briefAnswers.scale]        || null,
      budget_range:       briefAnswers.budgetTier             || '',
      budget_exact:       totalPrice                          || 0,
      venue_name:         eventDetails.venueName              || '',
      full_address:       eventDetails.fullAddress            || '',
      city:               eventDetails.city                   || '',
      floor:              eventDetails.floor                  || '',
      entrance_notes:     eventDetails.entranceNotes          || '',
      parking_available:  eventDetails.parkingAvailable       || false,
      parking_notes:      eventDetails.parkingNotes           || '',
      special_requests:   eventDetails.specialRequests        || '',
      is_private:         eventDetails.isPrivate              || false,
      selected_suppliers: selectedSuppliers,
      status:             'active',
    }
    try {
      let eventId = currentEventId
      if (eventId) {
        await updateEvent(eventId, fullData)
      } else {
        eventId = await createEvent(currentUser.uid, fullData)
        setCurrentEventId(eventId)
      }

      // AI flow: create a lead for each section vendor
      const aiVendors = (eventPackage?.sections || []).map(s => ({
        id:       s.vendor.id,
        name:     s.vendor.name,
        email:    s.vendor.email || '',
        category: s.vendor.category || s.id,
        image:    s.image || '',
      }))

      // Manual flow: create a lead for each selected supplier
      const manualVendors = Object.values(selectedSuppliers)

      const vendorsToLead = aiVendors.length > 0 ? aiVendors : manualVendors

      const leadPromises = vendorsToLead.map(vendor =>
        createLead(currentUser, vendor, briefAnswers, vendor.selectedPackage || null, cart)
          .catch(err => console.error('createLead failed for', vendor.id, err))
      )
      await Promise.all(leadPromises)

      // Send confirmation email to client (fire-and-forget)
      sendClientConfirmationEmail({
        clientEmail: briefAnswers?.clientDetails?.email || currentUser.email,
        clientName:  briefAnswers?.clientDetails?.full_name || currentUser.displayName || '',
        eventName:   eventPackage?.name || generatedEvent?.name || 'האירוע שלי',
        totalPrice,
        depositAmount,
      })

      return eventId
    } catch (e) {
      console.error('createEventInDb failed:', e)
      return null
    }
  }, [currentUser, briefAnswers, eventDetails, generatedEvent, totalPrice, selectedSuppliers, cart, eventPackage])

  // Reset all event state so the user can start a fresh event
  const resetForNewEvent = useCallback(() => {
    setSwipeResults([])
    setBriefAnswers({ eventType: null, scale: null, date: null, budgetTier: null, startTime: '19:00', endTime: '23:00', indoorOutdoor: null, hasVenue: null })
    setEventPackage(null)
    setSelectedSuppliers({})
    setCurrentEventId(null)
    setGeneratedEvent({ name: 'Your Curated Evening' })
    setEventDetails({ title: '', city: '', venueName: '', fullAddress: '', floor: '', entranceNotes: '', parkingAvailable: null, parkingNotes: '', specialRequests: '', isPrivate: false })
    setCart([])
  }, [])

  // Load a saved Firestore event into app state and open the dashboard
  const loadEvent = useCallback((event) => {
    const guestScaleMap = { 30: 'intimate', 75: 'medium', 150: 'grand' }
    setBriefAnswers({
      eventType:     event.type            || null,
      scale:         guestScaleMap[event.guest_count] || null,
      date:          event.date            || null,
      budgetTier:    event.budget_range    || null,
      startTime:     event.start_time      || '19:00',
      endTime:       event.end_time        || '23:00',
      indoorOutdoor: event.indoor_outdoor  || null,
      hasVenue:      event.venue_name ? true : null,
    })
    setEventDetails({
      title:            event.title            || '',
      city:             event.city             || '',
      venueName:        event.venue_name       || '',
      fullAddress:      event.full_address     || '',
      floor:            event.floor            || '',
      entranceNotes:    event.entrance_notes   || '',
      parkingAvailable: event.parking_available || null,
      parkingNotes:     event.parking_notes    || '',
      specialRequests:  event.special_requests || '',
      isPrivate:        event.is_private       || false,
    })
    if (event.selected_suppliers && typeof event.selected_suppliers === 'object') {
      setSelectedSuppliers(event.selected_suppliers)
    }
    setGeneratedEvent({ name: event.title || 'האירוע שלי' })
    setCurrentEventId(event.id)
    navigate('dashboard')
  }, [navigate])

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
    currentEventId, createEventInDb, resetForNewEvent, loadEvent,
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
    cart, addToCart, removeFromCart, updateCartQty, clearCart, cartCount, cartTotal,
    chatLead, setChatLead,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
