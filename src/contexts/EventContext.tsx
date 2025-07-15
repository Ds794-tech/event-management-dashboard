import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Event } from '../types/Event';
import dayjs from 'dayjs';

interface EventContextProps {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updatedEvent: Event) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => Event | undefined;
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  filteredEvents: Event[];
}

interface FilterState {
  search: string;
  category?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
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
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFiltersState] = useState<FilterState>({
    search: '',
    category: undefined,
    eventType: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const setFilters = (updated: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...updated }));
  };

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

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.description.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCategory = !filters.category || event.category === filters.category;
    const matchesType = !filters.eventType || event.eventType === filters.eventType;
    const matchesStart = !filters.startDate || dayjs(event.startDateTime).isAfter(dayjs(filters.startDate));
    const matchesEnd = !filters.endDate || dayjs(event.endDateTime).isBefore(dayjs(filters.endDate));

    return matchesSearch && matchesCategory && matchesType && matchesStart && matchesEnd;
  });

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, getEventById, filteredEvents, filters, setFilters }}>
      {children}
    </EventContext.Provider>
  );
};

