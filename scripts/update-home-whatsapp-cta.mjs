const WHATSAPP_LINK =
  'https://wa.me/919035676667?text=Hi%2C%20I%27m%20interested%20in%20discussing%20a%20project%20with%20Corespace%20Builders.%20Please%20guide%20me%20on%20the%20next%20steps.'

const WHATSAPP_SECONDARY_CTA = {
  type: 'custom',
  label: 'Speak with us on WhatsApp',
  url: WHATSAPP_LINK,
  newTab: true,
}

function updateAboutSection(section) {
  if (section?.blockType !== 'corespaceAbout') {
    return false
  }

  section.secondaryCta = WHATSAPP_SECONDARY_CTA
  return true
}

function walkBlocks(blocks) {
  let changed = false

  if (!Array.isArray(blocks)) {
    return changed
  }

  for (const block of blocks) {
    const sections = block?.corespaceTemplateFields?.sections

    if (!Array.isArray(sections)) {
      continue
    }

    for (const section of sections) {
      if (updateAboutSection(section)) {
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
const pagesCollection = payload.db.connection.db.collection('pages')

const homePage = await pagesCollection.findOne({ slug: 'home' })

if (!homePage) {
  console.log('Home page not found')
  process.exit(0)
}

if (walkBlocks(homePage.layout)) {
  await pagesCollection.updateOne(
    { _id: homePage._id },
    { $set: { layout: homePage.layout, updatedAt: new Date().toISOString() } },
  )
  console.log('Updated Home page Secondary CTA with WhatsApp URL')
} else {
  console.log('No About section found on Home page')
}

process.exit(0)
