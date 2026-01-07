import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! We have received your message.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl"
          >
            Get in <span className="text-indigo-600">Touch</span>
          </motion.h1>
          <p className="mt-4 text-xl text-gray-500">We'd love to hear from you. Let's start a conversation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-indigo-700 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-600 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-600 rounded-full opacity-50 blur-3xl"></div>
            
            <h2 className="text-2xl font-bold mb-8 relative z-10">Contact Information</h2>
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-start space-x-4">
                <FiMail className="text-2xl text-indigo-200 mt-1" />
                <div>
                  <p className="font-semibold text-lg">Email Us</p>
                  <p className="text-indigo-100">info@wipronix.com</p>
                  <p className="text-indigo-100">support@wipronix.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <FiPhone className="text-2xl text-indigo-200 mt-1" />
                <div>
                  <p className="font-semibold text-lg">Call Us</p>
                  <p className="text-indigo-100">+1 (555) 123-4567</p>
                  <p className="text-indigo-100">+1 (555) 987-6543</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <FiMapPin className="text-2xl text-indigo-200 mt-1" />
                <div>
                  <p className="font-semibold text-lg">Visit Us</p>
                  <p className="text-indigo-100">123 Tech Park, Innovation Street</p>
                  <p className="text-indigo-100">Silicon Valley, CA 94025</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea 
                  rows="4"
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <FiSend />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
