import { AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import PageTransition from './components/PageTransition'

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
      <AnimatePresence mode="wait">
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
      <AppContent />
    </AppProvider>
  )
}
