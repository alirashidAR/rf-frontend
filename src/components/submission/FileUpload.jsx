// app/components/FileUpload.jsx
import { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';

const FileUpload = ({ submissionId, onSuccess }) => {
  const [uploading, setUploading] = useState(false);
  
  const uploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: true,
    customRequest: async ({ file, onSuccess, onError }) => {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch(`/api/submissions/${submissionId}/submit`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const result = await response.json();
        message.success('File uploaded successfully');
        onSuccess(result, file);
        
        if (typeof onSuccess === 'function') {
          onSuccess(result);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        message.error('Failed to upload file');
        onError(error);
      } finally {
        setUploading(false);
      }
    },
    accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.rar'
  };
  
  return (
    <Upload {...uploadProps}>
      <Button 
        icon={uploading ? <LoadingOutlined /> : <UploadOutlined />} 
        loading={uploading}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </Button>
    </Upload>
  );
};

export default FileUpload;