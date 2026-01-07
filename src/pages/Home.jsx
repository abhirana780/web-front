import React, { useState } from "react";
import bgImage from "../assets/bg.jpg";
import logoWhite from "../assets/logo.png";
import SplitText from "../components/reactBits/SplitText";
import InfiniteCardSlider from "../components/reactBits/InfiniteCardSlider";
import crm from "../../src/assets/crm.png";
import webLogo from "../../src/assets/webLogo.png";
import seoLogo from "../../src/assets/seoLogo.png";
import aiLogo from "../assets/aiLogo.jpg";
import seo from "../assets/seo.png";
import CEOIntro from "../components/ceo/CeoIntro";
import Services from "../components/Serivecs/Services";
import Testimonials from "../components/reactBits/Testimonials";
import c1 from "../assets/c1.jpg";
import c2 from "../assets/c2.jpg";
import c3 from "../assets/c3.jpg";
import c4 from "../assets/c4.jpg";
import c5 from "../assets/c5.jpg";
import FAQs from "../components/FQ/Faq";
import Masonry from "../components/reactBits/Mansory/Mansory";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../components/ui/button";

import LogoLoopMarque from "../components/LogoMarqe/LogoLoopMarque";
import Missions from "../components/Missions";
import { Link } from "react-router";
const items = [
  {
    id: "1",
    img: "https://picsum.photos/id/1015/600/900?grayscale",
    url: "https://example.com/blog1",
    height: 400,
    title: "How AI is Reshaping the Future of Business",
    description:
      "A deep dive into how artificial intelligence enhances productivity, automation, and decision-making across industries.",
  },
  {
    id: "2",
    img: "https://picsum.photos/id/1011/600/750?grayscale",
    url: "https://example.com/blog2",
    height: 250,
    title: "Eco-Friendly Tech: The Future of Sustainable Innovation",
    description:
      "Discover emerging green technologies that reduce environmental impact while boosting business efficiency.",
  },
  {
    id: "3",
    img: "https://picsum.photos/id/1020/600/800?grayscale",
    url: "https://example.com/blog3",
    height: 600,
    title: "Top Digital Marketing Trends You Must Know in 2025",
    description:
      "Stay ahead with cutting-edge marketing strategies, consumer behavior insights, and growth-focused techniques.",
  },
  {
    id: "4",
    img: "https://picsum.photos/id/1025/600/700?grayscale",
    url: "https://example.com/blog4",
    height: 350,
    title: "Building Scalable Web Apps: A Complete Guide",
    description:
      "Learn essential principles and modern frameworks for creating fast, secure, and scalable web applications.",
  },
  {
    id: "5",
    img: "https://picsum.photos/id/1030/600/650?grayscale",
    url: "https://example.com/blog5",
    height: 300,
    title: "Cybersecurity Essentials Every Business Must Follow",
    description:
      "Understand critical security practices to protect your digital infrastructure from threats and vulnerabilities.",
  },
  {
    id: "6",
    img: "https://picsum.photos/id/1035/600/850?grayscale",
    url: "https://example.com/blog6",
    height: 450,
    title: "Why Cloud Computing Is a Game-Changer for Enterprises",
    description:
      "Explore the cost, performance, and scalability advantages of migrating business workloads to the cloud.",
  },
  {
    id: "7",
    img: "https://picsum.photos/id/1040/600/600?grayscale",
    url: "https://example.com/blog7",
    height: 200,
    title: "The Rise of Remote Work: Trends & Business Impact",
    description:
      "How remote work has redefined productivity, collaboration, and global workforce culture.",
  },
  {
    id: "8",
    img: "https://picsum.photos/id/1045/600/950?grayscale",
    url: "https://example.com/blog8",
    height: 500,
    title: "Game-Changing Innovations in the E-Commerce Industry",
    description:
      "A look at new technologies driving online shopping experiences, growth, and customer retention.",
  },
  {
    id: "9",
    img: "https://picsum.photos/id/1050/600/720?grayscale",
    url: "https://example.com/blog9",
    height: 320,
    title: "Using Data Analytics to Accelerate Business Growth",
    description:
      "Learn how businesses leverage data insights to boost performance, optimize operations, and scale effectively.",
  },
  {
    id: "10",
    img: "https://picsum.photos/id/1055/600/880?grayscale",
    url: "https://example.com/blog10",
    height: 480,
    title: "The Impact of 5G Technology on Modern Businesses",
    description:
      "Explore how 5G connectivity is transforming communication, IoT, and real-time data processing across sectors.",
  },
  {
    id: "11",
    img: "https://picsum.photos/id/1060/600/780?grayscale",
    url: "https://example.com/blog11",
    height: 380,
    title: "Mastering UX Design for Maximum User Engagement",
    description:
      "Best practices and strategies for creating intuitive, user-friendly digital experiences that drive retention.",
  },
  {
    id: "12",
    img: "https://picsum.photos/id/1065/600/820?grayscale",
    url: "https://example.com/blog12",
    height: 420,
    title: "Blockchain Beyond Cryptocurrency: Real-World Applications",
    description:
      "Discover how blockchain technology is revolutionizing supply chains, healthcare, and data security.",
  },
];

