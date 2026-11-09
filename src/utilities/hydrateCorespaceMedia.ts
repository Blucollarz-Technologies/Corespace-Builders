import type { Media, Page } from '@root/payload-types'
import type { Payload } from 'payload'

import { normalizeMediaUrl } from '@root/utilities/normalizeMediaUrl'

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i
const UPLOAD_KEYS = ['image', 'media', 'thumbnail', 'photo', 'featuredImage'] as const

const bytesToHex = (bytes: ArrayBuffer | Buffer | Uint8Array): null | string => {
  try {
    const hex = Buffer.from(bytes as Buffer).toString('hex')
    return OBJECT_ID_RE.test(hex) ? hex : null
  } catch {
    return null
  }
}

/** Resolve Payload / BSON ObjectId-like values to a 24-char hex string. */
export const toMediaId = (value: unknown): null | string => {
  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    return OBJECT_ID_RE.test(value) ? value : null
  }

  if (typeof value !== 'object') {
    return null
  }

  const record = value as Record<string, unknown>

  // Already populated media
  if (typeof record.url === 'string' && record.url) {
    return null
  }

  if (typeof record.id === 'string' && OBJECT_ID_RE.test(record.id)) {
    return record.id
  }

  // BSON ObjectId: { id: Uint8Array } or Buffer
  if (record.id instanceof Uint8Array || Buffer.isBuffer(record.id)) {
    const hex = bytesToHex(record.id as Uint8Array)
    if (hex) {
      return hex
    }
  }

  // Nested Binary / corrupted ObjectId blobs (incl. structuredClone damage):
  // { buffer: { buffer: base64|Uint8Array|{0:n,1:n,...}, sub_type } }
  const readByteMap = (value: unknown): null | string => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null
    }
    const map = value as Record<string, number>
    const keys = Object.keys(map)
    if (keys.length !== 12 || keys.some((k) => Number.isNaN(Number(k)))) {
      return null
    }
    const bytes = Uint8Array.from({ length: 12 }, (_, i) => Number(map[String(i)]))
    return bytesToHex(bytes)
  }

  const outer = record.buffer
  if (outer && typeof outer === 'object') {
    const binary = outer as { buffer?: ArrayBuffer | Buffer | Record<string, number> | string | Uint8Array }
    if (typeof binary.buffer === 'string') {
      try {
        const hex = Buffer.from(binary.buffer, 'base64').toString('hex')
        if (OBJECT_ID_RE.test(hex)) {
          return hex
        }
      } catch {
        // ignore
      }
    }
    if (binary.buffer instanceof Uint8Array || Buffer.isBuffer(binary.buffer)) {
      const hex = bytesToHex(binary.buffer as Uint8Array)
      if (hex) {
        return hex
      }
    }
    const fromMap = readByteMap(binary.buffer) || readByteMap(outer) || readByteMap(record)
    if (fromMap) {
      return fromMap
    }
    if (outer instanceof Uint8Array || Buffer.isBuffer(outer)) {
      const hex = bytesToHex(outer as Uint8Array)
      if (hex) {
        return hex
      }
    }
  }

  if (typeof (value as { toHexString?: () => string }).toHexString === 'function') {
    const hex = (value as { toHexString: () => string }).toHexString()
    if (OBJECT_ID_RE.test(hex)) {
      return hex
    }
  }

  if (typeof (value as { toString?: () => string }).toString === 'function') {
    const asString = (value as { toString: () => string }).toString()
    if (OBJECT_ID_RE.test(asString) && asString !== '[object Object]') {
      return asString
    }
  }

  return null
}

