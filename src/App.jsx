import { Component } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import PageTransition from './components/PageTransition'

class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center px-8 text-center" style={{ background: '#F5F5F7' }}>
          <p style={{ color: '#2D1B69', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Something went wrong</p>
          <p style={{ color: '#1A1A2E', fontSize: 13, marginBottom: 8 }}>{this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: 24, color: '#2D1B69', fontSize: 12, border: '1px solid rgba(45,27,105,0.3)', borderRadius: 9999, padding: '8px 16px' }}>
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

import Entry           from './screens/Entry'
import AIPrompt        from './screens/AIPrompt'
import Brief           from './screens/Brief'
import Building        from './screens/Building'
import PackageReveal   from './screens/PackageReveal'
import Secure          from './screens/Secure'
import Confirmation    from './screens/Confirmation'
import EventManagement from './screens/EventManagement'
import EventPreview    from './screens/EventPreview'
import Categories      from './screens/Categories'
import SupplierList    from './screens/SupplierList'
import SupplierProfile from './screens/SupplierProfile'
import EventSummary    from './screens/EventSummary'
import Checkout        from './screens/Checkout'
import AIResult        from './screens/AIResult'
import PreAISummary    from './screens/PreAISummary'
import EventDetails    from './screens/EventDetails'
import UserProfile     from './screens/UserProfile'

const screenMap = {
  entry:           Entry,
  aiprompt:        AIPrompt,
  brief:           Brief,
  building:        Building,
  package:         PackageReveal,
  secure:          Secure,
  confirmation:    Confirmation,
  management:      EventManagement,
  preview:         EventPreview,
  categories:      Categories,
  supplierList:    SupplierList,
  supplierProfile: SupplierProfile,
  summary:         EventSummary,
  checkout:        Checkout,
  result:          AIResult,
  presummary:      PreAISummary,
  eventdetails:    EventDetails,
  userprofile:     UserProfile,
}

function AppContent() {
  const { currentScreen } = useApp()
  const Screen = screenMap[currentScreen] || Entry
  return (
    <div className="w-full min-h-screen flex justify-center" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md min-h-screen overflow-x-hidden relative" style={{ background: 'var(--background)' }}>
        <AnimatePresence mode="wait">
          <PageTransition key={currentScreen}>
            <Screen />
          </PageTransition>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AppProvider>
  )
}
