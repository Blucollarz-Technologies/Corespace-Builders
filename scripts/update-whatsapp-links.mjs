const WHATSAPP_LINK =
  'https://wa.me/919035676667?text=Hi%2C%20I%27m%20interested%20in%20discussing%20a%20project%20with%20Corespace%20Builders.%20Please%20guide%20me%20on%20the%20next%20steps.'

const PLACEHOLDER_PATTERNS = ['https://wa.me/', '91XXXXXXXXXX', '919876543210']

function isPlaceholderUrl(url) {
  if (!url || typeof url !== 'string') {
    return true
  }

  return PLACEHOLDER_PATTERNS.some((pattern) => url.includes(pattern))
}

function updateCorespaceSections(sections) {
  let changed = false

  if (!Array.isArray(sections)) {
    return changed
  }

  for (const section of sections) {
    if (section?.blockType === 'corespaceStepForm' && isPlaceholderUrl(section.whatsappUrl)) {
      section.whatsappUrl = WHATSAPP_LINK
      changed = true
    }

    if (section?.blockType === 'corespaceThankYouClosing') {
      const link = section.whatsappLink

      if (!link || typeof link !== 'object') {
        section.whatsappLink = {
          type: 'custom',
          label: 'Chat with us on WhatsApp',
          url: WHATSAPP_LINK,
          newTab: true,
        }
        changed = true
        continue
      }

      if (isPlaceholderUrl(link.url)) {
        link.type = 'custom'
        link.url = WHATSAPP_LINK
        link.label = link.label || 'Chat with us on WhatsApp'
        link.newTab = link.newTab ?? true
        delete link.reference
        changed = true
      }
    }
  }

  return changed
}

function walkBlocks(blocks) {
  let changed = false

  if (!Array.isArray(blocks)) {
    return changed
  }

  for (const block of blocks) {
    if (block?.blockType === 'corespaceTemplate') {
      const sections = block?.corespaceTemplateFields?.sections

      if (updateCorespaceSections(sections)) {
        changed = true
      }
    }
  }

  return changed
}

const { getPayload } = await import('payload')
const { default: configPromise } = await import('../src/payload.config.ts')
const config = await configPromise
const payload = await getPayload({ config })
const globalsCollection = payload.db.connection.db.collection('globals')
const pagesCollection = payload.db.connection.db.collection('pages')

const mainMenu = await globalsCollection.findOne({ globalType: 'main-menu' })

if (mainMenu && isPlaceholderUrl(mainMenu.whatsappUrl)) {
  await globalsCollection.updateOne(
    { globalType: 'main-menu' },
    {
      $set: {
        whatsappUrl: WHATSAPP_LINK,
        enableWhatsApp: mainMenu.enableWhatsApp ?? true,
        updatedAt: new Date().toISOString(),
      },
    },
  )
  console.log('Updated main-menu WhatsApp URL')
} else {
  console.log('Main menu WhatsApp URL already set')
}

let pagesUpdated = 0
const pages = await pagesCollection.find({}).toArray()

for (const page of pages) {
  let changed = false
  const layout = page.layout

  if (walkBlocks(layout)) {
    changed = true
  }

  if (changed) {
    await pagesCollection.updateOne(
      { _id: page._id },
      { $set: { layout, updatedAt: new Date().toISOString() } },
    )
    pagesUpdated += 1
    console.log('Updated page:', page.slug || page.title || page._id)
  }
}

console.log(`Pages updated: ${pagesUpdated}`)
process.exit(0)
