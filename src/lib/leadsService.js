import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc,
  query, where, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// ── Create a lead when client requests a supplier ──────────────────────────
export async function createLead(clientUser, vendor, briefAnswers) {
  const guestMap = { intimate: '20–40', medium: '50–100', large: '100–200', grand: '200+' }
  const ref = await addDoc(collection(db, 'leads'), {
    vendor_id:     vendor.id,
    vendor_name:   vendor.name,
    client_id:     clientUser.uid,
    client_name:   clientUser.displayName || '',
    client_email:  clientUser.email       || '',
    status:        'new',
    category:      vendor.category        || '',
    eventName:     'האירוע שלי',
    eventType:     briefAnswers?.eventType || '',
    date:          briefAnswers?.date !== 'flexible' ? (briefAnswers?.date || '') : 'גמיש',
    guestCount:    guestMap[briefAnswers?.scale] || '',
    budgetRange:   briefAnswers?.budgetTier      || '',
    location:      briefAnswers?.city            || '',
    matchScore:    92,
    heroImage:     vendor.image || '',
    receivedAt:    serverTimestamp(),
    created_at:    serverTimestamp(),
    updated_at:    serverTimestamp(),
  })
  return ref.id
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
