import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { useEvent } from '../contexts/EventContext';
import { Event } from '../types/Event';
import { Card, Space } from 'antd';
import { EventForm } from './EventForm';
import dayjs from 'dayjs';
import TimeOverLap from './TimeOverLap';
import SearchAndFilter from './Search&Filter';
import { useSearchParams } from 'react-router-dom';
import type { ColumnType } from 'antd/es/table';
import type { SortOrder } from 'antd/es/table/interface';

const EventList = () => {
  const { events, deleteEvent, addEvent, updateEvent, filteredEvents, filters, setFilters } = useEvent();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<Event | undefined>();
  const [modalOpen, setModalOpen] = useState(false)
  const [,setSearchParams] = useSearchParams();

  useEffect(() => {
    const params: any = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.eventType) params.eventType = filters.eventType;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    setSearchParams(params);
  }, [filters, setSearchParams]);

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
        return false;
      } else {
        addEvent(eventWithId);
        setModalVisible(false);
        return true;
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

  const columns: ColumnType<Event>[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '100px',
      sorter: (a: Event, b: Event) => a.title.localeCompare(b.title),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
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
      if (excludeId && event.id === excludeId) return false;

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
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0px' }}>
              <span>Event List</span>
              <Button type="primary" onClick={() => eventHandler(undefined)}>Create Event</Button>
            </div>
            <div>
              <h4 style={{ marginBottom: 10 }}>Filters :</h4>
              <SearchAndFilter
                search={filters.search}
                setSearch={(val) => setFilters({ search: val })}
                category={filters.category}
                setCategory={(val) => setFilters({ category: val })}
                eventType={filters.eventType}
                setEventType={(val) => setFilters({ eventType: val })}
                dateRange={[
                  filters.startDate ? dayjs(filters.startDate) : null,
                  filters.endDate ? dayjs(filters.endDate) : null,
                ]}
                setDateRange={(range) => setFilters({
                  startDate: range[0]?.toISOString(),
                  endDate: range[1]?.toISOString()
                })}
              />
            </div>
          </>
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
