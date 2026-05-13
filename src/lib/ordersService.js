import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export async function createOrder({ clientUid, clientName, clientPhone, eventDate, notes, items, total }) {
  const ref = await addDoc(collection(db, 'orders'), {
    client_uid:   clientUid   || null,
    client_name:  clientName  || '',
    client_phone: clientPhone || '',
    event_date:   eventDate   || '',
    notes:        notes       || '',
    items:        items       || [],
    total:        total       || 0,
    status:       'pending',
    createdAt:    serverTimestamp(),
  })
  return ref.id
}
