// app/admin/FACULTY/others-pages/projects/[id]/submissions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Card, Table, Modal, Form, DatePicker, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import Link from 'next/link';
import dayjs from 'dayjs';

// Define interfaces for your data types
interface Submission {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  projectId: string;
}

interface FormValues {
  title: string;
  description: string;
  dueDate: dayjs.Dayjs;
}

const ProjectSubmissionsPage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [form] = Form.useForm<FormValues>();

  // Fetch submissions for this project
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Or however you store your auth token
      const response = await fetch(`https://rf-backend-alpha.vercel.app/api/submissions/project/${projectId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add this line
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      message.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (projectId) {
      fetchSubmissions();
    }
  }, [projectId]);

  const handleOpenModal = (submission: Submission | null = null) => {
    setEditingSubmission(submission);
    
    if (submission) {
      form.setFieldsValue({
        title: submission.title,
        description: submission.description,
        dueDate: dayjs(submission.dueDate)
      });
    } else {
      form.resetFields();
    }
    
    setModalVisible(true);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      const payload = {
        ...values,
        projectId,
        dueDate: values.dueDate.toISOString()
      };

      let response;

      const token = localStorage.getItem('token');
      if (editingSubmission) {
        // Update existing submission
        response = await fetch(`https://rf-backend-alpha.vercel.app/api/submissions/${editingSubmission.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new submission
        response = await fetch('https://rf-backend-alpha.vercel.app/api/submissions/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save submission');
      }

      message.success(`Submission ${editingSubmission ? 'updated' : 'created'} successfully`);
      setModalVisible(false);
      fetchSubmissions();
    } catch (error) {
      console.error('Error saving submission:', error);
      message.error('Failed to save submission');
    }
  };

  const handleDelete = async (submissionId: string) => {
    try {
        const token = localStorage.getItem('token');
      const response = await fetch(`https://rf-backend-alpha.vercel.app/api/submissions/${submissionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete submission');
      }

      message.success('Submission deleted successfully');
      fetchSubmissions();
    } catch (error) {
      console.error('Error deleting submission:', error);
      message.error('Failed to delete submission');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Submission) => (
        <Link href={`/admin/FACULTY/others-pages/projects/${projectId}/submissions/${record.id}`}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => moment(date).format('MMMM DD, YYYY'),
      sorter: (a: Submission, b: Submission) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Submission) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Project Submissions</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          Create Submission
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={submissions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={`${editingSubmission ? 'Edit' : 'Create'} Submission`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <input 
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter submission title"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={4}
              placeholder="Enter submission description"
            />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select a due date' }]}
          >
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingSubmission ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectSubmissionsPage;
