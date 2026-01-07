import React, { useState, useEffect, useRef } from "react";
import {
  User, Mail, Phone, MapPin, GraduationCap, Calendar, Shield,
  BookOpen, Code, CheckCircle, AlertCircle, Loader, Upload,
  X, Save, ArrowLeft, Camera
} from "lucide-react";
import { Button, message, Input, Select, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { studentAPI } from "../services/api";
import { motion } from "framer-motion";

const { Option } = Select;

const UpdateProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form] = Form.useForm();
  
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [removedOldPicture, setRemovedOldPicture] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) {
          setError("User data not found in localStorage");
          setLoading(false);
          return;
        }

        let userData;
        try {
          userData = JSON.parse(userDataString);
        } catch {
          setError("Invalid user data in localStorage");
          setLoading(false);
          return;
        }

        const email = userData.email;
        if (!email) {
          setError("Email not found in user data");
          setLoading(false);
          return;
        }

        const response = await studentAPI.getStudentByEmail(email);
        
        if (response.data.success) {
          const student = response.data.data.student;
          setStudentData(student);
          
          // Set profile picture preview using the helper function
          if (student.profilePicture) {
            setProfilePicturePreview(studentAPI.getProfilePictureUrl(student.profilePicture));
          } else {
            setProfilePicturePreview(null);
          }
          
          // Set form values
          form.setFieldsValue({
            fullName: student.fullName,
            phoneNumber: student.phoneNumber,
            city: student.city,
            education: student.education,
            course: student.course,
            college: student.college,
            semester: student.semester,
            passingYear: student.passingYear,
            technology: student.technology
          });
        } else {
          setError("Failed to fetch student data");
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError(error.response?.data?.message || "Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [form]);

  // Handle profile picture upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      message.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error('Image file size must be less than 5MB');
      return;
    }

    setProfilePicture(file);
    setRemovedOldPicture(false);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePicturePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleImageUpload(fakeEvent);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Remove profile picture
  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
    setRemovedOldPicture(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Save profile
  const handleSave = async (values) => {
    try {
      setSaving(true);
      
      const userDataString = localStorage.getItem("userData");
      const userData = JSON.parse(userDataString);
      const email = userData.email;

      const formData = new FormData();
      formData.append('email', email);
      
      // Add form fields
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== '') {
          formData.append(key, values[key]);
        }
      });

      // Handle profile picture
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      } else if (removedOldPicture) {
        formData.append('removeProfilePicture', 'true');
      }

      const response = await studentAPI.updateStudentWithProfilePicture(formData);
      
      if (response.data.success) {
        message.success("Profile updated successfully!");
        navigate("/profile");
      } else {
        message.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader className="w-10 h-10 text-[#ab1428] animate-spin mx-auto" />
          <p className="ml-3 text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
          <p className="ml-3 text-gray-600 mt-4">
            {error || "No profile found. Please log in again."}
          </p>
          <Button 
            onClick={() => navigate("/login")}
            className="mt-4 bg-[#ab1428] text-white"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ab1428]/10 via-white to-[#ab1428]/10 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Button>
          <h1 className="text-3xl font-extrabold text-gray-900">Edit Profile</h1>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="space-y-6"
        >
          
          {/* Profile Picture Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#ab1428]/20">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#ab1428]" />
              Profile Picture
            </h2>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              
              {/* Profile Picture Preview */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-[#ab1428]/20">
                  {profilePicturePreview ? (
                    <img 
                      src={profilePicturePreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-20 h-20 text-gray-400" />
                  )}
                </div>
                
                {/* Remove button */}
                {profilePicturePreview && (
                  <button
                    type="button"
                    onClick={removeProfilePicture}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Upload Section */}
              <div className="flex-1">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#ab1428] transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium text-[#ab1428]">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    JPEG, PNG, GIF or WebP (max. 5MB)
                  </p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#ab1428]/20">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#ab1428]" />
              Personal Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input size="large" placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item
                name="phoneNumber"
                label="Phone Number"
              >
                <Input size="large" placeholder="Enter your phone number" />
              </Form.Item>

              <Form.Item
                name="city"
                label="City"
              >
                <Input size="large" placeholder="Enter your city" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
              >
                <Input size="large" disabled value={studentData.email} />
              </Form.Item>
            </div>
          </div>

          {/* Education Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#ab1428]/20">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#ab1428]" />
              Education Details
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Form.Item
                name="education"
                label="Education"
              >
                <Select size="large" placeholder="Select education level">
                  <Option value="10th">10th</Option>
                  <Option value="12th">12th</Option>
                  <Option value="Graduate">Graduate</Option>
                  <Option value="Post Graduate">Post Graduate</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="course"
                label="Course"
              >
                <Select size="large" placeholder="Select course">
                  <Option value="Full Stack">Full Stack</Option>
                  <Option value="Frontend">Frontend</Option>
                  <Option value="Backend">Backend</Option>
                  <Option value="Data Science">Data Science</Option>
                  <Option value="DevOps">DevOps</Option>
                  <Option value="Mobile Development">Mobile Development</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="college"
                label="College"
              >
                <Input size="large" placeholder="Enter your college name" />
              </Form.Item>

              <Form.Item
                name="semester"
                label="Semester"
              >
                <Input size="large" placeholder="Enter your semester" />
              </Form.Item>

              <Form.Item
                name="passingYear"
                label="Passing Year"
              >
                <Select size="large" placeholder="Select passing year">
                  <Option value="2024">2024</Option>
                  <Option value="2025">2025</Option>
                  <Option value="2026">2026</Option>
                  <Option value="2027">2027</Option>
                  <Option value="2028">2028</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="technology"
                label="Technology"
              >
                <Select size="large" placeholder="Select technology">
                  <Option value="MernStack">MernStack</Option>
                  <Option value="AI / ML">AI / ML</Option>
                  <Option value="PythonWebDevelopment">Python Web Development</Option>
                  <Option value="GraphicDesign">Graphic Design</Option>
                  <Option value="DataAnalytics">Data Analytics</Option>
                  <Option value="MobileAppDevelopment">Mobile App Development</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <Button
              size="large"
              onClick={() => navigate("/profile")}
              disabled={saving}
            >
              Cancel
            </Button>
            
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={saving}
              className="bg-[#ab1428] hover:bg-[#8f0f1f] border-[#ab1428]"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
