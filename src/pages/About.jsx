import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiTarget, FiAward, FiZap } from 'react-icons/fi';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold text-gray-900 mb-6"
          >
            We Are <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Wipronix</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed"
          >
            Innovating the digital landscape with cutting-edge technology solutions. We believe in building software that not only solves problems but transforms businesses.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-indigo-700 to-purple-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { label: 'Years Experience', value: '10+' },
            { label: 'Projects Completed', value: '500+' },
            { label: 'Happy Clients', value: '200+' },
            { label: 'Team Members', value: '50+' },
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-4"
            >
              <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
              <p className="text-indigo-200">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
          <p className="mt-4 text-gray-500">The principles that guide our every decision.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: FiTarget, title: 'Innovation', desc: 'Pushing boundaries to create unique solutions.' },
            { icon: FiUsers, title: 'Collaboration', desc: 'Working together to achieve greatness.' },
            { icon: FiAward, title: 'Excellence', desc: 'Delivering nothing but the best quality.' },
            { icon: FiZap, title: 'Agility', desc: 'Adapting quickly to the changing digital world.' },
          ].map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center"
            >
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 text-3xl">
                <item.icon />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
