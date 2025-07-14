import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Radio, Button, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { Modal as AntdModal } from 'antd'; 

const { TextArea } = Input;
const { Option } = Select;

interface Event {
  id?: string;
  title: string;
  description: string;
  category: string;
  eventType: 'Online' | 'In-Person';
  location?: string;
  eventLink?: string;
  startDateTime: string;
  endDateTime: string;
  organizer?: string;
}

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: Event) => void;
  initialData?: Partial<Event>;
}

export const EventForm: React.FC<EventFormProps> = ({ open, onClose, onSubmit, initialData }) => {
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<Event>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      eventType: 'Online',
      location: '',
      eventLink: '',
      startDateTime: '',
      endDateTime: '',
      organizer: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData?.title || '',
        description: initialData?.description || '',
        category: initialData?.category || '',
        eventType: initialData?.eventType || 'Online',
        location: initialData?.location || '',
        eventLink: initialData?.eventLink || '',
        startDateTime: initialData?.startDateTime || '',
        endDateTime: initialData?.endDateTime || '',
        organizer: initialData?.organizer || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        category: '',
        eventType: 'Online',
        location: '',
        eventLink: '',
        startDateTime: '',
        endDateTime: '',
        organizer: '',
      });
    }
  }, [initialData, reset, open]);


  const eventType = watch('eventType');

  const onFormSubmit = (data: Event) => {
  if (dayjs(data.startDateTime).isSame(dayjs(data.endDateTime))) {
    alert('End Date & Time must not be the same as Start Date & Time');
    return;
  }

  if (dayjs(data.startDateTime).isAfter(dayjs(data.endDateTime))) {
    alert('End Date & Time must be after Start Date & Time');
    return;
  }

  onSubmit({
    ...data,
    id: initialData?.id || String(Date.now()),
    organizer: data.organizer || initialData?.organizer,
  });

};

  // const onFormSubmit = (data: Event) => {
  //   if (dayjs(data.startDateTime).isSame(dayjs(data.endDateTime))) {
  //     message.error('End Date & Time must not be same Start Date & Time');
  //     alert('End Date & Time must not be same Start Date & Time');
  //     return;
  //   }

  //   if (dayjs(data.startDateTime).isAfter(dayjs(data.endDateTime))) {
  //     message.error('End Date & Time must be After Start Date & Time');
  //     alert('End Date & Time must not be After Start Date & Time');
  //     return;
  //   }

  //   onSubmit({
  //     ...data,
  //     id: initialData?.id || String(Date.now()),
  //     organizer: data?.organizer || initialData?.organizer, // Replace with context value if needed
  //   });

  //   onClose();
  // };

  return (
    <Modal
      open={open}
      title={initialData ? 'Edit Event' : 'Create Event'}
      onCancel={onClose}
      footer={null}
    // destroyOnClose
    >
      <Form layout="vertical" onFinish={handleSubmit(onFormSubmit)}>
        <Form.Item
          label="Title"
          validateStatus={errors.title && 'error'}
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Title is required' }}
            render={({ field }) => <Input {...field} placeholder="Event Title" />}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          validateStatus={errors.description && 'error'}
          help={errors.description?.message}
        >
          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <TextArea rows={3} {...field} placeholder="Event Description" />
            )}
          />
        </Form.Item>

        <Form.Item label="Event Type">
          <Controller
            name="eventType"
            control={control}
            render={({ field }) => (
              <Radio.Group {...field}>
                <Radio value="Online">Online</Radio>
                <Radio value="In-Person">In-Person</Radio>
              </Radio.Group>
            )}
          />
        </Form.Item>

        {eventType === 'Online' ? (
          <Form.Item
            label="Event Link"
            validateStatus={errors.eventLink && 'error'}
            help={errors.eventLink?.message}
          >
            <Controller
              name="eventLink"
              control={control}
              rules={{ required: 'Event Link is required for Online events' }}
              render={({ field }) => <Input {...field} placeholder="https://..." />}
            />
          </Form.Item>
        ) : (
          <Form.Item
            label="Location"
            validateStatus={errors.location && 'error'}
            help={errors.location?.message}
          >
            <Controller
              name="location"
              control={control}
              rules={{ required: 'Location is required for In-Person events' }}
              render={({ field }) => <Input {...field} placeholder="Event Location" />}
            />
          </Form.Item>
        )}

        <Form.Item
          label="Category"
          validateStatus={errors.category && 'error'}
          help={errors.category?.message}
        >
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select a category"
                onChange={(value) => field.onChange(value)}
                value={field.value || undefined}
              >
                <Option value="General">General</Option>
                <Option value="Workshop">Workshop</Option>
                <Option value="Meetup">Meetup</Option>
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Start Date & Time"
          validateStatus={errors.startDateTime && 'error'}
          help={errors.startDateTime?.message}
        >
          <Controller
            name="startDateTime"
            control={control}
            rules={{ required: 'Start date is required' }}
            render={({ field }) => (
              <DatePicker
                showTime
                style={{ width: '100%' }}
                value={field.value ? dayjs(field.value) : null}
                onChange={(value) =>
                  field.onChange(value ? value.toISOString() : '')
                }
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="End Date & Time"
          validateStatus={errors.endDateTime && 'error'}
          help={errors.endDateTime?.message}
        >
          <Controller
            name="endDateTime"
            control={control}
            rules={{ required: 'End date is required' }}
            render={({ field }) => (
              <DatePicker
                showTime
                style={{ width: '100%' }}
                value={field.value ? dayjs(field.value) : null}
                onChange={(value) =>
                  field.onChange(value ? value.toISOString() : '')
                }
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="organizer"
          validateStatus={errors.organizer && 'error'}
          help={errors.organizer?.message}
        >
          <Controller
            name="organizer"
            control={control}
            rules={{ required: 'organizer is required' }}
            render={({ field }) => <Input {...field} placeholder="Event organizer" />}
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {initialData ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
