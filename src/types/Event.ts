export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: 'Online' | 'In-Person';
  location?: string;
  eventLink?: string;
  startDateTime: string;
  endDateTime: string;
  category: string;
  organizer: string;
}
