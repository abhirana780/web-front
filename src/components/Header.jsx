import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Sun,
  Moon,
  Briefcase,
  FileText,
  LogIn,
  LogOut,
  Users,
  Phone,
  Mail,
  User as UserIcon,
  Home,
  Info,
  Wrench,
  PhoneCall,
  Upload
} from "lucide-react";
import { motion } from "framer-motion";
import PillNav from "./reactBits/PillNav";
import { Link, useLocation, useNavigate } from "react-router";
import { authAPI } from "../services/api";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPillNavSticky, setIsPillNavSticky] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check for userData in localStorage on initial render
    const userDataString = localStorage.getItem("userData");
    if (!userDataString) return false;
    
    try {
      const userData = JSON.parse(userDataString);
      return !!(userData && userData.email);
    } catch {
      return false;
    }
  });
  const menuRef = useRef();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 220);
      // Activate sticky state when scrolling past the header
      setIsPillNavSticky(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Listen for localStorage changes to update authentication state
  useEffect(() => {
    const handleStorageChange = () => {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
        setIsAuthenticated(false);
        return;
      }
      
      try {
        const userData = JSON.parse(userDataString);
        setIsAuthenticated(!!(userData && userData.email));
      } catch {
        setIsAuthenticated(false);
      }
    };

    // Listen for custom events that might indicate auth changes
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleStorageChange);
    };
  }, []);

  // Create menu items based on authentication status
  const menuItems = [
    "Apply For Internship",
    "Take a Test",
    "Employee Portal",
    isAuthenticated ? "Profile" : "Register",
    isAuthenticated ? "Logout" : "",
    "Career With Us",
  ].filter(item => item !== "");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      className="bg-gradient-to-r from-[#ab1428] to-[#8b0f1f]"
    >
      <div className="flex p-4 pt-[10px] h-[60px] border-gray-300 justify-between ">
        <div className="flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center text-[15px]! font-bold gradient-text text-[white]"
          >
            <Phone className="w-4 h-4 mr-2!" />
            +91 96467 06114
            <span className="mx-3">|</span>
            <Mail className="w-4 h-4 mr-2!" />
            info@wipronix.com
          </motion.div>
          
        </div>

        <div className="flex gap-2">
  {/* Desktop Menu */}
  {!isScrolled && (
    <div className="hidden md:flex gap-4 justify-center items-center ">
      {menuItems.map((text, index) => {
        const iconMap = {
          "Apply For Internship": Briefcase,
          "Take a Test": FileText,
          "Employee Portal": Users,
          "Register": LogIn,
          "Profile": UserIcon,
          "Logout": LogOut,
          "Career With Us": Users,
        };
        const IconComponent = iconMap[text];
        let href = "#"; // Default placeholder for href
        let onClick = null; // Default no click handler

        // Define URLs and click handlers for the items
        if (text === "Apply For Internship") {
          href = "/internship";
        } else if (text === "Take a Test") {
          href = "https://forms.gle/nfdLB4FMVar987yeA";
        } else if (text === "Employee Portal") {
          href = "/employee-portal/login";
        } else if (text === "Register") {
          href = "/onBoard";
        } else if (text === "Profile") {
          href = "/profile";
        } else if (text === "Logout") {
          onClick = async () => {
            try {
              await authAPI.logout();
            } catch (error) {
              console.error("Logout failed:", error);
            }
            // Clear localStorage and update state
            localStorage.removeItem("userData");
            setIsAuthenticated(false);
          };
        }else if(text==="Career With Us"){
          href="/courses"
        }

        return (
          <motion.p
            key={text}
            className="flex border-b h-[28px] font-bold border-[#ab1428] items-center p-2 text-[12px]! rounded-t-[20px] hover:bg-[#a4a3a3] hover:text-[white] bg-white to-white text-[black] cursor-pointer transition-all duration-300 ease-in-out"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.08 * index,
              duration: 0.4,
              ease: "easeOut",
            }}
            onClick={() => {
              if (onClick) {
                onClick(); // Execute logout function
              } else if (href.startsWith("/")) {
                navigate(href); // Navigate internally
              } else if (href !== "#") {
                window.open(href, "_blank"); // Open external link in a new tab
              }
            }}
          >
            <IconComponent className="w-4 h-4 mr-2" />
            {text}
          </motion.p>
        );
      })}
    </div>
  )}
