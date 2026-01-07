"use client";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useInView } from "react-intersection-observer";
import { useEffect, useState, useMemo } from "react";
import ScrollFloat from "./ScrollFloat";
import { Quote } from "lucide-react";
const Testimonials = ({ testimonials, autoplay = false }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotations = useMemo(() => {
    return testimonials.map((_, index) => Math.floor((index * 7.13) % 21) - 10);
  }, [testimonials]);
  return (
    <div
      className="rounded-tl-[200px]  rounded-br-[200px] bg-gradient-to-br
    from-[#ab1428]/25
    via-[#f0f0f0]
    to-white
    p-10
    "
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 "
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1], // smooth pop
          }}
          className="my-6! mt-12! text-2xl md:text-4xl font-bold mb-4 text-center"
        >
          Clients{" "}
          <motion.span
            initial={{ scale: 0.6, rotate: -6, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              delay: 0.25,
              duration: 0.6,
              type: "spring",
              stiffness: 260,
              damping: 18,
            }}
            className="
      inline-block
      gradient-text
      drop-shadow-[0_8px_30px_rgba(171,20,40,0.45)]
    "
          >
            Testimonials
          </motion.span>
        </motion.h2>

        <ScrollFloat
          animationDuration={1.2}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
          containerClassName=""
          textClassName="text-xl sm:text-3xl md:text-4xl lg:text-3xl font-bold text-center mb-10"
        >
          Discover how Wipronix Technologies’s fluid, powerful solutions
          transformed their digital presence.
        </ScrollFloat>
      </motion.div>
      <div className="flex justify-center   items-center md:flex-row md:flex">
        <div>
         

          {/* <motion.p className="mt-8 text-lg text-gray-500 dark:text-neutral-300">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block">
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p> */}
        </div>
        <div className="mx-auto max-w-sm px-4 py-10 md:py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12 ">
  
        <div className="relative grid grid-row-1 gap-20 md:grid-row-2 md:gap-0 
  bg-[#ab1428]/50 rounded-[20px] z-10 ">

            <div className="">
            <span className="absolute left-10 -top-4 
    text-[1rem] text-[#ab1428]
    pointer-events-none select-none">
    <Quote className="absolute left-6 -top-10 w-30 h-30 text-[#ab1428] rotate-180" />
  </span>
            <div className="relative w-full h-40  bottom-20  ">
                <AnimatePresence>
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                        z: -100,
                        rotate: randomRotations[index],
                      }}
                      animate={{
                        opacity: isActive(index) ? 1 : 0.6,
                        scale: isActive(index) ? 1 : 0.92,
                        z: isActive(index) ? 0 : -100,
                        rotate: isActive(index) ? 0 : randomRotations[index],

                        zIndex: isActive(index)
                          ? 40
                          : testimonials.length + 2 - index,

                        // Floating animation only for active card
                        y: isActive(index) ? [0, -60, 0] : 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.9,
                        z: 100,
                        rotate: randomRotations[index],
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 origin-bottom flex justify-center items-center px-2 sm:px-4"
                    >
                      <img
                        src={testimonial.src}
                        alt={testimonial.name}
                        draggable={false}
                        className="
            w-[300px] 
            h-[300px] 
   
            rounded-[500px]
            object-cover 
            object-center
            
             
          "
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <span className="absolute right-18 -top-34 text-[16rem] text-[#ab1428] z-30"><Quote className="absolute -right-6 top-18 w-30 h-30 text-[#ab1428]" />
</span>
       
            </div>
            <div className="flex justify-center flex-col items-center">
            <div className="text-center sm:hidden lg:block">
              <h3 className="text-3xl! md:text-3xl font-bold text-black ">
                {testimonials[active].name}
              </h3>
              <p className="text-[40px]! md:text-2xl text-gray-500 dark:text-neutral-500">
                {testimonials[active].designation}
              </p>
            </div>
            {/* <div className="relative sm:hidden lg:block">
              <Lottie animationData={greet} loop={true} />
            </div> */}
          </div>
            <div className="flex flex-col justify-between py-4 text-center relative">
     
              <motion.div
                key={active}
                initial={{
                  y: 20,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: -20,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              >
                <motion.p
                  className="
    
    text-lg
    font-extrabold
    bg-gradient-to-r
    from-blue-400
    to-cyan-300
    bg-clip-text
    text-[white]
    drop-shadow-lg
    xl:w-[50rem]
    px-8
    lg:w-[25rem]
  "
                >
                  {testimonials[active].quote.split(" ").map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{
                        filter: "blur(10px)",
                        opacity: 0,
                        y: 5,
                      }}
                      animate={{
                        filter: "blur(0px)",
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                        delay: 0.02 * index,
                      }}
                      className="inline-block"
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </motion.p>
              </motion.div>
              

              <div className="flex gap-4 pt-8 md:pt-0 justify-center items-center mt-10!">
                <button
                  onClick={handlePrev}
                  className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
                >
                  <IconArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
                </button>
                <button
                  onClick={handleNext}
                  className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
                >
                  <IconArrowRight className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Testimonials;
