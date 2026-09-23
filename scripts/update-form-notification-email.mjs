const FORM_NOTIFICATION_EMAIL = 'corespacebuilders@gmail.com'

const defaultEmailMessage = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: '{{*:table}}',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
}

const defaultEmail = {
  emailTo: FORM_NOTIFICATION_EMAIL,
  subject: 'New lead from Corespace Builders',
  message: defaultEmailMessage,
}

function usesDynamicRecipient(emails) {
  return Array.isArray(emails) && emails.some((email) => email?.emailTo?.includes('{{'))
}

function buildEmails(existingEmails) {
  if (!existingEmails?.length) {
    return [defaultEmail]
  }

  return existingEmails.map((email) => ({
    ...email,
    emailTo: FORM_NOTIFICATION_EMAIL,
  }))
}

const { getPayload } = await import('payload')
const { default: configPromise } = await import('../src/payload.config.ts')
const config = await configPromise
const payload = await getPayload({ config })
const formsCollection = payload.db.connection.db.collection('forms')

const forms = await formsCollection.find({}).toArray()
let updated = 0

for (const form of forms) {
  if (usesDynamicRecipient(form.emails)) {
    console.log(`Skipping "${form.title}" (dynamic email recipient)`)
    continue
  }

  const emails = buildEmails(form.emails)

  await formsCollection.updateOne(
    { _id: form._id },
    { $set: { emails, updatedAt: new Date().toISOString() } },
  )

  updated += 1
  console.log(`Updated "${form.title}" notification email to ${FORM_NOTIFICATION_EMAIL}`)
}

console.log(`Done. Updated ${updated} form(s).`)

process.exit(0)