const testimonials = [
  {
    id: 1,
    src: c1,
    name: "Sarah Johnson",
    designation: "CEO, TechStart Inc.",
    quote:
      "Partnering with Wipronix Technologies has been one of the best decisions we made for our digital growth. Their commitment to quality is evident in every detail, from design to deployment. The team understood our vision instantly and transformed it into a seamless digital experience. Their deep-tech approach ensured efficiency, scalability, and long-term stability. We now operate faster and smarter than ever before.",
  },
  {
    id: 2,
    src: c2,
    name: "Michael Chen",
    designation: "Founder, InnovateLabs",
    quote:
      "Wipronix Technologies delivered a website that feels fluid, modern, and incredibly intuitive. What impressed us most was their ability to combine creativity with technical excellence. Every section of our platform feels thoughtfully crafted and optimized. Their communication was clear, their timelines were precise, and the final product exceeded our expectations. Our brand finally looks as innovative as we always envisioned.",
  },
  {
    id: 3,
    src: c3,
    name: "Emily Rodriguez",
    designation: "Marketing Director, GrowthCo",
    quote:
      "We saw an instant boost in user engagement after Wipronix Technologies redesigned our digital presence. Their approach is strategic, data-driven, and beautifully executed. They don’t just build— they understand the psychology behind great user experiences. Our customers now enjoy a faster, cleaner, and more enjoyable interface. Wipronix Technologies helped us turn visitors into loyal users effortlessly.",
  },
  {
    id: 4,
    src: c4,
    name: "David Lee",
    designation: "CTO, InnovateTech",
    quote:
      "The level of technical expertise Wipronix Technologies brings is unmatched. They took a complex platform and made it incredibly smooth, stable, and scalable. Their problem-solving skills and deep understanding of modern architecture helped strengthen our entire infrastructure. We now handle significantly more traffic with zero downtime. They are a true partner in innovation, not just a service provider.",
  },
  {
    id: 5,
    src: c5,
    name: "Lisa Wang",
    designation: "Founder, StartupHub",
    quote:
      "From the first meeting to the final launch, Wipronix Technologies made the entire process effortless. Their team listened, advised, and delivered a product that went beyond our expectations. The UI feels premium, the performance is lightning-fast, and the overall experience reflects true craftsmanship. Our users love the new interface, and engagement has grown consistently. Wipronix Technologies brought our ideas to life with precision and passion.",
  },
];

