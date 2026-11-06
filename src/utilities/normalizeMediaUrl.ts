/**
 * Normalize broken / legacy Vercel Blob URLs to the public CDN form.
 *
 * Correct:
 *   https://{storeId}.public.blob.vercel-storage.com/{filename}
 *
 * where `storeId` is the id embedded in BLOB_READ_WRITE_TOKEN
 * (e.g. vercel_blob_rw_<storeId>_<secret>), lowercased, without a `store_` prefix.
 *
 * Legacy / incorrect shapes we rewrite:
 *   /api/media/file/{filename}  (Payload local path; files live on Blob)
 *   https://store_{id}/{filename}
 *   https://store_{id}.public.blob.vercel-storage.com/{filename}
 */
function getBlobStoreId(): null | string {
  const publicId = process.env.NEXT_PUBLIC_BLOB_STORE_ID || process.env.BLOB_STORE_ID
  if (publicId) {
    return publicId.replace(/^store_/i, '').toLowerCase()
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return null
  }

  // vercel_blob_rw_<storeId>_<secret>
  const match = token.match(/^vercel_blob_rw_([A-Za-z0-9]+)_/i)
  return match?.[1]?.toLowerCase() || null
}

export function normalizeMediaUrl(url?: null | string): string {
  if (!url) {
    return ''
  }

  const storeId = getBlobStoreId()

  // Payload often stores relative /api/media/file/... even when files are on Vercel Blob.
  // Locally those routes 404 — rewrite to the public Blob CDN.
  const apiFileMatch = url.match(/^\/api\/media\/file\/(.+)$/i)
  if (apiFileMatch && storeId) {
    const filename = decodeURIComponent(apiFileMatch[1])
    return `https://${storeId}.public.blob.vercel-storage.com/${filename}`
  }

  try {
    const parsed = new URL(url, 'http://localhost')
    const host = parsed.hostname.toLowerCase()

    // Relative URL handled above; absolute path-only already returned
    if (!/^https?:$/i.test(parsed.protocol) && url.startsWith('/')) {
      return url
    }

    // https://store_xxx/file  OR  https://store_xxx.public.blob.vercel-storage.com/file
    const bareStoreMatch = host.match(/^store_([a-z0-9]+)$/i)
    if (bareStoreMatch) {
      parsed.hostname = `${bareStoreMatch[1].toLowerCase()}.public.blob.vercel-storage.com`
      return parsed.toString()
    }

    const prefixedBlobMatch = host.match(/^store_([a-z0-9]+)\.public\.blob\.vercel-storage\.com$/i)
    if (prefixedBlobMatch) {
      parsed.hostname = `${prefixedBlobMatch[1].toLowerCase()}.public.blob.vercel-storage.com`
      return parsed.toString()
    }

    // Also fix mixed-case store hosts if present.
    const blobMatch = host.match(/^([a-z0-9]+)\.public\.blob\.vercel-storage\.com$/i)
    if (blobMatch && host !== `${blobMatch[1].toLowerCase()}.public.blob.vercel-storage.com`) {
      parsed.hostname = `${blobMatch[1].toLowerCase()}.public.blob.vercel-storage.com`
      return parsed.toString()
    }
  } catch {
    return url
  }

  return url
}
