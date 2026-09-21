const TARGET_URL = '/service/corespace-construction-services-coorg'
const TARGET_LABEL = 'Corespace Construction Services Coorg'

const OLD_URLS = new Set(['/service/coorg', '/services/coorg', '/projects/coorg'])
const OLD_LABELS = new Set(['Coorg Construction', 'coorg construction'])

function updateLink(link) {
  if (!link || typeof link !== 'object') {
    return false
  }

  let changed = false
  const url = typeof link.url === 'string' ? link.url.toLowerCase() : link.url
  const label = link.label

  if (url && OLD_URLS.has(url)) {
    link.url = TARGET_URL
    link.type = 'custom'
    delete link.reference
    changed = true
  }

  if (label && OLD_LABELS.has(label)) {
    link.label = TARGET_LABEL
    changed = true
  }

  return changed
}

function walkNavItems(navItems) {
  let changed = false

  if (!Array.isArray(navItems)) {
    return changed
  }

  for (const item of navItems) {
    if (item?.defaultLink?.link && updateLink(item.defaultLink.link)) {
      changed = true
    }

    if (Array.isArray(item?.featuredLink?.links)) {
      for (const entry of item.featuredLink.links) {
        if (entry?.link && updateLink(entry.link)) {
          changed = true
        }
      }
    }

    if (Array.isArray(item?.listLinks?.links)) {
      for (const entry of item.listLinks.links) {
        if (entry?.link && updateLink(entry.link)) {
          changed = true
        }
      }
    }
  }

  return changed
}

function walkFooterColumns(columns) {
  let changed = false

  if (!Array.isArray(columns)) {
    return changed
  }

  for (const column of columns) {
    if (!Array.isArray(column?.navItems)) {
      continue
    }

    for (const item of column.navItems) {
      if (item?.link && updateLink(item.link)) {
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

let mainMenuChanged = false
const mainMenuDoc = await globalsCollection.findOne({ globalType: 'main-menu' })

if (Array.isArray(mainMenuDoc?.tabs)) {
  for (const tab of mainMenuDoc.tabs) {
    if (tab?.link && updateLink(tab.link)) {
      mainMenuChanged = true
    }

    if (Array.isArray(tab?.descriptionLinks)) {
      for (const entry of tab.descriptionLinks) {
        if (entry?.link && updateLink(entry.link)) {
          mainMenuChanged = true
        }
      }
    }

    if (walkNavItems(tab?.navItems)) {
      mainMenuChanged = true
    }
  }
}

if (mainMenuChanged) {
  await globalsCollection.updateOne(
    { globalType: 'main-menu' },
    { $set: { tabs: mainMenuDoc.tabs, updatedAt: new Date().toISOString() } },
  )
  console.log('Updated main-menu nav link to:', TARGET_LABEL, TARGET_URL)
} else {
  console.log('No matching main-menu links found to update.')
}

let footerChanged = false
const footerDoc = await globalsCollection.findOne({ globalType: 'footer' })

if (walkFooterColumns(footerDoc?.columns)) {
  footerChanged = true
}

if (footerChanged) {
  await globalsCollection.updateOne(
    { globalType: 'footer' },
    { $set: { columns: footerDoc.columns, updatedAt: new Date().toISOString() } },
  )
  console.log('Updated footer nav link to:', TARGET_LABEL, TARGET_URL)
} else {
  console.log('No matching footer links found to update.')
}

process.exit(0)
