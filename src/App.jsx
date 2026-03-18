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
        <div className="w-full min-h-screen bg-evo-black flex flex-col items-center justify-center px-8 text-center">
          <p className="text-evo-accent text-xs tracking-widest uppercase mb-4">Something went wrong</p>
          <p className="text-white text-sm font-light mb-2">{this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })} className="mt-6 text-evo-muted text-xs border border-evo-border rounded-full px-4 py-2">
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

import Entry           from './screens/Entry'
import Discover        from './screens/Discover'
import Brief           from './screens/Brief'
import Building        from './screens/Building'
import PackageReveal   from './screens/PackageReveal'
import Secure          from './screens/Secure'
import Confirmation    from './screens/Confirmation'
import EventManagement from './screens/EventManagement'
import EventPreview    from './screens/EventPreview'

const screenMap = {
  entry:      Entry,
  discover:   Discover,
  brief:      Brief,
  building:   Building,
  package:    PackageReveal,
  secure:     Secure,
  confirmation: Confirmation,
  management: EventManagement,
  preview:    EventPreview,
}

function AppContent() {
  const { currentScreen } = useApp()
  const Screen = screenMap[currentScreen] || Entry
  return (
    <div className="w-full min-h-screen bg-evo-black text-white overflow-x-hidden">
      <AnimatePresence>
        <PageTransition key={currentScreen}>
          <Screen />
        </PageTransition>
      </AnimatePresence>
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
