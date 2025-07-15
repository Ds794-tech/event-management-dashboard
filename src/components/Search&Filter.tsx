import { Form, Input, Select, DatePicker } from 'antd';
import { Dayjs } from 'dayjs';
import React from 'react';

const { RangePicker } = DatePicker;

interface SearchAndFilterProps {
    search: string;
    setSearch: (value: string) => void;
    eventType: string | undefined;
    setEventType: (value: string | undefined) => void;
    category: string | undefined;
    setCategory: (value: string | undefined) => void;
    setDateRange: (value: [Dayjs | null, Dayjs | null]) => void;
    dateRange: [Dayjs | null, Dayjs | null];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    search,
    setSearch,
    eventType,
    setEventType,
    category,
    setCategory,
    setDateRange,
    dateRange
}) => {
    return (
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <Form.Item>
                <Input
                    placeholder="Search by title or description"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Form.Item>
            <Form.Item>
                <Select
                    style={{ width: 200 }}
                    placeholder="Event Type"
                    value={eventType}
                    onChange={setEventType}
                    allowClear
                >
                    <Select.Option value="Online">Online</Select.Option>
                    <Select.Option value="In-Person">In-Person</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Select
                    style={{ width: 200 }}
                    placeholder="Category"
                    value={category}
                    onChange={setCategory}
                    allowClear
                >
                    <Select.Option value="General">General</Select.Option>
                    <Select.Option value="Workshop">Workshop</Select.Option>
                    <Select.Option value="Meetup">Meetup</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <RangePicker
                    value={dateRange}
                    onChange={(range) => setDateRange(range as [Dayjs | null, Dayjs | null] || [null, null])}
                />
            </Form.Item>
        </div>
    );
}


export default SearchAndFilter;