export interface CalendarEventType {
  id: string
  summary: string

  start: {
    dateTime: string
  }

  end: {
    dateTime: string
  }

  colorId?: string
  
}