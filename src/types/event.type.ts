export type IntegrationProvider = "GOOGLE_CALENDAR";

export interface IEvent {
  id: string;
  externalId: string;
  provider: IntegrationProvider;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  location?: string;
  status?: string;
  syncedAt: string;
}

export interface IConnectionDetails {
  connectionId: string;
  events: IEvent[];
} 

export interface CreateEventRequest {
  provider: IntegrationProvider;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isAllDay?: boolean;
  location?: string;
  attendees?: string[];
}