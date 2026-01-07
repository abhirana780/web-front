import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
import Lottie from "lottie-react";
import faqAnimation from "../../assets/FAQ.json";
import AnimatedList from "../reactBits/AnimatedList.jsx";
import Testimonials from "../reactBits/Testimonials.jsx";

const FAQs = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });


  const items = [
    { 
      name: "What services does Wipronix Technologies provide?",
      description: "We offer deep-tech solutions including AI automation, web & mobile app development, cloud integration, and digital transformation services."
    },
    { 
      name: "How long does it take to build a website or app?",
      description: "Project timelines vary, but most websites take 2–4 weeks, while mobile and web apps take 1–3 months depending on features."
    },
    { 
      name: "Do you provide post-launch support?",
      description: "Yes, we offer continuous maintenance, updates, and technical support to ensure long-term stability and performance."
    },
    { 
      name: "Do you work with startups?",
      description: "Absolutely! We help startups build MVPs, scale products, and adopt modern technology to accelerate growth."
    },
    { 
      name: "What technologies does Wipronix Technologies specialize in?",
      description: "Our core stack includes MERN, React Native, AI tools, cloud platforms, and automation-focused technologies."
    },
    { 
      name: "Do you provide UI/UX design services?",
      description: "Yes, we create modern, intuitive, and user-focused interface designs tailored to your brand and audience."
    },
    { 
      name: "How much does a complete project cost?",
      description: "Pricing depends on project size and features. We offer flexible packages for websites, apps, and enterprise solutions."
    },
    { 
      name: "Can you integrate AI into our existing system?",
      description: "Yes! We build and integrate AI modules for automation, analytics, chatbots, and intelligent workflows."
    },
    { 
      name: "Is my data secure with Wipronix Technologies?",
      description: "We follow industry-standard security practices, encryption, and secure architecture to protect your business data."
    },
    { 
      name: "Do you offer custom software solutions?",
      description: "Yes, every project we build is customized to your business requirements—no generic templates."
    },
    { 
      name: "Can you improve or redesign my existing website?",
      description: "Absolutely! We modernize outdated websites with fresh designs, better performance, and smooth UI."
    },
    { 
      name: "Do you build cross-platform mobile apps?",
      description: "Yes, we use React Native and other modern frameworks to create apps for both Android and iOS."
    },
    { 
      name: "How do we get started with a project?",
      description: "Simply contact us with your idea. We'll schedule a discussion, understand your needs, and create a detailed project plan."
    },
    { 
      name: "Do you offer hosting or domain services?",
      description: "Yes, we help with domain registration, hosting setup, cloud deployment, and end-to-end configuration."
    },
    { 
      name: "Why choose Wipronix Technologies?",
      description: "We blend deep-technology expertise with ocean-level precision, delivering solutions that are scalable, modern, and truly impactful."
    }
  ];
  


  return (
    <section className="py-24 rounded-tl-[200px]   bg-gradient-to-br
    from-[#ab1428]/25
    via-[#f0f0f0]
    to-white">
    
    
    <div className="flex flex-col-reverse justify-between px-6 sm:px-28 xl:flex-row">
    <AnimatedList
  items={items}
  onItemSelect={(item, index) => console.log(item, index)}
  showGradients={true}
  enableArrowNavigation={true}
  displayScrollbar={true}
/>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className=" text-center mb- flex flex-col items-center gap-8 md:gap-16"
        >
          <div className="max-w-full md:max-w-md">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked <span className="text-[#ab1428]">Questions</span>
            </h2>
            <div className="inline-flex items-center justify-center w-full max-w-xs sm:max-w-sm h-auto bg-primary/10 rounded-lg mb-6 mx-auto">
              <Lottie animationData={faqAnimation} loop={true} className="w-full max-w-xs sm:max-w-sm h-auto" />
            </div>
          </div>
        </motion.div>

  
       
        
      </div>
      <motion.div
  initial={{ opacity: 0, y: 50, scale: 0.95 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  viewport={{ once: true, amount: 0.4 }}
  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
  className="relative mt-28 px-6"
>
  {/* Gradient Aura */}
  <div className="absolute inset-0 flex justify-center items-center -z-10">
    <div className="w-[420px] h-[420px] bg-gradient-to-br from-[#ab1428]/20 to-[#6c575a]/20 blur-[140px] rounded-full" />
  </div>

  {/* Glass Card */}
  <div
    className="
      relative max-w-3xl mx-auto
      rounded-3xl
      bg-white/70 backdrop-blur-xl
      border border-white/60
      shadow-[0_30px_80px_rgba(0,0,0,0.08)]
      px-10 py-14
      text-center
    "
  >
    {/* Accent Line */}
    <div className="absolute left-1/2 -top-[2px] -translate-x-1/2 w-24 h-1 rounded-full bg-gradient-to-r from-[#ab1428] to-[#6c575a]" />

    {/* Headline */}
    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
      Let’s build something meaningful together
    </h3>

    {/* Description */}
    <p className="text-gray-600 max-w-xl mx-auto leading-relaxed mb-10">
      Still have questions? Our team is ready to guide you with clarity,
      confidence, and real-world expertise.
    </p>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <motion.a
        href="/contact"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.96 }}
        className="
          group inline-flex items-center justify-center
          px-10 py-3.5
          rounded-full
          font-semibold
          text-white
          bg-gradient-to-r from-[#ab1428] to-[#6c575a]
          shadow-lg shadow-[#ab1428]/30
          hover:shadow-xl hover:shadow-[#ab1428]/40
          transition-all duration-300
        "
      >
        <span className="flex items-center gap-2">
          Contact Us
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </motion.a>

      {/* Secondary CTA */}
      <motion.a
        href="/services"
        whileHover={{ y: -2 }}
        className="
          text-sm font-medium
          text-gray-700
          hover:text-[#ab1428]
          transition-colors
        "
      >
        Explore Services →
      </motion.a>
    </div>
  </div>
</motion.div>


<motion.div
  initial={{ scaleX: 0 }}
  whileInView={{ scaleX: 1 }}
  transition={{ duration: 1, ease: "easeOut" }}
  viewport={{ once: true }}
  className="relative mx-auto mt-16 h-[4px] max-w-[420px] origin-center"
>
  {/* Gradient Line */}
  <div className="h-full w-full rounded-full bg-gradient-to-r from-[#ab1428] to-[#6c575a]" />

  {/* Soft Glow */}
  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ab1428]/40 to-[#6c575a]/40 blur-md" />
</motion.div>

    </section>
    
  );
};

export default FAQs;
