import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import api from '../../services/employeeApi';
import { FiUser, FiBriefcase, FiPhone, FiFileText, FiSave, FiUploadCloud, FiX } from 'react-icons/fi';

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '', address: '', dateOfBirth: '', profileImage: '',
    emergencyContact: { name: '', relationship: '', phone: '', email: '' },
    joinedDate: '', department: '', designation: '', reportingTo: '', role: 'Employee', employeeType: 'Permanent',
    salary: { base: 0, hra: 0, transportAllowance: 0, otherAllowances: 0, tax: 0, providentFund: 0, otherDeductions: 0 },
    status: 'Active'
  });

  const [managers, setManagers] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchManagers();
    if (isEdit) {
      fetchEmployee();
    }
  }, [id]);

  const fetchManagers = async () => {
      try {
          const res = await api.get('/employees');
          setManagers(res.data);
      } catch (err) {
          console.error("Could not fetch managers");
      }
  };

  const fetchEmployee = async () => {
    try {
      const res = await api.get(`/employees/${id}`);
      setFormData(prev => ({
          ...res.data,
          // Ensure nested objects exist to avoid crashes if backend returns partial data
          emergencyContact: res.data.emergencyContact || prev.emergencyContact,
          salary: res.data.salary || prev.salary,
          reportingTo: res.data.reportingTo || '' // Handle ObjectId or String
      }));
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Failed to fetch employee details';
      setError(`${msg} (ID: ${id})`);
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

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let employeeId = id;
      if (isEdit) {
        await api.put(`/employees/${id}`, formData);
      } else {
        const res = await api.post('/employees', formData);
        employeeId = res.data.employeeId;
      }

      // Upload documents
      if (files.length > 0 && employeeId) {
        for (const fileObj of files) {
          const formData = new FormData();
          formData.append('file', fileObj.file);
          formData.append('type', fileObj.type);
          await api.post(`/documents/${employeeId}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      }

      navigate('/employee-portal/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          {isEdit ? 'Edit Employee Profile' : 'Create Employee Profile'}
        </h1>
        <button
          onClick={() => navigate('/employee-portal/employees')}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Cancel
        </button>
      </div>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Info */}
        <Section title="Personal Information" icon={<FiUser />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            {!isEdit && <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />}
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
            <Input label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''} onChange={handleChange} />
            <div className="md:col-span-2">
              <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <Input label="Profile Image URL" name="profileImage" value={formData.profileImage} onChange={handleChange} placeholder="https://example.com/photo.jpg" />
            </div>
          </div>
        </Section>

        {/* Joining Info */}
        <Section title="Professional Details & Roles" icon={<FiBriefcase />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Date of Joining" name="joinedDate" type="date" value={formData.joinedDate ? formData.joinedDate.split('T')[0] : ''} onChange={handleChange} />
            <Input label="Department" name="department" value={formData.department} onChange={handleChange} />
            <Input label="Designation" name="designation" value={formData.designation} onChange={handleChange} />

            {/* Reporting Manager Dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Reporting To</label>
              <select
                name="reportingTo"
                value={formData.reportingTo}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-white/50"
              >
                  <option value="">None (Top Level)</option>
                  {managers.filter(m => m.employeeId !== id).map(m => (
                      <option key={m._id} value={m._id}>
                          {m.firstName} {m.lastName} ({m.designation})
                      </option>
                  ))}
              </select>
            </div>

            {/* Role Dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">System Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-white/50"
              >
                <option value="Employee">Employee (Standard)</option>
                <option value="TeamLead">Team Lead</option>
                <option value="Manager">Manager</option>
                <option value="HR">HR</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Employee Type</label>
              <select
                name="employeeType"
                value={formData.employeeType}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-white/50"
              >
                <option>Permanent</option>
                <option>Contract</option>
                <option>Intern</option>
              </select>
            </div>
          </div>
        </Section>

        {/* Emergency Contact */}
        <Section title="Emergency Contact" icon={<FiPhone />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Contact Name" name="name" value={formData.emergencyContact.name} onChange={(e) => handleChange(e, 'emergencyContact')} />
            <Input label="Relationship" name="relationship" value={formData.emergencyContact.relationship} onChange={(e) => handleChange(e, 'emergencyContact')} />
            <Input label="Phone" name="phone" value={formData.emergencyContact.phone} onChange={(e) => handleChange(e, 'emergencyContact')} />
            <Input label="Email" name="email" value={formData.emergencyContact.email} onChange={(e) => handleChange(e, 'emergencyContact')} />
          </div>
        </Section>

        {/* Salary */}
        <Section title="Salary Structure (HR Only)" icon={<FiFileText />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Base Salary" name="base" type="number" value={formData.salary.base} onChange={(e) => handleChange(e, 'salary')} />
            <Input label="HRA" name="hra" type="number" value={formData.salary.hra} onChange={(e) => handleChange(e, 'salary')} />
            <Input label="Transport" name="transportAllowance" type="number" value={formData.salary.transportAllowance} onChange={(e) => handleChange(e, 'salary')} />
            <Input label="Other" name="otherAllowances" type="number" value={formData.salary.otherAllowances} onChange={(e) => handleChange(e, 'salary')} />
            <Input label="Tax Ded." name="tax" type="number" value={formData.salary.tax} onChange={(e) => handleChange(e, 'salary')} />
            <Input label="PF" name="providentFund" type="number" value={formData.salary.providentFund} onChange={(e) => handleChange(e, 'salary')} />
          </div>
        </Section>

        {/* Documents */}
        <Section title="Documents Upload" icon={<FiUploadCloud />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DocUpload type="Identity Proof" onFile={(e) => handleFileChange(e, 'Identity Proof')} />
            <DocUpload type="Educational Certificate" onFile={(e) => handleFileChange(e, 'Educational Certificate')} />
            <DocUpload type="Offer Letter" onFile={(e) => handleFileChange(e, 'Offer Letter')} />
            <DocUpload type="Medical Document" onFile={(e) => handleFileChange(e, 'Medical Document')} />
          </div>
          {files.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Files to Upload:</h4>
              <ul className="space-y-2">
                {files.map((f, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{f.type}: {f.file.name}</span>
                    <button type="button" onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700"><FiX /></button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition disabled:opacity-50"
          >
            <FiSave className="w-5 h-5" />
            <span>{loading ? 'Saving...' : 'Save Employee Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center space-x-3">
      <div className="text-indigo-600 text-xl">{icon}</div>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const Input = ({ label, name, type = "text", value, onChange, required = false, placeholder = '' }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1">{label} {required && '*'}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white/50 backdrop-blur-sm"
    />
  </div>
);

const DocUpload = ({ type, onFile }) => (
  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-indigo-500 transition bg-gray-50 cursor-pointer relative">
    <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
    <span className="text-sm font-medium text-gray-600">{type}</span>
    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onFile} accept=".pdf,.doc,.docx,.jpg,.png" />
  </div>
);
