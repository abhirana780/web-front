import { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../../contexts/EmployeeAuthContext';
import api from '../../services/employeeApi';
import { FiCalendar, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function CalendarPage() {
  const { user } = useEmployeeAuth();
  const isAdmin = user?.role === 'Admin' || user?.role === 'SuperAdmin';
  
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '', type: 'Public Holiday', isOptional: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const res = await api.get('/holidays');
      setHolidays(res.data);
    } catch (error) {
      console.error('Error fetching holidays', error);
    } finally {
        setLoading(false);
    }
  };

  const addHoliday = async (e) => {
    e.preventDefault();
    try {
      await api.post('/holidays', newHoliday);
      setNewHoliday({ name: '', date: '', type: 'Public Holiday', isOptional: false });
      fetchHolidays();
    } catch (error) {
      alert('Error adding holiday');
    }
  };

  const deleteHoliday = async (id) => {
    if (!window.confirm('Delete this holiday?')) return;
    try {
      await api.delete(`/holidays/${id}`);
      fetchHolidays();
    } catch (error) {
      alert('Error deleting holiday');
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Company Calendar</h2>
          <p className="text-pink-100 text-sm">Holidays and Events</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full">
            <FiCalendar size={32} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar List */}
        <div className="lg:col-span-2 space-y-4">
             {loading ? <p>Loading...</p> : holidays.length === 0 ? <p className="text-gray-500">No holidays found.</p> : (
                 holidays.map(holiday => (
                     <div key={holiday._id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center border-l-4 border-pink-500">
                        <div className="flex items-center space-x-4">
                            <div className="bg-pink-50 text-pink-600 font-bold p-3 rounded-lg text-center w-20">
                                <span className="block text-xl">{new Date(holiday.date).getDate()}</span>
                                <span className="block text-xs uppercase">{new Date(holiday.date).toLocaleString('default', { month: 'short' })}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">{holiday.name}</h4>
                                <div className="flex space-x-2 mt-1">
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{holiday.type}</span>
                                    {holiday.isOptional && <span className="text-xs text-blue-500 bg-blue-100 px-2 py-0.5 rounded">Optional</span>}
                                </div>
                            </div>
                        </div>
                        {isAdmin && (
                            <button onClick={() => deleteHoliday(holiday._id)} className="text-red-400 hover:text-red-600">
                                <FiTrash2 />
                            </button>
                        )}
                     </div>
                 ))
             )}
        </div>

        {/* Add Holiday (Admin Only) */}
        {isAdmin && (
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center"><FiPlus className="mr-2"/> Add Holiday</h3>
                <form onSubmit={addHoliday} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name</label>
                        <input 
                            type="text" required 
                            className="w-full border-gray-300 rounded-lg p-2 border"
                            value={newHoliday.name} onChange={e => setNewHoliday({...newHoliday, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input 
                            type="date" required 
                            className="w-full border-gray-300 rounded-lg p-2 border"
                            value={newHoliday.date} onChange={e => setNewHoliday({...newHoliday, date: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select 
                            className="w-full border-gray-300 rounded-lg p-2 border"
                            value={newHoliday.type} onChange={e => setNewHoliday({...newHoliday, type: e.target.value})}
                        >
                            <option>Public Holiday</option>
                            <option>Company Event</option>
                            <option>Optional Holiday</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input 
                            type="checkbox" 
                            id="optional"
                            checked={newHoliday.isOptional} onChange={e => setNewHoliday({...newHoliday, isOptional: e.target.checked})}
                        />
                        <label htmlFor="optional" className="text-sm text-gray-700">Is Optional?</label>
                    </div>
                    <button type="submit" className="w-full bg-pink-600 text-white font-bold py-2 rounded-lg hover:bg-pink-700">
                        Add Holiday
                    </button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
}
