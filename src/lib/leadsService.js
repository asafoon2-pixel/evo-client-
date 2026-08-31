import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc,
  query, where, orderBy, onSnapshot, serverTimestamp, arrayUnion, Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { sendEvoEmail } from './email/sendEvoEmail'

// ── Create a lead when client requests a supplier ──────────────────────────
export async function createLead(clientUser, vendor, briefAnswers, selectedPackage, cartItems) {
  const guestMap = { intimate: '20–40', medium: '50–100', large: '100–200', grand: '200+' }

  // Build ordered items: cart items for this supplier + selected package
  const supplierCartItems = (cartItems || []).filter(c => c.supplierId === vendor.id)
  const orderItems = supplierCartItems.map(c => ({
    item_id:   c.item.id,
    item_name: c.item.label,
    type:      c.type,
    price:     c.item.price || 0,
    quantity:  c.quantity,
  }))

  // If no cart items but a package was selected, include it
  const hasCartItems = orderItems.length > 0
  const packageForLead = (!hasCartItems && selectedPackage) ? {
    item_id:   selectedPackage.id,
    item_name: selectedPackage.label,
    type:      'package',
    price:     selectedPackage.price || 0,
    quantity:  1,
  } : null
  const finalItems = packageForLead ? [packageForLead] : orderItems
  const orderTotal = finalItems.reduce((s, i) => s + i.price * i.quantity, 0)

  const ref = await addDoc(collection(db, 'leads'), {
    vendor_id:     vendor.id,
    vendor_name:   vendor.name,
    vendor_email:  vendor.email || '',
    client_id:     clientUser.uid,
    client_name:      clientUser.displayName || '',
    client_email:     clientUser.email       || '',
    client_photo_url: clientUser.photoURL    || '',
    status:        'new',
    status_history: [{ status: 'new', at: Timestamp.now() }],
    category:      vendor.category        || '',
    eventName:     'האירוע שלי',
    eventType:     briefAnswers?.eventType || '',
    date:          briefAnswers?.date !== 'flexible' ? (briefAnswers?.date || '') : 'גמיש',
    guestCount:    guestMap[briefAnswers?.scale] || briefAnswers?.guestCount || '',
    budgetRange:   briefAnswers?.budgetTier      || '',
    location:      briefAnswers?.city            || '',
    matchScore:    92,
    heroImage:     vendor.image || '',
    order_items:   finalItems,
    order_total:   orderTotal,
    receivedAt:    serverTimestamp(),
    created_at:    serverTimestamp(),
    updated_at:    serverTimestamp(),
  })

  // Notify the vendor by email (fire-and-forget). vendor.email isn't always
  // populated by callers (e.g. the manual cart checkout flow) — fall back to
  // looking up the vendor doc, same as the old onLeadCreated Cloud Function did.
  resolveVendorEmail(vendor).then(vendorEmail => {
    sendEvoEmail('new_lead', {
      to: vendorEmail,
      data: {
        supplierName:  vendor.name,
        customerName:  clientUser.displayName || '',
        eventType:     briefAnswers?.eventType || '',
        eventDate:     briefAnswers?.date !== 'flexible' ? (briefAnswers?.date || '') : 'גמיש',
        eventLocation: briefAnswers?.city || '',
        budgetRange:   briefAnswers?.budgetTier || '',
        leadLink:      'https://supplier.evoevents.co',
      },
    })
  })

  return ref.id
}

async function resolveVendorEmail(vendor) {
  if (vendor.email) return vendor.email
  try {
    const snap = await getDoc(doc(db, 'vendors', vendor.id))
    if (!snap.exists()) return null
    const vendorData = snap.data()
    return vendorData.email || vendorData.contact_email || null
  } catch (err) {
    console.error('resolveVendorEmail failed:', err)
    return null
  }
}

// ── Get all leads for a client ─────────────────────────────────────────────
export async function getClientLeads(clientId) {
  const q = query(
    collection(db, 'leads'),
    where('client_id', '==', clientId),
    orderBy('created_at', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── Send a message in a lead thread ───────────────────────────────────────
export async function sendMessage(leadId, senderId, senderName, text, senderRole = 'client') {
  await addDoc(collection(db, 'leads', leadId, 'messages'), {
    sender_id:   senderId,
    sender_name: senderName,
    from:        senderRole,  // 'client' | 'vendor'
    text,
    time:        serverTimestamp(),
    read:        false,
  })
  // Update lead's last message
  await updateDoc(doc(db, 'leads', leadId), {
    last_message:    text,
    last_message_at: serverTimestamp(),
    updated_at:      serverTimestamp(),
  })
}

// ── Listen to messages in real-time ───────────────────────────────────────
export function listenToMessages(leadId, callback) {
  const q = query(
    collection(db, 'leads', leadId, 'messages'),
    orderBy('time', 'asc')
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

// ── Listen to all client leads in real-time ────────────────────────────────
export function listenToClientLeads(clientId, callback) {
  const q = query(collection(db, 'leads'), where('client_id', '==', clientId))
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

// ── Mark all messages from the other side as read ─────────────────────────
export async function markMessagesAsRead(leadId, viewerRole) {
  const otherRole = viewerRole === 'client' ? 'vendor' : 'client'
  const q = query(
    collection(db, 'leads', leadId, 'messages'),
    where('from', '==', otherRole),
    where('read', '==', false)
  )
  const snap = await getDocs(q)
  await Promise.all(snap.docs.map(d => updateDoc(d.ref, { read: true })))
}

// ── Listen to all vendor leads in real-time (for supplier app) ─────────────
export function listenToVendorLeads(vendorId, callback) {
  const q = query(collection(db, 'leads'), where('vendor_id', '==', vendorId))
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

// ── Check if a lead already exists for this client+vendor ─────────────────
export async function getExistingLead(clientId, vendorId) {
  const q = query(
    collection(db, 'leads'),
    where('client_id', '==', clientId),
    where('vendor_id', '==', vendorId)
  )
  const snap = await getDocs(q)
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() }
}
