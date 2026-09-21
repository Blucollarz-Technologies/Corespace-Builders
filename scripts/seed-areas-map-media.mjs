import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const mapPath = path.join(root, 'public/images/corespace-areas-we-serve-map.svg')

if (!fs.existsSync(mapPath)) {
  console.error('Map file not found:', mapPath)
  process.exit(1)
}

const { getPayload } = await import('payload')
const { default: configPromise } = await import('../src/payload.config.ts')
const config = await configPromise

const payload = await getPayload({ config })
const fileBuffer = fs.readFileSync(mapPath)
const filename = 'corespace-areas-we-serve-map.svg'

const existing = await payload.find({
  collection: 'media',
  limit: 1,
  where: {
    filename: {
      equals: filename,
    },
  },
})

if (existing.docs.length > 0) {
  console.log('Media already exists:', existing.docs[0].id)
  console.log('URL:', existing.docs[0].url)
  process.exit(0)
}

const media = await payload.create({
  collection: 'media',
  data: {
    alt: 'Corespace service areas map showing Coorg, Kodagu towns, and Bangalore',
  },
  file: {
    data: fileBuffer,
    mimetype: 'image/svg+xml',
    name: filename,
    size: fileBuffer.length,
  },
})

console.log('Uploaded to Media:', media.id)
console.log('URL:', media.url)
console.log('Select this image in Areas We Serve → Map image in the CMS.')
