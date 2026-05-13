import {
  collection, doc, addDoc, getDocs, updateDoc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// Submit a review after event completion
export async function submitReview(vendorId, leadId, clientId, clientName, rating, text) {
  await addDoc(collection(db, 'vendors', vendorId, 'reviews'), {
    lead_id:     leadId,
    client_id:   clientId,
    client_name: clientName,
    rating,
    text,
    created_at:  serverTimestamp(),
  })
  // Mark lead as reviewed
  await updateDoc(doc(db, 'leads', leadId), { reviewed: true, updated_at: serverTimestamp() })
  // Update vendor avg_rating
  const snap = await getDocs(collection(db, 'vendors', vendorId, 'reviews'))
  const all = snap.docs.map(d => d.data().rating).filter(Boolean)
  if (all.length > 0) {
    const avg = Math.round((all.reduce((s, r) => s + r, 0) / all.length) * 10) / 10
    await updateDoc(doc(db, 'vendors', vendorId), {
      avg_rating:    avg,
      total_reviews: all.length,
    })
  }
}

// Fetch reviews for a vendor
export async function getVendorReviews(vendorId) {
  const q = query(
    collection(db, 'vendors', vendorId, 'reviews'),
    orderBy('created_at', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
