import React, { useState, useEffect } from "react";
import {
  User, Mail, Phone, MapPin, GraduationCap, Calendar, Shield,
  BookOpen, Code, CheckCircle, AlertCircle, LogOut, Settings, Loader, Clock
} from "lucide-react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { studentAPI } from "../services/api";
import { motion } from "framer-motion";

const Profile = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null);
        const userDataString = localStorage.getItem("userData");
        console.log("Fetched userData from localStorage:", userDataString);
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

        // Call getStudentByEmail API
        const response = await studentAPI.getStudentByEmail(email);
        
        if (response.data.success) {
          setStudentData(response.data.data.student);
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
  }, []);

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
      
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-[#ab1428]/20"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          
          {/* Left - Profile Avatar */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full bg-[#ab1428] shadow-lg flex items-center justify-center overflow-hidden">
              {studentData?.profilePicture ? (
                <img 
                  src={studentAPI.getProfilePictureUrl(studentData.profilePicture)} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={() => {
                    // Fallback to user icon if image fails to load
                  }}
                />
              ) : null}
              <div className={`${studentData?.profilePicture ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}>
                <User className="w-16 h-16 text-white" />
              </div>
            </div>

            {studentData?.isVerified && (
              <span className="absolute -bottom-2 right-0 bg-green-500 rounded-full p-2 shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </span>
            )}
          </motion.div>

          {/* Right - Name & Status */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {studentData.fullName}
            </h1>
            <p className="text-gray-600">{studentData.email}</p>

            {/* Status Badge */}
            <div className="flex gap-2 mt-3 justify-center md:justify-start">
              <span className="px-4 py-1 rounded-full text-white bg-[#ab1428] text-sm">
                Internship Candidate
              </span>
              <span className={`px-4 py-1 rounded-full text-sm ${
                studentData?.isVerified 
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
              }`}>
                {studentData?.isVerified ? "Verified" : "Verification Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-6">
          <Button
            onClick={() => navigate("/update-profile")}
            className="bg-[#ab1428] text-white px-6 rounded-lg"
          >
            <Settings className="w-4 h-4 mr-2" /> Edit Profile
          </Button>

          <Button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            danger
            className="px-6 rounded-lg"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </motion.div>

      {/* Info Cards Section */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        
        {/* Personal Info */}
        <ProfileCard title="Personal Information" icon={<User />} color="#ab1428">
          <ProfileField icon={<User />} label="Full Name" value={studentData.fullName} />
          <ProfileField icon={<Mail />} label="Email" value={studentData.email} />
          <ProfileField icon={<Phone />} label="Phone" value={studentData.phoneNumber || "N/A"} />
          <ProfileField icon={<MapPin />} label="City" value={studentData.city || "N/A"} />
          <ProfileField icon={<Shield />} label="User Type" value={studentData.userType} />
          <ProfileField icon={<Calendar />} label="Student ID" value={studentData._id} />
        </ProfileCard>

        {/* Education */}
        <ProfileCard title="Education Details" icon={<GraduationCap />} color="#ab1428">
          <ProfileField icon={<BookOpen />} label="Education" value={studentData.education || "N/A"} />
          <ProfileField icon={<Code />} label="Course" value={studentData.course || "N/A"} />
          <ProfileField icon={<GraduationCap />} label="College" value={studentData.college || "N/A"} />
          <ProfileField icon={<Calendar />} label="Semester" value={studentData.semester || "N/A"} />
          <ProfileField icon={<Calendar />} label="Passing Year" value={studentData.passingYear || "N/A"} />
        </ProfileCard>

        {/* Internship & Timeline */}
        <ProfileCard title="Internship & Timeline" icon={<Shield />} color="#ab1428">
          <ProfileField icon={<Code />} label="Technology" value={studentData.technology || "N/A"} />
          <ProfileField
            icon={studentData.resultDeclared ? <CheckCircle /> : <Clock className="w-4 h-4 text-orange-500" />}
            label="Result Status"
            value={
              <div className="flex items-center gap-2">
                <span className={studentData.resultDeclared ? "" : "font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200"}>
                  {studentData.resultDeclared ? "Result Declared" : "Result Pending (3-4 days)"}
                </span>
              </div>
            }
          />
          <ProfileField 
            icon={<Calendar />} 
            label="Profile Created" 
            value={studentData.createdAt ? new Date(studentData.createdAt).toLocaleDateString() : "N/A"} 
          />
          <ProfileField 
            icon={<Calendar />} 
            label="Last Updated" 
            value={studentData.updatedAt ? new Date(studentData.updatedAt).toLocaleDateString() : "N/A"} 
          />
        </ProfileCard>
      </div>

    </div>
  );
};

/* ------------------- Components ------------------- */
const ProfileCard = ({ title, icon, children, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-xl transition"
    style={{ borderColor: `${color}33` }}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
        <div className="text-[#ab1428]">{icon}</div>
      </div>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const ProfileField = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-2 border-b last:border-b-0 border-gray-200">
    <span className="text-gray-500">{icon}</span>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  </div>
);

export default Profile;
