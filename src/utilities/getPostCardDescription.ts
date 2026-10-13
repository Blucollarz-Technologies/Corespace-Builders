import type { Post } from '@root/payload-types'

import { lexicalToPlaintext } from '@root/utilities/lexicalToPlaintext'

/** Prefer meta description, then excerpt plain text, for archive card previews. */
export const getPostCardDescription = (post: Partial<Post> | null | undefined): string => {
  const meta = post?.meta?.description?.trim()
  if (meta) {
    return meta
  }

  const excerpt = lexicalToPlaintext(post?.excerpt)
  if (excerpt && excerpt !== '.') {
    return excerpt
  }

  return ''
}
