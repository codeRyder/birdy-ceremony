import weddingData from '~/content/wedding.json'

export const useWeddingContent = () => {
  return {
    event: weddingData.event,
    seo: weddingData.seo,
    hero: weddingData.hero,
    eventInfo: weddingData.eventInfo,
    rsvp: weddingData.rsvp
  }
}
