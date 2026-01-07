import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Form, Input, Button, Select, Modal } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { authAPI, studentAPI } from "../services/api";
import axiosInstance from "../services/api";
import {
  handleApiError,
  applyFieldErrorsToForm,
  resetFormValidation,
} from "../utils/validationErrorHandler";
import { useToast } from "../hooks/use-toast";
import ToastContainer from "../components/ui/toast-container";
import "../styles/onboard.css";
import axios from "axios";


const OnBored = () => {
  // Mode state
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Animation state - controls when forms should be visible
  const [isAnimationComplete, setIsAnimationComplete] = useState(true);

  // Modal visibility states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Onboarding specific states
  const [isOnboardingMode, setIsOnboardingMode] = useState(false);
  const [showFetchingModal, setShowFetchingModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [fetchedStudentData, setFetchedStudentData] = useState(null);

  // Loading states
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [isOTPVerificationLoading, setIsOTPVerificationLoading] = useState(false);
  const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false);

  // Forgot password modal state
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  
  // OTP flow state management
  const [otpStep, setOTPStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [emailForOTP, setEmailForOTP] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [otpTimer, setOTPTimer] = useState(0);

  // Toast notification hook
  const { toast, toasts, removeToast } = useToast();

  // Form instances
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [forgotPasswordForm] = Form.useForm();

  // Check for email parameter in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    
    if (emailParam) {
      const decodedEmail = decodeURIComponent(emailParam);
      setStudentEmail(decodedEmail);
      setIsOnboardingMode(true);
      setShowFetchingModal(true);
      setIsSignUpMode(true); // Switch to signup form for onboarding
      
      // Fetch student details
      fetchStudentByEmail(decodedEmail);
    }
  }, []);

  // Fetch student details by email
  const fetchStudentByEmail = async (email) => {
    try {
      const response = await studentAPI.getStudentByEmail(email);
      
      if (response.data.success) {
        const studentData = response.data.data.student;
        
        // Check if student is already verified
        if (studentData.isVerified) {
          // Student is verified, redirect to login
          setShowFetchingModal(false);
          setIsOnboardingMode(false);
          setIsUpdateMode(false);
          
          // Switch to sign in mode
          setIsSignUpMode(false);
          resetStates();
          registerForm.resetFields();
          
          // Populate email in login form
          loginForm.setFieldsValue({
            email: studentData.email
          });
          
          toast({
            title: "Account Already Exists!",
            description: "You already have an account. Please sign in with your credentials.",
            type: "info",
            duration: 5000,
          });
          
          return; // Exit early, don't proceed with update mode
        }
        
        // Student is not verified, proceed with update mode
        setFetchedStudentData(studentData);
        setIsUpdateMode(true);
        
        // Populate the registration form with fetched data
        registerForm.setFieldsValue({
          fullName: studentData.fullName,
          email: studentData.email,
          phoneNumber: studentData.phoneNumber,
          city: studentData.city,
          education: studentData.education,
          course: studentData.course,
          college: studentData.college,
          passingYear: studentData.passingYear,
          // Don't populate password fields
        });
        
        // Close fetching modal after a short delay
        setTimeout(() => {
          setShowFetchingModal(false);
        }, 1500);
        
        toast({
          title: "Profile Loaded!",
          description: "Please update your password to complete registration",
          type: "success",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      
      // Handle error cases
      if (error.response?.status === 404) {
        toast({
          title: "Student Not Found",
          description: "No student found with this email address. Please register as a new user.",
          type: "warning",
          duration: 5000,
        });
      } else {
        toast({
          title: "Profile Loaded!",
          description: "Student Already Exist, Please Login ! ",
          type: "success",
          duration: 3000,
        });
      }
      
      setShowFetchingModal(false);
      setIsOnboardingMode(false);
    }
  };

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
    resetStates();
    loginForm.resetFields();

    // Hide forms during animation
    setIsAnimationComplete(false);

    // Show forms after animation completes
    setTimeout(() => {
      setIsAnimationComplete(true);
    }, 1800); // 1.8s to match the animation duration
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
    resetStates();
    registerForm.resetFields();

    // Hide forms during animation
    setIsAnimationComplete(false);

    // Show forms after animation completes
    setTimeout(() => {
      setIsAnimationComplete(true);
    }, 1800); // 1.8s to match the animation duration
  };

  const resetStates = () => {
    // Clear form validation states
    resetFormValidation(loginForm);
    resetFormValidation(registerForm);
  };

  // Custom validators
  const validatePasswordConfirmation = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error("The two passwords that you entered do not match!")
      );
    },
  });

  const validatePhone = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Phone number is required"));
    }
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(value.replace(/\D/g, ""))) {
      return Promise.reject(new Error("Please enter a valid phone number"));
    }
    return Promise.resolve();
  };

  const handleSignInSubmit = async (values) => {
    setIsLoginLoading(true);
    try {
      // const response = await authAPI.login({
      //   email: values.email,
      //   password: values.password,
      // });
      await axios.post("https://backend-wipronix-1.onrender.com/api/auth/login", {
        email: values.email,
        password: values.password,
      }).then((response) => {
        console.log(response);
        console.log(response);
        if (response.data.success) {
          // Show success toast
          toast({
            title: "Login Successful! 🎉",
            description: "Welcome back! Redirecting to your dashboard...",
            type: "success",
          });
  
          // Store user data
          localStorage.setItem("userData", JSON.stringify(response.data.user));
  
          // Redirect to profile page after successful login
          setTimeout(() => {
            window.location.href = "/profile";
          }, 1500);
        }
    })
   
    } catch (error) {
      console.error("Login error:", error);

      // Use the enhanced error handler
      const processedError = handleApiError(error, "login");

      if (processedError.hasFieldErrors) {
        // Apply field-specific errors to form
        applyFieldErrorsToForm(loginForm, processedError.fieldErrors);
        toast({
          title: "Validation Error",
          description: processedError.message,
          type: "error",
        });
      } else {
        // Show general error toast
        toast({
          title: "Login Failed",
          description: processedError.message,
          type: "error",
        });
      }
    } finally {
      setIsLoginLoading(false);
    }
  };


  const handleSignUpSubmit = async (values) => {
    setIsRegisterLoading(true);

    try {
      let response;

      if (isUpdateMode && studentEmail) {
        // Update existing student
        const updateData = {
          email: studentEmail, // Use the original email for update
          password: values.password,
        };

        response = await studentAPI.updateStudentByEmail(updateData);

        if (response.data.success) {
          toast({
            title: "Profile Updated! 🎉",
            description: "Your password has been updated successfully!",
            type: "success",
          });

          // Store updated user data
          localStorage.setItem("userData", JSON.stringify(response.data.data.student));

          // Redirect to Profile page
          setTimeout(() => {
            window.location.href = "/profile";
          }, 1500);
        }
      } else {
        // Register new student
        response = await authAPI.register(values);

        if (response.data.success) {
          // Show success toast
          toast({
            title: "Registration Successful! 🎉",
            description: "Welcome aboard! Please sign in to continue...",
            type: "success",
          });

          // Store user data
          localStorage.setItem(
            "userData",
            JSON.stringify(response.data.data.student)
          );

          // Switch to sign-in form after successful registration
          setTimeout(() => {
            setIsSignUpMode(false);
            resetStates();
            registerForm.resetFields();
            setIsAnimationComplete(false);
            setTimeout(() => {
              setIsAnimationComplete(true);
            }, 1800);
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Registration/Update error:", error);
      
      // Handle different error scenarios
      if (isUpdateMode) {
        toast({
          title: "Update Failed",
          description: "Failed to update your profile. Please try again.",
          type: "error",
        });
      } else {
        // Use the enhanced error handler for registration
        const processedError = handleApiError(error, "register");

        if (processedError.hasFieldErrors) {
          // Apply field-specific errors to form
          applyFieldErrorsToForm(registerForm, processedError.fieldErrors);
          toast({
            title: "Validation Error",
            description: processedError.message,
            type: "error",
          });
        } else {
          // Show general error toast
          toast({
            title: "Registration Failed",
            description: processedError.message,
            type: "error",
          });
        }
      }
    } finally {
      setIsRegisterLoading(false);
    }
  };

  // Forgot Password Handlers
  const handleForgotPasswordClick = () => {
    setForgotPasswordVisible(true);
    setOTPStep(1);
    setEmailForOTP("");
    setVerificationToken("");
    setOTPTimer(0);
  };

  const handleSendOTP = async (values) => {
    setIsForgotPasswordLoading(true);
    try {
      const response = await axios.post('https://backend-wipronix-1.onrender.com/api/auth/send-otp', {
        email: values.email
      });

      if (response.data.success) {
        setEmailForOTP(values.email);
        setOTPStep(2);
        setOTPTimer(600); // 10 minutes
        toast({
          title: 'OTP Sent',
          description: response.data.message,
          duration: 3000,
          type: 'success',
        });
      } else {
        toast({
          title: 'Error',
          description: response.data.message,
          duration: 3000,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send OTP. Please try again.',
        duration: 3000,
        type: 'error',
      });
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const handleVerifyOTP = async (values) => {
    setIsOTPVerificationLoading(true);
    try {
      const response = await axios.post('https://backend-wipronix-1.onrender.com/api/auth/verify-otp', {
        email: emailForOTP,
        otp: values.otp
      });

      if (response.data.success) {
        setVerificationToken(response.data.verificationToken);
        setOTPStep(3);
        toast({
          title: 'OTP Verified',
          description: 'Please enter your new password.',
          duration: 3000,
          type: 'success',
        });
      } else {
        toast({
          title: 'Error',
          description: response.data.message,
          duration: 3000,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify OTP. Please try again.',
        duration: 3000,
        type: 'error',
      });
    } finally {
      setIsOTPVerificationLoading(false);
    }
  };

  const handlePasswordReset = async (values) => {
    setIsPasswordResetLoading(true);
    try {
      const response = await axios.post('https://backend-wipronix-1.onrender.com/api/auth/otp-reset-password', {
        email: emailForOTP,
        verificationToken: verificationToken,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message,
          duration: 3000,
          type: 'success',
        });
        setForgotPasswordVisible(false);
        loginForm.setFieldsValue({ email: emailForOTP });
      } else {
        toast({
          title: 'Error',
          description: response.data.message,
          duration: 3000,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset password. Please try again.',
        duration: 3000,
        type: 'error',
      });
    } finally {
      setIsPasswordResetLoading(false);
    }
  };

  const handleResendOTP = () => {
    handleSendOTP({ email: emailForOTP });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  const educationOptions = [
    { label: "10th", value: "10th" },
    { label: "12th", value: "12th" },
    { label: "Graduate", value: "Graduate" },
    { label: "Post Graduate", value: "Post Graduate" },
  ];

  const courseOptions = [
    { label: "Full Stack", value: "Full Stack" },
    { label: "Frontend", value: "Frontend" },
    { label: "Backend", value: "Backend" },
    { label: "Data Science", value: "Data Science" },
    { label: "DevOps", value: "DevOps" },
    { label: "Mobile Development", value: "Mobile Development" },
  ];

  const passingYearOptions = [
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" },
    { label: "2026", value: "2026" },
    { label: "2027", value: "2027" },
    { label: "2028", value: "2028" },
  ];

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* ================= SIGN IN ================= */}
          <Form
            className="sign-in-form"
            form={loginForm}
            onFinish={handleSignInSubmit}
            disabled={isLoginLoading}
            layout="vertical"
            style={{
              width: "35rem",
              opacity: isLoginLoading || !isAnimationComplete ? 0.7 : 1,
              display: !isSignUpMode && isAnimationComplete ? "block" : "none",
            }}
          >
            <h2 className="title text-center">Welcome back 👋</h2>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "12px",
                fontSize: "0.95rem",
              }}
              className="text-center"
            >
              Sign in to continue your internship journey
            </p>

            {/* Email Field */}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email Address"
                size="large"
                disabled={isLoginLoading}
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Password is required" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
                disabled={isLoginLoading}
                iconRender={(visible) =>
                  visible ? <EyeOff size={16} /> : <Eye size={16} />
                }
              />
            </Form.Item>

            {/* Forgot Password Link */}
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <Button
                type="link"
                onClick={handleForgotPasswordClick}
                style={{
                  color: "#6b7280",
                  fontSize: "0.9rem",
                  padding: 0,
                  height: "auto",
                }}
              >
                Forgot your password?
              </Button>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="btn solid"
                size="large"
                loading={isLoginLoading}
                style={{
                  width: "100%",
                  opacity: isLoginLoading ? 0.7 : 1,
                  cursor: isLoginLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoginLoading ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Loader2 size={16} className="animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  "Continue to Dashboard"
                )}
              </Button>
            </Form.Item>
          </Form>

          {/* ================= SIGN UP ================= */}
          <Form
            className="sign-up-form"
            form={registerForm}
            onFinish={handleSignUpSubmit}
            disabled={isRegisterLoading}
            layout="vertical"
            style={{
              opacity: isRegisterLoading || !isAnimationComplete ? 0.7 : 1,
              display: isSignUpMode && isAnimationComplete ? "block" : "none",
            }}
          >
            <h2 className="title">{isUpdateMode ? "Complete Your Registration" : "Start your journey"}</h2>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "12px",
                fontSize: "0.95rem",
              }}
            >
              {isUpdateMode ? "Please update your password to complete the registration process" : "Create an account to apply for internships"}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {/* Full Name */}
              <Form.Item
                name="fullName"
                rules={[{ required: true, message: "Full name is required" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Full Name"
                  size="large"
                  disabled={isRegisterLoading || isUpdateMode}
                />
              </Form.Item>

              {/* Email */}
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email Address"
                  size="large"
                  disabled={isRegisterLoading || isUpdateMode}
                />
              </Form.Item>
              {/* Phone Number */}
              <Form.Item
                name="phoneNumber"
                rules={[{ validator: validatePhone }]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Phone Number"
                  size="large"
                  disabled={isRegisterLoading || isUpdateMode}
                />
              </Form.Item>

              {/* City */}
              <Form.Item
                name="city"
                rules={[{ required: true, message: "City is required" }]}
              >
                <Input
                  prefix={<EnvironmentOutlined />}
                  placeholder="City"
                  size="large"
                  disabled={isRegisterLoading || isUpdateMode}
                />
              </Form.Item>

              {/* Education */}
              <Form.Item
                name="education"
                rules={[{ required: true, message: "Education is required" }]}
              >
                <Select
                  placeholder="Education"
                  options={educationOptions}
                  size="large"
                  disabled={isRegisterLoading || isUpdateMode}
                  style={{
                    opacity: (isRegisterLoading || isUpdateMode) ? 0.7 : 1,
                    cursor: (isRegisterLoading || isUpdateMode) ? "not-allowed" : "pointer",
                  }}
                />
              </Form.Item>

              {/* Course / Internship */}
              <Form.Item
                name="course"
                rules={[
                  { required: true, message: "Course selection is required" },
                ]}
              >
                <Select
                  placeholder="Course / Internship"
                  options={courseOptions}
                  size="large"
                  disabled={isRegisterLoading || isUpdateMode}
                  style={{
                    opacity: (isRegisterLoading || isUpdateMode) ? 0.7 : 1,
                    cursor: (isRegisterLoading || isUpdateMode) ? "not-allowed" : "pointer",
                  }}
                />
              </Form.Item>

              {/* College */}
              <Form.Item
                name="college"
                rules={[
                  { required: true, message: "College name is required" },
                ]}
              >
                <Input
                  prefix={<TrophyOutlined />}
                  placeholder="College"
                  size="large"
                  disabled={isRegisterLoading || isUpdateMode}
                />
              </Form.Item>

              {/* Passing Year */}
              <Form.Item
                name="passingYear"
                rules={[
                  { required: true, message: "Passing year is required" },
                ]}
              >
                <Select
                  placeholder="Passing Year"
                  options={passingYearOptions}
                  size="large"
                  disabled={isRegisterLoading || isUpdateMode}
                  style={{
                    opacity: (isRegisterLoading || isUpdateMode) ? 0.7 : 1,
                    cursor: (isRegisterLoading || isUpdateMode) ? "not-allowed" : "pointer",
                  }}
                />
              </Form.Item>

              {/* Password */}
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Password is required" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder={isUpdateMode ? "New Password" : "Create Password"}
                  size="large"
                  disabled={isRegisterLoading}
                  iconRender={(visible) =>
                    visible ? <EyeOff size={16} /> : <Eye size={16} />
                  }
                />
              </Form.Item>

              {/* Confirm Password */}
              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  validatePasswordConfirmation,
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder={isUpdateMode ? "Confirm New Password" : "Confirm Password"}
                  size="large"
                  disabled={isRegisterLoading}
                  iconRender={(visible) =>
                    visible ? <EyeOff size={16} /> : <Eye size={16} />
                  }
                />
              </Form.Item>
            </div>

            <Form.Item style={{ gridColumn: "1 / -1" }}>
              <Button
                type="primary"
                htmlType="submit"
                className="btn"
                size="large"
                loading={isRegisterLoading}
                style={{
                  width: "100%",
                  opacity: isRegisterLoading ? 0.7 : 1,
                  cursor: isRegisterLoading ? "not-allowed" : "pointer",
                }}
              >
                {isRegisterLoading ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Loader2 size={16} className="animate-spin" />
                    {isUpdateMode ? "Updating Account..." : "Creating Account..."}
                  </span>
                ) : (
                  isUpdateMode ? "Complete Registration" : "Create Account"
                )}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      {/* ================= PANELS ================= */}
      <div className="panels-container">
        {/* LEFT PANEL – SIGN UP */}
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>
              Turn your skills into real-world experience. Apply for
              internships, learn with free resources, and grow step by step with
              industry guidance.
            </p>
            {/* BENEFITS – SIGN IN */}
            <ul
              style={{
                fontSize: "0.9rem",
                color: "white",
                marginBottom: "20px",
                lineHeight: "1.7",
                listStyle: "disc",
                paddingLeft: "18px",
                maxWidth: "380px",
                textAlign: "left",
              }}
            >
              <li>Check your internship application status</li>
              <li>View assessment results & next steps</li>
              <li>Access free notes, demo classes & resources</li>
              <li>Stay updated with HR communications</li>
            </ul>
            <button className="btn transparent" onClick={handleSignUpClick}>
              Get started
            </button>
          </div>

          <img
            src="/src/assets/log.svg"
            className="image"
            alt="student onboarding"
          />
        </div>

        {/* RIGHT PANEL – SIGN IN */}
        <div className="panel right-panel">
          <div className="content">
            <h3>Already part of the journey?</h3>
            <p>
              Pick up where you left off. Track your progress, prepare better,
              and move closer to your internship goals.
            </p>
            {/* BENEFITS – SIGN UP */}
            <ul
              style={{
                fontSize: "0.9rem",
                color: "white",
                marginBottom: "20px",
                lineHeight: "1.7",
                listStyle: "disc",
                paddingLeft: "18px",
                maxWidth: "380px",
                textAlign: "left",
              }}
            >
              <li>Apply for internships in your preferred tech stack</li>
              <li>Get free notes, demo classes & learning content</li>
              <li>Track assessments, interviews & selections</li>
              <li>Build skills before joining real projects</li>
            </ul>

            <button className="btn transparent" onClick={handleSignInClick}>
              Go to dashboard
            </button>
          </div>

          <img
            src="/src/assets/register.svg"
            className="image"
            alt="student login"
          />
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {/* Forgot Password Modal */}
      <Modal
        title={
          otpStep === 1 ? "Reset Your Password" :
          otpStep === 2 ? "Enter OTP Code" :
          "Set New Password"
        }
        open={forgotPasswordVisible}
        onCancel={() => setForgotPasswordVisible(false)}
        footer={null}
        width={500}
        destroyOnClose
      >
        {/* Step 1: Email Input */}
        {otpStep === 1 && (
          <Form
            form={forgotPasswordForm}
            onFinish={handleSendOTP}
            layout="vertical"
          >
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
              Enter your email address and we'll send you a verification code to reset your password.
            </p>
            
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email address" }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
              
                htmlType="submit"
                loading={isForgotPasswordLoading}
                style={{ width: "100%" }}
                size="large"
              >
                {isForgotPasswordLoading ? "Sending OTP..." : "Send Verification Code"}
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* Step 2: OTP Verification */}
        {otpStep === 2 && (
          <Form
            onFinish={handleVerifyOTP}
            layout="vertical"
          >
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
              We've sent a 6-digit verification code to <strong>{emailForOTP}</strong>
            </p>
            
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                Code expires in: <span style={{ fontWeight: "bold", color: "#ab1428" }}>{formatTime(otpTimer)}</span>
              </p>
            </div>

            <Form.Item
              name="otp"
              rules={[
                { required: true, message: "OTP is required" },
                { len: 6, message: "OTP must be exactly 6 digits" }
              ]}
            >
              <Input
                placeholder="Enter 6-digit OTP"
                size="large"
                maxLength={6}
                style={{ textAlign: "center", fontSize: "18px", letterSpacing: "4px" }}
              />
            </Form.Item>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Button
                type="link"
                onClick={handleResendOTP}
                disabled={otpTimer > 0}
                style={{ fontSize: "14px" }}
              >
                {otpTimer > 0 ? `Resend in ${formatTime(otpTimer)}` : "Resend OTP"}
              </Button>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isOTPVerificationLoading}
                style={{ width: "100%" }}
                size="large"
              >
                {isOTPVerificationLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* Step 3: Password Reset */}
        {otpStep === 3 && (
          <Form
            onFinish={handlePasswordReset}
            layout="vertical"
          >
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
              Enter your new password for <strong>{emailForOTP}</strong>
            </p>
            
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: "New password is required" },
                { min: 6, message: "Password must be at least 6 characters long" }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="New Password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm New Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isPasswordResetLoading}
                style={{ width: "100%" }}
                size="large"
              >
                {isPasswordResetLoading ? "Updating Password..." : "Update Password"}
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* Back button for steps 2 and 3 */}
        {otpStep > 1 && (
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Button
              type="link"
              onClick={() => setOTPStep(otpStep - 1)}
              style={{ color: "#6b7280" }}
            >
              <ArrowLeft size={16} style={{ marginRight: "4px" }} />
              Back
            </Button>
          </div>
        )}
      </Modal>

      {/* Fetching Student Details Modal */}
      <Modal
        title="Loading Your Details"
        open={showFetchingModal}
        footer={null}
        width={400}
        closable={false}
        centered
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Loader2 size={48} className="animate-spin" style={{ marginBottom: "16px" }} />
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Fetching your details...
          </p>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "8px" }}>
            Please wait while we load your profile information
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default OnBored;
