import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getAllVendors } from '../lib/suppliersService'
import SupplierMap from '../components/SupplierMap'

export default function AllSuppliersMap() {
  const { navigate, setCurrentSupplier } = useApp()
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAllVendors()
      .then(setVendors)
      .catch(() => setError('לא ניתן לטעון ספקים'))
      .finally(() => setLoading(false))
  }, [])

  const handleSelectSupplier = (supplier) => {
    setCurrentSupplier(supplier)
    navigate('supplierProfile')
  }

  return (
    <div dir="rtl" className="w-full min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 px-6 pt-5 pb-4"
        style={{ background: 'rgba(245,240,232,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(44,32,22,0.08)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('home')}
            style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <MapPin size={18} style={{ color: 'var(--primary)' }} />
            <div>
              <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                ספקים על המפה
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {loading ? 'טוען...' : `${vendors.length} ספקים`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center px-6">
            <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>{error}</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 px-4 pt-4 pb-6"
          >
            <SupplierMap
              suppliers={vendors}
              onSelectSupplier={handleSelectSupplier}
            />

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-2">
              {['צלמים', 'מוסיקה', 'קייטרינג', 'מקום'].map(label => (
                <span key={label}
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: 'rgba(107,95,228,0.1)', color: 'var(--primary)' }}>
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
