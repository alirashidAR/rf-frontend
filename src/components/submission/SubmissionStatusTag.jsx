// app/components/SubmissionStatusTag.jsx
import { Tag } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';

const SubmissionStatusTag = ({ status, dueDate }) => {
  const isOverdue = dueDate ? new Date() > new Date(dueDate) : false;
  
  if (status === 'GRADED') {
    return (
      <Tag color="success" icon={<CheckCircleOutlined />}>
        Graded
      </Tag>
    );
  } else if (status === 'SUBMITTED') {
    return (
      <Tag color="processing" icon={<ClockCircleOutlined />}>
        Submitted
      </Tag>
    );
  } else if (isOverdue) {
    return (
      <Tag color="error" icon={<WarningOutlined />}>
        Overdue
      </Tag>
    );
  } else {
    return (
      <Tag color="warning" icon={<ClockCircleOutlined />}>
        Pending
      </Tag>
    );
  }
};

export default SubmissionStatusTag;