// Central dispatcher for all EVO transactional emails sent from the client app.
// Every place in evo-client that needs to send an email calls this ONE function
// instead of building HTML / hitting /api/send-email directly.
//
// new_lead is triggered from here too (client-side, right after the lead doc is
// created) rather than from a Firestore-triggered Cloud Function — the
// evo-supplier Firebase project is on the free Spark plan, which can't run
// Cloud Functions at all (needs the Blaze plan). See
// evo-supplier/functions/lib/email/ for the Cloud Functions version, kept
// ready but undeployed for when/if that project upgrades to Blaze — don't run
// both at once, leads would get emailed twice.
//
// order_confirmed is triggered the same way from evo-supplier's own client
// code — see evo-supplier/src/lib/email/sendEvoEmail.js.

import { buildWelcomeEmail } from './templates/welcome'
import { buildRequestReceivedEmail } from './templates/requestReceived'
import { buildNewLeadEmail } from './templates/newLead'

const FROM = 'EVO Events <noreply@evoevents.co>'

const EMAIL_REGISTRY = {
  welcome: {
    subject: () => 'ברוכים הבאים ל-EVO 🎉',
    build: buildWelcomeEmail,
  },
  request_received: {
    subject: (data) => `קיבלנו את הבקשה שלך — ${data.eventName}`,
    build: buildRequestReceivedEmail,
  },
  new_lead: {
    subject: (data) => `🎉 בקשה חדשה מ-${data.customerName || 'לקוח'} — EVO`,
    build: buildNewLeadEmail,
  },
}

/**
 * Send an EVO transactional email.
 *
 * @param {string} type - one of the keys in EMAIL_REGISTRY (e.g. "welcome", "request_received")
 * @param {object} params
 * @param {string} params.to - recipient email address
 * @param {object} params.data - the data the template needs
 */
export async function sendEvoEmail(type, { to, data }) {
  const entry = EMAIL_REGISTRY[type]
  if (!entry) {
    throw new Error(`sendEvoEmail: unknown email type "${type}"`)
  }
  if (!to) return

  const html = entry.build(data)
  const subject = entry.subject(data)

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })
    if (!res.ok) console.error(`sendEvoEmail "${type}" error:`, await res.json())
  } catch (err) {
    console.error(`sendEvoEmail "${type}" failed:`, err)
  }
}
