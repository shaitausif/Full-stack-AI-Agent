import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import { motion } from "motion/react";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  RefreshCcw,
  Timer,
} from "lucide-react";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 10 * 60; // 10 minutes

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
  const inputRefs = useRef([]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      toast.warn("Please enter your email first.", {
        closeOnClick: true,
        autoClose: 3000,
        transition: Bounce,
      });
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    // Focus the input after the last pasted digit
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = useCallback(async () => {
    const otpString = otp.join("");
    if (otpString.length !== OTP_LENGTH) {
      toast.error("Please enter the complete 6-digit OTP", {
        closeOnClick: true,
        autoClose: 3000,
        transition: Bounce,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`
            : "/api/auth/verify-otp"
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, otp: otpString }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "OTP verified successfully!", {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error(data.message || "Invalid OTP", {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
        // If expired, redirect back
        if (
          data.message?.toLowerCase().includes("expired") ||
          data.message?.toLowerCase().includes("request a new")
        ) {
          setSecondsLeft(0);
        }
      }
    } catch (error) {
      console.log("OTP verification error:", error);
      toast.error("Something went wrong", {
        closeOnClick: true,
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  }, [otp, email, navigate]);

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (otp.every((d) => d !== "") && otp.join("").length === OTP_LENGTH) {
      handleVerify();
    }
  }, [otp, handleVerify]);

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`
            : "/api/auth/forgot-password"
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        }
      );
      await res.json();
      toast.success("A new OTP has been sent to your email.", {
        closeOnClick: true,
        autoClose: 3000,
        transition: Bounce,
      });
      setOtp(Array(OTP_LENGTH).fill(""));
      setSecondsLeft(OTP_EXPIRY_SECONDS);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.log("Resend OTP error:", error);
      toast.error("Failed to resend OTP", {
        closeOnClick: true,
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify();
  };

  if (!email) return null;

  return (
    <div className="relative flex min-h-screen flex-col text-white justify-center items-center px-4 bg-[#0a0f1a] bg-grid overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold gradient-text">Ticket AI</h1>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="w-full max-w-md glass-strong rounded-2xl p-6 md:p-8 glow-blue relative"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full" />

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center"
          >
            <ShieldCheck className="w-7 h-7 text-cyan-400" />
          </motion.div>
        </div>

        <h2 className="text-center text-xl md:text-2xl font-bold mb-1">
          Verify OTP
        </h2>
        <p className="text-center text-sm text-gray-400 mb-2">
          Enter the 6-digit code sent to
        </p>
        <p className="text-center text-sm text-blue-400 font-medium mb-5">
          {email}
        </p>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mb-5"
        >
          <Timer className="w-4 h-4 text-gray-500" />
          {secondsLeft > 0 ? (
            <span
              className={`text-sm font-mono font-medium ${
                secondsLeft <= 60 ? "text-red-400" : "text-gray-400"
              }`}
            >
              {formatTime(secondsLeft)}
            </span>
          ) : (
            <span className="text-sm text-red-400 font-medium">
              OTP expired
            </span>
          )}
        </motion.div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 6-digit OTP Inputs */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex justify-center gap-2 md:gap-3"
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-11 h-13 md:w-13 md:h-15 rounded-xl text-center text-xl md:text-2xl font-bold bg-white/5 border transition-all duration-200 outline-none focus:ring-2 ${
                  digit
                    ? "border-blue-500/40 text-white focus:ring-blue-500/30"
                    : "border-white/10 text-gray-400 focus:ring-white/20"
                }`}
              />
            ))}
          </motion.div>

          {/* Verify Button */}
          <motion.button
            type="submit"
            disabled={loading || secondsLeft <= 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <span>Verify OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Resend OTP */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <span className="text-sm text-gray-500">Didn&apos;t receive it?</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResend}
            disabled={resending}
            className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <RefreshCcw className="w-3.5 h-3.5" />
            )}
            <span>Resend OTP</span>
          </motion.button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          <Link
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            to="/forgot-password"
          >
            Use a different email
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
