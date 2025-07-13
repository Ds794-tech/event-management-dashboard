import { useState } from 'react';
import { Table, Button, Popconfirm, Modal } from 'antd';
import { useEvent } from '../contexts/EventContext';
import { Event } from '../types/Event';
import { Card, Space } from 'antd';
import { EventForm } from './EventForm';
import dayjs from 'dayjs';
import TimeOverLap from './TimeOverLap';

const EventList = () => {
  const { events, deleteEvent, addEvent, updateEvent } = useEvent();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<Event | undefined>();
  const [modalOpen, setModalOpen] = useState(false)

  const handleDelete = (id: string) => {
    deleteEvent(id);
  };

  const onSubmit = (event: Event) => {
    // Ensure id is always a string
    const eventWithId: Event = {
      ...event,
      id: event.id ?? crypto.randomUUID(),
      organizer: event.organizer ?? "",
    };
    if (!selectedEventId) {
      if (isOverlappingEvent(event)) {
        setModalOpen(true)
        setModalVisible(true)
        // alert('Event time overlaps with an existing event. Please choose a different time.')
        return;
      } else {
        addEvent(eventWithId);
      }
    } else {
      if (isOverlappingEvent(event, selectedEventId.id)) {
        setModalOpen(true)
        setModalVisible(true)
        // alert('Event time overlaps with an existing event. Please choose a different time.')
        return;
      } else {
        updateEvent(selectedEventId.id, eventWithId);
      }
    }
  }

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title', width: '100px' },
    { title: 'Description', dataIndex: 'description', key: 'description', width: '150px' },
    { title: 'Start Date Time', dataIndex: 'startDateTime', key: 'startDateTime', width: '100px' },
    { title: 'End Date Time', dataIndex: 'endDateTime', key: 'endDateTime' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Event Type', dataIndex: 'eventType', key: 'eventType' },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (text: string, record: Event) => {
        return record.eventType === 'In-Person' ? record.location : 'N/A';
      },
    },
    {
      title: 'Event Link',
      dataIndex: 'eventLink',
      key: 'eventLink',
      render: (text: string, record: Event) => {
        return record.eventType === 'Online' ?
          <div>
            {record.eventLink ? <a href={record.eventLink} target="_blank" rel="noopener noreferrer">{record.eventLink}</a> : 'N/A'}
            {/* If you want to show the link text as "View Event" */}
            {/* {record.eventLink ? <a href={record.eventLink} target="_blank" rel="noopener noreferrer">View Event</a> : 'N/A'} */}
          </div>
          :
          'N/A';
      },
    },
    { title: 'Organizer', dataIndex: 'organizer', key: 'organizer' },
    {
      title: 'Actions', key: 'actions', width: '300px', render: (text: string, record: Event) => (
        <span>
          <>
            <Button type='primary' onClick={() => eventHandler(record)}>Edit</Button>
          </>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
            <Button style={{ marginLeft: 20 }} type="default" danger>Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const eventHandler = (data: Event | undefined) => {
    setModalVisible(true);
    setSelectedEventId(data);
  };

  const isOverlappingEvent = (newEvent: Event, excludeId?: string) => {
    const newStart = dayjs(newEvent.startDateTime);
    const newEnd = dayjs(newEvent.endDateTime);
    return events.some((event: Event) => {
      if (excludeId && event.id === excludeId) return false; // skip the event being edited

      const existingStart = dayjs(event.startDateTime);
      const existingEnd = dayjs(event.endDateTime);

      return (
        newStart.isBefore(existingEnd) &&
        newEnd.isAfter(existingStart)
      );
    });
  };

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0px' }}>
            <span>Event List</span>
            <Button type="primary" onClick={() => eventHandler(undefined)}>Create Event</Button>
          </div>
        }
          size="small"
          style={{ width: '100%' }}
        >
          <Table
            dataSource={events}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            style={{ marginTop: 20 }}
          />
        </Card>
      </Space>
      <EventForm
        open={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedEventId(undefined);
        }}
        initialData={selectedEventId}
        onSubmit={(data) => onSubmit(data as Event)}
      />
      <TimeOverLap
        modalOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
        }}
      />
    </>
  );
};

export default EventList;
