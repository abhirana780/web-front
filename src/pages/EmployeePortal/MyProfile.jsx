import { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../../contexts/EmployeeAuthContext';
import api from '../../services/employeeApi';
import VirtualIDCard from '../../components/EmployeePortal/VirtualIDCard';
import { FiUser, FiLinkedin, FiGithub, FiGlobe, FiTwitter, FiSave, FiUploadCloud, FiFileText } from 'react-icons/fi';

const Input = ({ label, name, type = "text", value, onChange, placeholder = '', disabled = false, required = false }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1">{label} {required && '*'}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      className={`px-4 py-2 rounded-lg border ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500'} outline-none transition`}
    />
  </div>
);

export default function MyProfile() {
  const { user } = useEmployeeAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', dateOfBirth: '', profileImage: '',
    socialLinks: { linkedin: '', github: '', portfolio: '', twitter: '' },
    department: '', designation: '', role: '', employeeId: '',
    emergencyContact: { name: '', relationship: '', phone: '', email: '' }
  });

  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (user?.employeeId) {
        fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
        const res = await api.get(`/employees/${user.employeeId}`);
        const data = res.data;
        // Merge with default structure to avoid undefined errors
        setFormData({
            ...data,
            dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
            socialLinks: data.socialLinks || { linkedin: '', github: '', portfolio: '', twitter: '' },
            emergencyContact: data.emergencyContact || { name: '', relationship: '', phone: '', email: '' },
        });
    } catch (err) {
        console.error(err);
        setError('Failed to fetch profile data');
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e, section = null) => {
    const { name, value } = e.target;
    if (section) {
      setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e, type) => {
    setFiles(prev => [...prev, { file: e.target.files[0], type }]);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setSaving(true);
    try {
        const res = await api.post(`/employees/${user.employeeId}/upload-photo`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // Update local state instantly
        const newImageUrl = res.data.profileImage.startsWith('http') 
            ? res.data.profileImage 
            : `http://localhost:5000${res.data.profileImage}`; // Fallback if backend returns relative path
            
        setFormData(prev => ({ ...prev, profileImage: newImageUrl }));
        setSuccess('Profile photo updated successfully!');
    } catch (err) {
        console.error(err);
        setError('Failed to upload photo');
    } finally {
        setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
        // Update Profile
        await api.put(`/employees/${user.employeeId}`, formData);

        // Upload documents if any
        if (files.length > 0) {
            for (const fileObj of files) {
              const uploadFormData = new FormData();
              uploadFormData.append('file', fileObj.file);
              uploadFormData.append('type', fileObj.type);
              await api.post(`/documents/${user.employeeId}/upload`, uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
            }
            setFiles([]); // Clear queue
        }
        
        setSuccess('Profile updated successfully!');
        window.scrollTo(0,0);
        // Refresh data to ensure sync
        fetchProfile();
    } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-600">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FiUser className="text-indigo-600" /> My Profile
           </h2>
           <p className="text-gray-500 text-sm mt-1">Manage your personal information and credentials.</p>
        </div>
        <div className="flex items-center gap-4">
             {success && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">{success}</span>}
             {error && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">{error}</span>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left Column: Basic Info & Socials */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    <Input label="Email" name="email" value={formData.email} onChange={handleChange} disabled />
                    <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                    <div className="md:col-span-2">
                         <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                    <FiGlobe className="text-blue-500"/> Social & Professional Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="relative">
                        <FiLinkedin className="absolute top-9 left-3 text-blue-700 z-10" />
                        <div className="pl-6">
                             <Input label="LinkedIn URL" name="linkedin" value={formData.socialLinks.linkedin} onChange={(e) => handleChange(e, 'socialLinks')} placeholder="https://linkedin.com/in/..." />
                        </div>
                     </div>
                     <div className="relative">
                        <FiGithub className="absolute top-9 left-3 text-gray-800 z-10" />
                         <div className="pl-6">
                             <Input label="GitHub URL" name="github" value={formData.socialLinks.github} onChange={(e) => handleChange(e, 'socialLinks')} placeholder="https://github.com/..." />
                         </div>
                     </div>
                     <div className="relative">
                        <FiGlobe className="absolute top-9 left-3 text-green-600 z-10" />
                         <div className="pl-6">
                             <Input label="Portfolio Website" name="portfolio" value={formData.socialLinks.portfolio} onChange={(e) => handleChange(e, 'socialLinks')} placeholder="https://mywebsite.com" />
                         </div>
                     </div>
                     <div className="relative">
                        <FiTwitter className="absolute top-9 left-3 text-sky-500 z-10" />
                         <div className="pl-6">
                             <Input label="Twitter/X" name="twitter" value={formData.socialLinks.twitter} onChange={(e) => handleChange(e, 'socialLinks')} placeholder="@username" />
                         </div>
                     </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input label="Contact Name" name="name" value={formData.emergencyContact.name} onChange={(e) => handleChange(e, 'emergencyContact')} />
                     <Input label="Relationship" name="relationship" value={formData.emergencyContact.relationship} onChange={(e) => handleChange(e, 'emergencyContact')} />
                     <Input label="Phone" name="phone" value={formData.emergencyContact.phone} onChange={(e) => handleChange(e, 'emergencyContact')} />
                     <Input label="Email" name="email" value={formData.emergencyContact.email} onChange={(e) => handleChange(e, 'emergencyContact')} />
                </div>
            </div>
         </div>

         {/* Right Column: Photo, Job Info, Documents */}


         <div className="space-y-6">
            {/* Live ID Card Preview & Upload */}
            <div className="flex flex-col items-center">
                 <h3 className="text-gray-500 font-bold text-sm uppercase mb-4 tracking-wider">Live ID Preview</h3>
                 <div className="transform scale-90 origin-top">
                    {/* Live Preview of the Card */}
                    <VirtualIDCard employee={formData} />
                 </div>
                 
                 <div className="mt-[-20px] z-10">
                     <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                     <label 
                        htmlFor="photo-upload" 
                        className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-full shadow-lg flex items-center gap-2 transition transform hover:scale-105"
                     >
                        <FiUploadCloud className="text-xl" /> Change Photo
                     </label>
                 </div>
                 <p className="text-xs text-gray-400 mt-3 text-center max-w-xs">
                    Upload a professional headshot. This card will be visible to your team and management.
                 </p>
            </div>

            {/* Read-Only Job Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-gray-400">
                <h3 className="text-md font-bold text-gray-700 mb-3">Employment Details</h3>
                <div className="space-y-3">
                     <Input label="Employee ID" name="employeeId" value={formData.employeeId} disabled />
                     <Input label="Designation" name="designation" value={formData.designation} disabled />
                     <Input label="Department" name="department" value={formData.department} disabled />
                     <Input label="Role" name="role" value={formData.role} disabled />
                </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-md font-bold text-gray-700 mb-3 flex items-center gap-2"><FiUploadCloud/> Document Upload</h3>
                <div className="space-y-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition">
                         <input type="file" onChange={(e) => handleFileChange(e, 'Other')} className="hidden" id="doc-upload" />
                         <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center">
                             <FiUploadCloud className="text-3xl text-gray-400 mb-2"/>
                             <span className="text-sm text-indigo-600 font-medium">Click to Upload Document</span>
                             <span className="text-xs text-gray-400">PDF, JPG, PNG</span>
                         </label>
                    </div>
                </div>
                {files.length > 0 && (
                     <div className="mt-4 space-y-2">
                         <p className="text-xs font-bold text-gray-500 uppercase">Ready to upload:</p>
                         {files.map((f, i) => (
                             <div key={i} className="flex justify-between items-center text-xs bg-gray-100 p-2 rounded">
                                 <span className="truncate max-w-[150px]">{f.file.name}</span>
                                 <span className="text-gray-500">{f.type}</span>
                             </div>
                         ))}
                     </div>
                )}
            </div>

            <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition transform hover:-translate-y-1 flex justify-center items-center gap-2"
            >
                {saving ? 'Saving...' : <><FiSave /> Save Changes</>}
            </button>
         </div>
      </form>
    </div>
  );
}
