const EVENT_TYPE_MAP = {
  'חתונה': 'wedding reception',
  'בר מצווה': 'bar mitzvah celebration',
  'בת מצווה': 'bat mitzvah celebration',
  'יום הולדת': 'birthday party',
  'אירוע עסקי': 'corporate event',
  'מסיבה': 'party',
  'אירוסין': 'engagement party',
  'גאלה': 'gala dinner',
  'ברית': 'ceremony',
  'ימי עיון': 'conference',
}

const VIBE_MAP = {
  luxury: 'luxurious, elegant, opulent decor',
  outdoor: 'outdoor, natural, garden setting',
  corporate: 'professional, modern, corporate',
  energetic: 'energetic, vibrant, colorful',
  curated: 'carefully curated, tasteful',
}

const SCALE_MAP = {
  intimate: 'intimate gathering of 30 guests',
  medium: 'medium event of 75 guests',
  grand: 'grand event with 150+ guests',
}

const CATEGORY_MAP = {
  'photography': 'professional photography setup, elegant camera equipment',
  'music': 'DJ booth, professional sound system, stage lighting',
  'catering': 'elegant catering buffet, gourmet food display, fine dining',
  'venue': 'stunning venue, beautiful hall',
  'flowers': 'elaborate floral arrangements, flower decorations',
  'bar': 'cocktail bar, drinks station, glassware',
  'lighting': 'dramatic event lighting, spotlights, LED effects',
  'invitation': 'elegant invitation design, stationery',
  'videography': 'video equipment, cinematic setup',
  'entertainment': 'entertainment stage, performers',
  'cake': 'elaborate wedding cake, dessert table',
  'transportation': 'luxury car, limousine',
}

/**
 * Collect all real images from selected suppliers and cart items
 * Returns array of { url, label } objects
 */
export function collectSupplierImages(selectedSuppliers = {}, cart = []) {
  const images = []

  // Images from selected suppliers
  Object.values(selectedSuppliers).forEach(supplier => {
    if (supplier.image) images.push({ url: supplier.image, label: supplier.name })
    if (supplier.gallery?.length) {
      supplier.gallery.slice(0, 2).forEach(img => {
        if (img) images.push({ url: img, label: supplier.name })
      })
    }
  })

  // Images from cart items (packages/products)
  cart.forEach(cartItem => {
    if (cartItem.item?.image) {
      images.push({ url: cartItem.item.image, label: cartItem.item.label })
    }
  })

  return images
}

/**
 * Build a rich prompt from event details + selected suppliers
 */
export function buildImagePrompt({ eventType, guestCount, vibe, city, selectedSuppliers = {}, cart = [] }) {
  const type = EVENT_TYPE_MAP[eventType] || 'special event'
  const vibeDesc = VIBE_MAP[vibe] || 'beautiful'
  const scale = SCALE_MAP[guestCount] || ''

  // Extract supplier categories for context
  const supplierDescs = []
  Object.values(selectedSuppliers).forEach(supplier => {
    const cat = supplier.category?.toLowerCase()
    const desc = CATEGORY_MAP[cat]
    if (desc) supplierDescs.push(desc)
    else if (supplier.shortDescription) {
      supplierDescs.push(supplier.shortDescription.split(' ').slice(0, 5).join(' '))
    }
  })

  // Also get cart item names
  cart.slice(0, 3).forEach(c => {
    if (c.item?.label) supplierDescs.push(c.item.label)
  })

  const suppliersText = supplierDescs.length
    ? `featuring ${supplierDescs.join(', ')}, `
    : ''

  const cityText = city ? `in ${city}, Israel, ` : 'in Israel, '

  const negativeHints = 'cartoon, illustration, painting, anime, CGI, text, watermark, blurry'
  return `professional event photography of a ${vibeDesc} ${type} ${cityText}${suppliersText}${scale}, golden hour lighting, bokeh background, shot on Canon EOS R5, photorealistic, ultra detailed, editorial style — avoid: ${negativeHints}`
}

/**
 * Generate event mood image using Pollinations.ai (free, no API key)
 */
export async function generateEventImage(prompt) {
  const encoded = encodeURIComponent(prompt)
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&enhance=true&model=flux`

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(url)
    img.onerror = () => reject(new Error('שגיאה ביצירת התמונה'))
    img.src = url
  })
}
