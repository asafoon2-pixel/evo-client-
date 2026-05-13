import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from './firebase'

// Track an event in the 'analytics' collection
export async function trackEvent(eventName, properties = {}) {
  try {
    await addDoc(collection(db, 'analytics'), {
      event:      eventName,
      userId:     auth.currentUser?.uid || null,
      properties,
      timestamp:  serverTimestamp(),
      platform:   'client',
    })
  } catch (_) {} // silent fail — never break the UI
}

// Common events exported as named functions
export const track = {
  viewSupplier:   (vendorId, category) => trackEvent('view_supplier', { vendorId, category }),
  selectSupplier: (vendorId, category) => trackEvent('select_supplier', { vendorId, category }),
  viewPackage:    (vendorId, packageId) => trackEvent('view_package', { vendorId, packageId }),
  submitBrief:    (eventType, budget) => trackEvent('submit_brief', { eventType, budget }),
  startCheckout:  (totalAmount) => trackEvent('start_checkout', { totalAmount }),
  completeEvent:  (eventId, totalAmount) => trackEvent('complete_event', { eventId, totalAmount }),
  generateAI:     (prompt) => trackEvent('generate_ai', { promptLength: prompt?.length }),
}
