import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { geocodeCity } from '../lib/geocodeService'

// Fix Leaflet default icon paths broken by Vite/webpack asset handling
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

/**
 * SupplierMap
 * Props:
 *   suppliers        – array of normalised vendor objects
 *   onSelectSupplier – called with the supplier when "צפה בפרופיל" is clicked
 */
export default function SupplierMap({ suppliers = [], onSelectSupplier }) {
  // Only keep suppliers that have geocodable cities
  const mappable = suppliers
    .map(s => ({ supplier: s, coords: geocodeCity(s.city) }))
    .filter(({ coords }) => coords !== null)

  return (
    <MapContainer
      center={[31.5, 34.9]}
      zoom={8}
      style={{ height: '60vh', width: '100%', borderRadius: '16px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {mappable.map(({ supplier, coords }) => (
        <Marker key={supplier.id} position={[coords.lat, coords.lng]}>
          <Popup>
            <div dir="rtl" style={{ minWidth: 180 }}>
              {/* Supplier name */}
              <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                {supplier.name}
              </p>

              {/* Rating */}
              {supplier.rating > 0 && (
                <p style={{ fontSize: 12, marginBottom: 4 }}>
                  {'⭐'} {supplier.rating}
                  {supplier.reviewCount ? ` (${supplier.reviewCount})` : ''}
                </p>
              )}

              {/* Price range */}
              {supplier.priceRange && (
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary, #6b5fe4)', marginBottom: 8 }}>
                  {supplier.priceRange}
                </p>
              )}

              {/* CTA */}
              <button
                onClick={() => onSelectSupplier && onSelectSupplier(supplier)}
                style={{
                  width: '100%',
                  background: 'var(--primary, #6b5fe4)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '7px 0',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: 0.3,
                }}
              >
                צפה בפרופיל
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
