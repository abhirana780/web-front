import React from 'react';
import { motion } from 'framer-motion';
import { FiMonitor, FiSmartphone, FiCloud, FiTrendingUp, FiShield, FiCpu } from 'react-icons/fi';

const Services = () => {
  const services = [
    { icon: FiMonitor, title: 'Web Development', desc: 'Building responsive, high-performance websites and web applications tailored to your business needs.' },
    { icon: FiSmartphone, title: 'Mobile Apps', desc: 'Creating native and cross-platform mobile experiences that engage users on the go.' },
    { icon: FiCloud, title: 'Cloud Solutions', desc: 'Scalable cloud infrastructure and migration services to power your digital transformation.' },
    { icon: FiTrendingUp, title: 'Digital Marketing', desc: 'Data-driven strategies to increase your online visibility and drive growth.' },
    { icon: FiShield, title: 'Cyber Security', desc: 'Protecting your digital assets with advanced security auditing and implementation.' },
    { icon: FiCpu, title: 'AI & ML', desc: 'Leveraging artificial intelligence to automate processes and gain predictive insights.' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-4xl font-extrabold text-gray-900 sm:text-5xl"
          >
            Our <span className="text-indigo-600">Services</span>
          </motion.h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Comprehensive technology solutions designed to scale with your ambition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-600 text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <service.icon />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-500 leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
