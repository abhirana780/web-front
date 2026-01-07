import React from 'react'
import Threads from '../components/reactBits/Threads'
import {
    GraduationCap,
    Users,
    BadgeCheck,
    Trophy,
    Laptop,
    ThumbsUp,
    Star,Briefcase,
    Code2,
    Layers,
    Clock,
    Wallet,
    UserCheck,
    MessageSquare,
    RefreshCcw,
    Building2,
    CreditCard,
    Award,
    Sliders,
    Monitor,
    CalendarClock,


    Home,
    Store,
    CheckCircle2,
    
    
  } from "lucide-react";
import LogoLoopMarque from '../components/LogoMarqe/LogoLoopMarque';
import { SiGoogleads, SiGoogleanalytics, SiHubspot, SiMeta, SiYoutube } from 'react-icons/si';
import { Link } from 'react-router';


  function Stat({ icon, title, desc }) {
    return (
      <div className="flex items-start gap-3">
        <div className="text-[#f5a623]">
          {icon}
        </div>
        <div>
          <p className="font-bold text-lg">{title}</p>
          <p className="text-gray-600 text-sm">{desc}</p>
        </div>
      </div>
    );
  }
const Courses = () => {
    const cards = [
        {
          icon: GraduationCap,
          title: "Freshers & Job Seekers",
          points: [
            "Career-oriented training with placement support",
            "High-demand tech roles in MERN, Cloud & AI",
            "Salary packages starting from industry standards",
            "Job-ready skills with real-world projects",
          ],
        },
        {
          icon: Briefcase,
          title: "Working Professionals",
          points: [
            "Upgrade your technical skillset",
            "Switch to high-paying tech domains",
            "Earn additional income via freelancing",
            "Flexible batch timings for professionals",
          ],
        },
        {
          icon: Home,
          title: "Housewives",
          points: [
            "Earn while working from home",
            "Freelancing & remote job opportunities",
            "Learn modern tech skills from scratch",
          ],
        },
        {
          icon: Store,
          title: "Business Owners",
          points: [
            "Build & manage your own tech products",
            "Generate more leads using digital platforms",
            "Improve online presence & automation",
            "Make data-driven business decisions",
          ],
        },
      ];
      
    const certifications = [
        { icon: SiGoogleads, label: "Google Ads" },
        { icon: SiGoogleads, label: "Shopping Advertising" },
        // { icon: SiGooglemybusiness, label: "Google My Business" },
        { icon: SiYoutube, label: "Video Advertising" },
      
        { icon: SiGoogleads, label: "Digital Sales" },
        { icon: SiGoogleads, label: "Mobile Advertising" },
        { icon: SiGoogleanalytics, label: "Google Analytics" },
        { icon: SiGoogleads, label: "Search Advertising" },
      
        { icon: SiHubspot, label: "HubSpot Content Marketing" },
        { icon: SiMeta, label: "Meta Blueprint" },
        { icon: SiHubspot, label: "Inbound Marketing" },
        { icon: SiHubspot, label: "HubSpot Certification" },
      
        { icon: SiGoogleads, label: "Internship Certificate" },
        { icon: SiGoogleads, label: "Industry Certificate" },
      ];
    const benefits = [
        { icon: Briefcase, title: "100% Career Assistance", bg: "bg-yellow-100" },
        { icon: Code2, title: "Live Project Training", bg: "bg-orange-100" },
        { icon: Layers, title: "Industry-Based Modules", bg: "bg-purple-100" },
        { icon: Clock, title: "2–3 Hours Daily Classes", bg: "bg-sky-100" },
        { icon: Wallet, title: "Affordable Fees", bg: "bg-[#ab1428]" },
      
        { icon: UserCheck, title: "Experienced Mentors", bg: "bg-green-100" },
        { icon: MessageSquare, title: "Interview Preparation", bg: "bg-red-100" },
        { icon: RefreshCcw, title: "Backup Classes", bg: "bg-pink-100" },
        { icon: Building2, title: "Placement Support", bg: "bg-yellow-100" },
        { icon: CreditCard, title: "EMI Payment Option", bg: "bg-green-100" },
      
        { icon: Award, title: "Industry Certification", bg: "bg-rose-100" },
        { icon: Sliders, title: "Customised Courses", bg: "bg-red-100" },
        { icon: GraduationCap, title: "Internship Opportunities", bg: "bg-cyan-100" },
        { icon: Monitor, title: "Online + Offline Classes", bg: "bg-teal-100" },
        { icon: CalendarClock, title: "Flexible Timings", bg: "bg-amber-100" },
      ];
  return (
    <div>
       <div className="w-full h-[200px] relative">
        <Threads amplitude={4} distance={0.4} enableMouseInteraction={false} />

        <div className="absolute inset-0 "></div>

        <h1
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          text-5xl! md:text-6xl font-extrabold text-[#ab1428] drop-shadow-xl
          animate-fadeInSlow"
        >
Who We Are          
        </h1>
      </div>
      <section className="w-full bg-white px-6 py-14 md:px-16">
      <div className="max-w-7xl mx-auto">

        {/* TOP DESCRIPTION */}
        <p className="text-gray-700 text-lg leading-relaxed max-w-5xl">
          Join the most advanced and career-focused tech training programs by
          <span className="font-semibold text-black"> Wipronix Technologies</span>.
          Learn industry-ready skills in
          <span className="font-semibold"> MERN Stack, Cloud Computing, AI & ML, Python, and Web Development</span>
          through <span className="font-semibold">LIVE projects</span>, real-world case studies,
          and expert-led mentoring.
        </p>

        <p className="text-gray-700 text-lg mt-4 max-w-5xl">
          Start your tech career with a trusted training partner known for
          delivering job-ready professionals to the industry.
        </p>

        <p className="text-gray-900 font-semibold mt-3">
          Book Free Demo Class | Call Now: <span className="text-[#ab1428]">+91-96467 06113</span>
        </p>

        {/* MAIN HEADING */}
        <h1 className="mt-10 text-4xl md:text-6xl font-extrabold leading-tight text-black">
          Advanced Tech Courses in{" "}
          <span className="text-green-500">Mohali</span>,{" "}
          <span className="text-orange-400">Chandigarh</span>{" "}
          and{" "}
          <span className="text-red-500">Patiala</span>
        </h1>

        {/* STATS */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-6 gap-8">

          <Stat
            icon={<GraduationCap />}
            title="5,000+"
            desc="Students Trained"
          />

          <Stat
            icon={<Users />}
            title="85%"
            desc="Placement Assistance"
          />

          <Stat
            icon={<BadgeCheck />}
            title="100%"
            desc="Industry Mentors"
          />

          <Stat
            icon={<Trophy />}
            title="10+ Years"
            desc="Industry Experience"
          />

          <Stat
            icon={<Laptop />}
            title="Hybrid"
            desc="Online + Offline"
          />

          <Stat
            icon={<ThumbsUp />}
            title="Career"
            desc="Focused Training"
          />
        </div>

        {/* RATING */}
        <div className="flex items-center gap-2 mt-8 text-lg">
          <Star className="text-yellow-400 fill-yellow-400" />
          <span className="font-semibold">4.9 Rating</span>
          <span className="text-gray-600">on Google</span>
        </div>

        {/* CTA */}
        <div className="mt-10">
        <Link to="/contact">
        <button className="bg-[#f5a623] hover:bg-[#e0951e] text-white px-8 py-4 rounded-md font-semibold text-lg shadow-md transition">
            Apply to Build Your Tech Career
          </button>
        </Link>

        </div>

      </div>
    </section>
    <LogoLoopMarque/>
    <section className="w-full bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center">
          Benefits of Choosing{" "}
          <span className="text-[#ab1428]">Wipronix</span> Courses
        </h2>

        <p className="text-center text-gray-500 mt-2">
          (Mohali, Chandigarh, Patiala)
        </p>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col items-center text-center"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${item.bg}`}
                >
                  <Icon className="w-7 h-7 text-[#ab1428]" />
                </div>

                <p className="mt-4 font-semibold text-gray-800">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Why we stand out */}
        <div className="mt-20 text-center max-w-5xl mx-auto">
          <h3 className="text-3xl font-extrabold">
            Why We{" "}
            <span className="text-[#ab1428]">Stand Out</span>{" "}
            From The{" "}
            <span className="text-orange-500">Crowd</span>?
          </h3>

          <p className="mt-6 text-gray-600 leading-relaxed text-lg">
            <span className="font-semibold text-gray-800">
              Wipronix Technologies
            </span>{" "}
            is a career-focused tech training company helping students and
            professionals master{" "}
            <span className="font-semibold">
              MERN Stack, Cloud Computing, AI & ML, Python, and Web Development
            </span>
            . Our programs are designed with real industry workflows, live
            projects, and mentoring by working professionals—so you don’t just
            learn, you become job-ready.
          </p>
        </div>

      </div>
    </section>
    <section className="w-full bg-gradient-to-b from-[white] to-[#ab1428] py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-white text-3xl md:text-4xl font-extrabold">
          Get 15+ Industry-Recognized Certifications!
        </h2>

        <p className="text-white text-xl mt-4">
          Enroll now to become a{" "}
          <span className="text-orange-400 font-bold">
            Google and Meta Certified
          </span>{" "}
          Professional
        </p>

        {/* White Card */}
        <div className="mt-14 bg-white rounded-2xl shadow-xl px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 place-items-center">

            {certifications.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="w-full max-w-[200px] border rounded-md px-4 py-3 flex items-center gap-3 justify-center hover:shadow-md transition"
                >
                  <Icon className="text-2xl text-gray-700" />
                  <span className="text-sm font-semibold text-gray-700">
                    {item.label}
                  </span>
                </div>
              );
            })}

          </div>
        </div>

      </div>
    </section>
    <section className="w-full bg-gradient-to-b from-[#ab1428] to-[white] py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-white text-3xl md:text-4xl font-extrabold">
          Who Can Join Our Tech Training Programs in Mohali?
        </h2>

        <p className="text-white/90 mt-3 text-lg">
          Discover how Wipronix Technologies helps you accelerate your tech career
        </p>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col"
              >
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-[#0a2540]" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {card.title}
                </h3>

                <ul className="space-y-3 text-gray-600">
                  {card.points.map((point, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16">
          <button className="bg-[#ab1428] hover:bg-[#ab1428] text-white font-semibold px-10 py-4 rounded-full shadow-lg transition">
            CONNECT WITH LEARNING ADVISOR
          </button>
        </div>

      </div>
    </section>
    <section className="w-full bg-[#2f2f2f] py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Text */}
        <p className="text-white text-lg md:text-xl font-medium text-center md:text-left">
          Establish a 
          <span className="text-orange-400 font-semibold mx-1.5 text-[30px]">
          Career
          </span>
          by enrolling for the best course
        </p>

        {/* Button */}
        <Link to={"/contact"}>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-md font-semibold text-lg transition shadow-md">
          Get Started
        </button>
</Link>
      </div>
    </section>
    </div>
  )
}

export default Courses