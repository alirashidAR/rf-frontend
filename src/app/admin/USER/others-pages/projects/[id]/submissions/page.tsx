// app/USER/projects/[id]/submissions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, List, Button, Tag, Progress, Spin, message, Empty } from 'antd';
import { FileAddOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import moment from 'moment';
import React from 'react'; // Make sure to import React

// Define interfaces for type safety
interface Submission {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  submissionItems?: SubmissionItem[];
}

interface SubmissionItem {
  id: string;
  status?: string;
  submittedAt?: string;
  fileUrl?: string;
}

interface SubmissionStatus {
  status: string;
  label: string;
  color: string;
  icon: React.ReactNode; // Use React.ReactNode instead of JSX.Element
}

const StudentSubmissionsPage = () => {
  const params = useParams();
  const projectId = params.id as string;
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
      const response = await fetch(`https://rf-backend-alpha.vercel.app/api/submissions/project/${projectId}`, {
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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

  const getSubmissionStatus = (submission: Submission): SubmissionStatus => {
    // For each submission, we need to check if the current user has submitted already
    // This would be implemented on the actual detail page where we can get the user's submission
    const currentDate = new Date();
    const dueDate = new Date(submission.dueDate);
    
    if (currentDate > dueDate) {
      return { 
        status: 'overdue', 
        label: 'Overdue', 
        color: 'error',
        icon: <ClockCircleOutlined />
      };
    } else {
      return { 
        status: 'pending', 
        label: 'Pending', 
        color: 'warning',
        icon: <ClockCircleOutlined />
      };
    }
  };

  const getDaysRemaining = (dueDate: string): string => {
    const now = moment();
    const due = moment(dueDate);
    const days = due.diff(now, 'days');
    
    if (days < 0) {
      return `Overdue by ${Math.abs(days)} days`;
    } else if (days === 0) {
      const hours = due.diff(now, 'hours');
      if (hours <= 0) {
        const minutes = due.diff(now, 'minutes');
        if (minutes <= 0) {
          return 'Due now';
        }
        return `${minutes} minutes remaining`;
      }
      return `${hours} hours remaining`;
    } else {
      return `${days} days remaining`;
    }
  };

  const calculateProgress = (dueDate: string): number => {
    const now = moment();
    const due = moment(dueDate);
    
    if (now > due) {
      return 100;
    }
    
    const totalTimespan = due.diff(due.clone().subtract(14, 'days'), 'hours');
    const elapsedTime = now.diff(due.clone().subtract(14, 'days'), 'hours');
    
    const percentage = Math.min(100, Math.max(0, (elapsedTime / totalTimespan) * 100));
    return Math.round(percentage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Project Submissions</h1>
      
      {submissions.length === 0 ? (
        <Empty description="No submissions found for this project" />
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
          dataSource={submissions}
          renderItem={(item: Submission) => {
            const { status, label, color, icon } = getSubmissionStatus(item);
            const timeRemaining = getDaysRemaining(item.dueDate);
            const progress = calculateProgress(item.dueDate);
            
            return (
              <List.Item>
                <Card
                  title={item.title}
                  extra={
                    <Tag color={color} icon={icon}>
                      {label}
                    </Tag>
                  }
                  actions={[
                    <Link href={`/USER/others-pages/projects/${projectId}/submissions/${item.id}`} key="submit">
                      <Button type="primary" icon={<FileAddOutlined />}>
                        View & Submit
                      </Button>
                    </Link>
                  ]}
                >
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <p className="text-sm">
                      <span className="font-medium">Due:</span> {moment(item.dueDate).format('MMM DD, YYYY h:mm A')}
                    </p>
                    <p className="text-sm text-blue-600">{timeRemaining}</p>
                  </div>
                  
                  <Progress 
                    percent={progress} 
                    status={status === 'overdue' ? 'exception' : 'active'} 
                    showInfo={false}
                    strokeColor={status === 'overdue' ? '#ff4d4f' : '#1890ff'}
                  />
                </Card>
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
};

export default StudentSubmissionsPage;
