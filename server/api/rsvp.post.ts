import { promises as fs } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'
import type { H3Event } from 'h3'
import { createError, defineEventHandler, readBody } from 'h3'

interface FormSubmissionPayload {
  name: string
  email: string
  attendance: 'attending' | 'not-attending' | 'dont-know'
  additionalPeople: number
  guestNames: string[]
  stayTuned: boolean
}

interface FormSubmission extends FormSubmissionPayload {
  id: string
  submittedAt: string
}

const DATA_DIR = join(process.cwd(), 'data')
const DATA_FILE = join(DATA_DIR, 'rsvp-submissions.json')
const MAX_ADDITIONAL_PEOPLE = 4

const sanitizePayload = (payload: Partial<FormSubmissionPayload>): FormSubmissionPayload => {
  const name = (payload.name ?? '').trim()
  const email = (payload.email ?? '').trim()
  const attendance = payload.attendance ?? 'dont-know'
  const additionalPeople = Number(payload.additionalPeople ?? 0)
  const stayTuned = Boolean(payload.stayTuned)
  const guestNames = Array.isArray(payload.guestNames) ? payload.guestNames : []

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Name is required.' })
  }

  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'Email is required.' })
  }

  if (!['attending', 'not-attending', 'dont-know'].includes(attendance)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid attendance option.' })
  }

  const clampedAdditionalPeople = Math.min(
    Math.max(0, Number.isFinite(additionalPeople) ? additionalPeople : 0),
    MAX_ADDITIONAL_PEOPLE
  )

  return {
    name,
    email,
    attendance,
    additionalPeople: clampedAdditionalPeople,
    guestNames,
    stayTuned
  }
}

const readSubmissions = async (): Promise<FormSubmission[]> => {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8')
    const parsed = JSON.parse(content)

    return Array.isArray(parsed) ? parsed : []
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []
    }

    throw error
  }
}

const writeSubmissions = async (submissions: FormSubmission[]) => {
  await fs.mkdir(DATA_DIR, { recursive: true })  
  // Writing the whole JSON array keeps the storage easy to inspect manually.
  await fs.writeFile(DATA_FILE, `${JSON.stringify(submissions, null, 2)}\n`, 'utf-8')
}

export default defineEventHandler(async (event: H3Event) => {
  const payload = await readBody<Partial<FormSubmissionPayload>>(event)
  const sanitized = sanitizePayload(payload ?? {})

  const cleanedGuestNames = sanitized.guestNames
    .slice(0, sanitized.additionalPeople)
    .map((name) => name.trim())
    .filter(Boolean)

  const submission: FormSubmission = {
    ...sanitized,
    guestNames: cleanedGuestNames,
    id: randomUUID(),
    submittedAt: new Date().toISOString()
  }

  const submissions = await readSubmissions()
  submissions.push(submission)
  await writeSubmissions(submissions)

  return {
    success: true,
    submissionId: submission.id
  }
})
