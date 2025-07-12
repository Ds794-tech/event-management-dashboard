// src/components/EventForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useEvent } from '../contexts/EventContext';
import { Event } from '../types/Event';
import { isTimeOverlap } from '../utils';
import { Button, Input, Select, DatePicker, message } from 'antd';
import moment from 'moment';

const EventForm = ({ eventId }: { eventId?: string }) => {
  const { addEvent, updateEvent, getEventById, events } = useEvent();
  const [event, setEvent] = useState<Event | null>(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Event>({
    defaultValues: {
      startDateTime: moment().format('YYYY-MM-DDTHH:mm'),
      endDateTime: moment().format('YYYY-MM-DDTHH:mm'),
    },
  });

  useEffect(() => {
    if (eventId) {
      const existingEvent = getEventById(eventId);
      if (existingEvent) {
        setEvent(existingEvent);
        setValue('title', existingEvent.title);
        setValue('description', existingEvent.description);
        setValue('startDateTime', existingEvent.startDateTime);
        setValue('endDateTime', existingEvent.endDateTime);
        setValue('category', existingEvent.category);
      }
    }
  }, [eventId, getEventById, setValue]);

  const onSubmit = (data: Event) => {
    // Check if the new event's time overlaps with existing events
    if (isTimeOverlap(data, events)) {
      message.error('The event time overlaps with an existing event.');
      return;
    }

    if (eventId) {
      updateEvent(eventId, data);
    } else {
      addEvent(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('title', { required: true })} placeholder="Event Title" />
      {errors.title && <p>{errors.title.message}</p>}

      <Input.TextArea {...register('description', { required: true })} placeholder="Event Description" />
      {errors.description && <p>{errors.description.message}</p>}

      <Select {...register('category', { required: true })} placeholder="Category">
        <Select.Option value="workshop">Workshop</Select.Option>
        <Select.Option value="seminar">Seminar</Select.Option>
        {/* Add more options here */}
      </Select>
      {errors.category && <p>{errors.category.message}</p>}

      <DatePicker
        {...register('startDateTime', { required: true })}
        showTime
        format="YYYY-MM-DD HH:mm"
        placeholder="Start Date & Time"
        value={moment(event?.startDateTime)}
        onChange={(date) => setValue('startDateTime', date?.toISOString())}
      />
      {errors.startDateTime && <p>{errors.startDateTime.message}</p>}

      <DatePicker
        {...register('endDateTime', { required: true })}
        showTime
        format="YYYY-MM-DD HH:mm"
        placeholder="End Date & Time"
        value={moment(event?.endDateTime)}
        onChange={(date) => setValue('endDateTime', date?.toISOString())}
      />
      {errors.endDateTime && <p>{errors.endDateTime.message}</p>}

      <Button type="primary" htmlType="submit">
        {eventId ? 'Update Event' : 'Create Event'}
      </Button>
    </form>
  );
};

export default EventForm;
