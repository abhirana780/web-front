import React, { useState } from 'react';
import { Upload, Button, Card, message, List, Typography, Space, Divider, Spin } from 'antd';
import { UploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { imageAPI } from '../services/api';

const { Title, Text, Paragraph } = Typography;

const TestUpload = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      // Validate file type
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }

      // Validate file size (5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return false;
      }

      setFileList([...fileList, file]);
      return false; // Prevent automatic upload
    },
    fileList,
    multiple: false,
    accept: 'image/*',
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Please select an image first!');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', fileList[0]);
      formData.append('folder', 'test-uploads');

      const response = await imageAPI.uploadImage(formData);
      
      if (response.data.success) {
        message.success('Image uploaded successfully!');
        setUploadedImages([response.data.data, ...uploadedImages]);
        setFileList([]); // Clear file list
      } else {
        message.error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageData) => {
    try {
      const response = await imageAPI.deleteImage(imageData.filePath);
      
      if (response.data.success) {
        message.success('Image deleted successfully!');
        setUploadedImages(uploadedImages.filter(img => img.filePath !== imageData.filePath));
      } else {
        message.error(response.data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Title level={1} className="text-gray-800 mb-4">
            Firebase Image Upload Test
          </Title>
          <Paragraph className="text-gray-600 max-w-2xl mx-auto">
            Test the Firebase image upload API with Ant Design Upload component. 
            Upload images and manage them through our API.
          </Paragraph>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card title="Upload Image" className="shadow-lg">
            <Space direction="vertical" size="large" className="w-full">
              <div>
                <Text strong>Supported formats:</Text>
                <br />
                <Text type="secondary">JPEG, JPG, PNG, GIF, WebP</Text>
              </div>
              
              <div>
                <Text strong>File size limit:</Text>
                <br />
                <Text type="secondary">5MB maximum</Text>
              </div>

              <Upload.Dragger {...uploadProps} className="mb-4">
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag image to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for single image upload. Please select an image file.
                </p>
              </Upload.Dragger>

              <Button 
                type="primary" 
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                icon={<UploadOutlined />}
                size="large"
                block
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </Space>
          </Card>

          {/* Uploaded Images Section */}
          <Card title="Uploaded Images" className="shadow-lg">
            {uploadedImages.length === 0 ? (
              <div className="text-center py-8">
                <Text type="secondary">No images uploaded yet</Text>
              </div>
            ) : (
              <List
                dataSource={uploadedImages}
                renderItem={(image) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => window.open(image.publicUrl, '_blank')}
                      >
                        View
                      </Button>,
                      <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteImage(image)}
                      >
                        Delete
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <img 
                          src={image.publicUrl} 
                          alt={image.originalName}
                          className="w-12 h-12 object-cover rounded"
                        />
                      }
                      title={image.originalName}
                      description={
                        <div>
                          <Text type="secondary">Size: {(image.size / 1024).toFixed(1)} KB</Text>
                          <br />
                          <Text type="secondary">Type: {image.contentType}</Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </div>

        {/* API Response Display */}
        <Card title="API Documentation" className="mt-8 shadow-lg">
          <div className="space-y-4">
            <div>
              <Text strong>Base URL:</Text>
              <code className="bg-gray-100 px-2 py-1 rounded ml-2">
                http://localhost:3000/api/image
              </code>
            </div>
            
            <Divider />
            
            <div>
              <Text strong>Endpoints:</Text>
              <ul className="mt-2 space-y-2">
                <li>
                  <Text code>POST /api/image/upload</Text> - Upload image
                </li>
                <li>
                  <Text code>DELETE /api/image/:filePath</Text> - Delete image
                </li>
                <li>
                  <Text code>GET /api/image/:filePath/metadata</Text> - Get image metadata
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TestUpload;