const Home = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [2700, 2794], [0, 1]);

  // Form state management
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    project: "",
    drink: ""
  });

  const [errors, setErrors] = useState({});

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  // Form input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.project.trim()) {
      newErrors.project = "Project description is required";
    }
    
    if (!formData.drink) {
      newErrors.drink = "Please select your meeting preference";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const message = `🌟 Hello! Thank you for your interest in Wipronix Technologies!

I'm excited to learn about your project:
👤 Name: ${formData.firstName}
📧 Email: ${formData.email}
📱 Phone: ${formData.phone}
📝 Project: ${formData.project}
☕ Meeting preference: ${formData.drink}

We're thrilled to help bring your vision to life! Our team will review your requirements and call you back within 10-30 minutes to discuss your project in detail.

Looking forward to our conversation!
- Wipronix Technologies Team 🚀`;

    return encodeURIComponent(message);
  };

  // Form submission handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const whatsappNumber = "9191646706113"; // Company WhatsApp number
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Open WhatsApp in new window
    window.open(whatsappUrl, '_blank');
    
    // Optional: Reset form after submission
    // setFormData({
    //   firstName: "",
    //   email: "",
    //   phone: "",
    //   project: "",
    //   drink: ""
    // });
  };

  // Card data for the InfiniteCardSlider
  const serviceCards = [
    {
      backgroundImage: seo,
      title: "SEO & Organic Lead Generation",
      description: "Rank higher, attract quality traffic, and convert visitors with a strong organic presence. Sustainable growth without relying on paid ads.",
      logo: seoLogo,
    },
    {
      backgroundImage: seo,
      title: "Website and App Development",
      description: "Build modern, high-performance websites and apps tailored to your business. Scalable, secure, and designed for real-world impact.",
      logo: webLogo,

    },
    {
      backgroundImage: seo,
      title: "Custom Software & CRM",
      description: "Streamline operations with custom-built software and CRM systems designed for your workflow. Smarter management. Better efficiency.",
      logo: crm,

    },
    {
      backgroundImage: seo,
      title: "AI & Automation Solutions",
      description: "Eliminate repetitive tasks and scale faster with intelligent AI tools and automation workflows.",
      logo: aiLogo,

    }
  ];
  return (
    <div>
      <div
        className="
        min-h-screen
        bg-cover bg-center
        px-4 md:px-10
        overflow-x-hidden
        rounded-br-[200px]
      "
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeIn", delay: 0.2 }}
          className="flex justify-center"
        >
          <img
            src={logoWhite}
            alt="Company Logo"
            className="w-[300px]! md:w-[300px] drop-shadow-2xl "
          />
        </motion.div>

        <div className="">
          <div
            className="

          md:text-center
       
    flex flex-col
      sm:max-w-[40rem]
    md:max-w-[45rem]
    lg:max-w-[60rem]
    xl:max-w-[40rem]
    2xl:max-w-[85rem]
 

    xl:flex-row
    justify-between
    items-center
    text-center 
  "
          >
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div
                className="text-start bg-white/10 backdrop-blur-md rounded-xl border border-white/20  p-6 md:p-8
                sm:max-w-[40rem]
    md:max-w-[45rem]
    lg:max-w-[60rem]
    xl:max-w-[40rem]
    2xl:max-w-[55rem]
    
    
    "
              >
                <SplitText
                  text="Innovative Digital, Data & AI Solutions by Wipronix Technologies Technologies – Mohali"
                  className="font-extrabold text-[#ab1428] text-[24px] drop-shadow-lg"
                  delay={5}
                  duration={0.03}
                  ease="power2.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  onLetterAnimationComplete={handleAnimationComplete}
                />
                <p className="text-lg md:text-xl text-[#989595] mt-4 leading-relaxed w-full ">
                  “At Wipronix Technologies, we believe technology should be as
                  fluid as water—powerful, limitless, and transformational.”
                </p>
                <p className="text-lg md:text-xl text-[#989595] mt-8 leading-relaxed w-full ">
                  “Your trusted partner for Digital Marketing, SEO, Software
                  Development, Website & App Development, CRM, Data Analytics &
                  AI Services across Mohali, Chandigarh, Punjab & Delhi NCR.”
                </p>
                <div
                  className="mt-6 flex gap-4 sm:items-center sm:flex  sm:justify-center 
              xl:items-center 
              xl:flex  
              xl:justify-center"
                >
                  {/* Primary Button */}
                  <Link to="/contact">
                    <button
                      className="
      bg-[#ab1428] text-white px-5 py-2 rounded-t-[20px]
      transition-all duration-300 ease-out
      hover:bg-white hover:text-[#ab1428]
      hover:scale-105 hover:shadow-lg
      active:scale-95
      animate-fadeIn
    "
                    >
                      Get Free Consultation
                    </button>
                  </Link>

                  {/* Outline Button */}
                  <Link to="/services">
                    <button
                      className="
      border border-[#ab1428] text-[#ab1428] px-5 py-2 rounded-t-[20px]
      transition-all duration-300 ease-out
      hover:bg-[#ab1428] hover:text-white
      hover:scale-105 hover:shadow-lg
      active:scale-95
      animate-fadeIn delay-200
    "
                    >
                      Explore Services
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeIn", delay: 0.1 }}
            >
              <div className="h-[900px] md:h-[680px]  flex items-center justify-center md:mt-0">
                <InfiniteCardSlider>
                  {serviceCards.map((card, index) => (
                    <div
                      key={index}
                      backgroundImage={card.backgroundImage}
                      title={card.title}
                      description={card.description}
                      logo={card.logo}
                    />
                  ))}
                </InfiniteCardSlider>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <CEOIntro />
      <Services />
      <Testimonials testimonials={testimonials} />
      <div
        className="flex flex-col items-center justify-center py-10 rounded-tl-[200px]   bg-gradient-to-br
    from-[#141112]/25
    via-[#f0f0f0]
    to-white
  "
      >
        <h2 className="text-4xl font-bold text-center text-gray-800 ">
          Our Blogs
        </h2>
        <p className="my-4! mb-10! text-lg md:text-2xl font-extrabold bg-gradient-to-r from-[#ab1428] to-[#6c575a] text-transparent bg-clip-text drop-shadow-md mb-8">
          Discover how Wipronix Technologies’s fluid, powerful solutions
          transformed their digital presence.
        </p>
        <motion.div
          style={{ opacity }}
          className="w-full max-w-6xl h-[50rem] md:h-[50rem]  overflow-hidden "
        >
          <Masonry
            items={items}
            ease="power2.out"
            duration={0.2}
            stagger={0.01}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={true}
          />
        </motion.div>
      </div>

      <Missions />
      <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 px-6">

        {/* LEFT FORM */}
        <div className="bg-[#f7f9ff] rounded-3xl p-10 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Let’s Build Your Dream Website!
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className={`w-full border-b bg-transparent py-3 focus:outline-none ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300 focus:border-[#ab1428]-600'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className={`w-full border-b bg-transparent py-3 focus:outline-none ${
                  errors.email ? 'border-red-500' : 'border-gray-300 focus:border-[#ab1428]-600'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className={`w-full border-b bg-transparent py-3 focus:outline-none ${
                  errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-[#ab1428]-600'
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <textarea
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                rows="3"
                placeholder="What's your Project about?"
                className={`w-full border-b bg-transparent py-3 focus:outline-none resize-none ${
                  errors.project ? 'border-red-500' : 'border-gray-300 focus:border-[#ab1428]-600'
                }`}
              />
              {errors.project && (
                <p className="text-red-500 text-sm mt-1">{errors.project}</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                What would you like to have during our business meeting?
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="drink" 
                    value="Tea"
                    checked={formData.drink === "Tea"}
                    onChange={handleInputChange}
                  />
                  Tea
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="drink" 
                    value="Coffee"
                    checked={formData.drink === "Coffee"}
                    onChange={handleInputChange}
                  />
                  Coffee
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="drink" 
                    value="Green Tea"
                    checked={formData.drink === "Green Tea"}
                    onChange={handleInputChange}
                  />
                  Green Tea
                </label>
              </div>
              {errors.drink && (
                <p className="text-red-500 text-sm mt-1">{errors.drink}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#ab1428] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#ab1428] transition"
            >
              Yes, call me!
            </button>

            <p className="text-center text-sm text-gray-500">
              We call back in 10–30 minutes, guaranteed!
            </p>
          </form>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            WHY CHOOSE US
          </h2>
          <p className="text-orange-500 font-medium mb-6">
            Why 1500+ Clients Trust Solutions1313
          </p>

          <ul className="space-y-4 text-lg text-gray-800 mb-10">
            {[
              "13+ Years of Experience",
              "Professional in-house Developers",
              "Transparent Pricing – No Hidden Cost",
              "Clean & Modern UI/UX Design",
              "SEO-Friendly Website Structure",
              "High Loading Speed Score",
              "99% Client Satisfaction",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <a
            href="tel:+919216041313"
            className="inline-block bg-[#ab1428] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#ab1428] transition w-fit"
          >
            Contact Us: +91 96467 06113
          </a>
        </div>
      </div>
    </section>
      <FAQs />

    </div>
  );
};

export default Home;
