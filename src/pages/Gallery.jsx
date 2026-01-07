import React from "react";
import { motion } from "framer-motion";
import DomeGallery from "../components/reactBits/DomeGallery";
import Threads from "../components/reactBits/Threads";

const Gallery = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[] py-10 px-4"
    >
      <div className=" mx-auto">
      <div className="w-full h-[200px]  relative">
      <Threads amplitude={4} distance={0.4} enableMouseInteraction={false} />
      <h1
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          text-5xl! md:text-6xl font-extrabold text-[#ab1428] drop-shadow-xl
          animate-fadeInSlow"
        >
         Portfolio Gallery
        </h1>

      </div>
      <p className="text-gray-400 text-center mb-4! text-sm md:text-base animate-fadeInSlow delay-500">
      “Explore our gallery to see how Wipronix Technologies transforms ideas into powerful digital experiences.”
        </p>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
              className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={src}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          ))}
        </div> */}
        <div style={{ width: 'auto', height: '70vh' }}>
      <DomeGallery />
    </div>
      </div>
    </motion.div>
  );
};

export default Gallery;
