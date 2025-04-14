// app/admin/USER/others-pages/projects/[id]/submissions/[submissionId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, Button, Upload, message, Alert, Spin, Divider } from 'antd';
import { 
  InboxOutlined, 
  FileOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import moment from 'moment';
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

const { Dragger } = Upload;

// Define interfaces for type safety
interface User {
  id: string;
  name?: string;
  email?: string;
}

interface SubmissionItem {
  id: string;
  user: User;
  submittedAt?: string;
  status?: string;
  fileUrl?: string;
  feedback?: string;
}

interface Submission {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  submissionItems?: SubmissionItem[];
}

const StudentSubmissionDetailPage = () => {
  const params = useParams();
  const { id: projectId, submissionId } = params;
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [mySubmission, setMySubmission] = useState<SubmissionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
      
      // Find the current user's submission
      const currentUser = await getCurrentUser();
      const userSubmission = data.submissionItems?.find((item: SubmissionItem) => item.user.id === currentUser.id);
      setMySubmission(userSubmission || null);
    } catch (error) {
      console.error('Error fetching submission details:', error);
      message.error('Failed to load submission details');
    } finally {
      setLoading(false);
    }
  };

  // Mock function to get current user using JWT token
const getCurrentUser = async (): Promise<User> => {
    try {
      // Get the JWT token from localStorage, sessionStorage, or cookies
      const token = localStorage.getItem('token') || sessionStorage.getItem('token') || getCookieValue('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Parse the JWT token (it's base64 encoded)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Return the user data from the token
      return {
        id: payload.id,
        name: payload.name,
        email: payload.email
        // You can add other fields as needed
      };
    } catch (error) {
      console.error('Error extracting user from token:', error);
      // Fallback to API call if token parsing fails
      const response = await fetch('/api/auth/me');
      return response.json();
    }
  };
  
  // Helper function to get cookie value by name
  const getCookieValue = (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };
  
  useEffect(() => {
    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId]);

  const isOverdue = submission ? new Date() > new Date(submission.dueDate) : false;

  const handleUpload = async (options: RcCustomRequestOptions) => {
    const { file, onSuccess, onError } = options;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file as File);

    try {
        const token = localStorage.getItem('token');
      const response = await fetch(`https://rf-backend-alpha.vercel.app/api/submissions/${submissionId}/submit`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      message.success('File uploaded successfully');
      onSuccess?.(result);
      
      // Refresh the submission data
      fetchSubmission();
    } catch (error) {
      console.error('Error uploading file:', error);
      message.error('Failed to upload file');
      onError?.(error as any);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    customRequest: handleUpload,
    showUploadList: false,
    accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.rar',
  };

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
      <Card className="mb-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">{submission.title}</h1>
          <p className="text-gray-600 mt-2">{submission.description}</p>
        </div>
        
        <div className="flex items-center mt-4">
          <div className="mr-6">
            <p className="text-sm">
              <span className="font-medium">Due Date:</span>{' '}
              {moment(submission.dueDate).format('MMMM DD, YYYY h:mm A')}
            </p>
            
            {isOverdue ? (
              <Alert 
                message="This submission is past due" 
                type="error" 
                showIcon 
                icon={<WarningOutlined />}
                className="mt-2" 
              />
            ) : (
              <Alert 
                message={`Time remaining: ${moment(submission.dueDate).fromNow(true)}`} 
                type="info" 
                showIcon 
                icon={<ClockCircleOutlined />}
                className="mt-2" 
              />
            )}
          </div>
        </div>
      </Card>
      
      <Card 
        title="Your Submission" 
        className="mb-6"
        extra={
          mySubmission?.status === 'GRADED' ? (
            <span className="text-green-600 flex items-center">
              <CheckCircleOutlined className="mr-1" /> Graded
            </span>
          ) : null
        }
      >
        {mySubmission ? (
          <div>
            <div className="mb-4">
              <p>
                <span className="font-medium">Submitted:</span>{' '}
                {moment(mySubmission.submittedAt).format('MMMM DD, YYYY h:mm A')}
              </p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className={mySubmission.status === 'GRADED' ? 'text-green-600' : 'text-blue-600'}>
                  {mySubmission.status}
                </span>
              </p>
              {mySubmission.fileUrl && (
                <p className="mt-2">
                  <a 
                    href={mySubmission.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600"
                  >
                    <FileOutlined className="mr-1" /> View Submitted File
                  </a>
                </p>
              )}
            </div>

            {mySubmission.status === 'GRADED' && (
              <div className="mt-4">
                <Divider>Feedback</Divider>
                <div className="bg-gray-100 p-4 rounded">
                  <p>{mySubmission.feedback || 'No feedback provided yet.'}</p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <Alert
                message="Update Submission"
                description="You can upload a new file to update your submission before the deadline."
                type="info"
                showIcon
                className="mb-4"
              />
              
              <Dragger {...uploadProps} disabled={uploading}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to update your submission</p>
                <p className="ant-upload-hint">
                  Support for PDF, DOC, DOCX, images, and archive files
                </p>
              </Dragger>
            </div>
          </div>
        ) : (
          <div>
            <Alert
              message={isOverdue ? "This submission is overdue" : "You haven't submitted anything yet"}
              description={
                isOverdue 
                  ? "The deadline for this submission has passed. Contact your instructor if you need an extension."
                  : "Upload your file before the deadline."
              }
              type={isOverdue ? "warning" : "info"}
              showIcon
              className="mb-4"
            />
            
            <Dragger {...uploadProps} disabled={uploading || isOverdue}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to submit</p>
              <p className="ant-upload-hint">
                Support for PDF, DOC, DOCX, images, and archive files
              </p>
            </Dragger>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentSubmissionDetailPage;
