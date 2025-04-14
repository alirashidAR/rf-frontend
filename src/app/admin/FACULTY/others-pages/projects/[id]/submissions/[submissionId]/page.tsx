// app/admin/FACULTY/others-pages/projects/[id]/submissions/[submissionId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, Table, Button, Modal, Form, Input, Spin, message, Tag } from 'antd';
import { FileOutlined, CommentOutlined, DownloadOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

interface User {
  profilePicUrl?: string;
  name: string;
  email: string;
}

interface SubmissionItem {
  id: string;
  feedback?: string;
  fileUrl?: string;
  user?: User;
  submittedAt?: string;
  status?: string;
}

interface Submission {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  submissionItems: SubmissionItem[];
}

const SubmissionDetailPage = () => {
  const params = useParams();
  const { id: projectId, submissionId } = params;
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<SubmissionItem | null>(null);
  const [form] = Form.useForm();

  const fetchSubmission = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
      const response = await fetch(`https://rf-backend-alpha.vercel.app/api/submissions/${submissionId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch submission details');
      }
      
      const data = await response.json();
      setSubmission(data);
    } catch (error) {
      console.error('Error fetching submission details:', error);
      message.error('Failed to load submission details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId]);

  const handleOpenFeedbackModal = (item: SubmissionItem) => {
    setCurrentItem(item);
    form.setFieldsValue({
      feedback: item.feedback || ''
    });
    setFeedbackModal(true);
  };

  const handleSubmitFeedback = async (values: { feedback: string }) => {
    if (!currentItem) return;
    try {
        const token = localStorage.getItem('token');
      const response = await fetch(`https://rf-backend-alpha.vercel.app/api/submissions/item/${currentItem.id}/feedback`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ feedback: values.feedback }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      message.success('Feedback submitted successfully');
      setFeedbackModal(false);
      fetchSubmission(); // Refresh the data
    } catch (error) {
      console.error('Error submitting feedback:', error);
      message.error('Failed to submit feedback');
    }
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: 'user',
      key: 'user',
      render: (user: User) => (
        <div className="flex items-center">
          {user.profilePicUrl && (
            <img 
              src={user.profilePicUrl} 
              alt={user.name} 
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <div>
            <div>{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Submitted At',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date: string) => date ? moment(date).format('MMM DD, YYYY h:mm A') : 'Not submitted',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let icon = null;
        
        switch (status) {
          case 'SUBMITTED':
            color = 'processing';
            icon = <ClockCircleOutlined />;
            break;
          case 'GRADED':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          default:
            color = 'default';
        }
        
        return (
          <Tag color={color} icon={icon}>
            {status || 'NOT SUBMITTED'}
          </Tag>
        );
      },
    },
    {
      title: 'File',
      key: 'file',
      render: (_: any, record: SubmissionItem) => (
        record.fileUrl ? (
          <a 
            href={record.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <FileOutlined className="mr-1" /> View File
          </a>
        ) : 'No file submitted'
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: SubmissionItem) => (
        <div className="flex space-x-2">
          {record.fileUrl && (
            <Button 
              icon={<DownloadOutlined />}
              href={record.fileUrl}
              target="_blank"
            >
              Download
            </Button>
          )}
          <Button
            type="primary"
            icon={<CommentOutlined />}
            onClick={() => handleOpenFeedbackModal(record)}
            disabled={!record.fileUrl}
          >
            {record.feedback ? 'Edit Feedback' : 'Add Feedback'}
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center p-6">
        <h1 className="text-2xl font-semibold mb-4">Submission not found</h1>
        <p>The requested submission could not be found or you don't have permission to view it.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{submission.title}</h1>
        <p className="text-gray-600 mt-2">{submission.description}</p>
        <p className="text-sm mt-2">
          <span className="font-medium">Due Date:</span> {moment(submission.dueDate).format('MMMM DD, YYYY')}
        </p>
      </div>

      <Card title="Student Submissions" className="mb-6">
        <Table
          columns={columns}
          dataSource={submission.submissionItems || []}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal
        title="Provide Feedback"
        open={feedbackModal}
        onCancel={() => setFeedbackModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitFeedback}>
          <Form.Item
            name="feedback"
            label="Feedback"
            rules={[{ required: true, message: 'Please enter your feedback' }]}
          >
            <Input.TextArea rows={6} placeholder="Enter your feedback for the student's submission..." />
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setFeedbackModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit Feedback
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SubmissionDetailPage;
