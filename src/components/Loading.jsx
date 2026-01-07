import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import integrationAnimation from "../assets/integration.json";
import welcomeAnimation from "../assets/Welcome.json";

const Loading = ({ onComplete, setIsLoading }) => {
  const handleClick = () => {
    localStorage.setItem("hasLoaded", "true");
    setIsLoading(false);
    onComplete();
  };

  return (
    <div
      className="fixed inset-0 z-[99999] overflow-hidden
                    bg-gradient-to-br from-[#ab1428] via-white to-[#ab1428]/20"
    >
      {/* Soft Overlay */}
      <div className="absolute inset-0 bg-white/40" />

      {/* Background Lottie Animation */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center opacity-20"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Lottie
          animationData={integrationAnimation}
          loop
          className="w-[600px] max-w-[90%]"
        />
      </motion.div>

      {/* Center Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {/* Accent Glow */}
        <motion.div
          className="absolute w-[420px] h-[420px] rounded-full
                     bg-[#ab1428]/25 blur-3xl opacity-30"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="relative w-[300px] h-[300px] rounded-full
             bg-[#ab1428]/20 backdrop-blur-xl
             border border-[#ab1428]/20
             shadow-[0_0_60px_rgba(171,20,40,0.25)]
             flex flex-col items-center justify-center
             text-center left-5"
          animate={{
            scale: [1, 1.05, 1], // heart beat: grow -> shrink -> normal
          }}
          transition={{
            duration: 1, // speed of heartbeat
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Optional pulse ring */}
          <motion.span
            className="absolute inset-0 rounded-full border border-[#ab1428]/40"
            animate={{ scale: [1, 1.25], opacity: [0.6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          />

          {/* Content: appears once */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center"
            >
              <Lottie
                animationData={welcomeAnimation}
                loop={false}
                className="w-[500px] h-[280px] absolute"
              />
            </motion.div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-[20px] tracking-[0.35em] uppercase text-[#ab1428]/70 my-6 font-bold"
            >
              Wipronix Technologies
            </motion.p>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
              className="relative group px-3 py-3 rounded-full font-semibold text-white
                 bg-[#ab1428] text-[12px] shadow-md shadow-[#ab1428]/40"
            >
              <span
                className="absolute inset-0 rounded-full bg-white/20
                       opacity-0 group-hover:opacity-100 transition"
              />
              Enter the Wipronix Ecosystem →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;
