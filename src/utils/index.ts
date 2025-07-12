export interface Event {
  startDateTime: string | Date;
  endDateTime: string | Date;
}

export const isTimeOverlap = (newEvent: Event, existingEvents: Event[]) => {
  const newStart = new Date(newEvent.startDateTime).getTime();
  const newEnd = new Date(newEvent.endDateTime).getTime();

  for (const event of existingEvents) {
    const existingStart = new Date(event.startDateTime).getTime();
    const existingEnd = new Date(event.endDateTime).getTime();

    if (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) || 
      (newStart <= existingStart && newEnd >= existingEnd)
    ) {
      return true;
    }
  }

  return false;
};
