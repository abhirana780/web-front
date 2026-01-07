import React, { useState, useEffect } from "react";
import lost from '../../assets/lnf.png'
import bg from '../../assets/bg.png'
import tds from '../../assets/tds.png'
import rent from '../../assets/rent.png'
import green from '../../assets/green.png'
// import gbm from '../../assets/gbm.png'
import lms from '../../assets/lms.png'
// import bict from '../../assets/bict.png'
// import acha from '../../assets/acha.png'
import InfiniteMenu from "../reactBits/Infinite Menu";
import ScrollFloat from "../reactBits/ScrollFloat";

const Services = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showFullDescriptions, setShowFullDescriptions] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      // Make sticky responsive: activate when scrolled past 80% of viewport height
      if (window.scrollY > window.innerHeight * 0.8) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDescription = (index) => {
    setShowFullDescriptions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const products = [
    {
      title: "Lost And Found India",
      link: "#",
      image: lost,
      description: "A comprehensive platform to help users report and recover lost items across India, featuring advanced search and matching algorithms.",
      description1: "Users can upload details, photos, and locations for quick identification.",
      description2: "Smart matching automatically connects owners with finders efficiently."
    },
    {
      title: "Taxi Booking System",
      link: "#",
      image: bg,
      description: "An efficient taxi booking application that connects riders with drivers, offering real-time tracking and secure payment options.",
      description1: "Live driver tracking ensures transparency and faster pickups.",
      description2: "Multiple payment modes and ride history improve user convenience."
    },
    {
      title: "Truck Delivery System",
      link: "#",
      image: tds,
      description: "A logistics solution for managing truck deliveries, including route optimization, load tracking, and fleet management.",
      description1: "Real-time GPS tracking enables accurate delivery updates.",
      description2: "Automated load planning improves efficiency and reduces fuel cost."
    },
    {
      title: "Healthcare Portal",
      link: "#",
      image: rent,
      description: "An integrated healthcare platform providing appointment scheduling, telemedicine, and patient record management.",
      description1: "Patients can connect with doctors through secure online consultations.",
      description2: "Unified dashboards help hospitals manage daily operations smoothly."
    },
    {
      title: "Learning Management System",
      link: "#",
      image: green,
      description: "A robust LMS for educational institutions, offering course creation, student progress tracking, and interactive learning tools.",
      description1: "Teachers can build modules, quizzes, and interactive lessons easily.",
      description2: "Students track progress with analytics and personalized dashboards."
    },
    {
      title: "Real Estate Platform",
      link: "#",
      image: lms,
      description: "A comprehensive real estate marketplace for buying, selling, and renting properties with advanced search and virtual tours.",
      description1: "Smart filters help users find properties based on budget and location.",
      description2: "Virtual tours improve user experience and increase buyer confidence."
    },
  ];
  

  return (
    <div className="flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 rounded-tl-[200px]  rounded-br-[200px] bg-gradient-to-br
    from-[#141112]/25
    via-[#f0f0f0]
    to-white">

      <ScrollFloat
        animationDuration={1}
        ease='back.inOut(2)'
        scrollStart='center bottom+=50%'
        scrollEnd='bottom bottom-=40%'
        stagger={0.03}
        containerClassName=""
        textClassName="text-2xl! sm:text-2xl md:text-3xl lg:text-4xl text-gray-900 font-semibold mt-10"
      >
        Deep Technology Endless Possibilities
      </ScrollFloat>

      <ScrollFloat
        animationDuration={1.2}
        ease='back.inOut(2)'
        scrollStart='center bottom+=50%'
        scrollEnd='bottom bottom-=40%'
        stagger={0.03}
        containerClassName=""
        textClassName="text-3xl! sm:text-3xl md:text-4xl lg:text-5xl font-extrabold   bg-clip-text drop-shadow-md"
      >
        Our Dynamic & Deep-Innovation Services
      </ScrollFloat>
      <ScrollFloat
        animationDuration={1.4}
        ease='back.inOut(2)'
        scrollStart='center bottom+=50%'
        scrollEnd='bottom bottom-=40%'
        stagger={0.03}
        containerClassName=""
        textClassName="text-[14px]! sm:text-2xl md:text-3xl lg:text-4xl text-gray-500 font-semibold"
      >
        Click & Move to Explore our diverse range of cutting-edge services.
      </ScrollFloat>
      <div style={{ height: '700px',width:'100%',paddingLeft:"4rem",paddingRight:"4rem",paddingBottom:"4rem"}}>
        <InfiniteMenu items={products}/>
      </div>
    </div>
  );
};

export default Services;