const collectUploadIds = (node: unknown, ids: Set<string>, parentKey?: string) => {
  if (!node || typeof node !== 'object') {
    return
  }

  if (Array.isArray(node)) {
    node.forEach((item) => collectUploadIds(item, ids, parentKey))
    return
  }

  // Do not walk inside ObjectId / Binary internals
  if (
    (node as { _bsontype?: string })._bsontype === 'ObjectId' ||
    (node as { _bsontype?: string })._bsontype === 'ObjectID' ||
    (node as { _bsontype?: string })._bsontype === 'Binary'
  ) {
    if (parentKey && UPLOAD_KEYS.includes(parentKey as (typeof UPLOAD_KEYS)[number])) {
      const id = toMediaId(node)
      if (id) {
        ids.add(id)
      }
    }
    return
  }

  const record = node as Record<string, unknown>

  for (const key of UPLOAD_KEYS) {
    if (!(key in record)) {
      continue
    }
    const id = toMediaId(record[key])
    if (id) {
      ids.add(id)
    }
  }

  for (const [key, value] of Object.entries(record)) {
    if (!value || typeof value !== 'object') {
      continue
    }
    collectUploadIds(value, ids, key)
  }
}

const toPlainMedia = (doc: Media): Media =>
  ({
    id: String(doc.id),
    alt: doc.alt ?? '',
    filename: doc.filename ?? undefined,
    filesize: doc.filesize ?? undefined,
    height: doc.height ?? undefined,
    mimeType: doc.mimeType ?? undefined,
    url: normalizeMediaUrl(doc.url) || doc.url || '',
    width: doc.width ?? undefined,
  }) as Media

const replaceUploadRefs = (node: unknown, byId: Map<string, Media>): unknown => {
  if (!node || typeof node !== 'object') {
    return node
  }

  if (Array.isArray(node)) {
    return node.map((item) => replaceUploadRefs(item, byId))
  }

  const asMedia = node as Media
  if (typeof asMedia.url === 'string' && asMedia.url && typeof asMedia.mimeType === 'string') {
    return toPlainMedia(asMedia)
  }

  // Bare ObjectId standing in for an upload field value — handled by parent key replace
  if (
    (node as { _bsontype?: string })._bsontype === 'ObjectId' ||
    (node as { _bsontype?: string })._bsontype === 'ObjectID'
  ) {
    const id = toMediaId(node)
    return id && byId.has(id) ? byId.get(id) : null
  }

  const record = { ...(node as Record<string, unknown>) }

  for (const key of UPLOAD_KEYS) {
    if (!(key in record)) {
      continue
    }
    const id = toMediaId(record[key])
    if (id && byId.has(id)) {
      record[key] = byId.get(id)
      continue
    }
    if (record[key] && typeof record[key] === 'object') {
      const replaced = replaceUploadRefs(record[key], byId)
      record[key] = replaced
    }
  }

  for (const [key, value] of Object.entries(record)) {
    if (UPLOAD_KEYS.includes(key as (typeof UPLOAD_KEYS)[number]) || !value || typeof value !== 'object') {
      continue
    }
    record[key] = replaceUploadRefs(value, byId)
  }

  return record
}

/** Strip remaining BSON values so layout can cross the RSC → client boundary. */
const toPlainJson = <T,>(value: T): T =>
  JSON.parse(
    JSON.stringify(value, (_key, current) => {
      if (!current || typeof current !== 'object') {
        return current
      }

      const bsonType = (current as { _bsontype?: string })._bsontype
      if (bsonType === 'ObjectId' || bsonType === 'ObjectID') {
        return String(current)
      }
      if (bsonType === 'Binary') {
        const asId = toMediaId(current)
        return asId || null
      }

      return current
    }),
  )

/**
 * Payload depth does not always populate uploads nested inside Corespace
 * template section arrays. Resolve those media docs so gallery cards get real URLs,
 * and convert BSON ObjectIds into plain JSON for client components.
 */
export async function hydrateCorespaceMedia(page: Page, payload: Payload): Promise<Page> {
  if (!page?.layout?.length) {
    return page
  }

  const ids = new Set<string>()
  collectUploadIds(page.layout, ids)

  const byId = new Map<string, Media>()

  if (ids.size) {
    const media = await payload.find({
      collection: 'media',
      depth: 0,
      limit: Math.max(ids.size, 1),
      pagination: false,
      where: {
        id: {
          in: [...ids],
        },
      },
    })

    for (const doc of media.docs) {
      byId.set(String(doc.id), toPlainMedia(doc as Media))
    }
  }

  const hydratedLayout = replaceUploadRefs(page.layout, byId) as Page['layout']

  return toPlainJson({
    ...page,
    layout: hydratedLayout,
  })
}
