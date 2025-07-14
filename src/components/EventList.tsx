import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Modal } from 'antd';
import { useEvent } from '../contexts/EventContext';
import { Event } from '../types/Event';
import { Card, Space } from 'antd';
import { EventForm } from './EventForm';
import dayjs, { Dayjs } from 'dayjs';
import TimeOverLap from './TimeOverLap';
import SearchAndFilter from './Search&Filter';
import { useSearchParams } from 'react-router-dom';
import type { SortOrder } from 'antd/es/table/interface';

const EventList = () => {
  const { events, deleteEvent, addEvent, updateEvent } = useEvent();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<Event | undefined>();
  const [modalOpen, setModalOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(() => searchParams.get("search") || "");
  const [category, setCategory] = useState<string | undefined>(() => searchParams.get("category") || undefined);
  const [eventType, setEventType] = useState<string | undefined>(() => searchParams.get("eventType") || undefined);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>(() => {
    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");
    return [start ? dayjs(start) : null, end ? dayjs(end) : null];
  });

  useEffect(() => {
    const params: any = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (eventType) params.eventType = eventType;
    if (dateRange[0]) params.startDate = dateRange[0].toISOString();
    if (dateRange[1]) params.endDate = dateRange[1].toISOString();

    setSearchParams(params);
  }, [search, category, eventType, dateRange]);

  const handleDelete = (id: string) => {
    deleteEvent(id);
  };

  const onSubmit = (event: Event): boolean => {
    const eventWithId: Event = {
      ...event,
      id: event.id ?? crypto.randomUUID(),
      organizer: event.organizer ?? "",
    };

    if (!selectedEventId) {
      if (isOverlappingEvent(event)) {
        setModalOpen(true);
        return false; // failed
      } else {
        addEvent(eventWithId);
        setModalVisible(false);
        return true; // success
      }
    } else {
      if (isOverlappingEvent(event, selectedEventId.id)) {
        setModalOpen(true);
        return false;
      } else {
        updateEvent(selectedEventId.id, eventWithId);
        setModalVisible(false);
        return true;
      }
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = !eventType || event.eventType === eventType;
    const matchesCategory = !category || event.category === category;
    const matchesDate =
      (!dateRange[0] || dayjs(event.startDateTime).isAfter(dateRange[0])) &&
      (!dateRange[1] || dayjs(event.endDateTime).isBefore(dateRange[1]));

    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title', width: '100px'
    },
    { title: 'Description', dataIndex: 'description', key: 'description', width: '150px' },
    {
      title: 'Start Date Time',
      dataIndex: 'startDateTime',
      key: 'startDateTime',
      width: '150px',
      sorter: (a: Event, b: Event) =>
        dayjs(a.startDateTime).unix() - dayjs(b.startDateTime).unix(),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'End Date Time',
      dataIndex: 'endDateTime',
      key: 'endDateTime',
      width: '150px',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
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

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    const [start, end] = dates || [null, null];
    setDateRange([start, end]);

    const updatedParams: any = {};
    if (start) updatedParams.startDate = start.toISOString();
    if (end) updatedParams.endDate = end.toISOString();

    // Preserve other filters
    searchParams.forEach((value, key) => {
      if (!updatedParams[key]) {
        updatedParams[key] = value;
      }
    });

    setSearchParams(updatedParams);
  };

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0px' }}>
            <span>Event List</span>
            <div style={{ marginTop: '30px' }}>
              <SearchAndFilter
                search={search}
                setSearch={setSearch}
                eventType={eventType}
                setEventType={setEventType}
                category={category}
                setCategory={setCategory}
                dateRange={dateRange}
                setDateRange={setDateRange}
                handleFilterChange={() => { }} // Provide a no-op or your actual handler here
              />
            </div>
            <Button type="primary" onClick={() => eventHandler(undefined)}>Create Event</Button>
          </div>
        }
          size="small"
          style={{ width: '100%' }}
        >
          <Table
            dataSource={filteredEvents}
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
