"use client";
import { motion } from "framer-motion";
import React from "react";

/* ================== ANIMATION VARIANTS ================== */

const popFade = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const staggerPop = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemPop = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ================== COMPONENT ================== */

const Missions = () => {
  return (
    <div className="relative bg-gradient-to-b from-white to-[#f5f5f7] py-20 overflow-hidden">

      {/* Vertical Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-[#ab1428] to-[#6c575a] opacity-30 z-0"></div>

      {/* Background Watermark */}
      <div className="absolute inset-0 flex flex-col items-center pointer-events-none select-none z-0">
        <p className="text-7xl sm:text-8xl font-bold text-black/5 mt-10">Our Vision</p>
        <p className="text-7xl sm:text-8xl font-bold text-black/5 mt-[28rem]">Our Mission</p>
        <p className="text-7xl sm:text-8xl font-bold text-black/5 mt-[25rem]">Our Values</p>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* ================= VISION ================= */}
        <motion.div
          variants={popFade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="text-center py-20"
        >
          <motion.h2 className="relative text-2xl sm:text-3xl font-semibold leading-relaxed text-gray-900 max-w-3xl mx-auto mt-6 drop-shadow-[0_6px_25px_rgba(171,20,40,0.15)]">
            <span className="absolute -left-6 -top-4 text-6xl text-[#ab1428]/20">&ldquo;</span>
            To become Mohali’s leading technology partner, driving innovation,
            empowering businesses, and shaping the future through modern digital
            solutions and training.
            <span className="absolute -right-6 bottom-0 text-6xl text-[#ab1428]/20">&rdquo;</span>
          </motion.h2>
        </motion.div>

        {/* ================= MISSION ================= */}
        <motion.div
          variants={popFade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="text-center py-20"
        >
          <p className="text-gray-700 max-w-2xl mx-auto">
            We aim to empower businesses and students by providing:
          </p>

          <motion.div
            variants={staggerPop}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex justify-center gap-6 mt-56 flex-wrap"
          >
            <motion.div
              variants={itemPop}
              whileHover={{ scale: 1.08, y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="w-70 h-70 rounded-full border-dotted border-4 border-[#ab1428]/50 flex items-center justify-center text-xl font-medium text-gray-700 p-6 text-center bg-white"
            >
              Helping companies grow with reliable tech solutions
            </motion.div>

            <motion.div
              variants={itemPop}
              whileHover={{ scale: 1.08, y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="w-70 h-70 rounded-full border-dotted border-4 border-[#6c575a]/50 flex items-center justify-center text-xl font-medium text-gray-700 p-6 text-center bg-white"
            >
              Building career opportunities through internships & training
            </motion.div>

            <motion.div
              variants={itemPop}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.1 }}
              className="w-70 h-70 rounded-full bg-gradient-to-br from-[#ab1428] to-[#6c575a] text-white flex items-center justify-center text-xl font-semibold p-6 text-center shadow-xl"
            >
              Strengthening the tech ecosystem in the region
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ================= VALUES ================= */}
        <motion.div
  variants={staggerPop}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.4 }}
  className="pb-20"
>
  <div className="max-w-4xl mx-auto px-4 mt-32">
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      
      {/* CARD 1 */}
      <motion.li
        variants={itemPop}
        whileHover={{ y: -6, scale: 1.02 }}
        className="
          group relative overflow-hidden
          rounded-2xl
          bg-white/80 backdrop-blur-md
          border border-black/5
          shadow-lg hover:shadow-2xl
          transition-all
          p-6
        "
      >
        {/* Accent */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#ab1428] to-[#6c575a]" />

        <h4 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ab1428]" />
          Innovation
        </h4>
        <p className="text-gray-600">
          Solving real-world problems with modern, scalable technologies.
        </p>
      </motion.li>

      {/* CARD 2 */}
      <motion.li
        variants={itemPop}
        whileHover={{ y: -6, scale: 1.02 }}
        className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border border-black/5 shadow-lg hover:shadow-2xl p-6"
      >
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#ab1428] to-[#6c575a]" />
        <h4 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ab1428]" />
          Integrity
        </h4>
        <p className="text-gray-600">
          Transparency, honesty, and trust in every engagement.
        </p>
      </motion.li>

      {/* CARD 3 */}
      <motion.li
        variants={itemPop}
        whileHover={{ y: -6, scale: 1.02 }}
        className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border border-black/5 shadow-lg hover:shadow-2xl p-6"
      >
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#ab1428] to-[#6c575a]" />
        <h4 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ab1428]" />
          Growth
        </h4>
        <p className="text-gray-600">
          Helping businesses scale and students build meaningful careers.
        </p>
      </motion.li>

      {/* CARD 4 */}
      <motion.li
        variants={itemPop}
        whileHover={{ y: -6, scale: 1.02 }}
        className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border border-black/5 shadow-lg hover:shadow-2xl p-6"
      >
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#ab1428] to-[#6c575a]" />
        <h4 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ab1428]" />
          Quality
        </h4>
        <p className="text-gray-600">
          Excellence in development, design, and training delivery.
        </p>
      </motion.li>

      {/* CARD 5 – Highlight */}
      <motion.li
        variants={itemPop}
        whileHover={{ scale: 1.04 }}
        className="
          relative overflow-hidden
          rounded-2xl
          bg-gradient-to-br from-[#ab1428] to-[#6c575a]
          text-white
          shadow-xl
          p-6
          sm:col-span-2
        "
      >
        <h4 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-white" />
          Empowerment
        </h4>
        <p className="text-white/90">
          Creating opportunities through internships, mentorship, and hands-on training.
        </p>
      </motion.li>

    </ul>
  </div>
</motion.div>

      </div>
    </div>
  );
};

export default Missions;
