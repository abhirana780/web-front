import { useState, useEffect, useRef } from 'react';
import { useEmployeeAuth } from '../../contexts/EmployeeAuthContext';
import api from '../../services/employeeApi';
import { initSocket, getSocket } from '../../services/employeeSocketService';
import { FiSend } from 'react-icons/fi';

export default function Chat() {
  const { user } = useEmployeeAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const messagesEndRef = useRef(null);

  const isAdmin = user?.role === 'Admin' || user?.role === 'SuperAdmin';

  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const socket = initSocket(user.employeeId || user._id);

    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('alert', (data) => {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    });

    if (isAdmin) {
      fetchEmployees();
    } else {
      fetchAdmins();
    }

    return () => {
      socket.off('receive_message');
      socket.off('alert');
    };
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/employees/admins');
      setAdmins(res.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const senderId = user.employeeId || user._id;
      const receiverId = selectedUser;
      const res = await api.get(`/chat?senderId=${senderId}&receiverId=${receiverId}`);
      setMessages(res.data);
      
      await api.post('/chat/read', { senderId: receiverId, receiverId: senderId });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const socket = getSocket();
    const messageData = {
      senderId: user.employeeId || user._id,
      receiverId: selectedUser,
      content: newMessage,
      senderRole: user.role // Add role for alerts
    };

    socket.emit('send_message', messageData);
    setMessages((prev) => [...prev, { ...messageData, timestamp: new Date() }]);
    setNewMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-xl shadow-lg overflow-hidden">
      {showAlert && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-pulse">
          ⚠️ You have a pending message! Please respond.
        </div>
      )}

      <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
          <h3 className="text-xl font-bold text-white">
            {isAdmin ? 'Employees' : 'Admin Support'}
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {isAdmin ? (
            employees.map((emp) => (
              <div
                key={emp.employeeId}
                onClick={() => setSelectedUser(emp.employeeId)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                  selectedUser === emp.employeeId ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                }`}
              >
                <p className="font-semibold text-gray-800">
                  {emp.firstName} {emp.lastName}
                </p>
                <p className="text-sm text-gray-600">{emp.employeeId}</p>
              </div>
            ))
          ) : (
            admins.map((admin) => (
              <div
                key={admin._id}
                onClick={() => setSelectedUser(admin.employeeId || admin._id)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                  selectedUser === (admin.employeeId || admin._id) ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                }`}
              >
                <p className="font-semibold text-gray-800">Admin Support</p>
                <p className="text-sm text-gray-600">{admin.email}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">
                {isAdmin ? `Chat with ${selectedUser}` : 'Admin Support'}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, index) => {
                const isSender = msg.senderId === (user.employeeId || user._id);
                return (
                  <div key={index} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        isSender
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${isSender ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition flex items-center space-x-2"
                >
                  <FiSend />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
