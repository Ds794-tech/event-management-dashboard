// src/components/EventList.tsx
import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { useEvent } from '../contexts/EventContext';
import { Event } from '../types/Event';
import { Link } from 'react-router-dom';
import { Card, Space } from 'antd';
import HeaderComponent from '../layout/header/Header';

const EventList = () => {
  const { events, deleteEvent } = useEvent();

  const handleDelete = (id: string) => {
    deleteEvent(id);
  };


  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Start Date', dataIndex: 'startDateTime', key: 'startDateTime' },
    { title: 'End Date', dataIndex: 'endDateTime', key: 'endDateTime' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    {
      title: 'Actions', key: 'actions', render: (text: string, record: Event) => (
        <span>
          <Link to={`/edit/${record.id}`}>
            <Button type="link">Edit</Button>
          </Link>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <>
      <HeaderComponent />
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 20 }}>
            <span style={{ marginLeft: 10 }}>Event List</span>
            <Link to="/create">
              <Button type="primary">Create Event</Button>
            </Link>
          </div>
        }
          size="small" style={{ width: '100%' }}>
          <Table
            dataSource={events}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            style={{ marginTop: 20 }}
          />
        </Card>
      </Space>
    </>
  );
};

export default EventList;
