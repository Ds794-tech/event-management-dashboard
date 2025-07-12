// src/contexts/EventContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Event } from '../types/Event';

interface EventContextProps {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updatedEvent: Event) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => Event | undefined;
  filterEvents: (filters: any) => Event[];
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([{
    title: 'Sample Event',
    description: 'This is a sample event',
    eventType: 'Online',
    startDateTime: new Date().toISOString(),
    endDateTime: new Date().toISOString(),
    category: 'General',
    id: '1',
    organizer: 'Sample Organizer'
  }]);

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
  };

  const updateEvent = (id: string, updatedEvent: Event) => {
    setEvents(events.map(event => event.id === id ? updatedEvent : event));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  const filterEvents = (filters: any) => {
    return events.filter(event => {
      const { eventType, category, startDateTime, endDateTime } = filters;
      let isValid = true;
      if (eventType && event.eventType !== eventType) {
        isValid = false;
      }
      if (category && event.category !== category) {
        isValid = false;
      }
      if (startDateTime && new Date(event.startDateTime) < new Date(startDateTime)) {
        isValid = false;
      }
      if (endDateTime && new Date(event.endDateTime) > new Date(endDateTime)) {
        isValid = false;
      }
      return isValid;
    });
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, getEventById, filterEvents }}>
      {children}
    </EventContext.Provider>
  );
};
