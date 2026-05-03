import { parseISO, differenceInMinutes } from "date-fns"

export const HOUR_HEIGHT = 60

export function getMinutesFromMidnight(date: Date) {
  return date.getHours() * 60 + date.getMinutes()
}

export function getEventTop(startISO: string) {
  const start = parseISO(startISO)
  return getMinutesFromMidnight(start)
}

export function getEventHeight(startISO: string, endISO: string) {
  const start = parseISO(startISO)
  const end = parseISO(endISO)

  return differenceInMinutes(end, start)
}