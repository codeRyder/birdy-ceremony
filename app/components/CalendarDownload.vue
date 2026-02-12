<template>
  <div class="text-center">
    <UButton
      size="lg"
      icon="i-heroicons-calendar-days"
      color="primary"
      @click="downloadCalendar"
    >
      {{ content.rsvp.calendar.buttonText }}
    </UButton>
    
    <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
      {{ content.rsvp.calendar.subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
const content = useWeddingContent()

const downloadCalendar = () => {
  // Event details from content
  const event = {
    title: content.rsvp.calendar.eventTitle,
    description: content.rsvp.calendar.eventDescription,
    location: content.event.location.full,
    startDate: content.event.startDate,
    endDate: content.event.endDate
  }

  // Create ICS file content
  const icsContent = generateICS(event)
  
  // Create blob and download
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = 'spiritual-marriage-celebration.ics'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const generateICS = (event: any) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const escapeString = (str: string) => {
    return str.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
  }

  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Spiritual Marriage//Wedding Invitation//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Spiritual Marriage Celebration
X-WR-TIMEZONE:Europe/Berlin

BEGIN:VEVENT
UID:${now}@spiritual-marriage-2026
DTSTAMP:${now}
DTSTART:${formatDate(event.startDate)}
DTEND:${formatDate(event.endDate)}
SUMMARY:${escapeString(event.title)}
DESCRIPTION:${escapeString(event.description)}
LOCATION:${escapeString(event.location)}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-P1W
ACTION:DISPLAY
DESCRIPTION:Reminder: ${escapeString(event.title)} in 1 week
END:VALARM
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Reminder: ${escapeString(event.title)} tomorrow
END:VALARM
END:VEVENT

END:VCALENDAR`
}
</script>
