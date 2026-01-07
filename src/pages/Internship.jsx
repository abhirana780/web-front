
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Threads from "../components/reactBits/Threads";
import Lottie from "lottie-react";
import { Drawer, Form, Input, Button } from "antd";
import { useToast } from "../hooks/use-toast";
import ToastContainer from "../components/ui/toast-container";
import axiosInstance from "../services/api";

import calendar from "../assets/Calendar.json";
import documents from "../assets/document.json";
import HiringAnimation from "../assets/hiring.json";
import WorkingTogetherAnimation from "../assets/WorkingTogether.json";
import interPhip from "../assets/Welcome.json";
import EmailSent from "../assets/EmailSent.json";
import "../styles/neumorphism.css";

const techStacks = [
  "MernStack",
  "AI / ML",
  "PythonWebDevelopment",
  "GraphicDesign",
  "DataAnalytics",
  "MobileAppDevelopment",
];

const InterShip = () => {
  const [videoWatched, setVideoWatched] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [selectedStack, setSelectedStack] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [videoCompletedToastShown, setVideoCompletedToastShown] = useState(false);
  const { toast, toasts, removeToast } = useToast();

  // Show toast when video is watched (only once)
  React.useEffect(() => {
    if (videoWatched && !videoCompletedToastShown) {
      toast({
        title: "Video Completed! 🎥",
        description: "Great! Now you can explore our internship opportunities and apply.",
        type: "success"
      });
      setVideoCompletedToastShown(true);
    }
  }, [videoWatched, videoCompletedToastShown, toast]);

  const showWatchVideoToast = () => {
    toast({
      title: "Watch the introduction video",
      description: "Please watch the full video to unlock the internship application.",
      type: "warning"
    });
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/internship/apply', {
        name: values.name,
        email: values.email,
        phone: values.phone,
        technology: selectedStack,
        college: values.college,
        semester: values.semester,
        link:true
      });

      if (response.data.success) {
        toast({
          title: "Application Submitted! 🎉",
          description: response.data.message,
          type: "success"
        });
        
        // Close drawer and reset form
        setOpenDrawer(false);
        form.resetFields();
        
        // Show success animation
        setShowSuccessAnimation(true);
        
        // Auto-hide animation after 3 seconds
        setTimeout(() => {
          setShowSuccessAnimation(false);
        }, 3000);
        
        // Show assessment link in a toast
        if (response.data.data.assessmentLink) {
          setTimeout(() => {
            toast({
              title: "Assessment Link Ready! 🔗",
              description: `Your assessment link: ${response.data.data.assessmentLink}`,
              type: "info"
            });
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Application submission error:', error);
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast({
        title: "Application Failed",
        description: errorMessage,
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-white py-10 px-4"
    >
      {/* HERO */}
      <div className="w-full h-[220px] relative mb-20">
        <Threads amplitude={4} distance={0.4} enableMouseInteraction={false} />
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          text-5xl md:text-6xl font-extrabold text-[#ab1428] text-center">
          Apply for Internship
        </h1>
        <p className="absolute top-[65%] left-1/2 -translate-x-1/2 text-gray-600 text-center max-w-2xl">
          Understand how we work before you apply.
        </p>
      </div>

      {/* VIDEO FIRST */}
      <section className="max-w-4xl mx-auto text-center mb-18">
        <h2 className="text-3xl font-bold mb-4">How Our Internship Works</h2>
        <p className="text-gray-600 mb-8">
          Watch the video to unlock the internship application.
        </p>

        <button
          onClick={() => setOpenVideo(true)}
          className="px-8 py-4 bg-[#ab1428] text-white text-lg rounded-xl shadow-lg hover:scale-105 transition"
        >
          Watch Full Video →
        </button>

        {videoWatched && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#ab1428] font-semibold mt-4"
          >
            Hope you liked how our company works.
            If this aligns with your goals, we'd be glad to have you join us.
          </motion.p>
        )}
      </section>

      <section
        className={`max-w-4xl mx-auto mb-28 text-center transition ${
          !videoWatched ? "opacity-40" : ""
        }`}
      >
        <h2 className="text-3xl font-bold mb-4">Choose Your Technology</h2>
        <p className="text-gray-600 mb-8">
          Select the tech stack you want to apply for.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {techStacks.map((stack) => (
            <button
              key={stack}
              onClick={() => {
                if (!videoWatched) {
                  showWatchVideoToast();
                  return;
                }
                setSelectedStack(stack);
              }}
              className={`p-4 rounded-xl border font-semibold transition
                ${
                  selectedStack === stack
                    ? "bg-[#ab1428] text-white"
                    : "bg-white hover:border-[#ab1428]"
                }
                ${!videoWatched ? "cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {stack}
            </button>
          ))}
        </div>

        {selectedStack && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
          >
            <button
              onClick={() => setOpenDrawer(true)}
              className="px-6 py-3 bg-[#ab1428] text-white rounded-xl text-lg shadow-lg hover:scale-105 transition"
            >
              Apply for Internship →
            </button>
          </motion.div>
        )}
      </section>

      {/* DRAWER */}
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        width={540}
        closable={false}
        bodyStyle={{
          padding: 0,
          background: "#e9edf1",
        }}
      >
        <div className="bg-[#ab1428] px-6 py-5 text-white shadow-lg">
          <h3 className="text-xl font-semibold text-center">Internship Application</h3>
          <p className="text-sm opacity-90 text-center">{selectedStack}</p>
        </div>

        <div className="neumo-form-container m-4">
          <Form 
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
          >
            <Form.Item label={<span className="neumo-label">Full Name</span>} name="name" rules={[{ required: true }]}>
              <Input 
                size="large" 
                className="neumo-input"
              />
            </Form.Item>

            <Form.Item label={<span className="neumo-label">Email</span>} name="email" rules={[{ required: true, type: "email" }]}>
              <Input 
                size="large" 
                className="neumo-input"
              />
            </Form.Item>

            <Form.Item label={<span className="neumo-label">Phone Number</span>} name="phone" rules={[{ required: true }]}>
              <Input 
                size="large" 
                className="neumo-input"
              />
            </Form.Item>

            <Form.Item label={<span className="neumo-label">Technology</span>}>
              <Input 
                value={selectedStack} 
                disabled 
                size="large" 
                className="neumo-input"
              />
            </Form.Item>

            <Form.Item label={<span className="neumo-label">College Name</span>} name="college" rules={[{ required: true }]}>
              <Input 
                size="large" 
                className="neumo-input"
              />
            </Form.Item>

            <Form.Item label={<span className="neumo-label">Semester</span>} name="semester" rules={[{ required: true }]}>
              <Input 
                size="large" 
                className="neumo-input"
              />
            </Form.Item>

            <Button
              htmlType="submit"
              block
              size="large"
              className="neumo-button mt-6"
              loading={loading}
            >
              Submit & Get Assessment Link
            </Button>
          </Form>
        </div>
      </Drawer>

      {/* TIMELINE */}
      <section className="max-w-6xl mx-auto mb-28 relative">
        {/* CENTER TIMELINE LINE */}
        <div
          className="hidden md:block absolute left-1/2 top-0 h-full
          border-l-8 border-dotted border-gray-300 -translate-x-1/2 mt-[4rem]"
        />

        <h2 className="text-3xl font-bold text-center mb-12">
          How the Internship Selection Works
        </h2>

        <div className="grid md:grid-cols-2 gap-y-24 relative z-10">
          {/* STEP 01 */}
          <div className="text-right pr-10">
            <h3 className="text-4xl font-bold">01</h3>
            <h4 className="text-xl font-semibold text-[#ab1428] mb-3">
              Apply & Choose Tech Stack
            </h4>
            <p className="text-gray-600">
              Apply by selecting your preferred technology.
            </p>
            <div className="w-64 h-64 mx-auto mt-6 rounded-full bg-[#ab1428] shadow-lg">
              <Lottie animationData={calendar} />
            </div>
          </div>

          {/* STEP 02 */}
          <div className="pl-10 mt-[14rem]">
            <h3 className="text-4xl font-bold">02</h3>
            <h4 className="text-xl font-semibold text-[#ab1428] mb-3">
              Skill Assessment
            </h4>
            <p className="text-gray-600">
              A role-specific assessment evaluates your readiness.
            </p>
            <div className="w-64 h-64 mx-auto mt-6 rounded-full bg-[#ab1428] shadow-lg">
              <Lottie animationData={documents} />
            </div>
          </div>

          {/* STEP 03 */}
          <div className="text-right pr-10">
            <h3 className="text-4xl font-bold">03</h3>
            <h4 className="text-xl font-semibold text-[#ab1428] mb-3">
              Result & Evaluation
            </h4>
            <p className="text-gray-600">
              Results determine internship eligibility.
            </p>
            <div className="w-64 h-64 mx-auto mt-6 rounded-full bg-[#ab1428] shadow-lg">
              <Lottie animationData={HiringAnimation} />
            </div>
          </div>

          {/* STEP 04 */}
          <div className="pl-10 mt-[14rem]">
            <h3 className="text-4xl font-bold">04</h3>
            <h4 className="text-xl font-semibold text-[#ab1428] mb-3">
              HR Interaction
            </h4>
            <p className="text-gray-600">
              Our team discusses next steps with you.
            </p>
            <div className="w-64 h-64 mx-auto mt-6 rounded-full bg-[#ab1428] shadow-lg">
              <Lottie animationData={WorkingTogetherAnimation} />
            </div>
          </div>

          {/* STEP 05 */}
          <div className="text-right pr-10">
            <h3 className="text-4xl font-bold">05</h3>
            <h4 className="text-xl font-semibold text-[#ab1428] mb-3">
              Join as Intern
            </h4>
            <p className="text-gray-600">
              Selected candidates work on real projects with mentors.
            </p>
            <div className="w-64 h-64 mx-auto mt-6 rounded-full bg-[#ab1428] shadow-lg">
              <Lottie animationData={interPhip} />
            </div>
          </div>

          <div />
        </div>
      </section>

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {openVideo && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setOpenVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              className="bg-black rounded-xl w-[90%] md:w-[800px] h-[450px]"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                className="w-full h-full rounded-xl"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Internship Process"
                allowFullScreen
                onLoad={() => setTimeout(() => setVideoWatched(true), 10000)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Success Animation Modal */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-xl p-8 flex flex-col items-center justify-center"
            >
              <div className="w-64 h-64">
                <Lottie animationData={EmailSent} loop={false} />
              </div>
              <p className="text-xl font-semibold text-[#ab1428] mt-4 text-center">
                Application Submitted Successfully!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toast Container - Only show when video is watched */}
      {videoWatched && (
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      )}
    </motion.div>
  );
};

export default InterShip;