</div>


        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-[white] focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`flex justify-center transition-all duration-300 ${
          isPillNavSticky 
            ? "sticky top-0 bg-white/95 backdrop-blur-sm shadow-lg z-50" 
            : ""
        }`}
      >
        <div>
          <PillNav
            logoAlt="Company Logo"
            items={[
              { label: "Home", href: "/home" },
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Gallery", href: "/gallery" },
              { label: "Contact", href: "/contact" },
              // { label: "Courses", href: "/courses" },

            ]}
            activeHref={location.pathname}
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#000000"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#000000"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          ref={menuRef}
          className="
            md:hidden fixed top-[90px] right-4 
            w-[260px] rounded-3xl 
            bg-gradient-to-br from-[#ab1428]/80 to-[#8b0f1f]/80 backdrop-blur-xl 
            border border-white/20 shadow-2xl 
            p-5 z-50
          "
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* --- MAIN NAV (PillNav Items with Icons) --- */}
          <div className="flex flex-col gap-3 mb-5! pb-5 border-b border-white/20">
            {[
              { label: "Home", href: "/home", icon: Home },
              { label: "About", href: "/about", icon: Info },
              { label: "Services", href: "/services", icon: Wrench },
              { label: "Contact", href: "/contact", icon: PhoneCall },
              { label: "Gallery", href: "/gallery", icon: Home },
              { label: "InterShip", href: "/internship", icon: Home },
       
              { label: "Serivecs", href: "/serivecs", icon: Home }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="
                  flex items-center gap-3 
                  py-3 px-4 rounded-2xl 
                  bg-white/10 
                  border border-white/10
                  text-white
                  hover:bg-white/20 
                  transition-all cursor-pointer
                  shadow-md
                "
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.3, ease: "easeOut" }}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5 opacity-90" />
                <Link to={item.href}>{item.label}</Link>
              </motion.div>
            ))}
          </div>

          {/* --- ACTION ITEMS (Internship, Test, Register/Logout, Career) --- */}
<div className="flex flex-col gap-3">
  {menuItems.map((text, index) => {
    const iconMap = {
      "Apply For Internship": Briefcase,
      "Take a Test": FileText,
      "Employee Portal": Users,
      "Register": LogIn,
      "Profile": UserIcon,
      "Logout": LogOut,
      "Career With Us": Users,
    };
    const IconComponent = iconMap[text];
    let href = "#";
    let onClick = null;

    // Define URLs and click handlers for mobile menu items
    if (text === "Apply For Internship") {
      href = "/internship";
    } else if (text === "Take a Test") {
      href = "https://forms.gle/nfdLB4FMVar987yeA";
    } else if (text === "Register") {
      href = "/onBoard";
    } else if (text === "Profile") {
      href = "/profile";
    } else if (text === "Logout") {
      onClick = async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error("Logout failed:", error);
        }
        // Clear localStorage and update state
        localStorage.removeItem("userData");
        setIsAuthenticated(false);
        setIsOpen(false); // Close mobile menu after logout
      };
    } else if (text === "Career With Us") {
      href = "/courses";
    }

    return (
      <motion.div
        key={text}
        className="
          flex items-center gap-3 
          py-3 px-4 rounded-2xl 
          bg-white/10 
          border border-white/10
          text-white
          hover:bg-white/20 
          transition-all cursor-pointer
          shadow-md
        "
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.06 * index, duration: 0.3, ease: "easeOut" }}
        onClick={() => {
          if (onClick) {
            onClick(); // Execute logout function
          } else if (href.startsWith("/")) {
            navigate(href);
            setIsOpen(false);
          } else if (href !== "#") {
            window.open(href, "_blank"); // Open link in new tab
            setIsOpen(false); // Close mobile menu after opening link
          }
        }}
      >
        <IconComponent className="w-5 h-5 opacity-90" />
        <span className="font-medium tracking-wide">{text}</span>
      </motion.div>
    );
  })}
</div>

        </motion.div>
      )}
    </motion.div>
  );
};

export default Header;
