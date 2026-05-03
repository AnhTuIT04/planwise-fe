export interface CalendarEventType {
  id: string
  summary: string
  description?: string
  isAllDay?: boolean
  location?: string
  attendees?: string[]
  


  start: {
    dateTime: string
  }

  end: {
    dateTime: string
  }

  colorId?: string
  
}